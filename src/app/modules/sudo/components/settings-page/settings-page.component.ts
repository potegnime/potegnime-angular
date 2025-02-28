import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth/services/auth-service/auth.service';
import { CacheService } from 'src/app/modules/shared/services/cache-service/cache.service';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';
import { UserService } from 'src/app/modules/user/services/user-service/user.service';
import { UpdateUsernameDto } from 'src/app/modules/user/models/update-username.interface';
import { UpdateEmailDto } from 'src/app/modules/user/models/update-email.interface';
import { UpdatePfpDto } from 'src/app/modules/user/models/update-pfp.interface';
import { UpdatePasswordDto } from 'src/app/modules/user/models/update-password.interface';
import { DeleteProfileDto } from 'src/app/modules/user/models/delete-profile.interface';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';
import { UploaderRequestDto } from 'src/app/modules/user/models/uploader-request.interface';
import { UploaderRequestStatus } from '../../enums/uploader-request-status.enum';

@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
    protected token: string | null = null;
    protected uid: number | null = null;
    protected username: string | null = null;
    protected email: string | null = null;
    protected pristineProfilePicture: string | Blob = 'assets/images/no-pfp.png';
    protected hasProfilePicture: boolean = false;
    protected selectedProfilePicture: File | null = null;
    protected profilePictureUrl: string = 'assets/images/no-pfp.png';
    protected pfpChanged: boolean = false;
    protected isUser: boolean = false;
    protected uploaderRequestStatus: UploaderRequestStatus | null = null;
    protected uploaderRequestStatusEnum = UploaderRequestStatus;
    protected uploaderRequestFormCharacterCount: any = {
        experience: 0,
        content: 0,
        proof: 0,
        otherTrackers: 0
    };

    changeUserDataForm!: FormGroup;
    uploaderRequestDataForm!: FormGroup;
    changePasswordForm!: FormGroup;
    deleteProfileForm!: FormGroup;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
        private readonly toastr: ToastrService,
        private readonly cacheService: CacheService
    ) { }

    public ngOnInit(): void {
        // Form builders
        this.changeUserDataForm = this.formBuilder.group({
            username: ['', Validators.required],
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

        this.changePasswordForm = this.formBuilder.group({
            oldPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
            newPasswordRepeat: ['', Validators.required]
        }, { validator: this.passwordMatchValidator });

        this.deleteProfileForm = this.formBuilder.group({
            password: ['', Validators.required]
        });

        // Get user data - set settings page
        this.token = this.tokenService.getToken();
        if (!this.token) {
            this.authService.unauthorizedHandler();
        }
        const decodedToken = this.tokenService.decodeToken();
        if (decodedToken) {
            if (decodedToken.uploaderRequestStatus) {
                this.uploaderRequestStatus = decodedToken.uploaderRequestStatus;
            }
            // Get user data from JWT
            this.setSettingsPage(
                decodedToken.username,
                decodedToken.email
            );

            // Get user pfp
            // Wait 0.5 second to avoid unnecessary double api calls for profile picture - other component already has it cached
            setTimeout(() => {
                const cachedProfilePicture = this.cacheService.get(decodedToken.uid.toString());
                if (cachedProfilePicture) {
                    this.createImageFromBlob(cachedProfilePicture);
                    this.pristineProfilePicture = cachedProfilePicture;
                    return;
                } else {
                    this.userService.getUserPfp(decodedToken.uid).subscribe({
                        next: (response) => {
                            this.cacheService.put(decodedToken.uid.toString(), response);
                            this.createImageFromBlob(response);
                            this.pristineProfilePicture = response;
                        },
                        error: (error) => {
                            this.profilePictureUrl = 'assets/images/no-pfp.png';
                            this.changeUserDataForm.patchValue({
                                profilePicture: this.profilePictureUrl
                            });
                            switch (error.status) {
                                case 401:
                                    this.authService.unauthorizedHandler();
                                    break;
                            }
                        }
                    });
                }
            }, 500);

        } else {
            // Error decoding token - redirect to login page - log out user
            this.authService.unauthorizedHandler();
        }
    }

    protected onChnangeUserDataSubmit() {
        if (this.changeUserDataForm.valid) {
            // Check which fields have changed
            const username = this.changeUserDataForm.get('username')?.value;
            const email = this.changeUserDataForm.get('email')?.value;
            const profilePicture = this.changeUserDataForm.get('profilePicture')?.value;

            // Check if none of the fields have changed
            if (username === this.username && email === this.email && profilePicture === this.pristineProfilePicture) {
                this.toastr.info('', 'Ni sprememb', { timeOut: timingConst.info });
                return;
            }

            // Update username
            if (username !== this.username) {
                const updateUsernameDto: UpdateUsernameDto = {
                    username: username
                };
                this.userService.updateUsername(updateUsernameDto).subscribe({
                    next: () => {
                        this.toastr.success('Uporabniško ime uspešno posodobljeno');
                        // Update username in settings page
                        this.username = username;
                        this.changeUserDataForm.patchValue({
                            username: this.username
                        });
                        // Update JWT
                        this.authService.refreshToken().subscribe({
                            next: (response) => {
                                this.tokenService.updateToken(response.token);
                            },
                            error: () => {
                                this.authService.unauthorizedHandler();
                            }
                        });
                    },
                    error: (error) => {
                        switch (error.status) {
                            case 401:
                                this.authService.unauthorizedHandler();
                                break;
                            case 409:
                                this.toastr.error('', error.error.message, { timeOut: timingConst.error });
                                break;
                            default:
                                this.toastr.error('', 'Napaka pri posodabljanju uporabniškega imena', { timeOut: timingConst.error });
                                break;
                        }
                    }
                });
            }

            if (email !== this.email) {
                const updateEmailDto: UpdateEmailDto = {
                    email: email
                };
                this.userService.updateEmail(updateEmailDto).subscribe({
                    next: () => {
                        this.toastr.success('', 'Email uspešno posodobljen', { timeOut: timingConst.success });
                        // Update email in settings page
                        this.email = email;
                        this.changeUserDataForm.patchValue({
                            email: this.email
                        });
                        // Update JWT
                        this.authService.refreshToken().subscribe({
                            next: (response) => {
                                this.tokenService.updateToken(response.token);
                            },
                            error: () => {
                                this.authService.unauthorizedHandler();
                            }
                        });
                    },
                    error: (error) => {
                        switch (error.status) {
                            case 401:
                                this.authService.unauthorizedHandler();
                                break;
                            case 409:
                                this.toastr.error('', error.error.message, { timeOut: timingConst.error });
                                break;
                            default:
                                this.toastr.error('', 'Napaka pri posodabljanju e-pošte', { timeOut: timingConst.error });
                                break;
                        }
                    }
                });
            }

            if (profilePicture !== this.pristineProfilePicture && this.pfpChanged) {
                const updatePfpDto: UpdatePfpDto = {
                    profilePicFile: this.selectedProfilePicture as File
                };
                this.userService.updatePfp(updatePfpDto).subscribe({
                    next: () => {
                        this.toastr.success('', 'Profilna slika uspešno posodobljena', { timeOut: timingConst.success });
                        // Update profile picture in settings page
                        this.pristineProfilePicture = this.selectedProfilePicture as File;
                        this.profilePictureUrl = this.getProfilePictureUrl();
                        this.changeUserDataForm.patchValue({
                            profilePicture: this.profilePictureUrl
                        });

                        // Refresh site to update profile picture across the site
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    },
                    error: (error) => {
                        switch (error.status) {
                            case 401:
                                this.authService.unauthorizedHandler();
                                break;
                            case 409:
                                this.toastr.error('', error.error.message, { timeOut: timingConst.error });
                                break;
                            default:
                                this.toastr.error('', 'Napaka pri posodabljanju profilne slike', { timeOut: timingConst.error });
                                break;
                        }
                    }
                });
            }
        } else {
            for (const controlName of Object.keys(this.changeUserDataForm.controls)) {
                const control = this.changeUserDataForm.get(controlName);
                if (control?.invalid) {
                    this.toastr.error('', `Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`, { timeOut: timingConst.error });
                    break;
                }
            }
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
                next: () => {
                    this.toastr.success('', 'Vloga za nalagalca uspešno poslana', { timeOut: timingConst.success });
                    this.uploaderRequestStatus = UploaderRequestStatus.Review;
                    // Update JWT
                    this.authService.refreshToken().subscribe({
                        next: (response) => {
                            this.tokenService.updateToken(response.token);
                        },
                        error: () => {
                            this.authService.unauthorizedHandler();
                        }
                    });
                },
                error: (error) => {
                    switch (error.status) {
                        case 401:
                            this.authService.unauthorizedHandler();
                            break;
                        default:
                            this.toastr.error('', 'Napaka pri pošiljanju vloge za nalagalca', { timeOut: timingConst.error });
                            break;
                    }
                }
            });

        } else {
            for (const controlName of Object.keys(this.uploaderRequestDataForm.controls)) {
                const control = this.uploaderRequestDataForm.get(controlName);
                if (control?.invalid) {
                    this.toastr.error('', `Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`, { timeOut: timingConst.error });
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
                },
                error: (error) => {
                    switch (error.status) {
                        case 401:
                            this.authService.unauthorizedHandler();
                            break;
                        case 403:
                            this.toastr.error('', error.error.message, { timeOut: timingConst.error });
                            break;
                        default:
                            this.toastr.error('', 'Napaka pri posodabljanju gesla', { timeOut: timingConst.error });
                            break;
                    }
                }
            });
        } else {
            for (const controlName of Object.keys(this.changePasswordForm.controls)) {
                const control = this.changePasswordForm.get(controlName);
                if (control?.invalid) {
                    this.toastr.error('', `Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`, { timeOut: timingConst.error });
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
            const password = this.deleteProfileForm.get('password')?.value;
            const deleteProfileDto: DeleteProfileDto = {
                password: password
            };

            this.userService.deleteProfile(deleteProfileDto).subscribe({
                next: () => {
                    this.toastr.success('', 'Profil uspešno izbrisan', { timeOut: timingConst.success });
                    this.authService.unauthorizedHandler();
                },
                error: (error) => {
                    switch (error.status) {
                        case 401:
                            this.authService.unauthorizedHandler();
                            break;
                        case 403:
                            this.toastr.error('', error.error.message, { timeOut: timingConst.error });
                            break;
                        default:
                            this.toastr.error('', 'Napaka pri brisanju profila', { timeOut: timingConst.error });
                            break;
                    }
                }
            });
        } else {
            for (const controlName of Object.keys(this.deleteProfileForm.controls)) {
                const control = this.deleteProfileForm.get(controlName);
                if (control?.invalid) {
                    this.toastr.error('', `Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`, { timeOut: timingConst.error });
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
        this.hasProfilePicture = false;
        this.selectedProfilePicture = null;
        this.profilePictureUrl = this.getProfilePictureUrl();
        this.changeUserDataForm.patchValue({
            profilePicture: this.profilePictureUrl
        });
    }

    protected onProfilePictureChange(event: any): void {
        this.pfpChanged = true;
        if (event.target.files && event.target.files.length > 0) {
            this.hasProfilePicture = true;
            this.selectedProfilePicture = event.target.files[0];
            this.profilePictureUrl = this.getProfilePictureUrl();
            this.changeUserDataForm.patchValue({
                profilePicture: this.profilePictureUrl
            });
        } else {
            this.selectedProfilePicture = null;
            this.profilePictureUrl = this.getProfilePictureUrl();
            this.changeUserDataForm.patchValue({
                profilePicture: this.profilePictureUrl
            });
        }
        this.profilePictureUrl = this.getProfilePictureUrl();
        this.changeUserDataForm.patchValue({
            profilePicture: this.profilePictureUrl
        });
    }

    protected getProfilePictureUrl() {
        if (!this.hasProfilePicture) {
            return 'assets/images/no-pfp.png';
        } else {
            if (this.selectedProfilePicture) {
                return URL.createObjectURL(this.selectedProfilePicture);
            } else {
                return this.profilePictureUrl;
            }
        }
    }

    protected createImageFromBlob(image: Blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
            this.hasProfilePicture = true;
            this.profilePictureUrl = reader.result as string;
            this.changeUserDataForm.patchValue({
                profilePicture: this.profilePictureUrl
            });
        }
        reader.readAsDataURL(image);
    }

    protected getUiAppropriateControlName(controlName: string): string {
        switch (controlName) {
            case 'username':
                return 'Uporabniško ime';
            case 'email':
                return 'E-pošta';
            case 'profilePicture':
                return 'Profilna slika';
            case 'oldPassword':
                return 'Staro geslo';
            case 'newPassword':
                return 'Novo geslo';
            case 'newPasswordRepeat':
                return 'Ponovi novo geslo';
            case 'password':
                return 'Geslo';
            case 'experience':
                return 'Izkušnje';
            case 'content':
                return 'Vsebina';
            case 'proof':
                return 'Dokaz';
            case 'otherTrackers':
                return 'Ostali sledilci';
            case 'agreeToTerms':
                return 'Strinjanje s pogoji';
            default:
                return controlName;
        }
    }

    protected updateCharacterCount(field: string) {
        this.uploaderRequestFormCharacterCount[field] = this.uploaderRequestDataForm.get(field)?.value.length || 0;
    }

    private setSettingsPage(username: string, email: string): void {
        // Set input fields
        this.username = username;
        this.email = email;
        this.isUser = this.userService.isUserLogged();

        this.changeUserDataForm.patchValue({
            username: this.username,
            email: this.email,
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
