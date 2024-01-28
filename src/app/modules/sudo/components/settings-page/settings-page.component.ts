import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth/services/auth/auth.service';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';

@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent {

    changeUserDataForm: FormGroup;
    changePasswordForm: FormGroup;
    deleteProfileForm: FormGroup;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly tokenService: TokenService,
        private readonly router: Router,
        private readonly toastr: ToastrService
    ) {
        this.changeUserDataForm = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', Validators.required],
            profilePicture: ['']
        });

        this.changePasswordForm = this.formBuilder.group({
            oldPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
            newPasswordRepeat: ['', Validators.required]
        });

        this.deleteProfileForm = this.formBuilder.group({
            password: ['', Validators.required]
        });
    }

    onChnangeUserDataSubmit() {
        if (this.changeUserDataForm.valid) {

        }
    }

    onChangePasswordSubmit() {
        if (this.changePasswordForm.valid) {

        }
    }

    onDeleteProfileSubmit() {
        if (this.deleteProfileForm.valid) {

        }
    }

    scrollToSection(sectionId: string): void {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
