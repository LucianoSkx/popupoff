# PopUpOFF

[![Greasy Fork](https://img.shields.io/badge/Greasy%20Fork-PopUpOFF-670000)](https://greasyfork.org/pt-BR/scripts/587461-popupoff)

---

## English

Userscript that removes popups, overlays, and fixed elements from websites. Based on the [PopUpOFF browser extension](https://github.com/RomanistHere/PopUpOFF) by RomanistHere.

### Install

1. Install [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/)
2. [Click here to install](https://greasyfork.org/pt-BR/scripts/587461-popupoff) (Greasy Fork)

Or copy `popupoff.user.js` into a new script in your userscript manager.

### Modes

| Mode | Description |
|------|-------------|
| **Aggressive** | Removes all `position: fixed/sticky` elements. Full cleanup. |
| **Moderate** | Smart algorithm: checks position, size, and content to detect bad popups. |
| **Delicate** | Changes `position: fixed` to `position: relative` instead of removing. |
| **Whitelist** | Disables PopUpOFF on the current site. |

### Features

- **Anti-paid content** — Restores hidden content blocked by paywalls (removes cropping classes)
- **Gradient overlay removal** — Removes linear-gradient overlays that block content
- **CSS filter removal** — Removes blur and other filters applied to the page
- **Shadow DOM support** — Checks elements inside shadow roots
- **MutationObserver** — Catches dynamically added popups
- **Overflow fix** — Removes `overflow: hidden` from `<html>` and `<body>`
- **Alt+X shortcut** — Cycle through modes with a notification

### Keyboard Shortcut

- **Alt+X** (Windows/Linux) or **Cmd+Shift+X** (Mac): Cycle through modes

### License

Apache-2.0

---

## Português

Userscript que remove popups, overlays e elementos fixos de sites. Baseado na extensão [PopUpOFF](https://github.com/RomanistHere/PopUpOFF) de RomanistHere.

### Instalação

1. Instale [Violentmonkey](https://violentmonkey.github.io/) ou [Tampermonkey](https://www.tampermonkey.net/)
2. [Clique aqui para instalar](https://greasyfork.org/pt-BR/scripts/587461-popupoff) (Greasy Fork)

Ou copie o conteúdo de `popupoff.user.js` em um novo script no seu gerenciador de usuários.

### Modos

| Modo | Descrição |
|------|-----------|
| **Agressivo** | Remove todos os elementos `position: fixed/sticky`. Limpeza total. |
| **Moderado** | Algoritmo inteligente: verifica posição, tamanho e conteúdo para detectar popups nocivos. |
| **Delicado** | Muda `position: fixed` para `position: relative` em vez de remover. |
| **OFF** | Desativa o PopUpOFF no site atual. |

### Funcionalidades

- **Anti-conteúdo pago** — Restaura conteúdo oculto bloqueado por paywalls (remove classes de corte)
- **Remoção de overlay gradiente** — Remove overlays com gradiente linear que bloqueiam conteúdo
- **Remoção de filtro CSS** — Remove desfoque e outros filtros aplicados à página
- **Suporte a Shadow DOM** — Verifica elementos dentro de shadow roots
- **MutationObserver** — Captura popups adicionados dinamicamente
- **Correção de overflow** — Remove `overflow: hidden` do `<html>` e `<body>`
- **Atalho Alt+X** — Alterna entre modos com notificação

### Atalho

- **Alt+X** (Windows/Linux) ou **Cmd+Shift+X** (Mac): Alterna entre modos

### Licença

Apache-2.0
