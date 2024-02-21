import { Component } from '@angular/core';
import { urlConst } from '../../enums/url.enum';
import { Route } from '@angular/router';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
    protected urlAppBase = urlConst.appBase;
}
