# PopUpOFF

[![Greasy Fork](https://img.shields.io/badge/Greasy%20Fork-PopUpOFF-670000)](https://greasyfork.org/users/Luciano.Oliveirals)

Userscript that removes popups, overlays, and fixed elements from websites. Based on the [PopUpOFF browser extension](https://github.com/RomanistHere/PopUpOFF) by RomanistHere.

Remove popups, overlays e elementos fixos de sites. Baseado na extensão PopUpOFF de RomanistHere.

## Install / Instalação

1. Install [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/)
2. [Click here to install](https://greasyfork.org/users/Luciano.Oliveirals) (Greasy Fork)

Or copy `popupoff.user.js` into a new script in your userscript manager.

## Modes / Modos

| Mode | Description |
|------|-------------|
| **Aggressive** | Removes all `position: fixed/sticky` elements. Full cleanup. |
| **Moderate** | Smart algorithm: checks position, size, and content to detect bad popups. |
| **Delicate** | Changes `position: fixed` to `position: relative` instead of removing. |
| **Whitelist** | Disables PopUpOFF on the current site. |

## Features / Funcionalidades

- **Anti-paid content** — Restores hidden content blocked by paywalls (removes cropping classes)
- **Gradient overlay removal** — Removes linear-gradient overlays that block content
- **CSS filter removal** — Removes blur and other filters applied to the page
- **Shadow DOM support** — Checks elements inside shadow roots
- **MutationObserver** — Catches dynamically added popups
- **Overflow fix** — Removes `overflow: hidden` from `<html>` and `<body>`
- **Alt+X shortcut** — Cycle through modes with a notification

## Keyboard Shortcut / Atalho

- **Alt+X** (Windows/Linux) or **Cmd+Shift+X** (Mac): Cycle through modes

## License / Licença

Apache-2.0
