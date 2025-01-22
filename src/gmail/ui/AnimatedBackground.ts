import { settingsState } from "@/gmail/utils/listeners/SettingsState";

/**
 * Update the background animation durations based on the slider input.
 * @param {Object} item - The object containing the bksliderinput property.
 * @param {number} [minDuration=1] - The minimum animation duration in seconds.
 * @param {number} [maxDuration=10] - The maximum animation duration in seconds.
 */
export function updateBgDurations() {
  // Class names to look for
  const bgClasses = ['bg', 'bg2', 'bg3'];
    
  // Function to calculate animation duration
  const calcDuration = (
    baseValue: number, 
    offset = 0, 
    minBase = 50, 
    maxBase = 150, 
  ) => {
    const scaledValue = 2 + ((maxBase - baseValue) / (maxBase - minBase)) ** 4;
    return scaledValue + offset;
  };
    
  // Iterate through each class name to update its animation duration
  bgClasses.forEach((className, index) => {
    const elements = document.getElementsByClassName(className);

    if (elements.length === 0) {
      return;
    }
    
    const offset = index * 0.05;
    const duration = calcDuration(parseInt(settingsState.bksliderinput), offset);
    (elements[0] as HTMLElement).style.animationDuration = `${duration}s`;
    (elements[0] as HTMLElement).style.animationDelay = `${offset * 5}s`;
  });
}

export function CreateBackground() {
  var bkCheck = document.getElementsByClassName('bg')
  if (bkCheck.length !== 0) {
    return
  }
  // Creating and inserting 3 divs containing the background applied to the pages
  var bklocation = document.querySelector('body > div:has([role="button"])')
  var bk = document.createElement('div')
  bk.classList.add('bg')

  bklocation!.appendChild(bk)

  var bk2 = document.createElement('div')
  bk2.classList.add('bg')
  bk2.classList.add('bg2')
  bklocation!.appendChild(bk2)

  var bk3 = document.createElement('div')
  bk3.classList.add('bg')
  bk3.classList.add('bg3')
  bklocation!.appendChild(bk3)
}

export function RemoveBackground() {
  var bk = document.getElementsByClassName('bg')
  var bk2 = document.getElementsByClassName('bg2')
  var bk3 = document.getElementsByClassName('bg3')

  if (bk.length == 0 || bk2.length == 0 || bk3.length == 0) return
  bk[0].remove()
  bk2[0].remove()
  bk3[0].remove()
}
