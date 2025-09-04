import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth-service/auth.service';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';
import { UserService } from 'src/app/modules/user/services/user-service/user.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from 'src/app/modules/shared/services/cache-service/cache.service';

// TODO
// Dont load no-pfp.png if user has profile picture (see network requests, it loads no-pfp.png first and then the actual profile picture)
// Probaly same issue for nav bar component

// TODO
// Compress pfp (client side?) before uploading to server, or server side (before saving?)

import { timingConst } from 'src/app/modules/shared/enums/toastr-timing.enum';

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
    protected isLoading: boolean = true;

    constructor(
        private readonly router: Router,
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly authService: AuthService,
        private readonly route: ActivatedRoute,
        private readonly toastr: ToastrService,
        private readonly cacheService: CacheService
    ) { }

    public ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.token = this.tokenService.getToken();
            if (!this.token) {
                this.authService.unauthorizedHandler();
            }

            const urlUid: number | null = parseInt(this.router.url.split('/')[2]);
            if (!urlUid) {
                const decodedToken = this.tokenService.decodeToken();
                if (decodedToken) {
                    this.router.navigate(['u', decodedToken.uid]);
                } else {
                    this.authService.unauthorizedHandler();
                }
            }

            const decodedToken = this.tokenService.decodeToken();
            if (decodedToken) {
                this.isMyPage = decodedToken.uid == urlUid;
                if (this.isMyPage) {
                    this.getCompleteUserData(decodedToken.uid);
                } else {
                    this.getCompleteUserData(urlUid);
                }
            } else {
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
        this.userService.getUserById(id).subscribe({
            next: (user) => {
                if (this.isMyPage) {
                    this.setMyPage(user.uid, user.username, user.joined, user.role);
                }
                else {
                    this.setUserPage(user.uid, user.username, user.joined, user.role);
                }
            },
            error: (error) => {
                switch (error.status) {
                    case 401:
                        this.authService.unauthorizedHandler();
                        break;
                    case 404:
                        // Redirect to 404 page
                        this.router.navigate(['404']);
                        break;
                    default:
                        this.toastr.error('', 'Napaka pri pridobivanju podatkov o uporabniku', { timeOut: timingConst.error });
                        break;
                }
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
                        this.isLoading = false;
                    },
                    error: (error) => {
                        this.profilePictureUrl = 'assets/images/no-pfp.png';
                        switch (error.status) {
                            case 401:
                                this.authService.unauthorizedHandler();
                                break;
                        }
                        this.isLoading = false;
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
