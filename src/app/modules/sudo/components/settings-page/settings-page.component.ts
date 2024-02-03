import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, map, Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CacheService } from 'src/app/modules/shared/services/cache-service/cache.service';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';
import { UserService } from 'src/app/modules/shared/services/user-service/user.service';
import { UpdateUsernameDto } from 'src/app/modules/user/models/update-username.interface';
import { UpdateEmailDto } from 'src/app/modules/user/models/update-email.interface';
import { UpdatePfpDto } from 'src/app/modules/user/models/update-pfp.interface';
import { UpdatePasswordDto } from 'src/app/modules/user/models/update-password.interface';
import { DeleteProfileDto } from 'src/app/modules/user/models/delete-profile.interface';

@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent {
    protected token: string | null = null;
    protected uid: number | null = null;
    protected username: string | null = null;
    protected email: string | null = null;
    protected pristineProfilePicture: string | Blob= 'assets/images/no-pfp.png';
    protected hasProfilePicture: boolean = false;
    protected selectedProfilePicture: File | null = null;
    protected profilePictureUrl: string = 'assets/images/no-pfp.png';

    changeUserDataForm: FormGroup;
    changePasswordForm: FormGroup;
    deleteProfileForm: FormGroup;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
        private readonly toastr: ToastrService,
        private readonly cacheService: CacheService
    ) {
        // Form builders
        this.changeUserDataForm = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            profilePicture: ['']
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
            // Get user data
            this.userService.getUserById(decodedToken.uid).subscribe({
                next: (user) => {
                    this.setSettingsPage(
                        user.username,
                        user.email);
                },
                error: () => {
                    this.toastr.error('Napaka pri pridobivanju uprabniških podatkov.');
                    // Force logout
                    this.authService.unauthorizedHandler();
                }
            });

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
                            switch (error.status) {
                                case 401:
                                    this.authService.unauthorizedHandler();
                                    break;
                                case 404:
                                    // No profile picture
                                    this.profilePictureUrl = 'assets/images/no-pfp.png';
                                    this.changeUserDataForm.patchValue({
                                        profilePicture: this.profilePictureUrl
                                    });
                                    break;
                                default:
                                    // this.toastr.error('Napaka pri pridobivanju profilne slike');
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

    onChnangeUserDataSubmit() {
        if (this.changeUserDataForm.valid) {
            // Check which fields have changed
            const username = this.changeUserDataForm.get('username')?.value;
            const email = this.changeUserDataForm.get('email')?.value;
            const profilePicture = this.changeUserDataForm.get('profilePicture')?.value;

            // Check if none of the fields have changed
            if (username === this.username && email === this.email && profilePicture === this.pristineProfilePicture) {
                this.toastr.info('Ni sprememb!');
            }

            // Update username
            if (username !== this.username) {
                const updateUsernameDto: UpdateUsernameDto = {
                    username: username
                };
                this.userService.updateUsername(updateUsernameDto).subscribe({
                    next: () => {
                        this.toastr.success('Uporabniško ime uspešno posodobljeno!');
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
                                this.toastr.error(error.error.message);
                                break;
                            default:
                                this.toastr.error('Napaka pri posodabljanju uporabniškega imena!');
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
                        this.toastr.success('Email uspešno posodobljen!');
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
                                this.toastr.error(error.error.message);
                                break;
                            default:
                                this.toastr.error('Napaka pri posodabljanju e-poštes!');
                                break;
                        }
                    }
                });
            }

            if (profilePicture !== this.pristineProfilePicture) {
                const pfpUpdate: File | null =
                    profilePicture == 'assets/images/no-pfp.png' 
                    ? this.selectedProfilePicture as File : null;
                const updatePfpDto: UpdatePfpDto = {
                    profilePicFile: pfpUpdate as File
                };
                this.userService.updatePfp(updatePfpDto).subscribe({
                    next: () => {
                        this.toastr.success('Profilna slika uspešno posodobljena!');
                        // Update profile picture in settings page
                        this.pristineProfilePicture = this.selectedProfilePicture as File;
                        this.profilePictureUrl = this.getProfilePictureUrl();
                        this.changeUserDataForm.patchValue({
                            profilePicture: this.profilePictureUrl
                        });

                        // Refresh site to update profile picture across the site
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    },
                    error: (error) => {
                        switch (error.status) {
                            case 401:
                                this.authService.unauthorizedHandler();
                                break;
                            case 409:
                                this.toastr.error(error.error.message);
                                break;
                            default:
                                this.toastr.error('Napaka pri posodabljanju profilne slike!');
                                break;
                        }
                    }
                });
            }
        } else {
            Object.keys(this.changeUserDataForm.controls).forEach((controlName) => {
                const control = this.changeUserDataForm.get(controlName);
                if (control?.invalid) {
                    this.toastr.error(`Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`);
                }
            });
        }
    }

    onChangePasswordSubmit() {
        if (this.changePasswordForm.valid) {
            const oldPassword = this.changePasswordForm.get('oldPassword')?.value;
            const newPassword = this.changePasswordForm.get('newPassword')?.value;
            const newPasswordRepeat = this.changePasswordForm.get('newPasswordRepeat')?.value;

            if (newPassword !== newPasswordRepeat) {
                this.toastr.error('Gesli se ne ujemata!');
                return;
            }

            const updatePasswordDto: UpdatePasswordDto = {
                oldPassword: oldPassword,
                newPassword: newPassword
            };

            this.userService.updatePassword(updatePasswordDto).subscribe({
                next: () => {
                    this.toastr.success('Geslo uspešno posodobljeno!');
                    this.changePasswordForm.reset();
                },
                error: (error) => {
                    switch (error.status) {
                        case 401:
                            this.authService.unauthorizedHandler();
                            break;
                        case 403:
                            console.log('40333333333333');
                            console.log(error);
                            this.toastr.error(error.error.message);
                            break;
                        default:
                            this.toastr.error('Napaka pri posodabljanju gesla!');
                            break;
                    }
                }
            });
        } else {
            Object.keys(this.changePasswordForm.controls).forEach((controlName) => {
                const control = this.changePasswordForm.get(controlName);
                if (control?.invalid) {
                    this.toastr.error(`Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`);
                }
            });
        }
    }

    onDeleteProfileSubmit() {
        if (this.deleteProfileForm.valid) {
            if (!confirm('Ali ste prepričani, da želite izbrisati profil? Ta operacija je nepovratna!')) {
                return;
            }
            const password = this.deleteProfileForm.get('password')?.value;
            const deleteProfileDto: DeleteProfileDto = {
                password: password
            };

            this.userService.deleteProfile(deleteProfileDto).subscribe({
                next: () => {
                    this.toastr.success('Profil uspešno izbrisan!');
                    this.authService.logout();
                },
                error: (error) => {
                    switch (error.status) {
                        case 401:
                            this.authService.unauthorizedHandler();
                            break;
                        case 403:
                            this.toastr.error(error.error.message);
                            break;
                        default:
                            this.toastr.error('Napaka pri brisanju profila!');
                            break;
                    }
                }
            });
        } else {
            Object.keys(this.deleteProfileForm.controls).forEach((controlName) => {
                const control = this.deleteProfileForm.get(controlName);
                if (control?.invalid) {
                    this.toastr.error(`Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`);
                }
            });
        }
    }

    passwordMatchValidator(control: AbstractControl) {
        const newPassword = control.get('newPassword')?.value;
        const newPasswordRepeat = control.get('newPasswordRepeat')?.value;

        if (newPassword !== newPasswordRepeat) {
            control.get('newPasswordRepeat')?.setErrors({ passwordMismatch: true });
        } else {
            control.get('newPasswordRepeat')?.setErrors(null);
        }
    }

    // UI methods
    protected scrollToSection(sectionId: string): void {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    protected removeProfilePicture(): void {
        this.hasProfilePicture = false;
        this.selectedProfilePicture = null;
        this.profilePictureUrl = this.getProfilePictureUrl();
        this.changeUserDataForm.patchValue({
            profilePicture: this.profilePictureUrl
        });
    }

    protected onProfilePictureChange(event: any): void {
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

    private setSettingsPage(username: string, email: string): void {
        // Set input fields
        this.username = username;
        this.email = email;

        this.changeUserDataForm.patchValue({
            username: this.username,
            email: this.email,
            profilePicture: this.profilePictureUrl
        });

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
            default:
                return '';
        }
    }
}
