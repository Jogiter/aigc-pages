# 跨页主题切换器与视觉统一实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 4 个页面共享 index.html 的视觉风格（Noto Sans SC + warm 浅色），并提供一个跨页持久化、可选 4 个主题的悬浮切换器。

**Architecture:**
- `theme.css` 扩展为 primitive tokens + 4 个 `[data-theme]` 语义覆盖块 + `.prose` 排版 + `.theme-fab` 通用切换器样式。
- `theme-switcher.js` 独立脚本：注入 DOM、在 `<html>` 上设置 `data-theme`、用统一 localStorage key 持久化。所有页面 `<head>` 引入即可。
- 各页面删除各自的 `[data-theme]` 块、独立切换器 JS、非 Noto Sans SC 字体；只保留结构/组件样式并引用 token。

**Tech Stack:** 纯静态 HTML + CSS 变量 + 原生 JS；无构建工具。

---

## 关键约定

- **存储 key：** `aigc-theme`（跨页一致）
- **默认主题：** `warm`
- **`data-theme` 作用域：** `<html>`（避免 body 替换时闪烁；所有页面在脚本最顶部立即读取）
- **可选主题：** `warm`（暖棕 · 默认）/ `coral`（珊瑚红）/ `sunflower`（向日葵金）/ `forest`（森林绿）
- **字体：** 所有页面统一 `'Noto Sans SC', system-ui, sans-serif`

---

## 文件结构（变更后）

```
aigc-pages/
├── theme.css                # 扩展：tokens + 4 主题 + .prose + .theme-fab
├── theme-switcher.js        # 新增：共享切换器
├── index.html
├── dual-track-6y.html
├── taoteching-silk.html
└── positive-discipline-revised-nelsen.html
```

---

## Task 1: 扩展 theme.css —— 4 主题 + 切换器通用样式

**Files:**
- Modify: `theme.css`

- [ ] **Step 1: 替换 Layer 2 为默认 + 4 主题块**

将现有 `:root` 语义层改为放在 `[data-theme="warm"]`（默认），并新增 3 个主题：

```css
/* ═══════════════════════════════════════════
   LAYER 2: SEMANTIC TOKENS（默认 + 4 主题）
   ═══════════════════════════════════════════ */
:root,
[data-theme="warm"] {
  --background:     var(--warm-50);
  --surface:        var(--neutral-0);
  --surface-2:      var(--warm-100);
  --primary:        var(--warm-500);
  --primary-light:  var(--warm-300);
  --primary-rgb:    201,122,58;
  --on-primary:     var(--neutral-0);
  --text-primary:   var(--neutral-700);
  --text-secondary: var(--neutral-500);
  --text-muted:     var(--neutral-400);
  --border:         var(--neutral-200);
  --outline:        var(--neutral-300);
  --accent:         var(--warm-300);
}

[data-theme="coral"] {
  --background:     #FFF5F1;
  --surface:        var(--neutral-0);
  --surface-2:      #FCE3D9;
  --primary:        var(--coral-500);
  --primary-light:  #D3694F;
  --primary-rgb:    139,54,32;
  --on-primary:     var(--neutral-0);
  --text-primary:   #2E140C;
  --text-secondary: #6B3A2A;
  --text-muted:     #A07A6A;
  --border:         #F0D6CB;
  --outline:        #D9B4A4;
  --accent:         #D3694F;
}

[data-theme="sunflower"] {
  --background:     #FFFBED;
  --surface:        var(--neutral-0);
  --surface-2:      var(--gold-100);
  --primary:        var(--gold-500);
  --primary-light:  #E5A93A;
  --primary-rgb:    196,137,26;
  --on-primary:     var(--neutral-0);
  --text-primary:   #2A1F05;
  --text-secondary: #6A5218;
  --text-muted:     #A08B4F;
  --border:         #EFE1B6;
  --outline:        #D9C684;
  --accent:         #E5A93A;
}

[data-theme="forest"] {
  --background:     #F1F6F2;
  --surface:        var(--neutral-0);
  --surface-2:      var(--green-100);
  --primary:        var(--green-500);
  --primary-light:  #6A9C74;
  --primary-rgb:    58,102,68;
  --on-primary:     var(--neutral-0);
  --text-primary:   #15261A;
  --text-secondary: #3F5A47;
  --text-muted:     #7A8F7F;
  --border:         #D4E2D7;
  --outline:        #A9C2AD;
  --accent:         #6A9C74;
}
```

- [ ] **Step 2: 追加 Layer 4 —— 共享切换器样式**

在文件末尾追加：

```css
/* ═══════════════════════════════════════════
   LAYER 4: SHARED THEME SWITCHER
   ═══════════════════════════════════════════ */
.theme-fab {
  position: fixed;
  bottom: 28px;
  right: 24px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  font-family: 'Noto Sans SC', system-ui, sans-serif;
}
.theme-fab-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--on-primary);
  border: none;
  cursor: pointer;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(var(--primary-rgb), .30);
  transition: transform .2s, box-shadow .2s, background .22s;
}
.theme-fab-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(var(--primary-rgb), .40);
}
.theme-fab-btn:active { transform: scale(0.96); }

.theme-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  box-shadow: var(--shadow-lg);
  display: none;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
}
.theme-panel.open { display: flex; }
.theme-panel-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.theme-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  border: 1.5px solid transparent;
  background: none;
  width: 100%;
  font-family: inherit;
  text-align: left;
  color: var(--text-primary);
  transition: background .15s, border-color .15s;
}
.theme-option:hover { background: var(--surface-2); }
.theme-option.selected {
  border-color: var(--primary);
  background: var(--surface-2);
}
.theme-swatch {
  display: flex;
  gap: 3px;
  flex-shrink: 0;
}
.theme-swatch span {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: block;
}
.theme-name { font-size: 13px; font-weight: 500; }
.theme-sub  { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
```

- [ ] **Step 3: 提交**

```bash
git add theme.css
git commit -m "feat(theme): 扩展 4 主题 data-theme 块与共享切换器样式"
```

---

## Task 2: 新增 theme-switcher.js

**Files:**
- Create: `theme-switcher.js`

- [ ] **Step 1: 写入脚本内容**

```javascript
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
    const fab = document.createElement('div');
    fab.className = 'theme-fab';
    fab.innerHTML = `
      <div class="theme-panel" id="themePanel">
        <div class="theme-panel-title">选择主题</div>
        ${THEMES.map(t => `
          <button class="theme-option" data-theme="${t.id}">
            <span class="theme-swatch">
              ${t.colors.map(c => `<span style="background:${c}"></span>`).join('')}
            </span>
            <span>
              <div class="theme-name">${t.name}</div>
              <div class="theme-sub">${t.sub}</div>
            </span>
          </button>`).join('')}
      </div>
      <button class="theme-fab-btn" id="themeFabBtn" aria-label="切换主题">🎨</button>
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

  // 1. 尽早设置 data-theme，避免闪烁
  document.documentElement.setAttribute('data-theme', getSaved());

  // 2. DOM ready 后注入切换器
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
```

- [ ] **Step 2: 在 index.html 临时引入 + 启动 dev server**

```html
<script src="/theme-switcher.js" defer></script>
```

Run: `npm run dev`
Expected: 首页右下角出现 🎨 悬浮按钮，点开可选 4 主题，切换后颜色变化；刷新后仍保持上次选择。

- [ ] **Step 3: 提交**

```bash
git add theme-switcher.js index.html
git commit -m "feat(theme): 新增跨页共享悬浮主题切换器脚本"
```

---

## Task 3: 重写 taoteching-silk.html —— 对齐 index 视觉

**Files:**
- Modify: `taoteching-silk.html`

- [ ] **Step 1: 字体与基础风格对齐**

- 移除 `Noto Serif SC`、`IM Fell English` 的 Google Fonts 链接；只保留 `Noto Sans SC`
- 删除文件内所有 `[data-theme]` 块（该页此前的「silk/paper/bamboo」等）
- 将 `:root` 精简为空别名或删除，直接使用 `theme.css` 语义 token
- 替换 `body` 样式：

```css
body {
  font-family: 'Noto Sans SC', system-ui, sans-serif;
  background: linear-gradient(135deg, var(--warm-50) 0%, var(--warm-100) 100%);
  color: var(--text-primary);
  line-height: 1.7;
}
```

- [ ] **Step 2: 重新映射 5 类色为浅底徽章**

在样式末尾替换原先「道/德/政/辩/修」深色丝绸分类色为语义 token：

```css
.cat-dao    { background: var(--warm-100);  color: var(--warm-700); }
.cat-de     { background: var(--gold-100);  color: #7A5308; }
.cat-zheng  { background: var(--coral-100); color: var(--coral-500); }
.cat-bian   { background: var(--blue-100);  color: var(--blue-500); }
.cat-xiu    { background: var(--green-100); color: var(--green-500); }
```

（根据实际类名微调 —— 若类名不同，只替换颜色属性，不改类名）

- [ ] **Step 3: 接入共享切换器，删除独立切换器**

- 在 `<head>` 末尾加：`<script src="/theme-switcher.js" defer></script>`
- 删除页内已有的 theme 切换按钮 HTML 与 JS（如存在）

- [ ] **Step 4: 浏览器验证**

Run: `npm run dev`，打开 `/taoteching-silk.html`
Expected: 浅色暖棕背景、Noto Sans SC 字体、右下角🎨按钮、切换到 coral/sunflower/forest 时主色同步变化。

- [ ] **Step 5: 提交**

```bash
git add taoteching-silk.html
git commit -m "refactor(silk): 对齐 index 视觉风格并接入共享主题切换器"
```

---

## Task 4: 重写 positive-discipline-revised-nelsen.html —— 对齐 index 视觉

**Files:**
- Modify: `positive-discipline-revised-nelsen.html`

- [ ] **Step 1: 移除深棕 header 与内置主题切换器**

- 删除页头 `.header` 深棕背景（含 `background: var(--neutral-800)` / `#4F2A0E` 等），改为与 index 一致的白色 sticky nav（参考 `index.html` 的 `<nav>` 样式结构）
- 删除文件内的 `[data-theme]` 块和 theme switcher HTML/JS

- [ ] **Step 2: 字体与正文排版对齐**

```css
body {
  font-family: 'Noto Sans SC', system-ui, sans-serif;
  background: linear-gradient(135deg, var(--warm-50) 0%, var(--warm-100) 100%);
  color: var(--text-primary);
  line-height: 1.75;
}
```

- 内容主区（章节/卡片父容器）加 `class="prose"` 继承 `theme.css` 排版（如 `<main class="prose">`）

- [ ] **Step 3: 卡片分类色引用功能色 token**

```css
.card-accent-gold   { border-top: 4px solid var(--gold-500); }
.card-accent-green  { border-top: 4px solid var(--green-500); }
.card-accent-blue   { border-top: 4px solid var(--blue-500); }
.card-accent-coral  { border-top: 4px solid var(--coral-500); }
```

（根据实际类名映射 —— 仅替换颜色属性）

- [ ] **Step 4: 接入共享切换器**

在 `<head>` 末尾加：

```html
<script src="/theme-switcher.js" defer></script>
```

- [ ] **Step 5: 浏览器验证**

Run: `npm run dev`，打开 `/positive-discipline-revised-nelsen.html`
Expected: 白色 nav + 暖棕渐变底 + Noto Sans SC + 右下角🎨；切主题时 nav logo / 卡片边色同步。

- [ ] **Step 6: 提交**

```bash
git add positive-discipline-revised-nelsen.html
git commit -m "refactor(positive-discipline): 对齐 index 视觉并接入共享主题切换器"
```

---

## Task 5: 重写 dual-track-6y.html —— 移除 M3 主题块与内置切换器

**Files:**
- Modify: `dual-track-6y.html`

- [ ] **Step 1: 删除页内 3 个 [data-theme] M3 块**

删除 `[data-theme="coral"]` / `[data-theme="sunflower"]` / `[data-theme="dawn"]` 的全部规则。

- [ ] **Step 2: 将所有 --md-* 与 --tab/--header/--progress 变量指向 theme.css token**

保留 `:root` 别名映射块，但展开为对应 token 引用：

```css
:root {
  --bg:              var(--background);
  --surface-variant: var(--surface-2);
  --primary-con:     var(--surface-2);
  --on-primary-con:  var(--text-primary);
  --on-surface:      var(--text-primary);
  --on-surface-var:  var(--text-secondary);
  --on-surface-3:    var(--text-muted);
  --outline:         var(--border);
  --outline-strong:  var(--outline);
  --tab-active-bg:   var(--primary);
  --tab-active-fg:   var(--on-primary);
  --header-bg:       var(--primary);   /* 头部改为主色（而非深棕） */
  --header-accent:   var(--primary-light);
  --progress-a:      var(--primary);
  --progress-b:      var(--accent);
  --shadow-color:    rgba(var(--primary-rgb), .12);
  --md-shape-sm:     var(--radius-sm);
  --md-shape-md:     var(--radius-md);
  --md-shape-lg:     var(--radius-lg);
  --md-shape-xl:     var(--radius-xl);
  --md-elev-1:       var(--shadow-sm);
  --md-elev-2:       var(--shadow-md);
  --transition:      .22s cubic-bezier(.4,0,.2,1);
}
```

- [ ] **Step 3: 字体与 Google Fonts 链接收敛**

- 移除 `Noto Serif SC` 引用；只保留 `Noto Sans SC`
- `body { font-family: 'Noto Sans SC', system-ui, sans-serif; }`

- [ ] **Step 4: 删除页内切换器 HTML 与 JS**

- 删除 `.theme-fab` 相关 HTML 块（`<div class="theme-fab">...</div>`）
- 删除 `setTheme / toggleThemePanel / closeThemePanel` 及其 init IIFE
- 保留 tab 切换 JS `showPanel(...)`
- 在 `<head>` 末尾加 `<script src="/theme-switcher.js" defer></script>`

- [ ] **Step 5: 浏览器验证**

Run: `npm run dev`，打开 `/dual-track-6y.html`
Expected: 头部变为主色条（不再是深棕），Tab 颜色跟随 primary 变化；切主题时整页响应；刷新保持。

- [ ] **Step 6: 提交**

```bash
git add dual-track-6y.html
git commit -m "refactor(dual-track): 移除 M3 主题块，接入共享切换器"
```

---

## Task 6: 更新 index.html 与最终验证

**Files:**
- Modify: `index.html`
- (无新增)

- [ ] **Step 1: 确认 index.html 已引入 theme-switcher.js**

若 Task 2 的 Step 2 已加上 `<script src="/theme-switcher.js" defer></script>`，跳过；否则补上。

- [ ] **Step 2: 跨页主题持久化校验**

Run: `npm run dev`，依次：
1. 在 `/` 切到 `forest`
2. 跳转 `/dual-track-6y.html` → 仍是 forest
3. 再跳 `/taoteching-silk.html` → 仍是 forest
4. 再跳 `/positive-discipline-revised-nelsen.html` → 仍是 forest
5. 切回 `warm`，再回首页 → 仍是 warm

Expected: 4 个页面均同步主色；localStorage 内 `aigc-theme` 键值可见。

- [ ] **Step 3: 硬编码扫描**

Run:
```bash
grep -nE "#[0-9A-Fa-f]{3,8}\b" index.html dual-track-6y.html taoteching-silk.html positive-discipline-revised-nelsen.html | grep -v "theme.css"
```
Expected: 仅有极少数允许项（如 SVG fill、transparent 替代等）；不应有分类主色硬编码。

- [ ] **Step 4: 提交并推送**

```bash
git add index.html
git commit -m "chore: 收尾 - 跨页主题切换器验证通过"
git push
```

Expected: PR 自动更新，CI 通过。

- [ ] **Step 5: 走 finishing-a-development-branch 技能收尾**

由 executing-plans 完成所有 task 后自动触发。

---

## 自检清单

- [ ] 4 个页面字体都是 `Noto Sans SC`
- [ ] 4 个页面背景都是 `linear-gradient(var(--warm-50), var(--warm-100))` 或等价 token 渐变
- [ ] 所有页面只存在一个切换器（`theme-switcher.js` 注入）
- [ ] `data-theme` 设在 `<html>` 上，所有页面默认值 = `warm`
- [ ] `localStorage['aigc-theme']` 跨页共享
- [ ] `theme.css` 是四主题唯一色值来源
- [ ] 无任何分类/品牌色硬编码残留
