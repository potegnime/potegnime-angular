import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
    imports: [RouterLink],
    standalone: true
})
export class ErrorComponent {

    @Input()
    errorCode: number = 404;

    @Input()
    errorMessage: string = 'Ups! Ta stran ne obstaja.';
}
