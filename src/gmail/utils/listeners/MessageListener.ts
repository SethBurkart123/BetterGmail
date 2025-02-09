import browser from 'webextension-polyfill'

import { closeExtensionPopup } from '@/gmail';
import { deleteTheme } from '@/gmail/ui/themes/deleteTheme';
import { getAvailableThemes } from '@/gmail/ui/themes/getAvailableThemes';
import { saveTheme } from '@/gmail/ui/themes/saveTheme';
import { UpdateThemePreview } from '@/gmail/ui/themes/UpdateThemePreview';
import { getTheme } from '@/gmail/ui/themes/getTheme';
import { setTheme } from '@/gmail/ui/themes/setTheme';
import { disableTheme } from '@/gmail/ui/themes/disableTheme';
import { CloseThemeCreator, OpenThemeCreator } from '@/gmail/ui/ThemeCreator';
import ShareTheme from '@/gmail/ui/themes/shareTheme';
import sendThemeUpdate from '@/gmail/utils/sendThemeUpdate';

export class MessageHandler {
  constructor() {
    browser.runtime.onMessage.addListener(this.routeMessage.bind(this));
  }
  routeMessage(request: any, _sender: any, sendResponse: any) {
    console.debug('Message received:', request)
    
    switch (request.info) {
      case 'UpdateThemePreview':
        if (request?.save == true) {
          const save = async () => {
            await saveTheme(request.body)
            if (request.body.enableTheme) {
              await setTheme(request.body.id)
            }
            sendResponse({ status: 'success' })
            sendThemeUpdate()
          }
          save()
        } else {
          UpdateThemePreview(request.body);
          sendResponse({ status: 'success' });
        }
        return true;
      
      case 'GetTheme':
        getTheme(request.body.themeID).then((theme) => {
          sendResponse(theme);
        });
        return true;
  
      case 'SetTheme':
        setTheme(request.body.themeID).then(() => {
          sendResponse({ status: 'success' });
        });
        break;
  
      case 'DisableTheme':
        disableTheme().then(() => {
          sendResponse({ status: 'success' });
        });
        break;
  
      case 'DeleteTheme':
        deleteTheme(request.body.themeID).then(() => {
          sendResponse({ status: 'success' });
        });
        break;

      case 'ListThemes':
        getAvailableThemes().then((themes) => {
          sendResponse(themes);
        });
        return true;

      case 'OpenThemeCreator':
        const themeID = request?.body?.themeID;
        OpenThemeCreator( themeID ? themeID : '' );
        closeExtensionPopup();
        sendResponse({ status: 'success' });
        break;
      
      case 'ShareTheme':
        ShareTheme(request.body.themeID).then((id) => {
          sendResponse({ status: 'success', id });
        });
        return true;

      case 'CloseThemeCreator':
        try {
          CloseThemeCreator();
        } catch (error) {
          console.error('Error closing theme creator:', error);
          sendResponse({ status: 'error' });
        }
        sendResponse({ status: 'success' });
        break;
  
      default:
        console.debug('Unknown request info:', request.info);      
    }
  }
}