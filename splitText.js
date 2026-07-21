export function initSplitText(selector, options = {}) {
  const {
    delay = 50,
    threshold = 0.1,
    rootMargin = "0px"
  } = options;

  const elements = document.querySelectorAll(selector);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const chars = entry.target.querySelectorAll('.char');
        chars.forEach((char, index) => {
          setTimeout(() => {
            char.style.opacity = '1';
            char.style.transform = 'translateY(0)';
          }, index * delay);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold, rootMargin });

  elements.forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    
    // Split into words to keep words together (no breaking mid-word if possible)
    const words = text.split(/(\s+)/);
    
    words.forEach(word => {
      if (word.trim() === '') {
        el.appendChild(document.createTextNode(word));
        return;
      }
      
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.className = 'char';
        charSpan.style.display = 'inline-block';
        charSpan.style.opacity = '0';
        charSpan.style.transform = 'translateY(1rem)';
        charSpan.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        charSpan.style.willChange = 'opacity, transform';
        wordSpan.appendChild(charSpan);
      }
      
      el.appendChild(wordSpan);
    });

    observer.observe(el);
  });
}
