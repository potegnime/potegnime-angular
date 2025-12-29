import { inject, Injectable } from '@angular/core';
import { timingConst } from '@core/enums/toastr-timing.enum';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastr = inject(ToastrService);
  private readonly authService = inject(AuthService);

  public showSuccess(message: string, title?: string): void {
    if (!this.authService.verifyToken()) return;
    this.toastr.success(message, title, { timeOut: timingConst.success });
  }

  public showError(message: string, title?: string): void {
    if (!this.authService.verifyToken()) return;
    this.toastr.error(message, title, { timeOut: timingConst.error });
  }

  public showInfo(message: string, title?: string): void {
    if (!this.authService.verifyToken()) return;
    this.toastr.info(message, title, { timeOut: timingConst.info });
  }
}
