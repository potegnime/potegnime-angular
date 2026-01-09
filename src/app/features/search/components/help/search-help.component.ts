import { Component } from '@angular/core';

@Component({
  selector: 'app-search-help',
  templateUrl: './search-help.component.html',
  styleUrls: ['./search-help.component.scss'],
  standalone: true
})
export class SearchHelpComponent {
  protected expanded = false;

  protected toggleExpanded() {
    this.expanded = !this.expanded;
  }
}
