<div align="center">

<img src="assets/favicon.svg" width="72" alt="Riceprint logo" />

# RICEPRINT

**Create exportable identity cards for Linux setups, dotfiles and desktop rice projects.**

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-8BA5FF?style=for-the-badge&logo=github)](https://aetherelic.github.io/riceprint/)
[![Vanilla JavaScript](https://img.shields.io/badge/VANILLA_JS-11131E?style=for-the-badge&logo=javascript)](app.js)
[![MIT License](https://img.shields.io/badge/LICENSE-MIT-7CF6D5?style=for-the-badge)](LICENSE)

<img src="assets/preview.png" alt="Riceprint Spatial Glass, Terminal Block and Minimal Mono previews" />

</div>

## Overview

Riceprint turns your Linux setup into a polished, shareable system card. Customise your identity, system details, colours and layout, then export the result as a **1200 × 675 PNG**.

- **Three styles:** Spatial Glass, Terminal Block and Minimal Mono
- Live editing, palette presets and random colour generation
- Local autosave and shareable configuration links
- Dependency-free, responsive and entirely browser-based

## Styles

<table>
  <tr>
    <td align="center"><strong>Spatial Glass</strong></td>
    <td align="center"><strong>Terminal Block</strong></td>
    <td align="center"><strong>Minimal Mono</strong></td>
  </tr>
  <tr>
    <td><img src="assets/style-glass.png" alt="Spatial Glass preview" /></td>
    <td><img src="assets/style-terminal.png" alt="Terminal Block preview" /></td>
    <td><img src="assets/style-minimal.png" alt="Minimal Mono preview" /></td>
  </tr>
</table>

## Run locally

```bash
git clone https://github.com/Aetherelic/riceprint.git
cd riceprint
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Use your card

Export the PNG, add it to your repository, then embed it in Markdown:

```md
![My Linux setup](./assets/riceprint-card.png)
```

## License

Released under the [MIT License](LICENSE).
