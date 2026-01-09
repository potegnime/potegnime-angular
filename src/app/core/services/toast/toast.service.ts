import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { underMaintenance } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastr = inject(ToastrService);
  private readonly timingConst = 4000;

  // APIs may be down during maintenance, so we disable toasts in maintenance mode
  public showSuccess(message: string, title?: string): void {
    if (underMaintenance) return;
    this.toastr.success(message, title, { timeOut: this.timingConst });
  }

  public showError(message: string, title?: string): void {
    if (underMaintenance) return;
    this.toastr.error(message, title, { timeOut: this.timingConst });
  }

  public showWarning(message: string, title?: string): void {
    if (underMaintenance) return;
    this.toastr.warning(message, title, { timeOut: this.timingConst });
  }

  public showInfo(message: string, title?: string): void {
    if (underMaintenance) return;
    this.toastr.info(message, title, { timeOut: this.timingConst });
  }
}
