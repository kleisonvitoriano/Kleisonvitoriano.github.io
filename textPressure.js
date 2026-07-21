const dist = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

export function initTextPressure(selector, options = {}) {
  const {
    fontFamily = 'Roboto Flex',
    fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap',
    width = true,
    weight = true,
    italic = false,
    alpha = false,
    textColor = '#F2EFE9',
    stroke = false,
    strokeColor = '#FF0000',
    strokeWidth = 2,
    minFontSize = 24,
    scale = false,
    text = '' // If provided, overrides existing text
  } = options;

  // Add the font style
  if (!document.querySelector(`link[href="${fontUrl}"]`) && !document.querySelector(`style[data-font="${fontFamily}"]`)) {
    const style = document.createElement('style');
    style.setAttribute('data-font', fontFamily);
    style.innerHTML = `
      @import url('${fontUrl}');
      .stroke span { position: relative; color: ${textColor}; }
      .stroke span::after {
        content: attr(data-char);
        position: absolute; left: 0; top: 0; color: transparent; z-index: -1;
        -webkit-text-stroke-width: ${strokeWidth}px;
        -webkit-text-stroke-color: ${strokeColor};
      }
    `;
    document.head.appendChild(style);
  }

  const elements = document.querySelectorAll(selector);

  elements.forEach(container => {
    container.style.position = 'relative';
    container.style.overflow = 'hidden';

    // The element containing the text
    const titleEl = container.querySelector('.text-pressure-title') || container;
    
    let charsText = text || titleEl.textContent.trim();
    titleEl.textContent = ''; // clear
    titleEl.style.fontFamily = fontFamily;
    titleEl.style.margin = '0';
    titleEl.style.fontWeight = '100';
    titleEl.style.display = 'flex';
    titleEl.style.justifyContent = 'space-between';
    titleEl.style.textTransform = 'uppercase';
    titleEl.style.lineHeight = '0.8'; // Add this to keep it tight
    titleEl.style.whiteSpace = 'nowrap';
    
    if (stroke) titleEl.classList.add('stroke');
    else titleEl.style.color = textColor;

    const chars = charsText.split('');
    const spans = [];
    
    chars.forEach(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'inline-block';
      span.setAttribute('data-char', char);
      titleEl.appendChild(span);
      spans.push(span);
    });

    const mouse = { x: 0, y: 0 };
    const cursor = { x: 0, y: 0 };
    let rafId;

    const handleMouseMove = e => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    };
    const handleTouchMove = e => {
      const t = e.touches[0];
      cursor.x = t.clientX;
      cursor.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Initial mouse position at center
    const rect = container.getBoundingClientRect();
    mouse.x = rect.left + rect.width / 2;
    mouse.y = rect.top + rect.height / 2;
    cursor.x = mouse.x;
    cursor.y = mouse.y;

    const setSize = () => {
      const { width: containerW, height: containerH } = container.getBoundingClientRect();
      let newFontSize = containerW / (chars.length / 2);
      newFontSize = Math.max(newFontSize, minFontSize);
      titleEl.style.fontSize = `${newFontSize}px`;
      
      requestAnimationFrame(() => {
        const textRect = titleEl.getBoundingClientRect();
        if (scale && textRect.height > 0) {
          const yRatio = containerH / textRect.height;
          titleEl.style.transform = `scale(1, ${yRatio})`;
          titleEl.style.transformOrigin = 'center top';
        }
      });
    };

    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setSize, 100);
    };
    window.addEventListener('resize', onResize);
    setSize();

    const animate = () => {
      mouse.x += (cursor.x - mouse.x) / 15;
      mouse.y += (cursor.y - mouse.y) / 15;
      
      const titleRect = titleEl.getBoundingClientRect();
      const maxDist = titleRect.width / 2;
      
      spans.forEach(span => {
        const spanRect = span.getBoundingClientRect();
        const charCenter = {
          x: spanRect.x + spanRect.width / 2,
          y: spanRect.y + spanRect.height / 2
        };
        
        const d = dist(mouse, charCenter);
        const wdthVal = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
        const wghtVal = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
        const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;
        const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;
        
        const newFontVariationSettings = `'wght' ${wghtVal}, 'wdth' ${wdthVal}, 'ital' ${italVal}`;
        if (span.style.fontVariationSettings !== newFontVariationSettings) {
          span.style.fontVariationSettings = newFontVariationSettings;
        }
        if (alpha && span.style.opacity !== alphaVal) {
          span.style.opacity = alphaVal;
        }
      });
      
      rafId = requestAnimationFrame(animate);
    };
    animate();
  });
}
