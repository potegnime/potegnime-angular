import { Component, Input, OnChanges, SimpleChanges, OnDestroy, inject } from '@angular/core';
import { DOCUMENT, NgClass } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  standalone: true,
  imports: [NgClass]
})
export class LoadingSpinnerComponent implements OnChanges, OnDestroy {
  @Input()
  active = false;

  @Input()
  overlay = false;

  private document = inject(DOCUMENT);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active']) {
      if (this.active) {
        this.document.body.classList.add('no-scroll');
      } else {
        this.document.body.classList.remove('no-scroll');
      }
    }
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove('no-scroll');
  }
}