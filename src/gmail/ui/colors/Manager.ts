import browser from 'webextension-polyfill'
import Color from 'color';

import { settingsState } from '@/gmail/utils/listeners/SettingsState';
import { lightenAndPaleColor } from './lightenAndPaleColor';
import ColorLuminance from './ColorLuminance';

import darkLogo from '@/resources/icons/betterseqta-light-full.png';
import lightLogo from '@/resources/icons/betterseqta-dark-full.png';

// Helper functions
const setCSSVar = (varName: any, value: any) => document.documentElement.style.setProperty(varName, value);
const applyProperties = (props: any) => Object.entries(props).forEach(([key, value]) => setCSSVar(key, value));

export function updateAllColors() {
  // Determine the color to use
  const selectedColor = settingsState.selectedColor !== '' ? settingsState.selectedColor : '#007bff';

  if (settingsState.transparencyEffects) {
    document.documentElement.classList.add('transparencyEffects');
  }

  // Common properties, always applied
  const commonProps = {
    '--better-sub': '#161616',
    '--better-alert-highlight': '#c61851',
    '--better-main': settingsState.selectedColor
  };

  // Mode-based properties, applied if storedSetting is provided
  let modeProps = {};
  modeProps = settingsState.DarkMode ? {
    '--betterseqta-logo': `url(${browser.runtime.getURL(darkLogo)})`
  } : {
    '--better-pale': lightenAndPaleColor(selectedColor),
    '--betterseqta-logo': `url(${browser.runtime.getURL(lightLogo)})`
  };

  if (settingsState.DarkMode) {
    document.documentElement.style.removeProperty('--better-pale');
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Dynamic properties, always applied
  const rgbThreshold = GetThresholdOfColor(selectedColor);
  const isBright = rgbThreshold > 210;
  const dynamicProps = {
    '--text-color': isBright ? 'black' : 'white',
    '--better-light': selectedColor === '#ffffff' ? '#b7b7b7' : ColorLuminance(selectedColor, 0.95)
  };

  // Apply all the properties
  applyProperties({ ...commonProps, ...modeProps, ...dynamicProps });

  let alliframes = document.getElementsByTagName('iframe');

  for (let i = 0; i < alliframes.length; i++) {
    const element = alliframes[i];
    
    if (element.getAttribute('excludeDarkCheck') == 'true') {
      continue;
    }
    
    if (settingsState.DarkMode) {
      element.contentDocument?.documentElement.classList.add('dark');
    } else {
      element.contentDocument?.documentElement.classList.remove('dark');
    }
  }
}

// utils
function GetThresholdOfColor(color: any) {
  if (!color) return 0
  // Case-insensitive regular expression for matching RGBA colors
  const rgbaRegex = /rgba?\(([^)]+)\)/gi

  // Check if the color string is a gradient (linear or radial)
  if (color.includes('gradient')) {
    let gradientThresholds = []

    // Find and replace all instances of RGBA in the gradient
    let match
    while ((match = rgbaRegex.exec(color)) !== null) {
      // Extract the individual components (r, g, b, a)
      const rgbaString = match[1]
      const [r, g, b] = rgbaString.split(',').map(str => str.trim())

      // Compute the threshold using your existing algorithm
      const threshold = Math.sqrt(parseInt(r) ** 2 + parseInt(g) ** 2 + parseInt(b) ** 2)

      // Store the computed threshold
      gradientThresholds.push(threshold)
    }

    // Calculate the average threshold
    const averageThreshold = gradientThresholds.reduce((acc, val) => acc + val, 0) / gradientThresholds.length
    
    return averageThreshold

  } else {
    // Handle the color as a simple RGBA (or hex, or whatever the Color library supports)
    const rgb = Color.rgb(color).object()
    return Math.sqrt(rgb.r ** 2 + rgb.g ** 2 + rgb.b ** 2)
  }
}