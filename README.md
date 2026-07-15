<div align="center">

<img src="assets/favicon.svg" width="72" alt="Riceprint logo" />

# RICEPRINT

**A browser-based generator for shareable setup cards.**

[![Open Generator](https://img.shields.io/badge/OPEN_GENERATOR-8BA5FF?style=for-the-badge&logo=githubpages&logoColor=white)](https://aetherelic.github.io/riceprint/)
[![Vanilla JavaScript](https://img.shields.io/badge/VANILLA_JS-11131E?style=for-the-badge&logo=javascript)](app.js)
[![MIT License](https://img.shields.io/badge/LICENSE-MIT-7CF6D5?style=for-the-badge)](LICENSE)

<img src="assets/preview.png" alt="Riceprint card style previews" />

</div>

## What is Riceprint?

Riceprint is a **static web app**, It lets you manually enter your setup details, customise the design and export the result as a **1200 × 675 PNG** for READMEs, dotfiles, portfolios and rice posts.

It does not install anything, read your system automatically or run in the background.

<div align="center">

### [Create a card in your browser →](https://aetherelic.github.io/riceprint/)

</div>

## Included

- 3 Different styles (I am in the process of making more)
- Live text, colour and layout editing
- Palette presets and random colour generation
- Local autosave and shareable configuration links
- Dependency-free PNG export

## Styles

<table>
  <tr>
    <td align="center"><strong>Spatial Glass</strong></td>
    <td align="center"><strong>Terminal</strong></td>
    <td align="center"><strong>Minimal Mono</strong></td>
  </tr>
  <tr>
    <td><img src="assets/style-glass.png" alt="Spatial Glass" /></td>
    <td><img src="assets/style-terminal.png" alt="Terminal" /></td>
    <td><img src="assets/style-minimal.png" alt="Minimal Mono" /></td>
  </tr>
</table>

## Run locally

```bash
git clone https://github.com/Aetherelic/riceprint.git
cd riceprint
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## License

Released under the [MIT License](LICENSE).
