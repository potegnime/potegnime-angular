import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth-service/auth.service';
import { CacheService } from 'src/app/modules/shared/services/cache-service/cache.service';
import { UserService } from 'src/app/modules/user/services/user-service/user.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
    protected uid!: number | null;
    protected username: string | null = null;
    protected profilePictureUrl: string | null = null;
    protected isAdmin: boolean = false;
    protected isUploader: boolean = false;
    protected notificationCount: number = 10;

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly router: Router,
        private readonly cacheService: CacheService
    ) { }

    public ngOnInit(): void {
        this.uid = this.userService.getLoggedUserId();
        this.isAdmin = this.userService.isAdminLogged();
        this.isUploader = this.userService.isUploaderLogged();
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
                        }
                        this.profilePictureUrl = 'assets/images/no-pfp.png';
                    }
                });
            }
        } else {
            this.authService.unauthorizedHandler();
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
