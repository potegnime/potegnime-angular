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

- Set `production: false` in `src/environment.ts`. This will use development URLs from `src/assets/config.json`
- Run the app:

```
npm install
npm start
```

Browser opens in http://localhost:4200

## Development guidelines

- Use `npm run format` to format project, or `npm run format:check` to check formatting
- Use @ import syntax defined in `tsconfig.json`
- Blank line between Angular and app imports

## Deployment

App is deployed on [Cloudflare Pages](https://pages.cloudflare.com/) via the `npm run build:prod` command.

If you want to try out the production build locally:

```
npm run build:prod
cd dist/potegnime-angular
http-server
```

App will open on http://127.0.0.1:8080/prijava

## Folder structure

App follows Angular v20 folder structure:

```
├── app
│   ├── core
│   │   ├── enums
│   │   ├── guards
│   │   ├── helpers
│   │   ├── interceptor
│   │   │   └── api
│   │   └── services
│   │       ├── base-http
│   │       ├── cache
│   │       ├── config
│   │       ├── http-api
│   │       └── token-service
│   ├── features
│   │   ├── about
│   │   │   └── components
│   │   │       ├── about-page
│   │   │       ├── donate-page
│   │   │       ├── license-page
│   │   │       └── terms-page
│   │   ├── auth
│   │   │   ├── components
│   │   │   │   ├── auth-page
│   │   │   │   ├── forgot-password-form
│   │   │   │   ├── login-form
│   │   │   │   ├── register-form
│   │   │   │   └── reset-password-form
│   │   │   ├── helpers
│   │   │   ├── models
│   │   │   └── services
│   │   │       └── auth
│   │   ├── home
│   │   │   └── components
│   │   │       ├── home-header
│   │   │       ├── home-page
│   │   │       └── home-torrent
│   │   ├── recommend
│   │   │   └── components
│   │   │       └── recommend-page
│   │   ├── search
│   │   │   ├── components
│   │   │   │   ├── about-results
│   │   │   │   ├── search-bar-search
│   │   │   │   └── search-results
│   │   │   ├── models
│   │   │   └── services
│   │   │       ├── search
│   │   │       ├── sort
│   │   │       └── torrent-file-download
│   │   ├── sudo
│   │   │   ├── components
│   │   │   │   ├── administration-page
│   │   │   │   ├── settings-page
│   │   │   │   ├── sudo-nav
│   │   │   │   └── upload-torrent-page
│   │   │   └── services
│   │   │       └── admin
│   │   └── user
│   │       ├── components
│   │       │   └── user-page
│   │       ├── models
│   │       └── services
│   │           └── user
│   ├── layout
│   │   ├── footer
│   │   ├── header
│   │   └── nav
│   ├── models
│   └── shared
│       ├── components
│       │   ├── error
│       │   ├── loading-spinner
│       │   └── search-bar
│       ├── pipes
│       └── services
│           ├── notification
│           └── recommend
└── assets
    └── images
```
