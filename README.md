# [potegni.me](https://potegni.me) frontend

To learn more about the project, visit [GitHub organization](https://github.com/potegnime)

## Overview

- **Framework:** Angular v20
- **UI Library:** Bootstrap 5
- **CSS Preprocessor:** SCSS
- **Icons:** Font Awesome
- **Notifications**: Toastr

## Development

Prerequisites:

- Node.js and npm
- Angular CLI

Running the app:

```
npm install

# development
npm run dev

# production
npm start
```

Browser opens in http://localhost:4200

Note: environment is set in `src/environment.ts` with the `production` boolean, which uses the correct backend endpoints from `src/assets/config.json`.

## Development guidelines

- Use `npm run format` to format project, or `npm run format:check` to check formatting
- Use @ import syntax defined in `tsconfig.json`
- Blank line between Angular and app imports

## Deployment

App is deployed on [Cloudflare Pages](https://pages.cloudflare.com/) via the `npm run build:prod` command.<br>
If you want to try out the production build locally:

```
npm run build:prod
cd dist/potegnime-angular
http-server
```

App will open on http://127.0.0.1:8080/
