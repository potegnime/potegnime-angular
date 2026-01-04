export class AuthResetHelper {
  private static forgotPasswordTimeoutCacheKey = 'potegnime-forgot-password-timeout';
  private static registerFormCacheKey = 'potegnime-register-form';

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

  public static setRegisterForm(value: any): void {
    const expires = new Date();
    expires.setMinutes(expires.getUTCMinutes() + 30);
    value.timestamp = expires.toISOString();
    localStorage.setItem(this.registerFormCacheKey, JSON.stringify(value));
  }

  public static getRegisterForm(): any {
    const item = localStorage.getItem(this.registerFormCacheKey);
    // Check if the cache has expired
    if (item) {
      const parsedItem = JSON.parse(item);
      const timestamp = new Date(parsedItem.timestamp);
      if (timestamp < new Date()) {
        localStorage.removeItem(this.registerFormCacheKey);
        return null;
      }
    }
    return item ? JSON.parse(item) : null;
  }

  public static removeRegisterForm(): void {
    localStorage.removeItem(this.registerFormCacheKey);
  }
}
