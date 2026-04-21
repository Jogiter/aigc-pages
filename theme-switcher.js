(function () {
  'use strict';

  const STORAGE_KEY = 'aigc-theme';
  const DEFAULT = 'warm';
  const THEMES = [
    { id: 'warm',      name: '暖棕',   sub: '默认 · 温暖自然', colors: ['#FFF8F0', '#C97A3A', '#7D4218'] },
    { id: 'coral',     name: '珊瑚红', sub: '温柔热情',        colors: ['#FFF5F1', '#8B3620', '#D3694F'] },
    { id: 'sunflower', name: '向日葵', sub: '明亮活泼',        colors: ['#FFFBED', '#C4891A', '#E5A93A'] },
    { id: 'forest',    name: '森林绿', sub: '沉静自然',        colors: ['#F1F6F2', '#3A6644', '#6A9C74'] }
  ];

  function getSaved() {
    try { return localStorage.getItem(STORAGE_KEY) || DEFAULT; }
    catch (_) { return DEFAULT; }
  }

  function applyTheme(id) {
    document.documentElement.setAttribute('data-theme', id);
    try { localStorage.setItem(STORAGE_KEY, id); } catch (_) {}
    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.classList.toggle('selected', opt.dataset.theme === id);
    });
  }

  function buildPanel() {
    if (document.querySelector('.theme-fab')) return;

    const fab = document.createElement('div');
    fab.className = 'theme-fab';
    fab.innerHTML = `
      <div class="theme-panel" id="themePanel">
        <div class="theme-panel-title">选择主题</div>
        ${THEMES.map(t => `
          <button class="theme-option" data-theme="${t.id}" type="button">
            <span class="theme-swatch">
              ${t.colors.map(c => `<span style="background:${c}"></span>`).join('')}
            </span>
            <span>
              <div class="theme-name">${t.name}</div>
              <div class="theme-sub">${t.sub}</div>
            </span>
          </button>`).join('')}
      </div>
      <button class="theme-fab-btn" id="themeFabBtn" aria-label="切换主题" type="button">🎨</button>
    `;
    document.body.appendChild(fab);

    const panel = fab.querySelector('#themePanel');
    fab.querySelector('#themeFabBtn').addEventListener('click', e => {
      e.stopPropagation();
      panel.classList.toggle('open');
    });
    fab.querySelectorAll('.theme-option').forEach(opt => {
      opt.addEventListener('click', () => {
        applyTheme(opt.dataset.theme);
        setTimeout(() => panel.classList.remove('open'), 200);
      });
    });
    document.addEventListener('click', e => {
      if (!fab.contains(e.target)) panel.classList.remove('open');
    });
  }

  // 尽早设置 data-theme，避免首屏闪烁
  document.documentElement.setAttribute('data-theme', getSaved());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      buildPanel();
      applyTheme(getSaved());
    });
  } else {
    buildPanel();
    applyTheme(getSaved());
  }
})();
