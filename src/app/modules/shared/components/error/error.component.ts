import { Component } from '@angular/core';
import { urlConst } from '../../enums/url.enum';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  urlAppBase = urlConst.appBase;
}
