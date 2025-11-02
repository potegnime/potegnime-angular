import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth/services/auth-service/auth.service';
import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';
import { AdminRecommendation } from 'src/app/modules/shared/models/admin-recommendation.interface';
import { RecommendationDto } from 'src/app/modules/shared/models/recommendation-dto.interface';
import { RecommendService } from 'src/app/modules/shared/services/recommend-service/recommend.service';
import { UpdateRoleDto } from 'src/app/modules/user/models/update-role.interface';
import { UserService } from 'src/app/modules/user/services/user-service/user.service';
import { AdminService } from '../../services/admin-service/admin.service';

@Component({
    selector: 'app-administration-page',
    templateUrl: './administration-page.component.html',
    styleUrls: ['./administration-page.component.scss']
})
export class AdministrationPageComponent implements OnInit {
    // User control
    protected userFound: boolean | null = null;
    protected userUserId: number | null = null;
    protected userUsername: string | null = null;
    protected userRole: string | null = null;
    protected userPfpUrl: string | null = null;

    // Uploader requests
    protected uploaderRequests: any[] = [];

    // Form groups
    protected setRecommendationForm!: FormGroup;
    protected userControlForm!: FormGroup
    protected userRoleChangeForm!: FormGroup;

    constructor(
        private readonly recommendService: RecommendService,
        private readonly userService: UserService,
        private readonly adminService: AdminService,
        private readonly formBuilder: FormBuilder,
        private readonly toastr: ToastrService,
        private readonly authService: AuthService
    ) { }

    public ngOnInit(): void {
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
                        this.toastr.error('', 'Napaka pri pridobivanju priporočila dneva', { timeOut: timingConst.error });
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

    // Form submit methods
    protected onSetRecommendationFormSubmit() {
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
                        this.toastr.success('', 'Izbrani film dnvea uspešno nastavljen', { timeOut: timingConst.success });
                    } else if (type == 'series') {
                        this.toastr.success('', 'Izbrana serija dnvea uspešno nastavljena', { timeOut: timingConst.success });
                    }
                },
                error: (error) => {
                    switch (error.status) {
                        case 401:
                            this.authService.unauthorizedHandler();
                            break;
                        default:
                            this.toastr.error('', 'Napaka na strežniku', { timeOut: timingConst.error });
                            break;
                    }
                }
            });
        } else {
            for (const controlName of Object.keys(this.setRecommendationForm.controls)) {
                const control = this.setRecommendationForm.get(controlName);
                if (control?.invalid) {
                    this.toastr.error('', `Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`, { timeOut: timingConst.error });
                    break;
                }
            }
        }
    }

    protected onDeleteTodaysRecommendation() {
        const date = this.setRecommendationForm.get('date')?.value;
        const type = this.setRecommendationForm.get('type')?.value;
        this.recommendService.deleteAdminRecommendation(date, type).subscribe({
            next: () => {
                if (type == 'movie') {
                    this.toastr.success('', 'Izbrani film dnvea uspešno izbrisan', { timeOut: timingConst.success });
                } else if (type == 'series') {
                    this.toastr.success('', 'Izbrana serija dnvea uspešno izbrisana', { timeOut: timingConst.success });
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
                        this.toastr.error('', 'Napaka na strežniku', { timeOut: timingConst.error });
                        break;
                }
            }
        })
    }

    protected onUserControlFormSubmit() {
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
                            this.userPfpUrl = 'assets/images/no-pfp.png';
                            switch (error2.status) {
                                case 401:
                                    this.authService.unauthorizedHandler();
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
            for (const controlName of Object.keys(this.userControlForm.controls)) {
                const control = this.userControlForm.get(controlName);
                if (control?.invalid) {
                    this.toastr.error('', `Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`, { timeOut: timingConst.error });
                    break;
                }
            }
        }
    }

    protected onUserRoleChangeForm() {
        const role = this.userRoleChangeForm.get('role')?.value;
        if (this.userUserId) {
            const updateRoleDto: UpdateRoleDto = {
                userId: this.userUserId,
                roleName: role
            };

            this.adminService.updateRole(updateRoleDto).subscribe({
                next: () => {
                    this.toastr.success('', `Role za uporabnika ${this.userUsername} uspešno nastavljen na ${this.getUiAppropriateControlName(role)}`, { timeOut: timingConst.success });
                    this.onUserControlFormSubmit();
                },
                error: (error) => {
                    switch (error.status) {
                        case 401:
                            this.authService.unauthorizedHandler();
                            break;
                        default:
                            this.toastr.error('', 'Napaka na strežniku', { timeOut: timingConst.error });
                            break;
                    }
                }
            });
        }
    }

    protected onDeleteUser() {
        if (!confirm(`Ali ste prepričani, da želite izbrisati uporabnika ${this.userUsername}?`)) {
            return;
        }

        if (this.userUsername) {
            this.adminService.deleteProfileAdmin(this.userUsername).subscribe({
                next: () => {
                    this.toastr.success('', 'Profil uspešno izbrisan', { timeOut: timingConst.success });
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
                            this.toastr.error('', 'Uporabnik ne obstaja', { timeOut: timingConst.error });
                            break;
                        default:
                            this.toastr.error('', 'Napaka pri brisanju profila', { timeOut: timingConst.error });
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
            case 'user':
                return 'Uporabnik';
            case 'uploader':
                return 'Nalagalec';
            case 'admin':
                return 'Administrator';
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
                        this.toastr.error('', 'Napaka pri pridobivanju priporočila dneva', { timeOut: timingConst.error });
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
}
