import { settingsState } from './SettingsState';
import { updateAllColors } from '@/gmail/ui/colors/Manager';
import { CreateBackground, RemoveBackground, updateBgDurations } from '@/gmail/ui/AnimatedBackground';
import browser from 'webextension-polyfill';

export class StorageChangeHandler {
  constructor() {
    this.registerHandlers();
  }

  private registerHandlers() {
    settingsState.register('selectedColor', updateAllColors.bind(this));
    settingsState.register('DarkMode', this.handleDarkModeChange.bind(this));
    settingsState.register('onoff', this.handleOnOffChange.bind(this));
    settingsState.register('bksliderinput', updateBgDurations.bind(this));
    settingsState.register('animatedbk', this.handleAnimatedBkChange.bind(this));
    settingsState.register('transparencyEffects', this.handleTransparencyEffectsChange.bind(this));
  }

  private handleDarkModeChange() {
    updateAllColors();
  }

  private handleOnOffChange(newValue: boolean) {
    if (newValue) return;
    browser.runtime.sendMessage({ type: 'reloadTabs' });
  }

  private handleAnimatedBkChange(newValue: boolean) {
    if (newValue) {
      CreateBackground();
    } else {
      RemoveBackground();
    }
  }

  private handleTransparencyEffectsChange(newValue: boolean) {
    if (newValue) {
      document.documentElement.classList.add('transparencyEffects');
    } else {
      document.documentElement.classList.remove('transparencyEffects');
    }
  }
}