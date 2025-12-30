const environment = {
  /**
   * Production mode flag - used for switching between dev and prod config.json settings
   */
  production: false,

  /**
   * Danger!! When true, the site is in maintenance mode and becomes unavailable,
   * Frontend will only allow /maintenance page to be displayed, APIs will continue to work normally.
   * Any users that visit site while in maintenance mode will be logged out.
   */
  underMaintenance: false
};



export const production = environment.production;
export const underMaintenance = environment.underMaintenance && localStorage.getItem('bypass') !== 'true';