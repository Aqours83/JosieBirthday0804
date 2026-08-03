# Happy Birthday, Josie!

A responsive, static birthday website with a reveal intro and six animated postcard wishes.

## Edit the wishes

Open `script.js` and replace each card's `title`, `text`, and `from` values. The six images live in `assets/`.

## Preview

Run any static file server in this folder, for example:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy

The site has no build step. Push it to a GitHub repository's `main` branch, then choose **GitHub Actions** under **Settings → Pages → Build and deployment**. The included workflow will publish the site automatically.
