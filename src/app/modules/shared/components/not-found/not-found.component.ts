import { Component } from '@angular/core';
import { urlConst } from '../../enums/url.enum';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
  urlAppBase = urlConst.appBase;
}
