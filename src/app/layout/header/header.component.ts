import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { NavComponent } from '@layout/nav/nav.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [SearchBarComponent, NavComponent, RouterLink],
  standalone: true
})
export class HeaderComponent {}
