import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastr = inject(ToastrService);
  private readonly timingConst = 4000;


  public showSuccess(message: string, title?: string): void {
    this.toastr.success(message, title, { timeOut: this.timingConst });
  }

  public showError(message: string, title?: string): void {
    this.toastr.error(message, title, { timeOut: this.timingConst });
  }

  public showWarning(message: string, title?: string): void {
    this.toastr.warning(message, title, { timeOut: this.timingConst });
  }

  public showInfo(message: string, title?: string): void {
    this.toastr.info(message, title, { timeOut: this.timingConst });
  }
}
