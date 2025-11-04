import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth-service/auth.service';
import { UserModel } from 'src/app/modules/shared/models/user.interface';
import { CacheService } from 'src/app/modules/shared/services/cache-service/cache.service';
import { UserService } from 'src/app/modules/user/services/user-service/user.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
    imports: [RouterLink],
    standalone: true
})
export class NavComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly userService = inject(UserService);
    private readonly router = inject(Router);
    private readonly cacheService = inject(CacheService);

    protected user: UserModel | null = null;
    protected profilePictureUrl: string = 'assets/images/no-pfp.png';
    protected notificationCount: number = 10;

    public ngOnInit(): void {
        this.user = this.userService.getUserInfoFromToken();
        // check if user has profile picture
        if (this.user.hasPfp) {
            // Get profile picture -try to get from cache first
            const cachedProfilePicture = this.cacheService.get(this.user.uid.toString());
            if (cachedProfilePicture) {
                this.createImageFromBlob(cachedProfilePicture);
            } else {
                this.userService.getUserPfp(this.user.uid).subscribe({
                    next: (response) => {
                        this.cacheService.put(this.user!.uid.toString(), response);
                        this.createImageFromBlob(response);
                    },
                    error: (error) => {
                        this.profilePictureUrl = 'assets/images/no-pfp.png';
                    }
                });
            }
        }
    }

    protected get notificationCountUi(): string {
        return this.notificationCount > 9 ? '9+' : this.notificationCount.toString();
    }

    protected exploreClick(section: string | null) {
        if (!section) {
            this.router.navigate(['/razisci']);
        }
        let queryParams = {
            s: section
        }
        this.router.navigate(['/razisci'], { queryParams: queryParams });
    }

    protected createImageFromBlob(image: Blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
            this.profilePictureUrl = reader.result as string;
        }
        reader.readAsDataURL(image);
    }

    protected removeNotification(event: Event, notificationId: number) {
        /**
         * TODO
         * Remove notification from database
         * Handle notification count (better?)
         */
        event.stopPropagation();
        this.notificationCount--;
    }

    protected logout() {
        this.authService.logout();
    }
}
