import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of, Subscription, switchMap } from 'rxjs';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { ApplicationDataService } from '@core/services/application-data/application-data.service';
import { TokenService } from '@core/services/token/token.service';
import { UserService } from '@features/user/services/user/user.service';
import { SetPfpDto } from '@features/user/models/update-pfp.interface';
import { UpdatePasswordDto } from '@features/user/models/update-password.interface';
import { DeleteProfileDto } from '@features/user/models/delete-profile.interface';
import { UploaderRequestDto } from '@features/user/models/uploader-request.interface';
import { UploaderRequestStatus } from '@core/enums/uploader-request-status.enum';
import { SudoNavComponent } from '@features/sudo/components/sudo-nav/sudo-nav.component';
import { UserModel } from '@models/user.interface';
import { APP_CONSTANTS } from '@constants/constants';
import { JwtTokenResponse } from '@models/jwt-token-response.interface';
import { UpdateUserDto } from '@features/user/models/update-user.interface';
import { ToastService } from '@core/services/toast/toast.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  imports: [ReactiveFormsModule, SudoNavComponent],
  standalone: true
})
export class SettingsPageComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly applicationDataService = inject(ApplicationDataService);
  private readonly tokenService = inject(TokenService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  protected user: UserModel | undefined;

  protected selectedProfilePicture: File | null = null;
  protected profilePictureUrl: string = APP_CONSTANTS.DEFAULT_PFP_PATH;
  protected pfpChanged: boolean = false;
  private lastObjectUrl: string | null = null;
  protected isUser: boolean = false;
  public isLoading: boolean = true;
  protected uploaderRequestStatus: UploaderRequestStatus | null = null;
  // protected uploaderRequestStatusEnum = UploaderRequestStatus;
  protected uploaderRequestFormCharacterCount: any = {
    experience: 0,
    content: 0,
    proof: 0,
    otherTrackers: 0
  };

  protected changeUserDataForm!: FormGroup;
  protected uploaderRequestDataForm!: FormGroup;
  protected changePasswordForm!: FormGroup;
  protected deleteProfileForm!: FormGroup;

  private userSubscription = new Subscription();

  public ngOnInit(): void {
    // Form builders
    this.changeUserDataForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      profilePicture: ['']
    });

    this.uploaderRequestDataForm = this.formBuilder.group({
      experience: ['', Validators.required],
      content: ['', Validators.required],
      proof: [''], // not required
      otherTrackers: [''], // not required
      agreeToTerms: ['no']
    });

    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        newPasswordRepeat: ['', Validators.required]
      },
      { validator: this.passwordMatchValidator }
    );

    this.deleteProfileForm = this.formBuilder.group({
      password: ['', Validators.required]
    });

    this.userSubscription = this.applicationDataService.user$.subscribe(user => {
      this.user = user;
      
      if (this.user) {
        // TODO - call api to get uploaderRequestStatus

        this.setSettingsPage();

        if (this.user.hasPfp) {
          this.profilePictureUrl = this.userService.buildPfpUrl(this.user.username);
        } else {
          this.profilePictureUrl = APP_CONSTANTS.DEFAULT_PFP_PATH;
        }
        this.changeUserDataForm.patchValue({
          profilePicture: this.profilePictureUrl
        });
      } else {
        this.authService.unauthorizedHandler();
      }
      this.isLoading = false;
    });
  }

  public ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  protected onChangeUserDataSubmit() {
    if (!this.changeUserDataForm.dirty) {
      return;
    }
    const username = this.changeUserDataForm.get('username')?.value;
    const email = this.changeUserDataForm.get('email')?.value;

    // Username basic validation (mirror register page rules)
    if (username && username.length < 4) {
      this.toastService.showError('Uporabniško ime mora vsebovati vsaj 4 znake');
      return;
    }
    if (username && username.length > 100) {
      this.toastService.showError('Uporabniško ime ima lahko največ 100 znakov');
      return;
    }
    // Username cannot end with a trailing space
    if (username && username.endsWith(' ')) {
      this.toastService.showError('Uporabniško ime ne sme končati s presledkom');
      return;
    }

    if (!this.changeUserDataForm.valid) {
      for (const controlName of Object.keys(this.changeUserDataForm.controls)) {
        const control = this.changeUserDataForm.get(controlName);
        if (control?.invalid) {
          this.toastService.showError(`Neveljaven vnos ${this.getUiAppropriateControlName(controlName)}!`);
          break;
        }
      }
      return;
    }

  // Check which fields have changed
  const profilePicture = this.changeUserDataForm.get('profilePicture')?.value; // TODO - remove?

    // Collect all update observables
    const updates: {
      user?: Observable<JwtTokenResponse>;
      pfp?: Observable<JwtTokenResponse>;
    } = {};

    const updateUserDto: UpdateUserDto = {
      username: undefined,
      email: undefined
    };

    // Check if username or email changed
    if (username !== this.user?.username) {
      updateUserDto.username = username ?? undefined;
      updateUserDto.email = undefined;
      updates.user = this.userService.updateUser(updateUserDto);
    }

    if (email !== this.user?.email) {
      updateUserDto.email = email ?? undefined;
      updates.user = this.userService.updateUser(updateUserDto);
    }

    // Check if profile picture changed
    if (this.pfpChanged) {
      // Check file size

      if (this.selectedProfilePicture && this.selectedProfilePicture.size > APP_CONSTANTS.MAX_PROFILE_PIC_SIZE_BYTES) {
        this.toastService.showError('Največja dovoljena velikost profilne slike je 5MB');
        return;
      }
      const setPfp: SetPfpDto = { profilePicFile: this.selectedProfilePicture ?? null };
      updates.pfp = this.userService.setPfp(setPfp);
    }

    // If no changes detected
    if (Object.keys(updates).length === 0) {
      this.toastService.showInfo('Ni sprememb');
      return;
    }

    // updateUser must be called before setPfp if username is changed
    this.isLoading = true;
    let update$ = of<JwtTokenResponse | null>(null);
    if (updates.user) update$ = updates.user;
    update$ = update$.pipe(
      switchMap((userResponse) => {
        if (userResponse?.accessToken) {
          this.tokenService.setToken(userResponse.accessToken);
        }
        if (updates.pfp) return updates.pfp;
        return of(userResponse);
      })
    );

    update$.subscribe({
      next: (finalResponse) => {
        if (finalResponse?.accessToken) {
          this.tokenService.setToken(finalResponse.accessToken);
          this.applicationDataService.fetchApplicationData().subscribe();
        }

        // refresh UI - user data will be updated via the subscription to applicationDataService.user$
        this.changeUserDataForm.patchValue({
          username: this.user?.username,
          email: this.user?.email
        });

        this.profilePictureUrl = this.user?.hasPfp
          ? this.userService.buildPfpUrl(this.user.username)
          : APP_CONSTANTS.DEFAULT_PFP_PATH;

        this.changeUserDataForm.patchValue({
          profilePicture: this.profilePictureUrl
        });

        this.toastService.showSuccess('Podatki uspešno posodobljeni');
        this.isLoading = false;

        // If profile picture was updated, reload the page so the new pfp is visible everywhere.
        if (this.pfpChanged) {
          setTimeout(() => {
            try {
              window.location.reload();
            } catch {}
          }, 1000);
        }
      },
      error: (error) => {
        switch (error.status) {
          case 409:
            this.toastService.showError(error.error.message);
            break;
        }
        this.isLoading = false;
      }
    });
  }

  protected onUploaderRequestSubmit() {
    if (this.uploaderRequestDataForm.valid) {
      const experience = this.uploaderRequestDataForm.get('experience')?.value;
      const content = this.uploaderRequestDataForm.get('content')?.value;
      const proof = this.uploaderRequestDataForm.get('proof')?.value;
      const otherTrackers = this.uploaderRequestDataForm.get('otherTrackers')?.value;
      const agreeToTerms = this.uploaderRequestDataForm.get('agreeToTerms')?.value;

      if (agreeToTerms !== 'yes') {
        this.toastService.showError('Strinjanje s pogoji je obvezno');
        return;
      }

      // Confirm submission
      if (!confirm('Ali ste prepričani, da želite poslati vlogo za nalagalca?')) {
        return;
      }

      const uploaderRequestDto: UploaderRequestDto = {
        requestedRole: 'nalagalec',
        experience: experience,
        content: content ? content : null,
        proof: proof ? proof : null,
        otherTrackers: otherTrackers ? otherTrackers : null
      };

      this.userService.submitUploaderRequest(uploaderRequestDto).subscribe({
        next: (response) => {
          this.toastService.showSuccess('Vloga za nalagalca uspešno poslana');
          this.uploaderRequestStatus = UploaderRequestStatus.Review;
          // Update JWT and application data
          this.tokenService.setToken(response.accessToken);
          this.applicationDataService.fetchApplicationData().subscribe();
          this.isLoading = false;
        }
      });
    } else {
      for (const controlName of Object.keys(this.uploaderRequestDataForm.controls)) {
        const control = this.uploaderRequestDataForm.get(controlName);
        if (control?.invalid) {
          this.toastService.showError(`Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`);
          break;
        }
      }
    }
  }

  protected onChangePasswordSubmit() {
    if (this.changePasswordForm.valid) {
      const oldPassword = this.changePasswordForm.get('oldPassword')?.value;
      const newPassword = this.changePasswordForm.get('newPassword')?.value;
      const newPasswordRepeat = this.changePasswordForm.get('newPasswordRepeat')?.value;

      // Passwords match validation
      if (newPassword !== newPasswordRepeat) {
        this.toastService.showError('Gesli se ne ujemata');
        return;
      }

      if (oldPassword === newPassword) {
        this.toastService.showError('Novo geslo ne sme biti enako kot staro geslo');
        return;
      }

      // Password strength validation (mirror register page rules)
      if (newPassword.length < 8) {
        this.toastService.showError('Geslo mora vsebovati vsaj 8 znakov');
        return;
      }
      const numbers = /[0-9]/;
      if (!numbers.test(newPassword)) {
        this.toastService.showError('Geslo mora vsebovati vsaj 1 številko');
        return;
      }

      const updatePasswordDto: UpdatePasswordDto = {
        oldPassword: oldPassword,
        newPassword: newPassword
      };

      this.userService.updatePassword(updatePasswordDto).subscribe({
        next: () => {
          this.toastService.showSuccess('Geslo uspešno posodobljeno');
          this.changePasswordForm.reset();
          this.isLoading = false;
        },
        error: (error) => {
          switch (error.status) {
            case 403:
              this.toastService.showError(error.error.message);
              break;
          }
          this.isLoading = false;
        }
      });
    } else {
      for (const controlName of Object.keys(this.changePasswordForm.controls)) {
        const control = this.changePasswordForm.get(controlName);
        if (control?.invalid) {
          this.toastService.showError(`Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`);
          break;
        }
      }
    }
  }

  protected onDeleteProfileSubmit() {
    if (this.deleteProfileForm.valid) {
      if (!confirm('Ali ste prepričani, da želite izbrisati profil?')) {
        return;
      }
      this.isLoading = true;
      const password = this.deleteProfileForm.get('password')?.value;
      const deleteProfileDto: DeleteProfileDto = {
        password: password
      };

      this.userService.deleteProfile(deleteProfileDto).subscribe({
        next: () => {
          this.toastService.showSuccess('Profil uspešno izbrisan');
          this.authService.unauthorizedHandler();
          this.isLoading = false;
        },
        error: (error) => {
          switch (error.status) {
            case 403:
              this.toastService.showError(error.error.message);
              break;
          }
          this.isLoading = false;
        }
      });
    } else {
      for (const controlName of Object.keys(this.deleteProfileForm.controls)) {
        const control = this.deleteProfileForm.get(controlName);
        if (control?.invalid) {
          this.toastService.showError(`Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`);
          break;
        }
      }
    }
  }

  protected scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  protected removeProfilePicture(): void {
    this.pfpChanged = true;
    this.selectedProfilePicture = null;
    if (this.lastObjectUrl) {
      try {
        URL.revokeObjectURL(this.lastObjectUrl);
      } catch {}
      this.lastObjectUrl = null;
    }

    this.profilePictureUrl = APP_CONSTANTS.DEFAULT_PFP_PATH;
    this.changeUserDataForm.patchValue({
      profilePicture: this.profilePictureUrl
    });
    this.changeUserDataForm.markAsDirty();

    const fileInputById = document.getElementById('change-user-pfp') as HTMLInputElement | null;
    if (fileInputById) {
      try {
        fileInputById.value = '';
      } catch {}
      return;
    }
    const anyFileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    if (anyFileInput) {
      try {
        anyFileInput.value = '';
      } catch {}
    }
  }

  protected onProfilePictureChange(event: any): void {
    this.pfpChanged = true;
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0] as File;

      // compress image - remove if necessary and use code commented out below
      this.compressImage(file).then((compressedFile) => {
        this.selectedProfilePicture = compressedFile;
        this.lastObjectUrl = URL.createObjectURL(compressedFile);
        this.profilePictureUrl = this.lastObjectUrl;
      }).catch(() => {
        // if compression fails, use original file
        this.selectedProfilePicture = file;
        if (this.lastObjectUrl) {
          try {
            URL.revokeObjectURL(this.lastObjectUrl);
          } catch {}
          this.lastObjectUrl = null;
        }
        try {
          this.lastObjectUrl = URL.createObjectURL(file);
          this.profilePictureUrl = this.lastObjectUrl;
        } catch {
          this.profilePictureUrl = this.getProfilePictureUrl();
        }
      });

      // this.selectedProfilePicture = file;
      // if (this.lastObjectUrl) {
      //   try {
      //     URL.revokeObjectURL(this.lastObjectUrl);
      //   } catch {}
      //   this.lastObjectUrl = null;
      // }
      // try {
      //   this.lastObjectUrl = URL.createObjectURL(file);
      //   this.profilePictureUrl = this.lastObjectUrl;
      // } catch {
      //   this.profilePictureUrl = this.getProfilePictureUrl();
      // }
    } else {
      this.selectedProfilePicture = null;
    }
    this.changeUserDataForm.patchValue({
      profilePicture: this.profilePictureUrl
    });
    this.changeUserDataForm.markAsDirty();
  }

  protected getProfilePictureUrl() {
    if (this.pfpChanged) {
      if (this.selectedProfilePicture) {
        return this.lastObjectUrl ?? URL.createObjectURL(this.selectedProfilePicture);
      }
    }

    if (this.user?.hasPfp) {
      if (this.selectedProfilePicture) {
        return URL.createObjectURL(this.selectedProfilePicture);
      } else {
        return this.profilePictureUrl;
      }
    } else {
      return APP_CONSTANTS.DEFAULT_PFP_PATH;
    }
  }

  protected getUiAppropriateControlName(controlName: string): string {
    switch (controlName) {
      case 'username':
        return 'uporabniškega imena';
      case 'email':
        return 'e-pošte';
      case 'profilePicture':
        return 'profilne slike';
      case 'oldPassword':
        return 'starega gesla';
      case 'newPassword':
        return 'novega gesla';
      case 'newPasswordRepeat':
        return 'novega gesla';
      case 'password':
        return 'gesla';
      case 'experience':
        return 'izkušenj';
      case 'content':
        return 'vsebine';
      case 'proof':
        return 'dokaza';
      case 'otherTrackers':
        return 'ostalih sledilcev';
      case 'agreeToTerms':
        return 'strinjanja s pogoji';
      default:
        return controlName;
    }
  }

  protected updateCharacterCount(field: string) {
    this.uploaderRequestFormCharacterCount[field] =
      this.uploaderRequestDataForm.get(field)?.value.length || 0;
  }

  private setSettingsPage(): void {
    this.isUser = this.userService.isUserLogged();
    this.changeUserDataForm.patchValue({
      username: this.user?.username,
      email: this.user?.email,
      profilePicture: this.profilePictureUrl
    });
  }

  private passwordMatchValidator(control: AbstractControl) {
    const newPassword = control.get('newPassword')?.value;
    const newPasswordRepeat = control.get('newPasswordRepeat')?.value;

    if (newPassword !== newPasswordRepeat) {
      control.get('newPasswordRepeat')?.setErrors({ passwordMismatch: true });
    } else {
      control.get('newPasswordRepeat')?.setErrors(null);
    }
  }

  private compressImage(file: File, maxWidth: number = 800, quality: number = 0.7): Promise<File> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const reader = new FileReader();

      reader.onload = (e: any) => {
        image.src = e.target.result;
      };

      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject('Cannot get canvas context');
          return;
        }

        const scale = Math.min(maxWidth / image.width, 1);
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
            resolve(compressedFile);
          } else {
            reject('Compression failed');
          }
        },
        'image/jpeg',
        quality
        );
      };

      image.onerror = (err) => reject(err);
    });
  }
}
