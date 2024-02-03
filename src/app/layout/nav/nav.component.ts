import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CacheService } from 'src/app/modules/shared/services/cache-service/cache.service';
import { UserService } from 'src/app/modules/shared/services/user-service/user.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent {
    protected uid: number | null;
    protected username: string | null = null;
    protected profilePictureUrl: string | null = null;

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly toastr: ToastrService,
        private readonly cacheService: CacheService
    ) {
        this.uid = userService.getLoggedUserId();
        if (this.uid) {
            // Get profile picture
            // Try to get from cache first
            const cachedProfilePicture = this.cacheService.get(this.uid.toString());
            if (cachedProfilePicture) {
                this.createImageFromBlob(cachedProfilePicture);
            } else {
                this.userService.getUserPfp(this.uid).subscribe({
                    next: (response) => {
                        this.cacheService.put(this.uid!.toString(), response);
                        this.createImageFromBlob(response);
                    },
                    error: (error) => {
                        switch (error.status) {
                            case 401:
                                this.authService.unauthorizedHandler();
                                break;
                            case 404:
                                // No profile picture
                                this.profilePictureUrl = 'assets/images/no-pfp.png';
                                break;
                            default:
                                this.toastr.error('Napaka pri pridobivanju profilne slike');
                                break;
                        }
                    }
                }); 
            }
        } else {
            this.authService.unauthorizedHandler();
        }
    }

    protected createImageFromBlob(image: Blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
            this.profilePictureUrl = reader.result as string;
        }
        reader.readAsDataURL(image);
    }

    protected logout() {
        this.authService.logout();
    }
}
