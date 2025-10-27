(() => {
  function updateDateTime() {
    const el = document.getElementById('datetime');
    if (!el) return;
    const now = new Date();
    const formatted = now.toLocaleString();
    el.textContent = formatted;
  }

  function applyThemeFromStorage() {
    const savedFont = localStorage.getItem('a3_fontSize') || '100%';
    const savedBg = localStorage.getItem('a3_bgColor') || '';
    document.documentElement.style.fontSize = savedFont;
    if (savedBg) {
      document.body.style.backgroundColor = savedBg;
      document.body.style.color = savedBg === '#121212' ? '#f5f5f5' : '';
    }
    const fontCtl = document.getElementById('fontSizeControl');
    const bgCtl = document.getElementById('bgColorControl');
    if (fontCtl) fontCtl.value = savedFont;
    if (bgCtl) bgCtl.value = savedBg;
  }

  function initThemeControls() {
    const fontCtl = document.getElementById('fontSizeControl');
    const bgCtl = document.getElementById('bgColorControl');
    if (fontCtl) {
      fontCtl.addEventListener('change', () => {
        const val = fontCtl.value || '100%';
        document.documentElement.style.fontSize = val;
        localStorage.setItem('a3_fontSize', val);
      });
    }
    if (bgCtl) {
      bgCtl.addEventListener('change', () => {
        const val = bgCtl.value || '';
        document.body.style.backgroundColor = val;
        document.body.style.color = val === '#121212' ? '#f5f5f5' : '';
        localStorage.setItem('a3_bgColor', val);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    applyThemeFromStorage();
    initThemeControls();
  });
})();


