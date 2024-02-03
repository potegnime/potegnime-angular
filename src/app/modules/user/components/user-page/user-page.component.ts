import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';
import { UserService } from 'src/app/modules/shared/services/user-service/user.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from 'src/app/modules/shared/services/cache-service/cache.service';

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
    protected isMyPage: boolean = false;
    protected token: string | null = null;
    protected uid: number | null = null;
    protected username: string | null = null;
    protected profilePictureUrl: string = 'assets/images/no-pfp.png';
    protected role: string | null = null;
    protected joined: string | null = null;

    constructor(
        private readonly router: Router,
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly authService: AuthService,
        private readonly route: ActivatedRoute,
        private readonly toastr: ToastrService,
        private readonly cacheService: CacheService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            // Perform checks on any route change

            // Check if token exists
            this.token = this.tokenService.getToken();
            if (!this.token) {
                // User not logged in - session expired - redirect to login page
                this.authService.unauthorizedHandler();
            }

            // Check if user id exists in url
            const urlUid: number | null = parseInt(this.router.url.split('/')[2]);
            if (!urlUid) {
                // No user id in url - redirect to my page
                const decodedToken = this.tokenService.decodeToken();
                if (decodedToken) {
                    this.router.navigate(['u', decodedToken.uid]);
                } else {
                    // User not logged in - session expired - redirect to login page
                    this.authService.unauthorizedHandler();
                }
            }

            // Check if user page is my user page
            const decodedToken = this.tokenService.decodeToken();
            if (decodedToken) {
                this.isMyPage = decodedToken.uid === urlUid;
                if (this.isMyPage) {
                    this.getCompleteUserData(decodedToken.uid);                                  
                } else {
                    this.getCompleteUserData(urlUid);
                }
            } else {
                // Error decoding token - redirect to login page - log out user
                this.authService.unauthorizedHandler();
            }
        });
    }

    protected createImageFromBlob(image: Blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
            this.profilePictureUrl = reader.result as string;
        }
        reader.readAsDataURL(image);
    }

    protected getCompleteUserData(id: number): void {
        // Get user data and set user page
        this.userService.getUserById(id).subscribe({
            next: (user) => {
                this.setUserPage(user.uid, user.username, user.joined, user.role);
            },
            error: () => {
                this.toastr.error('Napaka pri pridobivanju podatkov o uporabniku');
                // Redirect to 404 page
                this.router.navigate(['404']);
            }
        });

        // Get profile picture
        // Wait 0.5 second to avoid unnecessary double api calls for profile picture - other component already has it cached
        setTimeout(() => {
            const cachedProfilePicture = this.cacheService.get(id.toString());
            if (cachedProfilePicture) {
                this.createImageFromBlob(cachedProfilePicture);
                return;
            } else {
                this.userService.getUserPfp(id).subscribe({
                    next: (response) => {
                        this.cacheService.put(id.toString(), response);
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
                                // this.toastr.error('Napaka pri pridobivanju profilne slike');
                                break;
                        }
                    }
                });
            }
        }, 500);
    }

    protected setMyPage(uid: number, username: string, joined: string, role: string): void {
        this.uid = uid;
        this.username = username;
        this.role = role;
        this.joined = joined;
        this.isMyPage = true;
    }

    protected setUserPage(uid: number, username: string, joined: string, role: string): void {
        this.uid = uid;
        this.username = username;
        this.role = role;
        this.joined = joined;
        this.isMyPage = false;
    }


}
