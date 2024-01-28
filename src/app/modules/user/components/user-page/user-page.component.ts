import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth/auth.service';
import { TokenService } from 'src/app/modules/shared/services/token-service/token.service';
import { UserService } from 'src/app/modules/shared/services/user-service/user.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    protected base64ProfilePicture: string | null = null;
    protected profilePictureMimeType: string | null = null;
    protected role: string | null = null;
    protected joined: string | null = null;

    constructor(
        private readonly router: Router,
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly authService: AuthService,
        private readonly route: ActivatedRoute,
        private readonly toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            // perform checks on any route change

            // check if token exists
            this.token = this.tokenService.getToken();
            if (!this.token) {
                // user not logged in - session expired - redirect to login page
                this.authService.unauthorizedHandler();
            }

            // check if user id exists in url
            const urlUid: number | null = parseInt(this.router.url.split('/')[2]);
            if (!urlUid) {
                // no user id in url - redirect to my page
                const decodedToken = this.tokenService.decodeToken();
                if (decodedToken) {
                    this.router.navigate(['u', decodedToken.uid]);
                } else {
                    // user not logged in - session expired - redirect to login page
                    this.authService.unauthorizedHandler();
                }
            }

            // check if user page is my user page
            const decodedToken = this.tokenService.decodeToken();
            if (decodedToken) {
                this.isMyPage = decodedToken.uid === urlUid;
                if (this.isMyPage) {
                    // get user data by id and set my page
                    this.userService.getUserById(decodedToken.uid).subscribe({
                        next: (user) => {
                            this.setMyPage(user.uid, user.username, user.profilePictureBase64, user.profilePictureMimeType, user.role, user.joined);
                        },
                        error: () => {
                            this.toastr.error('Napaka pri pridobivanju podatkov o uporabniku');
                            // redirect to 404 page
                            this.router.navigate(['404']);
                        }
                    });
                } else {
                    // get user data by id and set user page
                    this.userService.getUserById(urlUid).subscribe({
                        next: (user) => {
                            this.setUserPage(user.uid, user.username, user.profilePictureBase64, user.profilePictureMimeType, user.role, user.joined);
                        },
                        error: () => {
                            this.toastr.error('Napaka pri pridobivanju podatkov o uporabniku');
                            // redirect to 404 page
                            this.router.navigate(['404']);
                        }
                    });
                }
            } else {
                // error decoding token - redirect to login page - log out user
                this.authService.unauthorizedHandler();
            }
        });
    }

    protected setMyPage(uid: number, username: string, base64Image: string, mimeType: string | null, role: string, joined: string): void {
        this.uid = uid;
        this.username = username;
        this.base64ProfilePicture = base64Image;
        this.profilePictureMimeType = mimeType;
        this.role = role;
        this.joined = joined;
        this.isMyPage = true;
    }

    protected setUserPage(uid: number, username: string, base64Image: string, mimeType: string | null, role: string, joined: string): void {
        this.uid = uid;
        this.username = username;
        this.base64ProfilePicture = base64Image;
        this.profilePictureMimeType = mimeType;
        this.role = role;
        this.joined = joined;
        this.isMyPage = false;
    }
}
