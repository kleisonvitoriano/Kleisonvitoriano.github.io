import { initSplitText } from './splitText.js';
import { initTextPressure } from './textPressure.js';

// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) {
    window.AOS.init({
      duration: 800, // values from 0 to 3000, with step 50ms
      easing: 'ease-out-cubic', // default easing for AOS animations
      once: true, // whether animation should happen only once - while scrolling down
      offset: 50, // offset (in px) from the original trigger point
    });
  }

  // Initialize SplitText animation on elements with .split-text-anim class
  initSplitText('.split-text-anim', { delay: 40 });
  initTextPressure('.text-pressure-container', { 
    text: 'PORTFOLIO',
    fontFamily: 'Roboto Flex',
    width: true,
    weight: true,
    textColor: '#F2EFE9',
    scale: false
  });
});
