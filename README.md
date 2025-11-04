# [potegni.me](https://potegni.me) Frontend

## Technologies used

- **Framework:** Angular v20
- **UI Library:** Bootstrap 5
- **CSS Preprocessor:** SCSS
- **Icons:** Font Awesome
- **Notifications**: Toastr

## Development
Prerequisites:
- Node.js and npm
- Angular CLI

Getting started:
- Set `production: false` in `src/environment.ts`. This will use development URLs from `src//assets/config.json`
- Run the app:
```
npm install
npm start
```
Browser opens in http://localhost:4200

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

## Deployment
Deployed on [Cloudflare Pages](https://pages.cloudflare.com/)