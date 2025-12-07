import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { TokenService } from '@core/services/token-service/token.service';
import { UserService } from '@features/user/services/user/user.service';
import { UpdateUsernameDto } from '@features/user/models/update-username.interface';
import { UpdateEmailDto } from '@features/user/models/update-email.interface';
import { SetPfpDto } from '@features/user/models/update-pfp.interface';
import { UpdatePasswordDto } from '@features/user/models/update-password.interface';
import { DeleteProfileDto } from '@features/user/models/delete-profile.interface';
import { timingConst } from '@core/enums/toastr-timing.enum';
import { UploaderRequestDto } from '@features/user/models/uploader-request.interface';
import { UploaderRequestStatus } from '@core/enums/uploader-request-status.enum';
import { SudoNavComponent } from '@features/sudo/components/sudo-nav/sudo-nav.component';
import { UserModel } from '@models/user.interface';
import { APP_CONSTANTS } from '@constants/constants';
import { JwtTokenResponse } from '@models/jwt-token-response.interface';
import { JitEvaluator } from '@angular/compiler';

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
  private readonly tokenService = inject(TokenService);
  private readonly userService = inject(UserService);
  private readonly toastr = inject(ToastrService);

  protected user: UserModel | undefined;

  protected selectedProfilePicture: File | null = null;
  protected profilePictureUrl: string = APP_CONSTANTS.DEFAULT_PFP_PATH;
  protected pfpChanged: boolean = false;
  protected isUser: boolean = false;
  public isLoading: boolean = true;
  protected uploaderRequestStatus: UploaderRequestStatus | null = null;
  protected uploaderRequestStatusEnum = UploaderRequestStatus;
  protected uploaderRequestFormCharacterCount: any = {
    experience: 0,
    content: 0,
    proof: 0,
    otherTrackers: 0
  };
  private originalProfilePictureUrl: string = '';

  protected changeUserDataForm!: FormGroup;
  protected uploaderRequestDataForm!: FormGroup;
  protected changePasswordForm!: FormGroup;
  protected deleteProfileForm!: FormGroup;

  private userSubscription = new Subscription();

  public ngOnInit(): void {
    // Form builders
    this.changeUserDataForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
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

    // Get user data - set settings page
    this.userSubscription = this.tokenService.user$.subscribe(user => {
      this.user = user;
    });

    if (this.user) {
      if (this.user.uploaderRequestStatus) {
        this.uploaderRequestStatus = this.user.uploaderRequestStatus;
      }
      // Get user data from JWT
      this.setSettingsPage();

      if (this.user.pfp) {
        this.originalProfilePictureUrl = this.user.pfp;
        this.profilePictureUrl = this.userService.getUserPfpUrl(this.user.pfp);
      } else {
        this.profilePictureUrl = APP_CONSTANTS.DEFAULT_PFP_PATH;
      }
      this.changeUserDataForm.patchValue({
        profilePicture: this.profilePictureUrl
      });
    } else {
      // Error decoding token - redirect to login page - log out user
      this.authService.unauthorizedHandler();
    }
    this.isLoading = false;
  }

  public ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  protected onChangeUserDataSubmit() {
    if (!this.changeUserDataForm.dirty) {
      return;
    }

    if (!this.changeUserDataForm.valid) {
      for (const controlName of Object.keys(this.changeUserDataForm.controls)) {
        const control = this.changeUserDataForm.get(controlName);
        if (control?.invalid) {
          this.toastr.error(
            '',
            `Neveljaven vnos ${this.getUiAppropriateControlName(controlName)}!`,
            { timeOut: timingConst.error }
          );
          break;
        }
      }
      return;
    }

    // Check which fields have changed
    const username = this.changeUserDataForm.get('username')?.value;
    const email = this.changeUserDataForm.get('email')?.value;
    const profilePicture = this.changeUserDataForm.get('profilePicture')?.value;

    // Collect all update observables
    const updates: any = {};

    // Check what needs to be updated
    if (username !== this.user?.username) {
      const updateUsernameDto: UpdateUsernameDto = { username };
      updates.username = this.userService.updateUsername(updateUsernameDto);
    }

    if (email !== this.user?.email) {
      const updateEmailDto: UpdateEmailDto = { email };
      updates.email = this.userService.updateEmail(updateEmailDto);
    }

    if (this.pfpChanged && this.selectedProfilePicture !== null) {
      // Check file size
      if (this.selectedProfilePicture.size > APP_CONSTANTS.MAX_PROFILE_PIC_SIZE_BYTES) {
        this.toastr.error('', 'Največja dovoljena velikost profilne slike je 5MB', {
          timeOut: timingConst.error
        });
        return;
      }
      const setPfp: SetPfpDto = { profilePicFile: this.selectedProfilePicture ?? null };
      updates.pfp = this.userService.setPfp(setPfp);
    }

    // If no changes detected
    if (Object.keys(updates).length === 0) {
      this.toastr.info('', 'Ni sprememb', { timeOut: timingConst.info });
      return;
    }

    this.isLoading = true;
    // Execute updates sequentially to handle token updates properly
    forkJoin(updates).subscribe({
      next: (responses: any) => {
        // TODO
      },
      error: (error) => {
        // TODO
      }
    });



    // Update username
    if (username !== this.user?.username) {
      const updateUsernameDto: UpdateUsernameDto = {
        username: username
      };
      this.userService.updateUsername(updateUsernameDto).subscribe({
        next: (response: JwtTokenResponse) => {
          this.toastr.success('Uporabniško ime uspešno posodobljeno');
          // Update JWT
          this.tokenService.updateToken(response.token);
          this.changeUserDataForm.patchValue({
            username: this.user?.username
          });
          this.isLoading = false;
        },
        error: (error) => {
          switch (error.status) {
            case 409:
              this.toastr.error('', error.error.message, { timeOut: timingConst.error });
              break;
            default:
              this.toastr.error('', 'Napaka pri posodabljanju uporabniškega imena', {
                timeOut: timingConst.error
              });
              break;
          }
          this.isLoading = false;
        },
      });
    }

    // Update email
    if (email !== this.user?.email) {
      const updateEmailDto: UpdateEmailDto = {
        email: email
      };
      this.userService.updateEmail(updateEmailDto).subscribe({
        next: (response: JwtTokenResponse) => {
          this.toastr.success('', 'Email uspešno posodobljen', { timeOut: timingConst.success });
          // Update JWT
          this.tokenService.updateToken(response.token);
          this.changeUserDataForm.patchValue({
            email: this.user?.email
          });
          this.isLoading = false;
        },
        error: (error) => {
          switch (error.status) {
            case 409:
              this.toastr.error('', error.error.message, { timeOut: timingConst.error });
              break;
            default:
              this.toastr.error('', 'Napaka pri posodabljanju e-pošte', {
                timeOut: timingConst.error
              });
              break;
          }
          this.isLoading = false;
        }
      });
    }

    // Update profile picture
    if (profilePicture !== this.originalProfilePictureUrl && this.pfpChanged) {
      // check size
      if (this.selectedProfilePicture && this.selectedProfilePicture.size > APP_CONSTANTS.MAX_PROFILE_PIC_SIZE_BYTES) {
        this.toastr.error('', 'Največja dovoljena velikost profilne slike je 5MB', { timeOut: timingConst.error });
        this.isLoading = false;
        return;
      }
      const setPfp: SetPfpDto = {
        profilePicFile: this.selectedProfilePicture as File
      };
      this.userService.setPfp(setPfp).subscribe({
        next: (response: JwtTokenResponse) => {
          this.tokenService.updateToken(response.token);
          this.isLoading = false;
          window.location.reload();
          this.toastr.success('', 'Profilna slika uspešno posodobljena', {
            timeOut: timingConst.success
          });
          // Update profile picture in settings page
          this.profilePictureUrl = this.getProfilePictureUrl();
          this.changeUserDataForm.patchValue({
            profilePicture: this.profilePictureUrl
          });

          this.isLoading = false;

          // Refresh site to update token and profile picture across the site
          //
        },
        error: (error) => {
          switch (error.status) {
            case 409:
              this.toastr.error('', error.error.message, { timeOut: timingConst.error });
              break;
            default:
              this.toastr.error('', 'Napaka pri posodabljanju profilne slike', {
                timeOut: timingConst.error
              });
              break;
          }
          this.isLoading = false;
        }
      });
    }
  }

  protected onUploaderRequestSubmit() {
    if (this.uploaderRequestDataForm.valid) {
      const experience = this.uploaderRequestDataForm.get('experience')?.value;
      const content = this.uploaderRequestDataForm.get('content')?.value;
      const proof = this.uploaderRequestDataForm.get('proof')?.value;
      const otherTrackers = this.uploaderRequestDataForm.get('otherTrackers')?.value;
      const agreeToTerms = this.uploaderRequestDataForm.get('agreeToTerms')?.value;

      if (agreeToTerms !== 'yes') {
        this.toastr.error('', 'Strinjanje s pogoji je obvezno', { timeOut: timingConst.error });
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
          this.toastr.success('', 'Vloga za nalagalca uspešno poslana', {
            timeOut: timingConst.success
          });
          this.uploaderRequestStatus = UploaderRequestStatus.Review;
          // Update JWT
          this.tokenService.updateToken(response.token);
          this.isLoading = false;
        },
        error: (error) => {
          switch (error.status) {
            default:
              this.toastr.error('', 'Napaka pri pošiljanju vloge za nalagalca', {
                timeOut: timingConst.error
              });
              break;
          }
          this.isLoading = false;
        }
      });
    } else {
      for (const controlName of Object.keys(this.uploaderRequestDataForm.controls)) {
        const control = this.uploaderRequestDataForm.get(controlName);
        if (control?.invalid) {
          this.toastr.error(
            '',
            `Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`,
            { timeOut: timingConst.error }
          );
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

      if (newPassword !== newPasswordRepeat) {
        this.toastr.error('', 'Gesli se ne ujemata', { timeOut: timingConst.error });
        return;
      }

      const updatePasswordDto: UpdatePasswordDto = {
        oldPassword: oldPassword,
        newPassword: newPassword
      };

      this.userService.updatePassword(updatePasswordDto).subscribe({
        next: () => {
          this.toastr.success('', 'Geslo uspešno posodobljeno', { timeOut: timingConst.success });
          this.changePasswordForm.reset();
          this.isLoading = false;
        },
        error: (error) => {
          switch (error.status) {
            case 403:
              this.toastr.error('', error.error.message, { timeOut: timingConst.error });
              break;
            default:
              this.toastr.error('', 'Napaka pri posodabljanju gesla', {
                timeOut: timingConst.error
              });
              break;
          }
          this.isLoading = false;
        }
      });
    } else {
      for (const controlName of Object.keys(this.changePasswordForm.controls)) {
        const control = this.changePasswordForm.get(controlName);
        if (control?.invalid) {
          this.toastr.error(
            '',
            `Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`,
            { timeOut: timingConst.error }
          );
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
          this.toastr.success('', 'Profil uspešno izbrisan', { timeOut: timingConst.success });
          this.authService.unauthorizedHandler();
          this.isLoading = false;
        },
        error: (error) => {
          switch (error.status) {
            case 403:
              this.toastr.error('', error.error.message, { timeOut: timingConst.error });
              break;
            default:
              this.toastr.error('', 'Napaka pri brisanju profila', { timeOut: timingConst.error });
              break;
          }
          this.isLoading = false;
        }
      });
    } else {
      for (const controlName of Object.keys(this.deleteProfileForm.controls)) {
        const control = this.deleteProfileForm.get(controlName);
        if (control?.invalid) {
          this.toastr.error(
            '',
            `Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`,
            { timeOut: timingConst.error }
          );
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
    this.profilePictureUrl = APP_CONSTANTS.DEFAULT_PFP_PATH;
    this.changeUserDataForm.patchValue({
      profilePicture: this.profilePictureUrl
    });
    this.changeUserDataForm.markAsDirty();
  }

  protected onProfilePictureChange(event: any): void {
    this.pfpChanged = true;
    if (event.target.files && event.target.files.length > 0) {
      this.selectedProfilePicture = event.target.files[0];
    } else {
      this.selectedProfilePicture = null;
    }
    this.profilePictureUrl = this.getProfilePictureUrl();
    this.changeUserDataForm.patchValue({
      profilePicture: this.profilePictureUrl
    });
    this.changeUserDataForm.markAsDirty();
  }

  protected getProfilePictureUrl() {
    if (this.pfpChanged) {
      if (this.selectedProfilePicture) {
        return URL.createObjectURL(this.selectedProfilePicture);
      }
    }
    if (this.user?.pfp) {
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
}
