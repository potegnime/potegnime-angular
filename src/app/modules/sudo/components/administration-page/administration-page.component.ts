import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { AdminRecommendation } from 'src/app/modules/shared/models/admin-recommendation.interface';
import { RecommendationDto } from 'src/app/modules/shared/models/recommendation-dto.interface';
import { RecommendService } from 'src/app/modules/shared/services/recommend-service/recommend.service';
import { UpdateRoleDto } from 'src/app/modules/user/models/update-role.interface';
import { UserService } from 'src/app/modules/user/services/user.service';

@Component({
  selector: 'app-administration-page',
  templateUrl: './administration-page.component.html',
  styleUrls: ['./administration-page.component.scss']
})
export class AdministrationPageComponent {
    protected userFound: boolean | null = null;
    protected userUserId: number | null = null;
    protected userUsername: string | null = null;
    protected userRole: string | null = null;
    protected userPfpUrl: string | null = null;

    protected setRecommendationForm: FormGroup;
    protected userControlForm: FormGroup
    protected userRoleChangeForm: FormGroup;

    constructor(
        private readonly recommendService: RecommendService,
        private readonly userService: UserService,
        private readonly formBuilder: FormBuilder,
        private readonly toastr: ToastrService,
        private readonly authService: AuthService
    ) {
        // Form builders
        const date: string = this.getFormattedDate();
        this.setRecommendationForm = this.formBuilder.group({
            date: [date, Validators.required],
            type: ['movie', Validators.required],
            name: ['', Validators.required]
        });
        this.recommendService.getAdminRecommendation(date, 'movie').subscribe({
            next: (response: AdminRecommendation) => {
                this.setRecommendationForm.patchValue({
                    name: response.name
                });
            }, 
            error: (error) => {
                switch (error.status) {
                    case 401:
                        this.authService.unauthorizedHandler();
                        break;
                    case 404:
                        this.setRecommendationForm = this.formBuilder.group({
                            date: [date, Validators.required],
                            type: ['movie', Validators.required],
                            name: ['', Validators.required]
                        });
                        break;
                    default:
                        this.toastr.error('', 'Napaka pri pridobivanju priporočila dneva', { timeOut: 5000 });
                        this.setRecommendationForm = this.formBuilder.group({
                            date: [date, Validators.required],
                            type: ['movie', Validators.required],
                            name: ['', Validators.required]
                        });
                    break;
                }
            }
        });

        this.userControlForm = this.formBuilder.group({
            username: ['', Validators.required]
        });

        this.userRoleChangeForm = this.formBuilder.group({
            role: ['', Validators.required]
        });
    }

    protected onRecommendationDateChanged() {
        const date = this.setRecommendationForm.get('date')?.value;
        const type = this.setRecommendationForm.get('type')?.value;
        this.updateRecommendationFields(date, type);
    }

    protected onRecommendationTypeChange(type: any) {
        const date = this.setRecommendationForm.get('date')?.value;
        this.updateRecommendationFields(date, type.value);
    }

    private updateRecommendationFields(date: string, type: 'movie' | 'series') {
        this.recommendService.getAdminRecommendation(date, type).subscribe({
            next: (response: AdminRecommendation) => {
                this.setRecommendationForm.patchValue({
                    date: response.date,
                    type: response.type,
                    name: response.name
                });
            }, 
            error: (error) => {
                switch (error.status) {
                    case 401:
                        this.authService.unauthorizedHandler();
                        break;
                    case 404:
                        this.setRecommendationForm = this.formBuilder.group({
                            date: [date, Validators.required],
                            type: [type, Validators.required],
                            name: ['', Validators.required]
                        });
                        break;
                    default:
                        this.toastr.error('', 'Napaka pri pridobivanju priporočila dneva', { timeOut: 5000 });
                        this.setRecommendationForm = this.formBuilder.group({
                            date: [date, Validators.required],
                            type: ['movie', Validators.required],
                            name: ['', Validators.required]
                        });
                    break;
                }
            }
        });
    }

    // Form submit methods
    onSetRecommendationFormSubmit() {
        if (this.setRecommendationForm.valid) {
            const date = this.setRecommendationForm.get('date')?.value;
            const type = this.setRecommendationForm.get('type')?.value;
            const name = this.setRecommendationForm.get('name')?.value;
            const recommendationDto: RecommendationDto = {
                date: date,
                type: type,
                name: name
            };

            this.recommendService.setAdminRecommendation(recommendationDto).subscribe({
                next: () => {
                    if (type == 'movie') {
                        this.toastr.success('', 'Izbrani film dnvea uspešno nastavljen!', { timeOut: 5000 });
                    } else if (type == 'series') {
                        this.toastr.success('', 'Izbrana serija dnvea uspešno nastavljena!', { timeOut: 5000 });
                    }
                },
                error: (error) => {
                    switch (error.status) {
                        case 401:
                            this.authService.unauthorizedHandler();
                            break;
                        default:
                            this.toastr.error('', 'Napaka na strežniku', { timeOut: 5000 });
                            break;
                    }
                }
            });
        } else {
            Object.keys(this.setRecommendationForm.controls).forEach((controlName) => {
                const control = this.setRecommendationForm.get(controlName);
                if (control?.invalid) {
                    this.toastr.error(`Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`);
                }
            });
        }
    }

    onDeleteTodaysRecommendation() {
        const date = this.setRecommendationForm.get('date')?.value;
        const type = this.setRecommendationForm.get('type')?.value;
        this.recommendService.deleteAdminRecommendation(date, type).subscribe({
            next: () => {
                if (type == 'movie') {
                    this.toastr.success('', 'Izbrani film dnvea uspešno izbrisan!', { timeOut: 5000 });
                } else if (type == 'series') {
                    this.toastr.success('', 'Izbrana serija dnvea uspešno izbrisana!', { timeOut: 5000 });
                }                
                this.setRecommendationForm.patchValue({
                    name: ''
                });
            },
            error: (error: any) => {
                switch (error.status) {
                    case 401:
                        this.authService.unauthorizedHandler();
                        break;
                    default:
                        this.toastr.error('', 'Napaka na strežniku', { timeOut: 5000 });
                        break;
                }
            }
        })
    }

    onUserControlFormSubmit() {
        if (this.userControlForm.valid) {
            // Search for user
            const username = this.userControlForm.get('username')?.value;
            this.userService.getUserByUsername(username).subscribe({
                next: (response1) => {
                    this.userFound = true;
                    this.userUserId = response1.userId;
                    this.userUsername = response1.username;
                    this.userRole = response1.role;

                    // Set role selection dropdown
                    this.userRoleChangeForm.patchValue({
                        role: response1.role.toLowerCase()
                    });

                    // Get user pfp
                    this.userService.getUserPfp(response1.userId).subscribe({
                        next: (response2) => {
                            this.createImageFromBlob(response2);
                        },
                        error: (error2) => {
                            switch (error2.status) {
                                case 401:
                                    this.authService.unauthorizedHandler();
                                    break;
                                case 404:
                                    // No profile picture
                                    this.userPfpUrl = 'assets/images/no-pfp.png';
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                },
                error: (error1) => {
                    switch (error1.status) {
                        case 401:
                            this.authService.unauthorizedHandler();
                            break;
                        case 404:
                            this.userFound = false;
                            break;
                        default:
                            this.toastr.error('Napaka na strežniku');
                            break;
                    }
                }
            });
        } else {
            Object.keys(this.userControlForm.controls).forEach((controlName) => {
                const control = this.userControlForm.get(controlName);
                if (control?.invalid) {
                    this.toastr.error(`Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`);
                }
            });
        }
    }

    onUserRoleChangeForm() {
        const role = this.userRoleChangeForm.get('role')?.value;
        if (this.userUserId) {
            const updateRoleDto: UpdateRoleDto = {
                userId: this.userUserId,
                roleName: role
            };
    
            this.userService.updateRole(updateRoleDto).subscribe({
                next: () => {
                    this.toastr.success('', `Role za uporabnika ${this.userUsername} uspešno nastavljen na ${this.getUiAppropriateControlName(role)}`, { timeOut: 5000 });
                    this.onUserControlFormSubmit();
                },
                error: (error) => {
                    switch(error.status) {
                        case 401:
                            this.authService.unauthorizedHandler();
                            break;
                        default:
                            this.toastr.error('', 'Napaka na strežniku', { timeOut: 5000 });
                            break;
                    }
                }
            });
        }
    }

    onDeleteUser() {
        if (!confirm(`Ali ste prepričani, da želite izbrisati uporabnika ${this.userUsername}?`)) {
            return;
        }

        if (this.userUsername) {
            this.userService.deleteProfileAdmin(this.userUsername).subscribe({
                next: () => {
                    this.toastr.success('Profil uspešno izbrisan!');
                    this.userFound = null;
                    this.userUsername = null;
                    this.userRole = null;
                    this.userPfpUrl = null;
                },
                error: (error) => {
                    switch (error.status) {
                        case 401:
                            this.authService.unauthorizedHandler();
                            break;
                        case 404:
                            this.toastr.error('', 'Uporabnik ne obstaja', { timeOut: 5000 });
                            break;
                        default:
                            this.toastr.error('', 'Napaka pri brisanju profila!', { timeOut: 5000 });
                            break;
                    }
                }
            });
        }
    }

    // UI methods
    protected createImageFromBlob(image: Blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
            this.userPfpUrl = reader.result as string;
        }
        reader.readAsDataURL(image);
    }

    protected getUiAppropriateControlName(controlName: string): string {
        switch (controlName) {
            case 'date':
                return 'Datum';
            case 'type':
                return 'Tip';
            case 'name':
                return 'Naslov';
            case 'username':
                return 'Uporabniško ime';
            default:
                return controlName;
        }
    }

    protected scrollToSection(sectionId: string): void {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Helper methods
    private getFormattedDate(): string {
        const dateObject = new Date();
        const day = String(dateObject.getDate()).padStart(2, '0');
        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
        const year = dateObject.getFullYear();
        return `${year}-${month}-${day}`;
    }
}
