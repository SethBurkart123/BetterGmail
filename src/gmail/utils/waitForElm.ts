import { eventManager } from "./listeners/EventManager";

export async function waitForElm(selector: string, usePolling: boolean = false, interval: number = 100): Promise<Element> {
  if (usePolling) {
    return new Promise((resolve) => {
      const checkForElement = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else {
          setTimeout(checkForElement, interval);
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkForElement);
      } else {
        checkForElement();
      }
    });
  } else {
    return new Promise((resolve) => {
      const registerObserver = () => {
        const { unregister } = eventManager.register(`${selector}`, {
          customCheck: (element) => element.matches(selector)
        }, (element) => {
          resolve(element);
          unregister(); // Remove the listener once the element is found
        });
        return unregister;
      };

      let unregister = null;

      if (document.readyState === 'loading') {
        // DOM is still loading, wait for it to be ready
        document.addEventListener('DOMContentLoaded', () => {
          unregister = registerObserver();
        });
      } else {
        unregister = registerObserver();
      }

      const querySelector = () => document.querySelector(selector);
      const element = querySelector();

      if (element) {
        if (unregister) unregister();
        resolve(element);
        return;
      }

    });
  }
}
  