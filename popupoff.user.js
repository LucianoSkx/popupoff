// ==UserScript==
// @name         PopUpOFF
// @name:en      PopUpOFF
// @name:pt-BR   PopUpOFF
// @namespace    https://greasyfork.org/users/Luciano.Oliveirals
// @version      1.0.0
// @description  Removes popups, overlays, and fixed elements from websites. Based on PopUpOFF browser extension by RomanistHere. Modes: Aggressive, Moderate, Delicate.
// @description:pt-BR  Remove popups, overlays e elementos fixos de sites. Baseado na extensão PopUpOFF de RomanistHere. Modos: Agressivo, Moderado, Delicado.
// @author       Luciano.Oliveirals
// @license      Apache-2.0
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @match        *://*/*
// @icon         https://icons.iconarchive.com/icons/paomedia/small-n-flat/64/shield-warning-icon.png
// @supportURL   https://greasyfork.org/scripts/587461-popupoff
// @homepageURL  https://github.com/LucianoSkx/popupoff
// ==/UserScript==

;(function () {
    'use strict'

    if (window !== window.parent) return

    const defaultSettings = {
        mode: 'moderate',
        restoreCont: false,
        staticSubMode: 'relative',
    }

    const whitelist = [
        'a.goodtime.io', 'about.google', 'app.hubspot.com', 'calendar.google.com',
        'discord.com', 'docs.google.com', 'drive.google.com', 'mail.google.com',
        'music.youtube.com', 'open.spotify.com', 'trello.com', 'twitter.com',
        'vk.com', 'web.telegram.org', 'www.amazon.com', 'www.facebook.com',
        'www.google.com', 'www.instagram.com', 'www.linkedin.com', 'www.netflix.com',
        'www.reddit.com', 'www.spotify.com', 'www.youtube.com', 'zoom.us',
        'store.steampowered.com', 'www.twitch.tv', 'www.apple.com', 'www.microsoft.com',
    ]

    const forbWordsEasy = [
        'cookie', 'privacy', 'adblock', 'ad block', 'blocker', 'ever miss',
        't miss', 'our privacy', 'theguardian', 'bloqueador de anuncios',
        'to continue us', 'mited acces', 'lusive acces', 'left this mon',
        'be the fir', 'ble notif', 's the time', 'ur newslet', 'gister for fre',
        'nload free', 'nload your free', 'gn to youtube', 'ble deal',
        'started for fre', "it's free", 'free trial', 'tart fre',
        'advertisement', '//consent.', 'ign in to youtub',
    ]

    const forbWords = [...forbWordsEasy, 'policy', 'subscri', 'sale', 'updates',
        'member', 'value', 'advertis', 'install',
    ]

    const allowedWords = [
        'sign in', 'language', 'basket', 'delivery', 'price', 'google meet',
        'resume', 'apply', 'drive',
    ]

    const hiddenClasses = [
        '.hide', '.height_0', '.not_scroll', '.excerpt-cropped',
        '.paragraph--faded', '.paragraph--reduced', '.paragraph--dynamic',
        '.article-teaser-overflow', '.editor-description__wrapper--cropped',
    ]

    let domObserver = null
    let isCSSAppended = false
    let infiniteLoopPreventCounter = 0
    let myTimer = 0
    let wasNotStopped = true

    const getStyle = (elem, prop) => window.getComputedStyle(elem, null).getPropertyValue(prop)
    const setPropImp = (elem, prop, val) => elem.style.setProperty(prop, val, 'important')
    const getPureURL = () => location.hostname + (location.port ? ':' + location.port : '')

    const isDecentElem = e => !['SCRIPT', 'HEAD', 'BODY', 'HTML', 'STYLE'].includes(e.nodeName)

    const contentEasyCheck = el => forbWordsEasy.some(v => el.innerHTML.toLowerCase().includes(v))
    const contentCheck = el => forbWords.some(v => el.innerHTML.toLowerCase().includes(v))
    const contentUnlockCheck = el => !allowedWords.some(v => el.innerHTML.toLowerCase().includes(v))

    const videoCheck = element => {
        const nn = element.nodeName
        if (nn === 'APP-DRAWER') return false
        if (nn === 'VIDEO' || nn === 'IMG' || nn === 'FORM' || nn === 'BUTTON' || nn === 'INPUT' || nn === 'IFRAME') return false
        if (element.shadowRoot) return videoCheck(element.shadowRoot)
        if (element.contentDocument) return videoCheck(element.contentDocument)
        for (let i = 0; i < element.childNodes.length; i++) {
            if (element.childNodes[i].nodeType === 1 && !videoCheck(element.childNodes[i])) return false
        }
        return true
    }

    const positionCheck = (element, windowArea) => {
        if (element.offsetHeight === 0 || element.offsetWidth === 0) {
            return { shouldRemove: true, shouldMemo: !!contentEasyCheck(element) }
        }
        const layoutArea = element.offsetHeight * element.offsetWidth
        const screenValue = Math.round((layoutArea / windowArea) * 100) / 100
        const offsetBot = window.innerHeight - (element.offsetTop + element.offsetHeight)

        if (screenValue >= 0.98) {
            return { shouldRemove: contentEasyCheck(element) || videoCheck(element), shouldMemo: true }
        }
        if (element.offsetTop <= 100 && element.offsetHeight <= 250 && element.offsetWidth > 640) {
            if (element.id === 'onesignal-slidedown-container') return { shouldRemove: true, shouldMemo: true }
            return { shouldRemove: false, shouldMemo: true }
        }
        if (element.offsetLeft <= 0 && element.offsetWidth <= 360 && screenValue >= 0.1) {
            return { shouldRemove: false, shouldMemo: true }
        }
        if (screenValue < 0.98 && screenValue >= 0.1) {
            return { shouldRemove: contentEasyCheck(element), shouldMemo: true }
        }
        if (screenValue <= 0.02 && element.offsetTop > 100) {
            return { shouldRemove: false, shouldMemo: true }
        }
        if (offsetBot <= 212) {
            return { shouldRemove: contentEasyCheck(element), shouldMemo: true }
        }
        if (screenValue <= 0.1 && element.offsetTop > 100) {
            return { shouldRemove: false, shouldMemo: true }
        }
        return { shouldRemove: false, shouldMemo: false }
    }

    const removeOverflow = () => {
        const doc = document.documentElement
        const body = document.body
        const overDoc = getStyle(doc, 'overflow-y')
        const overBody = getStyle(body, 'overflow-y')
        const docPos = getStyle(doc, 'position')
        const bodyPos = getStyle(body, 'position')

        if (overDoc !== 'visible' && overDoc !== 'unset' && overDoc !== 'auto') setPropImp(doc, 'overflow-y', 'unset')
        if (overBody !== 'visible' && overBody !== 'unset' && overBody !== 'auto') setPropImp(body, 'overflow-y', 'unset')
        if (docPos === 'fixed' || docPos === 'absolute') { setPropImp(doc, 'min-height', '100vh'); setPropImp(doc, 'position', 'relative') }
        if (bodyPos === 'fixed' || bodyPos === 'absolute') { setPropImp(body, 'position', 'relative'); setPropImp(body, 'min-height', '100vh') }
    }

    const findHidden = () => {
        hiddenClasses.forEach(cls => {
            document.querySelectorAll(cls).forEach(el => {
                if (el.innerHTML.length > 5) {
                    el.classList.remove(...hiddenClasses.map(c => c.replace('.', '')))
                }
            })
        })
        try { document.querySelector('#sign-in-gate').remove() } catch (e) { }
    }

    const detectGrad = element => {
        const bg = getStyle(element, 'background-image')
        if (bg.includes('linear-gradient')) setPropImp(element, 'background-image', 'unset')

        const before = getComputedStyle(element, '::before').getPropertyValue('background-image')
        const after = getComputedStyle(element, '::after').getPropertyValue('background-image')

        if (before.includes('linear-gradient') || after.includes('linear-gradient')) {
            if (!isCSSAppended) {
                document.head.insertAdjacentHTML('beforeend',
                    '<style>.PopUpOFF-no_grad::after,.PopUpOFF-no_grad::before{background-image:unset!important}</style>')
                isCSSAppended = true
            }
            element.classList.add('PopUpOFF-no_grad')
        }
    }

    const additionalChecks = (element, checkElem) => {
        const f = getStyle(element, 'filter')
        const wf = getStyle(element, '-webkit-filter')
        if (f !== 'none' || wf !== 'none') { setPropImp(element, 'filter', 'none'); setPropImp(element, '-webkit-filter', 'none') }

        const settings = getSettings()
        if (settings.restoreCont) detectGrad(element)
        if (element.shadowRoot) checkElemWithSibl(element.shadowRoot, checkElem)
    }

    const checkToConvertToStatic = elem => {
        if (getStyle(elem, 'overflow') === 'hidden') {
            const { width, height, top, left } = elem.getBoundingClientRect()
            if (width > 0 && height > 0 && top === 0 && left === 0) {
                setPropImp(elem, 'position', 'static')
                elem.setAttribute('data-popupoff', 'st')
                return true
            }
        }
        return false
    }

    const checkElemWithSibl = (element, checkElem) => {
        if (element instanceof HTMLElement) {
            checkElem(element)
            if (wasNotStopped) { const e = element.querySelectorAll('*'); e.forEach(checkElem) }
        } else if (element instanceof ShadowRoot) { element.querySelectorAll('*').forEach(checkElem) }
    }

    const disconnectObserver = () => {
        if (domObserver) { domObserver.disconnect(); domObserver = null }
    }

    const removeDomWatcher = (body, action) => {
        disconnectObserver()
        if (wasNotStopped) { setTimeout(() => { action(body.getElementsByTagName('*')) }, 2000) }
        wasNotStopped = false
    }

    const prevLoop = () => {
        if (infiniteLoopPreventCounter > 1200) return true
        infiniteLoopPreventCounter++
        if (myTimer === 0) { myTimer = setTimeout(() => { infiniteLoopPreventCounter = 0; clearTimeout(myTimer); myTimer = 0 }, 1000) }
        return false
    }

    const watchMutations = (mutations, checkElem, body, action) => {
        for (let i = 0; i < mutations.length; i++) {
            if (prevLoop()) { removeDomWatcher(body, action); break }
            const m = mutations[i]
            if (m.attributeName === 'data-popupoff') continue
            if (['SCRIPT', 'HEAD', 'STYLE'].includes(m.target.nodeName)) continue

            checkElemWithSibl(m.target, checkElem)
            m.addedNodes.forEach(el => {
                if (!['#text', '#comment', 'SCRIPT', 'HEAD', 'STYLE'].includes(el.nodeName))
                    checkElemWithSibl(el, checkElem)
            })
            removeOverflow()
        }
    }

    const aggressiveMode = () => {
        const doc = document.documentElement
        const body = document.body
        const settings = getSettings()
        const checkElem = element => {
            if (!isDecentElem(element)) return
            const pos = getStyle(element, 'position')
            if (pos === 'fixed' || pos === 'sticky') {
                if (checkToConvertToStatic(element)) return
                if (element.getAttribute('data-popupoff') === 'notification') return
                if (getStyle(element, 'display') !== 'none') element.setAttribute('data-popupoff', 'bl')
                setPropImp(element, 'display', 'none')
            }
            additionalChecks(element, checkElem)
        }
        const action = elems => {
            removeOverflow()
            ;[...elems].forEach(checkElem)
            if (settings.restoreCont) findHidden()
            domObserver = new MutationObserver(mutations => watchMutations(mutations, checkElem, body, action))
            domObserver.observe(doc, { childList: true, subtree: true, attributes: true })
        }
        action(body.getElementsByTagName('*'))
    }

    const moderateMode = () => {
        const doc = document.documentElement
        const body = document.body
        const memoize = new WeakMap()
        const settings = getSettings()
        const wArea = parseFloat(window.innerHeight * window.innerWidth)

        const checkElem = element => {
            if (!isDecentElem(element)) return
            const pos = getStyle(element, 'position')
            if (pos === 'fixed' || pos === 'sticky') {
                if (checkToConvertToStatic(element)) return
                if (element.getAttribute('data-popupoff') === 'notification') return

                const memoized = memoize.has(element)
                const { shouldRemove } = memoized
                    ? { shouldRemove: memoize.get(element) }
                    : positionCheck(element, wArea)

                if (shouldRemove) {
                    if (getStyle(element, 'display') !== 'none') element.setAttribute('data-popupoff', 'bl')
                    setPropImp(element, 'display', 'none')
                }
                if (!memoized) memoize.set(element, shouldRemove)
            }
            additionalChecks(element, checkElem)
        }

        const action = elems => {
            removeOverflow()
            ;[...elems].forEach(checkElem)
            if (settings.restoreCont) findHidden()
            domObserver = new MutationObserver(mutations => watchMutations(mutations, checkElem, body, action))
            domObserver.observe(doc, { childList: true, subtree: true, attributes: true })
        }
        action(body.getElementsByTagName('*'))
    }

    const delicateMode = () => {
        const doc = document.documentElement
        const body = document.body
        const settings = getSettings()
        const subMode = settings.staticSubMode || 'relative'

        const checkElem = element => {
            if (!isDecentElem(element)) return
            const pos = getStyle(element, 'position')
            if (pos === 'fixed' || pos === 'sticky') {
                if (element.getAttribute('data-popupoff') === 'notification') return
                if (getStyle(element, 'display') !== 'none') element.setAttribute('data-popupoff', 'st')
                setPropImp(element, 'position', subMode)
            }
        }

        const action = elems => {
            removeOverflow()
            ;[...elems].forEach(checkElem)
            if (settings.restoreCont) findHidden()
            domObserver = new MutationObserver(mutations => watchMutations(mutations, checkElem, body, action))
            domObserver.observe(doc, { childList: true, subtree: true, attributes: true })
        }
        action(body.getElementsByTagName('*'))
    }

    const restoreFixedElems = () => {
        document.querySelectorAll('[data-popupoff]').forEach(el => {
            const attr = el.getAttribute('data-popupoff')
            if (attr === 'notification') return
            if (attr === 'bl') el.style.display = null
            else if (attr === 'st') el.style.setProperty('position', 'absolute')
            el.removeAttribute('data-popupoff')
        })
    }

    const getSettings = () => {
        try { return JSON.parse(GM_getValue('settings', '{}')) || { ...defaultSettings } }
        catch (e) { return { ...defaultSettings } }
    }

    const saveSettings = s => GM_setValue('settings', JSON.stringify(s))

    const modes = {
        aggressive: aggressiveMode,
        moderate: moderateMode,
        delicate: delicateMode,
        whitelist: () => { },
    }

    const startMode = modeName => {
        disconnectObserver()
        restoreFixedElems()
        if (modes[modeName]) modes[modeName]()
    }

    const modeNames = {
        aggressive: { en: 'Aggressive', pt: 'Agressivo' },
        moderate: { en: 'Moderate', pt: 'Moderado' },
        delicate: { en: 'Delicate', pt: 'Delicado' },
        whitelist: { en: 'OFF', pt: 'OFF' },
    }

    const modesList = ['moderate', 'aggressive', 'delicate', 'whitelist']

    const cycleMode = () => {
        const settings = getSettings()
        const idx = modesList.indexOf(settings.mode)
        const nextMode = modesList[(idx + 1) % modesList.length]
        settings.mode = nextMode
        saveSettings(settings)
        startMode(nextMode)

        const n = document.createElement('div')
        n.textContent = 'PopUpOFF: ' + (modeNames[nextMode]?.pt || nextMode)
        n.style.cssText =
            'position:fixed;top:20px;left:50%;transform:translateX(-50%);' +
            'background:#1a1a2e;color:#fff;padding:10px 24px;border-radius:20px;' +
            'z-index:999999;font:14px sans-serif;box-shadow:0 2px 12px rgba(0,0,0,.3);' +
            'animation:popupoff-fade 2.5s forwards'
        document.body.appendChild(n)
        setTimeout(() => n.remove(), 2500)
    }

    const styleSheet = document.createElement('style')
    styleSheet.textContent =
        '@keyframes popupoff-fade{0%{opacity:1;transform:translateX(-50%) translateY(0)}' +
        '70%{opacity:1}100%{opacity:0;transform:translateX(-50%) translateY(-20px)}}'
    document.head.appendChild(styleSheet)

    const init = () => {
        const url = getPureURL()
        if (whitelist.includes(url)) return

        const settings = getSettings()
        startMode(settings.mode)
    }

    document.addEventListener('keydown', e => {
        if ((e.altKey && e.key === 'x') || (e.metaKey && e.shiftKey && e.key === 'X')) {
            e.preventDefault()
            cycleMode()
        }
    })

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
    else init()

    GM_registerMenuCommand('Modo: Moderado', () => {
        const s = getSettings(); s.mode = 'moderate'; saveSettings(s); startMode('moderate')
    })
    GM_registerMenuCommand('Modo: Agressivo', () => {
        const s = getSettings(); s.mode = 'aggressive'; saveSettings(s); startMode('aggressive')
    })
    GM_registerMenuCommand('Modo: Delicado', () => {
        const s = getSettings(); s.mode = 'delicate'; saveSettings(s); startMode('delicate')
    })
    GM_registerMenuCommand('Modo: OFF', () => {
        const s = getSettings(); s.mode = 'whitelist'; saveSettings(s); startMode('whitelist')
    })
})()
