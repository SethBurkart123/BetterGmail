import { settingsState } from "../utils/listeners/SettingsState";
import browser from "webextension-polyfill";
import { Popup } from "./Popup";

export function OpenWhatsNewPopup() {
  new Popup({
    title: "What's New",
    subtitle: `BetterGmail V${browser.runtime.getManifest().version}`,
    content: /* html */ `
      <div class="whatsnewTextContainer" style="height: 50%;overflow-y: scroll;">  
        <h1>1.0.0 - Introducing BetterGmail</h1>
        <li>Added a new feature to the extension</li>
      </div>
    `,
    onClose: () => {
      delete settingsState.justupdated;
    }
  });
}