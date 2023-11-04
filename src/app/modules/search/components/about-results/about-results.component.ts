import { Component } from '@angular/core';

@Component({
  selector: 'app-about-results',
  templateUrl: './about-results.component.html',
  styleUrls: ['./about-results.component.scss']
})
export class AboutResultsComponent {
  protected expanded = false;
  protected toggleExpanded() {
    this.expanded = !this.expanded;
  }
}
