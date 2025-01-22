// Third-party libraries
import browser from 'webextension-polyfill'
import { animate } from 'motion'

// Internal utilities and functions
import { MessageHandler } from '@/gmail/utils/listeners/MessageListener'
import { initializeSettingsState, settingsState } from '@/gmail/utils/listeners/SettingsState'
import { StorageChangeHandler } from '@/gmail/utils/listeners/StorageChanges'
import { eventManager } from '@/gmail/utils/listeners/EventManager'

// UI and theme management
import { enableCurrentTheme } from '@/gmail/ui/themes/enableCurrent'
import { updateAllColors } from '@/gmail/ui/colors/Manager'
import { SettingsResizer } from '@/gmail/ui/SettingsResizer'
import { AddBetterGmailElements } from '@/gmail/ui/AddBetterGmailElements'

// Icons and fonts
import IconFamily from '@/resources/fonts/IconFamily.woff'

// Stylesheets
import iframeCSS from '@/css/iframe.scss?raw'
import injectedCSS from '@/css/injected.scss?inline'
import documentLoadCSS from '@/css/documentload.scss?inline'

// Interface
import renderSvelte from '@/interface/main'
import Settings from '@/interface/pages/settings.svelte'
import { settingsPopup } from './interface/hooks/SettingsPopup'
import { OpenWhatsNewPopup } from './gmail/ui/Changelog'
import { waitForElm } from './gmail/utils/waitForElm'

let SettingsClicked = false
export let MenuOptionsOpen = false

const documentLoadStyle = document.createElement('style')
documentLoadStyle.textContent = documentLoadCSS
document.head.appendChild(documentLoadStyle)

init()

async function init() {
  // wait until settingsState has been loaded from storage
  await initializeSettingsState();
  
  if (settingsState.onoff) {
    enableCurrentTheme()
  
    // TEMP FIX for bug! -> this is a hack to get the injected.css file to have HMR in development mode as this import system is currently broken with crxjs
    if (import.meta.env.MODE === 'development') {
      import('./css/injected.scss')
    } else {
      const injectedStyle = document.createElement('style')
      injectedStyle.textContent = injectedCSS
      document.head.appendChild(injectedStyle)
    }
  }
  
  console.info('[BetterGmail] Successfully initalised BetterGmail, starting to load assets.')

  if (typeof settingsState.onoff === 'undefined') {
    browser.runtime.sendMessage({ type: 'setDefaultStorage' })
  }

  if (settingsState.onoff) {
    console.info('[BetterGmail] Enabled')
    if (settingsState.DarkMode) document.documentElement.classList.add('dark')

    new StorageChangeHandler();
    new MessageHandler()
    
    updateAllColors()
    InjectCustomIcons()
    tryLoad()
  } else {
    handleDisabled()
    window.addEventListener('load', handleDisabled)
  }
}

const handleDisabled = () => {
  waitForElm('[role="tablist"]', true, 50).then((_) => {
    AppendElementsToDisabledPage()
  })
}

export async function finishLoad() {
  if (settingsState.justupdated && !document.getElementById('whatsnewbk')) {
    OpenWhatsNewPopup();
  }
}

async function updateIframesWithDarkMode(): Promise<void> {
  const cssLink = document.createElement('style');
  cssLink.classList.add('iframecss');
  const cssContent = document.createTextNode(iframeCSS);
  cssLink.appendChild(cssContent);

  eventManager.register('iframeAdded', {
    elementType: 'iframe',
    customCheck: (element: Element) => !element.classList.contains('iframecss'),
  }, (element) => {
    const iframe = element as HTMLIFrameElement;
    try {
      applyDarkModeToIframe(iframe, cssLink);
    } catch (error) {
      console.error('Error applying dark mode:', error);
    }
  });
}

function applyDarkModeToIframe(iframe: HTMLIFrameElement, cssLink: HTMLStyleElement): void {
  const iframeDocument = iframe.contentDocument;
  if (!iframeDocument) return;

  iframe.onload = () => {
    applyDarkModeToIframe(iframe, cssLink);
  };

  if (settingsState.DarkMode) {
    iframeDocument.documentElement.classList.add('dark')
  }

  const head = iframeDocument.head;
  if (head && !head.innerHTML.includes('iframecss')) {
    head.innerHTML += cssLink.outerHTML;
  }
}

async function LoadPageElements(): Promise<void> {
  await AddBetterGmailElements();
  
  // runs function when certain elements are added to the page
  /* eventManager.register('messagesAdded', {
    elementType: 'div',
    className: 'messages',
  }, handleMessages); */

  finishLoad();
}

export function tryLoad() {
  // wait for the main page to be mounted
  waitForElm('[role="tablist"]', true, 50).then((_) => {
    LoadPageElements()
  })

  updateIframesWithDarkMode()
}

function InjectCustomIcons() {
  console.info('[BetterGmail] Injecting Icons')

  const style = document.createElement('style')
  style.setAttribute('type', 'text/css')
  style.innerHTML = `
    @font-face {
      font-family: 'IconFamily';
      src: url('${browser.runtime.getURL(IconFamily)}') format('woff');
      font-weight: normal;
      font-style: normal;
    }`
  document.head.appendChild(style)
}

export function AppendElementsToDisabledPage() {
  console.info("[BetterGmail] Appending elements to disabled page")
  AddBetterGmailElements()

  let settingsStyle = document.createElement('style')
  settingsStyle.innerHTML = /* css */`
  .addedButton {
    position: absolute !important;
    right: 50px;
    width: 35px;
    height: 35px;
    padding: 6px !important;
    overflow: unset !important;
    border-radius: 50%;
    margin: 7px !important;
    cursor: pointer;
    color: white !important;
  }
  .addedButton svg {
    margin: 6px;
  }
  .outside-container {
    top: 48px !important;
  }
  #ExtensionPopup {
    border-radius: 1rem;
    box-shadow: 0px 0px 20px -2px rgba(0, 0, 0, 0.6);
    transform-origin: 70% 0;
  }
  `
  document.head.append(settingsStyle)
}

export const closeExtensionPopup = (extensionPopup?: HTMLElement) => {
  if (!extensionPopup) extensionPopup = document.getElementById('ExtensionPopup')!

  extensionPopup.classList.add('hide')
  if (settingsState.animations) {
    animate(1, 0, {
      onUpdate: (progress) => {
        extensionPopup.style.opacity = Math.max(0, progress).toString()
        extensionPopup.style.transform = `scale(${Math.max(0, progress)})`
      },
      type: 'spring',
      stiffness: 520,
      damping: 20
    });
  } else {
    extensionPopup.style.opacity = '0'
    extensionPopup.style.transform = 'scale(0)'
  }
  
  settingsPopup.triggerClose()
  SettingsClicked = false
}

export function addExtensionSettings() {
  const extensionPopup = document.createElement('div')
  extensionPopup.classList.add('outside-container', 'hide')
  extensionPopup.id = 'ExtensionPopup'
  
  const extensionContainer = document.querySelector('[aria-label="Side panel"] > div > [role="tablist"]') as HTMLElement;
  if (extensionContainer) extensionContainer.appendChild(extensionPopup)

  // create shadow dom and render svelte app
  try {
    const shadow = extensionPopup.attachShadow({ mode: 'open' });
    requestIdleCallback(() => renderSvelte(Settings, shadow));
  } catch (err) {
    console.error(err)
  }

  new SettingsResizer();

  document.body.onclick = (event: MouseEvent) => {
    if (!SettingsClicked) return;

    if (!(event.target as HTMLElement).closest('#AddedSettings')) {
      if (event.target == extensionPopup) return;
      closeExtensionPopup()
    }
  }
}

export function setupSettingsButton() {
  var AddedSettings = document.getElementById('AddedSettings');
  var extensionPopup = document.getElementById('ExtensionPopup');

  AddedSettings!.addEventListener('click', async () => {
    if (SettingsClicked) {
      closeExtensionPopup(extensionPopup as HTMLElement);
    } else {
      if (settingsState.animations) {
        animate(0, 1, {
          onUpdate: (progress) => {
            extensionPopup!.style.opacity = progress.toString()
            extensionPopup!.style.transform = `scale(${progress})`
          },
          type: 'spring',
          stiffness: 280,
          damping: 20
        });

      } else {
        extensionPopup!.style.opacity = '1'
        extensionPopup!.style.transform = 'scale(1)'
        extensionPopup!.style.transition = 'opacity 0s linear, transform 0s linear'
      }
      extensionPopup!.classList.remove('hide');
      SettingsClicked = true;
    }
  });
}