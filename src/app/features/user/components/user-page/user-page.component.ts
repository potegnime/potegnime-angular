import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '@features/auth/services/auth/auth.service';
import { TokenService } from '@core/services/token-service/token.service';
import { UserService } from '@features/user/services/user/user.service';
import { CacheService } from '@core/services/cache/cache.service';
import { timingConst } from '@core/enums/toastr-timing.enum';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { SudoNavComponent } from '@features/sudo/components/sudo-nav/sudo-nav.component';
import { UserModel } from '@models/user.interface';
import { GetUserModel } from '@models/get-user.interface';

// TODO
// Don't load no-pfp.png if user has profile picture (see network requests, it loads no-pfp.png first and then the actual profile picture)
// Probably same issue for nav bar component

// TODO
// Compress pfp (client side?) before uploading to server, or server side (before saving?)

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.scss'],
    imports: [LoadingSpinnerComponent, NgClass, SudoNavComponent, DatePipe],
    standalone: true
})
export class UserPageComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly userService = inject(UserService);
    private readonly tokenService = inject(TokenService);
    private readonly authService = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastr = inject(ToastrService);
    private readonly cacheService = inject(CacheService);

    protected user: UserModel | null = null;
    protected otherUser: GetUserModel | null = null;
    protected isMyPage: boolean = false;
    protected profilePictureUrl: string = 'assets/images/no-pfp.png';
    protected isLoading: boolean = true;

    public get displayUserName(): string | undefined {
        if (this.isMyPage) return this.user?.username;
        else return this.otherUser?.username;
    }

    public get displayJoined(): string | undefined {
        if (this.isMyPage) return this.user?.joined;
        else return this.otherUser?.joined;
    }

    public get displayRole(): string {
        switch (this.user?.role) {
            case 'admin':
                return 'Administrator';
            case 'uploader':
                return 'Nalagatelj';
            default:
                return 'Uporabnik';
        }
    }

    public ngOnInit(): void {
        this.route.params.subscribe(params => {
            const loggedInUser: UserModel | null = this.userService.getUserInfoFromToken();
            if (!loggedInUser) {
                this.authService.unauthorizedHandler();
            }

            const urlUid: number | null = parseInt(this.router.url.split('/')[2]);
            this.isMyPage = loggedInUser.uid == urlUid;
            if (this.isMyPage && urlUid) {
                this.user = loggedInUser;
                if (this.user?.hasPfp) this.setPfp(this.user.uid);
                this.isLoading = false;
            } else {
                this.getUserData(urlUid);
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

    private getUserData(userId: number): void {
        this.userService.getUserById(userId).subscribe({
            next: (user: GetUserModel) => {
                console.log(user);
                this.otherUser = user;
                console.log(this.otherUser);
                if (this.otherUser?.hasPfp) this.setPfp(this.otherUser.userId);
                this.isLoading = false;
            },
            error: (error) => {
                switch (error.status) {
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
    }

    private setPfp(userId: number): void {
        // Get profile picture
        // Wait 0.5 second to avoid unnecessary double api calls for profile picture - other component already has it cached
        setTimeout(() => {
            const cachedProfilePicture = this.cacheService.get(userId.toString());
            if (cachedProfilePicture) {
                this.createImageFromBlob(cachedProfilePicture);
                this.isLoading = false;
            } else {
                this.userService.getUserPfp(userId).subscribe({
                    next: (response) => {
                        this.cacheService.put(userId.toString(), response);
                        this.createImageFromBlob(response);
                        this.isLoading = false;
                    },
                    error: (error) => {
                        this.profilePictureUrl = 'assets/images/no-pfp.png';
                        this.isLoading = false;
                    }
                });
            }
        }, 500);
    }
}
