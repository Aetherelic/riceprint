<div align="center">

<img src="assets/favicon.svg" width="72" alt="Riceprint logo" />

# RICEPRINT

**Create exportable identity cards for Linux setups, dotfiles and desktop rice projects.**

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-8ba5ff?style=for-the-badge&logo=github)](https://aetherelic.github.io/riceprint/)
[![Made with JavaScript](https://img.shields.io/badge/VANILLA_JS-11131e?style=for-the-badge&logo=javascript)](#)
[![MIT License](https://img.shields.io/badge/LICENSE-MIT-7cf6d5?style=for-the-badge)](LICENSE)

<img src="assets/preview.png" alt="Preview of the styles included in Riceprint" />

</div>

## What it does

RICEPRINT turns your Linux setup into a clean visual fingerprint. Enter your distro, window manager, shell, terminal and current project, choose a style, tweak the palette, then export a ready-to-use PNG.

- Live card editor
- Three built-in styles: **Spatial glass**, **Terminal block** and **Minimal mono**
- Four palette presets plus random generation
- Dependency-free **1200 × 675 PNG export**
- Local autosave and shareable configuration links
- Responsive, keyboard-friendly interface
- No accounts, tracking, build tools or backend

## Included styles

All previews below use grounded sample data and the same tagline:

> `Put anything you want here <3`

<table>
  <tr>
    <td align="center"><strong>Spatial glass</strong></td>
    <td align="center"><strong>Terminal block</strong></td>
    <td align="center"><strong>Minimal mono</strong></td>
  </tr>
  <tr>
    <td><img src="assets/style-glass.png" alt="Spatial glass card preview" width="100%" /></td>
    <td><img src="assets/style-terminal.png" alt="Terminal block card preview" width="100%" /></td>
    <td><img src="assets/style-minimal.png" alt="Minimal mono card preview" width="100%" /></td>
  </tr>
</table>

## Grounded README assets

The README now avoids decorative mockups and instead uses preview images based on the actual card layouts included in the project.

## Run locally

```bash
git clone https://github.com/Aetherelic/riceprint.git
cd riceprint
python3 -m http.server 8080
```

Open `http://localhost:8080`.

You can also open `index.html` directly, although a local server gives clipboard features the most reliable browser context.

## Publish with GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**.
4. Choose `main` and `/ (root)`.

The site will be available at `https://YOUR-USERNAME.github.io/riceprint/`.

## Add a generated card to your README

Export your card, save it as `assets/riceprint-card.png`, then add:

```md
![My Linux setup](./assets/riceprint-card.png)
```

## Project structure

```text
riceprint/
├── assets/
│   ├── favicon.svg
│   ├── preview.png
│   ├── style-glass.png
│   ├── style-terminal.png
│   ├── style-minimal.png
│   └── example-card.png
├── app.js
├── index.html
├── style.css
├── LICENSE
└── README.md
```

## Roadmap

- Additional card layouts
- Optional wallpaper-derived palettes
- SVG export
- Community preset gallery

## License

Released under the [MIT License](LICENSE).
