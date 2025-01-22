import localforage from 'localforage';
import type { CustomTheme } from '@/types/CustomThemes';
import { removeTheme } from './removeTheme';
import { Mutex } from '@/gmail/utils/mutex';
import { settingsState } from '@/gmail/utils/listeners/SettingsState';

const mutex = new Mutex();
let isDisabling = false;

export const disableTheme = async () => {
  if (isDisabling) return;

  if (!settingsState.selectedTheme || settingsState.selectedTheme === '') {
    console.debug('Theme is already disabled, exit early')
    // Theme is already disabled, exit early
    return;
  }
  isDisabling = true;
  const unlock = await mutex.lock();
  try {
    if (settingsState.selectedTheme) {
      console.debug('Disabling theme:', settingsState.selectedTheme);
      const theme = await localforage.getItem(settingsState.selectedTheme) as CustomTheme;
      if (theme) {
        await removeTheme(theme);
      }
    }

    settingsState.selectedTheme = ''
  } catch (error) {
    console.error('Error disabling theme:', error);
  } finally {
    unlock();
    isDisabling = false;
  }
};