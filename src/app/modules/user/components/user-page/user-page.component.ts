import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from 'src/app/modules/auth/guards/auth/auth.guard';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit  {
  constructor(
    private readonly authGuard: AuthGuard,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    const uid = this.router.url
    console.log(this.router)
  }
}
