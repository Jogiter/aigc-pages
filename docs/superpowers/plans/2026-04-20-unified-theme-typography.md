# 统一主题与排版系统 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建 `theme.css` 统一设计 token 体系（原始色阶 + 语义变量 + `.prose` 排版），并将四个 HTML 页面迁移到该体系。

**Architecture:** `theme.css` 分三层：primitive tokens（色阶/圆角/阴影原始值）→ semantic tokens（语义映射）→ `.prose` 排版类。各页面 `<head>` 引入 `theme.css`，原有 `:root` 改为仅包含"本页别名映射到 theme token"的覆盖层，页面内其余 CSS 不需修改。

**Tech Stack:** 纯静态 HTML + CSS 自定义属性，无构建工具。

---

### Task 1: 创建 theme.css（三层结构）

**Files:**
- Create: `theme.css`

- [ ] **Step 1: 创建文件，写入 Layer 1（Primitive Tokens）**

```css
/* ═══════════════════════════════════════════
   LAYER 1: PRIMITIVE TOKENS
   ═══════════════════════════════════════════ */
:root {
  /* 暖棕主色阶 */
  --warm-50:  #FFF8F0;
  --warm-100: #FDEBD0;
  --warm-200: #FAD7A0;
  --warm-300: #F5B97A;
  --warm-400: #E8955A;
  --warm-500: #C97A3A;
  --warm-600: #A85E28;
  --warm-700: #7D4218;
  --warm-800: #4F2A0E;
  --warm-900: #2C1608;

  /* 中性色阶 */
  --neutral-0:   #FFFFFF;
  --neutral-50:  #F7F3EE;
  --neutral-100: #EDE6DB;
  --neutral-200: #D9CEBD;
  --neutral-300: #B8A99A;
  --neutral-400: #9B8B78;
  --neutral-500: #6B5A47;
  --neutral-600: #4A3D30;
  --neutral-700: #2C2318;
  --neutral-800: #1A1410;
  --neutral-900: #0D0A07;

  /* 功能色 */
  --green-500: #3A6644;
  --green-100: #EAF2ED;
  --blue-500:  #1C4F7A;
  --blue-100:  #E8F2FA;
  --gold-500:  #C4891A;
  --gold-100:  #FDF3DC;
  --coral-500: #8B3620;
  --coral-100: #FAF0EC;

  /* 圆角 */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(44,22,8,.07), 0 1px 2px rgba(44,22,8,.05);
  --shadow-md: 0 3px 8px rgba(44,22,8,.09), 0 1px 3px rgba(44,22,8,.07);
  --shadow-lg: 0 4px 24px rgba(44,22,8,.12);
}
```

- [ ] **Step 2: 追加 Layer 2（Semantic Tokens）**

在同一文件末尾追加：

```css
/* ═══════════════════════════════════════════
   LAYER 2: SEMANTIC TOKENS (default light)
   ═══════════════════════════════════════════ */
:root {
  --background:      var(--neutral-50);
  --surface:         var(--neutral-0);
  --surface-2:       var(--neutral-100);
  --primary:         var(--warm-500);
  --primary-light:   var(--warm-300);
  --on-primary:      var(--neutral-0);
  --text-primary:    var(--neutral-700);
  --text-secondary:  var(--neutral-500);
  --text-muted:      var(--neutral-400);
  --border:          var(--neutral-200);
  --outline:         var(--neutral-300);
}
```

- [ ] **Step 3: 追加 Layer 3（`.prose` 排版）**

在同一文件末尾追加：

```css
/* ═══════════════════════════════════════════
   LAYER 3: TYPOGRAPHY — .prose
   Inspired by @tailwindcss/typography
   ═══════════════════════════════════════════ */
.prose {
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.75;
}
.prose > * + * { margin-top: 1.25em; }

.prose p { margin-top: 1.25em; margin-bottom: 1.25em; }

.prose h1 {
  color: var(--text-primary);
  font-weight: 800;
  font-size: 2.25em;
  line-height: 1.1111111;
  margin-top: 0;
  margin-bottom: 0.8888889em;
}
.prose h2 {
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.5em;
  line-height: 1.3333333;
  margin-top: 2em;
  margin-bottom: 1em;
}
.prose h3 {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.25em;
  line-height: 1.6;
  margin-top: 1.6em;
  margin-bottom: 0.6em;
}
.prose h4 {
  color: var(--text-primary);
  font-weight: 600;
  line-height: 1.5;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}
.prose a {
  color: var(--primary);
  text-decoration: underline;
  font-weight: 500;
}
.prose a:hover { color: var(--primary-light); }
.prose strong { color: var(--text-primary); font-weight: 600; }
.prose ul {
  list-style-type: disc;
  padding-left: 1.625em;
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}
.prose ol {
  list-style-type: decimal;
  padding-left: 1.625em;
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}
.prose li { margin-top: 0.5em; margin-bottom: 0.5em; }
.prose ul > li::marker,
.prose ol > li::marker { color: var(--text-muted); }
.prose blockquote {
  font-weight: 500;
  font-style: italic;
  color: var(--text-secondary);
  border-left: 0.25rem solid var(--primary);
  margin-top: 1.6em;
  margin-bottom: 1.6em;
  padding-left: 1em;
}
.prose code {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.875em;
  background: var(--surface-2);
  padding: 0.2em 0.4em;
  border-radius: var(--radius-sm);
}
.prose pre {
  color: var(--neutral-100);
  background-color: var(--neutral-800);
  overflow-x: auto;
  font-size: 0.875em;
  line-height: 1.7142857;
  margin-top: 1.7142857em;
  margin-bottom: 1.7142857em;
  border-radius: var(--radius-md);
  padding: 0.857em 1.143em;
}
.prose pre code {
  background-color: transparent;
  padding: 0;
  font-weight: 400;
  color: inherit;
  font-size: inherit;
  line-height: inherit;
  border-radius: 0;
}
.prose table {
  width: 100%;
  table-layout: auto;
  text-align: left;
  margin-top: 2em;
  margin-bottom: 2em;
  font-size: 0.875em;
  line-height: 1.7142857;
  border-collapse: collapse;
}
.prose thead th {
  color: var(--text-primary);
  font-weight: 600;
  background: var(--surface-2);
  padding: 0.571em 0.857em;
  border-bottom: 1px solid var(--border);
}
.prose tbody tr { border-bottom: 1px solid var(--border); }
.prose tbody td { padding: 0.571em 0.857em; }
.prose hr {
  border: none;
  border-top: 1px solid var(--border);
  margin-top: 3em;
  margin-bottom: 3em;
}
.prose img {
  max-width: 100%;
  border-radius: var(--radius-md);
  margin-top: 2em;
  margin-bottom: 2em;
}

/* 尺寸变体 */
.prose-sm { font-size: 0.875rem; line-height: 1.7142857; }
.prose-lg { font-size: 1.125rem; line-height: 1.7777778; }
```

- [ ] **Step 4: 验证文件存在且语法正确**

```bash
# 检查文件存在
ls -la theme.css

# 检查三个层都有内容
grep -c ":root" theme.css          # 应输出 2
grep -c "\.prose" theme.css        # 应输出 >= 1
grep -c "\-\-warm-500" theme.css   # 应输出 >= 1
```

期望输出：`2`, `>=1`, `>=1`，无报错。

- [ ] **Step 5: Commit**

```bash
git add theme.css
git commit -m "feat: add unified theme.css with primitive tokens, semantic tokens, and prose typography"
```

---

### Task 2: 迁移 index.html

**Files:**
- Modify: `index.html`（`<head>` 引入、`:root` 替换、CSS 中硬编码色值替换）

**背景：** index.html 当前有 8 个 `:root` 变量：`--primary`、`--primary-light`、`--secondary`（粉色）、`--accent`（青色）、`--background`、`--card-bg`、`--text-primary`、`--text-secondary`。其中 `--secondary` 和 `--accent` 是粉/青色，不在新暖棕色系中，改用暖棕色阶替代。

- [ ] **Step 1: 在 `<head>` 加入 theme.css 引入（放在现有 `<style>` 标签之前）**

在 `index.html` 第 30 行（`<link rel="manifest" href="/site.webmanifest">` 之后），插入：

```html
    <link rel="stylesheet" href="/theme.css">
```

- [ ] **Step 2: 替换 `:root` 块**

将以下旧代码（约第 34–43 行）：

```css
        :root {
            --primary: #FF8C42;
            --primary-light: #FFB74D;
            --secondary: #FF6B9D;
            --accent: #4ECDC4;
            --background: #FFF8F0;
            --card-bg: #FFFFFF;
            --text-primary: #2C2C2C;
            --text-secondary: #555555;
        }
```

替换为（仅保留本页需要覆盖/补充的变量）：

```css
        :root {
            /* 覆盖：将 index 专用变量映射到 theme token */
            --secondary: var(--warm-400);
            --accent:    var(--warm-300);
            --card-bg:   var(--surface);
        }
```

说明：`--primary`、`--primary-light`、`--background`、`--text-primary`、`--text-secondary` 直接继承自 `theme.css`，无需重复声明。

- [ ] **Step 3: 替换 CSS 中的硬编码色值**

在 `<style>` 块中做以下替换：

| 旧值 | 新值 | 位置 |
|------|------|------|
| `linear-gradient(135deg, #FFF8F0 0%, #FFF0E6 100%)` | `linear-gradient(135deg, var(--warm-50) 0%, var(--warm-100) 100%)` | `body` 背景 |
| `rgba(255, 140, 66, 0.3)` | `rgba(201,122,58,.30)` | `.cta-button` box-shadow |
| `rgba(255, 140, 66, 0.4)` | `rgba(201,122,58,.40)` | `.cta-button:hover` box-shadow |
| `background: #2C2C2C` | `background: var(--neutral-800)` | `footer` |
| `color: #ddd` | `color: var(--neutral-300)` | `footer` |

- [ ] **Step 4: 验证**

```bash
# 确认 index.html 中无裸 hex（footer 硬编码已清除）
grep -n "#[0-9a-fA-F]\{6\}" index.html | grep -v "rgba\|og:\|twitter:\|canonical\|favicon\|manifest\|png\|ico\|svg"
```

期望：无输出（或仅剩 meta/head 中 OG 图片链接，非 CSS 色值）。

- [ ] **Step 5: 启动服务并目视验证**

```bash
npm run dev
```

访问 `http://localhost:3000/index.html`，确认：
- Logo、按钮仍为暖棕橙色（`--warm-500` ≈ `#C97A3A`）
- Hero 标题渐变（暖棕→浅棕）可见
- 卡片背景白色，阴影正常

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: migrate index.html to theme.css tokens"
```

---

### Task 3: 迁移 positive-discipline-revised-nelsen.html

**Files:**
- Modify: `positive-discipline-revised-nelsen.html`

**背景：** 该页有 18 个 `:root` 变量，其中 `--primary: #231408`（极深棕，用作正文色和 header 背景）与 theme.css 的 `--primary`（暖橙）冲突。策略：保留页面 `:root`，但将所有色值替换为 theme token 引用，保持变量名称不变（这样页面 CSS 无需修改）。

- [ ] **Step 1: 在 `<head>` 加入 theme.css 引入（放在 `<style>` 之前）**

在第 8 行（Google Fonts `<link>` 之后，`<style>` 之前）插入：

```html
<link rel="stylesheet" href="/theme.css">
```

- [ ] **Step 2: 替换 `:root` 块**

将旧 `:root`（第 10–32 行）整体替换为：

```css
:root {
  /* 本页语义覆盖：--primary 作为深色文字/背景使用 */
  --bg:          var(--background);
  --surface2:    var(--surface-2);
  --primary:     var(--neutral-900);
  --secondary:   var(--neutral-500);
  --muted:       var(--text-muted);
  --accent:      var(--warm-700);
  --accent2:     var(--gold-500);
  --gold:        var(--gold-500);
  --gold-light:  var(--gold-100);
  --green:       var(--green-500);
  --green-light: var(--green-100);
  --blue:        var(--blue-500);
  --blue-light:  var(--blue-100);
  --coral:       var(--coral-500);
  --coral-light: var(--coral-100);
  --radius:      var(--radius-md);
  --shadow:      var(--shadow-sm);
}
```

页面其余所有 CSS（使用 `var(--bg)`、`var(--gold)` 等）无需修改。

- [ ] **Step 3: 验证**

```bash
grep -n "#[0-9a-fA-F]\{6\}" positive-discipline-revised-nelsen.html | grep "style\|:root\|--" | grep -v "rgba\|og:\|twitter:\|fonts\|#F7F3EE"
```

期望：无残留硬编码色值（注：header 内联 `color: #F7F3EE` 等已被 `:root` 覆盖，属于 `.header` 组件色，下一步处理）。

- [ ] **Step 4: 替换页面 CSS 中的硬编码色值**

在 `<style>` 块中搜索并替换剩余硬编码色（这些是组件级颜色，非 `:root` 变量）：

| 旧值 | 新值 |
|------|------|
| `color: #F7F3EE` | `color: var(--neutral-50)` |
| `background: #F7F3EE` | `background: var(--neutral-50)` |
| `rgba(247,243,238,0.65)` | `rgba(247,243,238,.65)` *(格式统一，值保留—来自 neutral-50)* |
| `rgba(247,243,238,0.75)` | `rgba(247,243,238,.75)` |
| `rgba(212,168,67,0.4)` | `rgba(196,137,26,.40)` *(gold-500 = #C4891A = 196,137,26)* |

- [ ] **Step 5: 目视验证（npm run dev 已运行）**

访问 `http://localhost:3000/positive-discipline-revised-nelsen.html`，确认：
- Header 深棕背景，金色标签文字正常
- 卡片分类色（金/绿/蓝/珊瑚）均正常显示

- [ ] **Step 6: Commit**

```bash
git add positive-discipline-revised-nelsen.html
git commit -m "feat: migrate positive-discipline page to theme.css tokens"
```

---

### Task 4: 迁移 taoteching-silk.html

**Files:**
- Modify: `taoteching-silk.html`

**背景：** 深色丝绸风格页面，需覆盖大部分语义 token（背景/文字变为暗色）。分类颜色（`--dao-*`、`--de-*` 等）是页面专属，保留但用 rgba 形式规范。

- [ ] **Step 1: 在 `<head>` 加入 theme.css 引入**

在第 10 行 `<style>` 之前插入：

```html
<link rel="stylesheet" href="/theme.css">
```

- [ ] **Step 2: 替换 `:root` 块**

将旧 `:root`（第 13–46 行）整体替换为：

```css
:root {
  /* 深色丝绸主题：覆盖语义 token */
  --background:      var(--neutral-900);
  --surface:         #131310;
  --surface-2:       #1a1a16;
  --primary:         var(--gold-500);
  --primary-light:   #e4c97e;
  --text-primary:    #f0ead8;
  --text-secondary:  #b8b09a;
  --text-muted:      #6e6858;
  --border:          rgba(196,137,26,.15);
  --outline:         rgba(196,137,26,.30);

  /* 本页别名 */
  --bg:       var(--background);
  --bg2:      var(--surface);
  --bg3:      var(--surface-2);
  --bg4:      #222220;
  --gold:     var(--primary);
  --gold-lt:  var(--primary-light);
  --gold-dk:  var(--warm-700);
  --ink:      var(--text-primary);
  --ink2:     var(--text-secondary);
  --ink3:     var(--text-muted);
  --border2:  rgba(196,137,26,.30);

  /* 分类颜色（页面专属） */
  --dao-bg:    rgba(99,80,32,.18);
  --dao-txt:   #e4c97e;
  --dao-bdr:   rgba(196,137,26,.35);

  --de-bg:     rgba(32,72,52,.22);
  --de-txt:    #7ecfa8;
  --de-bdr:    rgba(40,140,90,.35);

  --pol-bg:    rgba(80,40,20,.22);
  --pol-txt:   #e0a060;
  --pol-bdr:   rgba(180,90,30,.35);

  --dial-bg:   rgba(50,30,70,.22);
  --dial-txt:  #c09ee0;
  --dial-bdr:  rgba(130,70,180,.35);

  --xiu-bg:    rgba(20,55,80,.22);
  --xiu-txt:   #70b8e0;
  --xiu-bdr:   rgba(40,120,190,.35);
}
```

说明：`--bg4`（`#222220`）及分类颜色中的 txt 颜色（如 `#7ecfa8`）是高度特化的页面色，无对应 primitive token，暂保留硬编码值；rgba 的 base 已规范为对应 primitive token 的 RGB 值。

- [ ] **Step 3: 替换页面 CSS 中的硬编码色值**

在 `<style>` 块中找到并替换：

| 旧值 | 新值 |
|------|------|
| `rgba(201,168,76,0.025)` | `rgba(196,137,26,.025)` *(gold-500 RGB)* |

- [ ] **Step 4: 目视验证**

访问 `http://localhost:3000/taoteching-silk.html`，确认：
- 深色背景（近黑）正常
- 金色标题/边框正常
- 分类标签（道/德/政/辩/修）颜色正常

- [ ] **Step 5: Commit**

```bash
git add taoteching-silk.html
git commit -m "feat: migrate taoteching-silk page to theme.css tokens"
```

---

### Task 5: 迁移 dual-track-6y.html

**Files:**
- Modify: `dual-track-6y.html`

**背景：** 该页已有 Material Design 3 三主题切换器（coral/sunflower/dawn），`:root` 只有 shape 和 shadow 变量。主题色分散在 `[data-theme]` 块中，不做删除，只将 `:root` 的 shape/shadow 引用改为 theme token。主题切换器 swatch 的内联 `background:#xxxxxx` 因其表示主题预览色，可接受保留（例外说明见成功标准）。

- [ ] **Step 1: 在 `<head>` 加入 theme.css 引入**

在第 14 行（Google Fonts `<link>` 之后，`<style>` 之前）插入：

```html
<link rel="stylesheet" href="/theme.css">
```

- [ ] **Step 2: 替换 `:root` 块**

将旧 `:root`（第 21–29 行）：

```css
:root {
  --md-shape-sm:   8px;
  --md-shape-md:  12px;
  --md-shape-lg:  16px;
  --md-shape-xl:  24px;
  --md-elev-1: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06);
  --md-elev-2: 0 3px 8px rgba(0,0,0,.09), 0 1px 3px rgba(0,0,0,.07);
  --transition: .22s cubic-bezier(.4,0,.2,1);
}
```

替换为：

```css
:root {
  --md-shape-sm:   var(--radius-sm);
  --md-shape-md:   var(--radius-md);
  --md-shape-lg:   var(--radius-lg);
  --md-shape-xl:   var(--radius-xl);
  --md-elev-1:     var(--shadow-sm);
  --md-elev-2:     var(--shadow-md);
  --transition:    .22s cubic-bezier(.4,0,.2,1);
}
```

注意：`--radius-sm: 6px` vs 旧值 `8px`，`--radius-md: 10px` vs 旧值 `12px`，视觉变化极小（2px），可接受。

- [ ] **Step 3: 目视验证**

访问 `http://localhost:3000/dual-track-6y.html`，确认：
- 三个主题（珊瑚/向日葵/晨曦）切换正常
- 卡片圆角、阴影正常（视觉上与原版基本一致）
- 主题切换浮动按钮正常工作

- [ ] **Step 4: Commit**

```bash
git add dual-track-6y.html
git commit -m "feat: migrate dual-track page shape/shadow tokens to theme.css"
```

---

### Task 6: 最终验证

**Files:** 无新修改，仅验证

- [ ] **Step 1: 检查四个页面的 CSS 区域中无裸 hex 色值**

```bash
# 提取各页面 <style> 块内容并检查 hex 色值
for f in index.html taoteching-silk.html positive-discipline-revised-nelsen.html dual-track-6y.html; do
  echo "=== $f ===" 
  grep -n "#[0-9a-fA-F]\{3,6\}\b" "$f" | grep -v "^\s*//" | grep -v 'href\|src\|content\|og:\|twitter\|canonical\|favicon\|manifest\|fonts\.g'
done
```

期望：
- `index.html` — 无结果（footer 色已改为 token）
- `taoteching-silk.html` — 仅剩分类文字颜色（`--dao-txt: #e4c97e` 等）和 `--bg4: #222220`，这些是已知例外
- `positive-discipline-revised-nelsen.html` — 无结果
- `dual-track-6y.html` — 仅剩 `[data-theme]` 块内的主题色和 swatch 内联色（已知例外）

- [ ] **Step 2: 确认 theme.css 被所有页面引入**

```bash
grep -l 'href="/theme.css"' *.html
```

期望输出：`dual-track-6y.html`, `index.html`, `positive-discipline-revised-nelsen.html`, `taoteching-silk.html`（四个文件均包含）

- [ ] **Step 3: 四页面快速目视验证**

`npm run dev` 已运行，依次访问：
- `http://localhost:3000/` — 暖橙主色，卡片正常
- `http://localhost:3000/dual-track-6y.html` — 三主题切换正常
- `http://localhost:3000/taoteching-silk.html` — 深色金墨风格正常
- `http://localhost:3000/positive-discipline-revised-nelsen.html` — 米棕书卷风格正常

- [ ] **Step 4: 最终 Commit（如有未提交文件）**

```bash
git status
# 若有未提交文件，逐一提交
```
