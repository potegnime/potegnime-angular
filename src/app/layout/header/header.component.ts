import { Component } from '@angular/core';
import { SearchBarComponent } from 'src/app/shared/components/search-bar/search-bar.component';
import { NavComponent } from '../nav/nav.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [SearchBarComponent, NavComponent, RouterLink],
    standalone: true
})
export class HeaderComponent {

}
