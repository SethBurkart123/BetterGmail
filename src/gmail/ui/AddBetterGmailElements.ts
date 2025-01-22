import { addExtensionSettings, setupSettingsButton } from "@/gmail";
import { CreateBackground, RemoveBackground, updateBgDurations } from "./AnimatedBackground";
import { appendBackgroundToUI } from "./ImageBackgrounds";
import stringToHTML from "@/gmail/utils/stringToHTML";
import { settingsState } from "@/gmail/utils/listeners/SettingsState";
import { updateAllColors } from "./colors/Manager";
import { delay } from "@/gmail/utils/delay";
import { waitForElm } from "../utils/waitForElm";

export async function AddBetterGmailElements() {
  if (settingsState.onoff) {    
    initializeSettings();
    if (settingsState.DarkMode) {
      document.documentElement.classList.add('dark');
    }
    
    try {
      await Promise.all([
        appendBackgroundToUI(),
      ]);
    } catch (error) {
      console.error('Error initializing UI elements:', error);
    }
    
  }
  
  waitForElm('[aria-label="Side panel"] > div > [role="tablist"]', true, 50).then(async (_) => {
    if (settingsState.onoff) addDarkLightToggle();
    addExtensionSettings();
    await createSettingsButton();
    setupSettingsButton();
  })
  
}

function initializeSettings() {
  if (settingsState.animatedbk) {
    CreateBackground()
  } else {
    RemoveBackground()
  }
  
  updateBgDurations();
}

async function createSettingsButton() {
  let SettingsButton = stringToHTML( /* html */`
    <button class="addedButton tooltip" id="AddedSettings">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <g><g><path d="M23.182,6.923c-.29,0-3.662,2.122-4.142,2.4l-2.8-1.555V4.511l4.257-2.456a.518.518,0,0,0,.233-.408.479.479,0,0,0-.233-.407,6.511,6.511,0,1,0-3.327,12.107,6.582,6.582,0,0,0,6.148-4.374,5.228,5.228,0,0,0,.333-1.542A.461.461,0,0,0,23.182,6.923Z"></path><path d="M9.73,10.418,7.376,12.883c-.01.01-.021.016-.03.025L1.158,19.1a2.682,2.682,0,1,0,3.793,3.793l4.583-4.582,0,0,4.1-4.005-.037-.037A9.094,9.094,0,0,1,9.73,10.418ZM3.053,21.888A.894.894,0,1,1,3.946,21,.893.893,0,0,1,3.053,21.888Z"></path></g></g>
      </svg>
      ${settingsState.onoff ? '<div class="tooltiptext topmenutooltip">BetterGmail Settings</div>' : ''}
    </button>
  `);
  const container = document.querySelector('[aria-label="Side panel"] > div > [role="tablist"]') as HTMLElement;
  container!.append(SettingsButton.firstChild!);
}

function GetLightDarkModeString() {  
  if (settingsState.DarkMode) {
    return 'Switch to light theme'
  } else {
    return 'Switch to dark theme'
  }
}

async function addDarkLightToggle() {
  const tooltipString = GetLightDarkModeString();
  const svgContent = settingsState.DarkMode ? 
    /* html */`<defs><clipPath id="__lottie_element_80"><rect width="24" height="24" x="0" y="0"></rect></clipPath></defs><g clip-path="url(#__lottie_element_80)"><g style="display: block;" transform="matrix(1,0,0,1,12,12)" opacity="1"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill-opacity="1" d=" M0,-4 C-2.2100000381469727,-4 -4,-2.2100000381469727 -4,0 C-4,2.2100000381469727 -2.2100000381469727,4 0,4 C2.2100000381469727,4 4,2.2100000381469727 4,0 C4,-2.2100000381469727 2.2100000381469727,-4 0,-4z"></path></g></g><g style="display: block;" transform="matrix(1,0,0,1,12,12)" opacity="1"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill-opacity="1" d=" M0,6 C-3.309999942779541,6 -6,3.309999942779541 -6,0 C-6,-3.309999942779541 -3.309999942779541,-6 0,-6 C3.309999942779541,-6 6,-3.309999942779541 6,0 C6,3.309999942779541 3.309999942779541,6 0,6z M8,-3.309999942779541 C8,-3.309999942779541 8,-8 8,-8 C8,-8 3.309999942779541,-8 3.309999942779541,-8 C3.309999942779541,-8 0,-11.3100004196167 0,-11.3100004196167 C0,-11.3100004196167 -3.309999942779541,-8 -3.309999942779541,-8 C-3.309999942779541,-8 -8,-8 -8,-8 C-8,-8 -8,-3.309999942779541 -8,-3.309999942779541 C-8,-3.309999942779541 -11.3100004196167,0 -11.3100004196167,0 C-11.3100004196167,0 -8,3.309999942779541 -8,3.309999942779541 C-8,3.309999942779541 -8,8 -8,8 C-8,8 -3.309999942779541,8 -3.309999942779541,8 C-3.309999942779541,8 0,11.3100004196167 0,11.3100004196167 C0,11.3100004196167 3.309999942779541,8 3.309999942779541,8 C3.309999942779541,8 8,8 8,8 C8,8 8,3.309999942779541 8,3.309999942779541 C8,3.309999942779541 11.3100004196167,0 11.3100004196167,0 C11.3100004196167,0 8,-3.309999942779541 8,-3.309999942779541z"></path></g></g></g>` : 
    /* html */`<defs><clipPath id="__lottie_element_263"><rect width="24" height="24" x="0" y="0"></rect></clipPath></defs><g clip-path="url(#__lottie_element_263)"><g style="display: block;" transform="matrix(1.5,0,0,1.5,7,12)" opacity="1"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill-opacity="1" d=" M0,-4 C-2.2100000381469727,-4 -1.2920000553131104,-2.2100000381469727 -1.2920000553131104,0 C-1.2920000553131104,2.2100000381469727 -2.2100000381469727,4 0,4 C2.2100000381469727,4 4,2.2100000381469727 4,0 C4,-2.2100000381469727 2.2100000381469727,-4 0,-4z"></path></g></g><g style="display: block;" transform="matrix(-1,0,0,-1,12,12)" opacity="1"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill-opacity="1" d=" M0,6 C-3.309999942779541,6 -6,3.309999942779541 -6,0 C-6,-3.309999942779541 -3.309999942779541,-6 0,-6 C3.309999942779541,-6 6,-3.309999942779541 6,0 C6,3.309999942779541 3.309999942779541,6 0,6z M8,-3.309999942779541 C8,-3.309999942779541 8,-8 8,-8 C8,-8 3.309999942779541,-8 3.309999942779541,-8 C3.309999942779541,-8 0,-11.3100004196167 0,-11.3100004196167 C0,-11.3100004196167 -3.309999942779541,-8 -3.309999942779541,-8 C-3.309999942779541,-8 -8,-8 -8,-8 C-8,-8 -8,-3.309999942779541 -8,-3.309999942779541 C-8,-3.309999942779541 -11.3100004196167,0 -11.3100004196167,0 C-11.3100004196167,0 -8,3.309999942779541 -8,3.309999942779541 C-8,3.309999942779541 -8,8 -8,8 C-8,8 -3.309999942779541,8 -3.309999942779541,8 C-3.309999942779541,8 0,11.3100004196167 0,11.3100004196167 C0,11.3100004196167 3.309999942779541,8 3.309999942779541,8 C3.309999942779541,8 8,8 8,8 C8,8 8,3.309999942779541 8,3.309999942779541 C8,3.309999942779541 11.3100004196167,0 11.3100004196167,0 C11.3100004196167,0 8,-3.309999942779541 8,-3.309999942779541z"></path></g></g></g>`;
  
  const LightDarkModeButton = stringToHTML(/* html */`
    <button class="addedButton DarkLightButton tooltip" id="LightDarkModeButton">
      <svg xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>
      <div class="tooltiptext topmenutooltip" id="darklighttooliptext">${tooltipString}</div>
    </button>
  `);
  
  const container = document.querySelector('[aria-label="Side panel"] > div > [role="tablist"]') as HTMLElement;
  container.append(LightDarkModeButton.firstChild!);
  
  updateAllColors();
  
  document.getElementById('LightDarkModeButton')!.addEventListener('click', async () => {
    const darklightText = document.getElementById('darklighttooliptext');

    if (settingsState.originalDarkMode != undefined && settingsState.selectedTheme) {
      darklightText!.innerText = 'Locked by current theme';

      await delay(1000)

      darklightText!.innerText = GetLightDarkModeString();

      return
    }
    
    settingsState.DarkMode = !settingsState.DarkMode;
    
    updateAllColors();
    
    darklightText!.innerText = GetLightDarkModeString();
  });
}