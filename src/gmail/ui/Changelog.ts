import { settingsState } from "../utils/listeners/SettingsState";
import browser from "webextension-polyfill";
import { Popup } from "./Popup";

export function OpenWhatsNewPopup() {
  // Create video element
  const video = document.createElement('video');
  const source = document.createElement('source');
  
  source.setAttribute('src', 'https://raw.githubusercontent.com/BetterSEQTA/BetterSEQTA-Plus/main/src/resources/update-video.mp4');
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.classList.add('whatsnewImg');
  video.appendChild(source);

  // Create image container
  const imagecont = document.createElement('div');
  imagecont.classList.add('whatsnewImgContainer');
  imagecont.appendChild(video);

  new Popup({
    title: "What's New",
    subtitle: `BetterGmail V${browser.runtime.getManifest().version}`,
    imageContent: imagecont,
    content: /* html */ `
      <div class="whatsnewTextContainer" style="overflow-y: scroll;">  
        <h1>1.0.0 - Introducing BetterGmail</h1>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <h1>1.0.0 - Introducing BetterGmail</h1>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <h1>1.0.0 - Introducing BetterGmail</h1>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <h1>1.0.0 - Introducing BetterGmail</h1>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <h1>1.0.0 - Introducing BetterGmail</h1>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
        <li>Added a new feature to the extension</li>
      </div>
    `,
    onClose: () => {
      delete settingsState.justupdated;
    }
  });
}