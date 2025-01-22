import browser from 'webextension-polyfill'
import type { SettingsState } from "@/types/storage";

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyDatabase', 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      db.createObjectStore('backgrounds', { keyPath: 'id' });
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event: any) => {
      reject('Error opening database: ' + event.target.errorCode);
    };
  });
};

export const writeData = async (type: any, data: any) => {
  const db: any = await openDB();

  const tx = db.transaction('backgrounds', 'readwrite');
  const store = tx.objectStore('backgrounds');
  const request = await store.put({ id: 'customBackground', type, data });

  return request.result;
};

export const readData = () => {
  return new Promise((resolve, reject) => {
    openDB()
      .then((db: any) => {
        const tx = db.transaction('backgrounds', 'readonly');
        const store = tx.objectStore('backgrounds');

        // Retrieve the custom background
        const getRequest = store.get('customBackground');

        // Attach success and error event handlers
        getRequest.onsuccess = function(event: any) {
          resolve(event.target.result);
        };

        getRequest.onerror = function(event: any) {
          console.error('An error occurred:', event);
          reject(event);
        };
      })
      .catch(error => {
        console.error('An error occurred:', error);
        reject(error);
      });
  });
};

function reloadSeqtaPages() {
  const result = browser.tabs.query({})
    function open (tabs: any) {
    for (let tab of tabs) {
      if (tab.title.includes('SEQTA Learn')) {
        browser.tabs.reload(tab.id);
      }
    }
  }
  result.then(open, console.error)
}

// Main message listener
browser.runtime.onMessage.addListener((request: any, _sender: any, sendResponse: any) => {
  switch (request.type) {
  case 'reloadTabs':
    reloadSeqtaPages();
    break;
  
  case 'extensionPages':
    browser.tabs.query({}).then(function (tabs) {
      for (let tab of tabs) {
        if (tab.url?.includes('chrome-extension://')) {
          browser.tabs.sendMessage(tab.id!, request);
        }
      }
    });
    break;
  
  case 'currentTab':
    browser.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
      browser.tabs.sendMessage(tabs[0].id!, request).then(function (response) {
        sendResponse(response);
      });
    });
    return true;
    
  case 'setDefaultStorage':
    SetStorageValue(DefaultValues);
    break;

  default:
    console.log('Unknown request type');
  }
});

const DefaultValues: SettingsState = {
  onoff: true,
  animatedbk: true,
  bksliderinput: "50",
  transparencyEffects: false,
  selectedTheme: '',
  selectedColor: 'linear-gradient(40deg, rgba(201,61,0,1) 0%, RGBA(170, 5, 58, 1) 100%)',
  originalSelectedColor: '',
  DarkMode: true,
  animations: true,
};

function SetStorageValue(object: any) {
  for (var i in object) {
    browser.storage.local.set({ [i]: object[i] });
  }
}

browser.runtime.onInstalled.addListener(function (event) {
  browser.storage.local.remove(['justupdated']);
  browser.storage.local.remove(['data']);

  if ( event.reason == 'install' || event.reason == 'update' ) {
    browser.storage.local.set({ justupdated: true });
  }
});
