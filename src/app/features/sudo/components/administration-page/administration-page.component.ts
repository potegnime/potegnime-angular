import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AdminRecommendation } from '@models/admin-recommendation.interface';
import { RecommendationDto } from '@models/recommendation-dto.interface';
import { RecommendService } from '@shared/services/recommend/recommend.service';
import { UpdateRoleDto } from '@features/user/models/update-role.interface';
import { UserService } from '@features/user/services/user/user.service';
import { AdminService } from '@features/sudo/services/admin/admin.service';
import { SudoNavComponent } from '@features/sudo/components/sudo-nav/sudo-nav.component';
import { APP_CONSTANTS } from '@constants/constants';
import { GetUserModel } from '@models/get-user.interface';
import { ToastService } from '@core/services/toast/toast.service';

@Component({
  selector: 'app-administration-page',
  templateUrl: './administration-page.component.html',
  styleUrls: ['./administration-page.component.scss'],
  imports: [ReactiveFormsModule, SudoNavComponent],
  standalone: true
})
export class AdministrationPageComponent implements OnInit {
  private readonly recommendService = inject(RecommendService);
  private readonly userService = inject(UserService);
  private readonly adminService = inject(AdminService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(ToastService);

  // User control
  protected foundUser: GetUserModel | undefined;
  protected profilePictureUrl: string | undefined = APP_CONSTANTS.DEFAULT_PFP_PATH;

  // Uploader requests
  protected uploaderRequests: any[] = [];

  // Form groups
  protected setRecommendationForm!: FormGroup;
  protected userControlForm!: FormGroup;
  protected userRoleChangeForm!: FormGroup;

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
          case 404:
            this.setRecommendationForm = this.formBuilder.group({
              date: [date, Validators.required],
              type: ['movie', Validators.required],
              name: ['', Validators.required]
            });
            break;
          default:
            this.toastService.showError('Napaka pri pridobivanju priporočila dneva');
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
            this.toastService.showSuccess('Izbrani film dnvea uspešno nastavljen');
          } else if (type == 'series') {
            this.toastService.showSuccess('Izbrana serija dnvea uspešno nastavljena');
          }
        }
      });
    } else {
      for (const controlName of Object.keys(this.setRecommendationForm.controls)) {
        const control = this.setRecommendationForm.get(controlName);
        if (control?.invalid) {
          this.toastService.showError(`Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`);
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
          this.toastService.showSuccess('Izbrani film dnvea uspešno izbrisan');
        } else if (type == 'series') {
          this.toastService.showSuccess('Izbrana serija dnvea uspešno izbrisana');
        }
        this.setRecommendationForm.patchValue({
          name: ''
        });
      }
    });
  }

  protected onUserControlFormSubmit() {
    if (this.userControlForm.valid) {
      // Search for user
      const username = this.userControlForm.get('username')?.value;
      this.userService.getUserByUsername(username).subscribe({
        next: (response1: GetUserModel) => {
          this.foundUser = response1;

          // Set role selection dropdown
          this.userRoleChangeForm.patchValue({
            role: response1.role.toLowerCase()
          });

          // Get user pfp
          if (this.foundUser.hasPfp) {
            this.profilePictureUrl = this.userService.buildPfpUrl(this.foundUser.username);
          } else {
            this.profilePictureUrl = APP_CONSTANTS.DEFAULT_PFP_PATH;
          }
        },
        error: (error1) => {
          switch (error1.status) {
            case 404:
              // this.userFound = false;
              break;
          }
        }
      });
    } else {
      for (const controlName of Object.keys(this.userControlForm.controls)) {
        const control = this.userControlForm.get(controlName);
        if (control?.invalid) {
          this.toastService.showError(`Neveljaven vnos podatkov v polju ${this.getUiAppropriateControlName(controlName)}!`);
          break;
        }
      }
    }
  }

  protected onUserRoleChangeForm() {
    const role = this.userRoleChangeForm.get('role')?.value;
    if (this.foundUser?.username) {
      const updateRoleDto: UpdateRoleDto = {
        username: this.foundUser.username,
        roleName: role
      };

      this.adminService.updateRole(updateRoleDto).subscribe({
        next: () => {
          this.toastService.showSuccess(`Role za uporabnika ${this.foundUser?.username} uspešno nastavljen na ${this.getUiAppropriateControlName(role)}`);
          this.onUserControlFormSubmit();
        }
      });
    }
  }

  protected onDeleteUser() {
    if (!confirm(`Ali ste prepričani, da želite izbrisati uporabnika ${this.foundUser?.username}?`)) {
      return;
    }

    if (this.foundUser?.username) {
      this.adminService.deleteProfileAdmin(this.foundUser.username).subscribe({
        next: () => {
          this.toastService.showSuccess('Profil uspešno izbrisan');
          this.foundUser = undefined;
          this.profilePictureUrl = undefined;
        },
        error: (error) => {
          switch (error.status) {
            case 404:
              this.toastService.showError('Uporabnik ne obstaja');
              break;
            default:
              this.toastService.showError('Napaka pri brisanju profila');
              break;
          }
        }
      });
    }
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
          case 404:
            this.setRecommendationForm = this.formBuilder.group({
              date: [date, Validators.required],
              type: [type, Validators.required],
              name: ['', Validators.required]
            });
            break;
          default:
            this.toastService.showError('Napaka pri pridobivanju priporočila dneva');
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
