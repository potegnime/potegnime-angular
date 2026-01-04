export class AuthResetHelper {
  private static forgotPasswordTimeoutCacheKey = 'potegnime-forgot-password-timeout';

  public static setForgotPasswordTimeout(): void {
    const timeout = new Date();
    timeout.setMinutes(timeout.getUTCMinutes() + 2);
    localStorage.setItem(this.forgotPasswordTimeoutCacheKey, timeout.toISOString());
  }

  public static getForgotPasswordTimeout(): Date | null {
    const item = localStorage.getItem(this.forgotPasswordTimeoutCacheKey);
    return item ? new Date(item) : null;
  }

  public static removeForgotPasswordTimeout(): void {
    localStorage.removeItem(this.forgotPasswordTimeoutCacheKey);
  }
}
