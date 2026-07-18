# PopUpOFF

[![Greasy Fork](https://img.shields.io/badge/Greasy%20Fork-PopUpOFF-670000)](https://greasyfork.org/pt-BR/scripts/587461-popupoff)

Userscript that removes popups, overlays, and fixed elements from websites. Based on the [PopUpOFF browser extension](https://github.com/RomanistHere/PopUpOFF) by RomanistHere.

Remove popups, overlays e elementos fixos de sites. Baseado na extensão PopUpOFF de RomanistHere.

## Install / Instalação

1. Install [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/)
2. [Click here to install](https://greasyfork.org/pt-BR/scripts/587461-popupoff) (Greasy Fork)

Or copy `popupoff.user.js` into a new script in your userscript manager.

## Modes / Modos

| Mode / Modo | Description / Descrição |
|-------------|------------------------|
| **Aggressive / Agressivo** | Removes all `position: fixed/sticky` elements. Full cleanup. / Remove todos os elementos `position: fixed/sticky`. Limpeza total. |
| **Moderate / Moderado** | Smart algorithm: checks position, size, and content to detect bad popups. / Algoritmo inteligente: verifica posição, tamanho e conteúdo para detectar popups nocivos. |
| **Delicate / Delicado** | Changes `position: fixed` to `position: relative` instead of removing. / Muda `position: fixed` para `position: relative` em vez de remover. |
| **Whitelist / OFF** | Disables PopUpOFF on the current site. / Desativa o PopUpOFF no site atual. |

## Features / Funcionalidades

- **Anti-paid content / Anti-conteúdo pago** — Restores hidden content blocked by paywalls (removes cropping classes) / Restaura conteúdo oculto bloqueado por paywalls (remove classes de corte)
- **Gradient overlay removal / Remoção de overlay gradiente** — Removes linear-gradient overlays that block content / Remove overlays com gradiente linear que bloqueiam conteúdo
- **CSS filter removal / Remoção de filtro CSS** — Removes blur and other filters applied to the page / Remove desfoque e outros filtros aplicados à página
- **Shadow DOM support / Suporte a Shadow DOM** — Checks elements inside shadow roots / Verifica elementos dentro de shadow roots
- **MutationObserver** — Catches dynamically added popups / Captura popups adicionados dinamicamente
- **Overflow fix / Correção de overflow** — Removes `overflow: hidden` from `<html>` and `<body>` / Remove `overflow: hidden` do `<html>` e `<body>`
- **Alt+X shortcut / Atalho Alt+X** — Cycle through modes with a notification / Alterna entre modos com notificação

## Keyboard Shortcut / Atalho

- **Alt+X** (Windows/Linux) or **Cmd+Shift+X** (Mac): Cycle through modes / Alterna entre modos

## License / Licença

Apache-2.0
