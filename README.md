<div align="center">
  <a href="https://potegni.me/">
    <img src="images/logo.png" alt="Logo" height="80">
  </a>
  <h3 align="center" style="margin-top:0;">potegni.me Angular frontend</h3>
</div>

## About The Project

Torrent search platform build with Angular on the frontend and ASP.NET on the backend. Formly known as nalozi.si.

Features:
-  User registration and login system
    -  Hashing passwords with BCrypt
    - Authentication using JWT
    - System of regular and users and admins
- Torrent search using [torrent-search-api](https://www.npmjs.com/package/torrent-search-api)
    - Search torrents from ThePirateBay, YTS or TorrentProject
- Explore movies and series - data provided by [TMDB API](https://www.themoviedb.org/)
    - I'm feeling lucky functionality
    - Movie/series of the day (set by admins then visible to other users)

Project is 100% free to use and contains no ads. Because of this it runs entirely on free hosting, so things might be a little slow at times:
- Frontend: hosted on [Cloudflare Pages](http://pages.cloudflare.com/)
- APIs: hosted on [Render](https://render.com/)
- Postgres: hosted on [Neon](https://neon.com/)

Backed: [potegnime-api](https://github.com/lebaaar/potegnime-api)


## Frontend

Built with Angular framework using HTML, SCSS and TypeScript. Utilizing [Bootstrap](https://getbootstrap.com/). Designed in Figma.

Project images:

![Login and sign up screen](images/login.png)
![Home page](images/home.png)
![Search torrents](images/search.png)
![Profile page](images/profile.png)
![Edit profile page](images/edit.png)
![Administration page](images/admin.png)

## License

Distributed under the MIT License. See [`LICENSE.txt`](LICENSE.txt) for more information.

## Contact

Lan Lebar - [LinkedIn](https://www.linkedin.com/in/lan-lebar) - lanlebar6@gmail.com

Project Link: [https://github.com/lebaaar/potegnime-angular](https://github.com/lebaaar/potegnime-angular)