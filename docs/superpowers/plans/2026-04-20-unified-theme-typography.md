# 统一主题与排版系统 Implementation Plan (v2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建 `theme.css` 五层统一设计 token 体系（原始色阶 + 语义颜色 + 排版 token + 全局 Tailwind Typography 风格排版 + `.plain` 反向开关），并将四个 HTML 页面的色值/字号/字重全部迁移到 token 引用。

**Architecture:** `theme.css` 分五层：Layer 1 Primitive Tokens（色阶/圆角/阴影）→ Layer 2 Semantic Color Tokens（颜色语义）→ Layer 3 Typography Tokens（字号/行高/字重/字体族，字号全部 `clamp()` 流体）→ Layer 4 Global Type Rules（直接作用于 `html/body/h1~h6/p/ul/a/blockquote/code/table/hr/img/strong`）→ Layer 5 `.plain` Escape Hatch（UI 容器反向关闭全局排版）。各页面 `<head>` 引入 `theme.css`，UI 容器加 `.plain`，正文型容器继承全局；裸 hex/px/rem 字号/数字字重全部替换为 `var(--*)` 引用。

**Tech Stack:** 纯静态 HTML + CSS 自定义属性 + `clamp()` 流体响应式，无构建工具。

---

## File Structure

- **Create:** `theme.css`（唯一新文件，五层 token + 全局排版 + `.plain`）
- **Modify:** `index.html`（~263 行）
- **Modify:** `positive-discipline-revised-nelsen.html`（~2038 行）
- **Modify:** `taoteching-silk.html`（~917 行）
- **Modify:** `dual-track-6y.html`（~927 行）

---

### Task 1: 创建 theme.css（五层结构）

**Files:**
- Create: `theme.css`

- [ ] **Step 1: 创建文件并写入 Layer 1（Primitive Tokens）**

**File:** `theme.css`

```css
/* ═══════════════════════════════════════════
   LAYER 1: PRIMITIVE TOKENS
   色阶 / 圆角 / 阴影 — 系统唯一色值来源
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
  --green-500: #3A6644;  --green-100: #EAF2ED;
  --blue-500:  #1C4F7A;  --blue-100:  #E8F2FA;
  --gold-500:  #C4891A;  --gold-100:  #FDF3DC;
  --coral-500: #8B3620;  --coral-100: #FAF0EC;

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

- [ ] **Step 2: 追加 Layer 2（Semantic Color Tokens）**

在 `theme.css` 文件末尾追加：

```css

/* ═══════════════════════════════════════════
   LAYER 2: SEMANTIC COLOR TOKENS
   默认浅色主题；页面可在自己的 :root 覆盖
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

- [ ] **Step 3: 追加 Layer 3（Typography Tokens）**

在 `theme.css` 文件末尾追加：

```css

/* ═══════════════════════════════════════════
   LAYER 3: TYPOGRAPHY TOKENS
   字号（clamp 流体）+ 配套行高 + 字重 + 字体族
   ═══════════════════════════════════════════ */
:root {
  /* 字号 + 配套行高（中文友好，base=17px） */
  --text-xs:      clamp(12px, 0.7rem + 0.1vw, 13px);
  --text-xs-lh:   1.5;
  --text-sm:      clamp(14px, 0.85rem + 0.1vw, 15px);
  --text-sm-lh:   1.55;
  --text-base:    clamp(16px, 1rem + 0.1vw, 17px);
  --text-base-lh: 1.7;
  --text-lg:      clamp(17px, 1.05rem + 0.15vw, 19px);
  --text-lg-lh:   1.7;
  --text-xl:      clamp(19px, 1.15rem + 0.3vw, 22px);
  --text-xl-lh:   1.5;
  --text-2xl:     clamp(22px, 1.3rem + 0.5vw, 26px);
  --text-2xl-lh:  1.3;
  --text-3xl:     clamp(26px, 1.5rem + 1vw, 32px);
  --text-3xl-lh:  1.25;
  --text-4xl:     clamp(30px, 1.7rem + 2vw, 40px);
  --text-4xl-lh:  1.15;

  /* 字重 */
  --font-normal:    400;
  --font-medium:    500;
  --font-semibold:  600;
  --font-bold:      700;
  --font-extrabold: 800;

  /* 字体族（默认值，页面可覆盖） */
  --font-sans:  system-ui, -apple-system, "Segoe UI",
                "PingFang SC", "Microsoft YaHei", "Helvetica Neue",
                Arial, sans-serif;
  --font-serif: "Source Han Serif SC", "Songti SC", "SimSun",
                Georgia, "Times New Roman", serif;
  --font-mono:  ui-monospace, SFMono-Regular, Menlo,
                Consolas, "Liberation Mono", monospace;
}
```

- [ ] **Step 4: 追加 Layer 4（Global Type Rules）**

在 `theme.css` 文件末尾追加：

```css

/* ═══════════════════════════════════════════
   LAYER 4: GLOBAL TYPOGRAPHY RULES
   Inspired by @tailwindcss/typography
   所有页面自动继承；UI 容器用 .plain 反向关闭
   ═══════════════════════════════════════════ */
html {
  font-size: var(--text-base);
  line-height: var(--text-base-lh);
  font-family: var(--font-sans);
  color: var(--text-primary);
}
body { background: var(--background); }

/* 标题 */
h1 { font-size: var(--text-4xl); line-height: var(--text-4xl-lh);
     font-weight: var(--font-extrabold); margin: 0 0 0.6em; }
h2 { font-size: var(--text-3xl); line-height: var(--text-3xl-lh);
     font-weight: var(--font-bold);      margin: 2em 0 0.8em; }
h3 { font-size: var(--text-2xl); line-height: var(--text-2xl-lh);
     font-weight: var(--font-semibold);  margin: 1.6em 0 0.6em; }
h4 { font-size: var(--text-xl);  line-height: var(--text-xl-lh);
     font-weight: var(--font-semibold);  margin: 1.5em 0 0.5em; }
h5 { font-size: var(--text-lg);  line-height: var(--text-lg-lh);
     font-weight: var(--font-semibold);  margin: 1.4em 0 0.5em; }
h6 { font-size: var(--text-base);line-height: var(--text-base-lh);
     font-weight: var(--font-semibold);  margin: 1.2em 0 0.4em; }

/* 段落 / 列表 */
p  { margin: 1.25em 0; }
ul { list-style: disc; padding-left: 1.625em; margin: 1.25em 0; }
ol { list-style: decimal; padding-left: 1.625em; margin: 1.25em 0; }
li { margin: 0.5em 0; }
ul > li::marker,
ol > li::marker { color: var(--text-muted); }

/* 行内元素 */
strong { font-weight: var(--font-semibold); color: inherit; }
a      { color: var(--primary); text-decoration: underline;
         text-underline-offset: 0.15em; font-weight: var(--font-medium); }
a:hover { color: var(--primary-light); }

blockquote { border-left: 0.25rem solid var(--primary);
             padding-left: 1em; margin: 1.6em 0;
             font-style: italic; color: var(--text-secondary); }

/* 代码 */
code { font-family: var(--font-mono); font-size: 0.875em;
       font-weight: var(--font-semibold);
       background: var(--surface-2); padding: 0.2em 0.4em;
       border-radius: var(--radius-sm); }
pre  { background: var(--neutral-800); color: var(--neutral-100);
       padding: 1em 1.2em; border-radius: var(--radius-md);
       overflow-x: auto; margin: 1.75em 0;
       font-size: var(--text-sm); line-height: 1.71; }
pre code { background: transparent; padding: 0;
           font-weight: var(--font-normal); color: inherit; }

/* 表格 */
table { width: 100%; border-collapse: collapse; margin: 2em 0;
        font-size: var(--text-sm); }
thead th { background: var(--surface-2); font-weight: var(--font-semibold);
           padding: 0.6em 0.9em; border-bottom: 1px solid var(--border);
           text-align: left; }
tbody tr { border-bottom: 1px solid var(--border); }
tbody td { padding: 0.6em 0.9em; }

/* 分隔与图片 */
hr  { border: none; border-top: 1px solid var(--border); margin: 3em 0; }
img { max-width: 100%; border-radius: var(--radius-md); }
```

- [ ] **Step 5: 追加 Layer 5（`.plain` Escape Hatch）**

在 `theme.css` 文件末尾追加：

```css

/* ═══════════════════════════════════════════
   LAYER 5: ESCAPE HATCH — .plain
   容器级反开关：取消 Layer 4 的排版语义
   字号/字体仍通过 token 引用
   ═══════════════════════════════════════════ */
.plain h1, .plain h2, .plain h3,
.plain h4, .plain h5, .plain h6,
.plain p,  .plain ul, .plain ol,
.plain li, .plain blockquote {
  all: revert;
  margin: 0;
}
.plain a          { text-decoration: none; color: inherit; font-weight: inherit; }
.plain ul,
.plain ol         { list-style: none; padding: 0; }
.plain blockquote { border: none; font-style: normal; padding: 0; }
```

- [ ] **Step 6: 验证 theme.css 完整性**

运行：
```bash
ls -la theme.css
grep -c ":root" theme.css
grep -c "LAYER" theme.css
grep -c "\-\-text-" theme.css
grep -c "\.plain" theme.css
```

期望输出：
- `theme.css` 存在
- `:root` 出现 ≥ 3 次（Layer 1 / 2 / 3 各一个）
- `LAYER` 出现 5 次
- `--text-` 出现 ≥ 16 次（8 字号 × 2 含 `-lh` 配对）
- `.plain` 出现 ≥ 5 次

- [ ] **Step 7: Commit**

```bash
git add theme.css
git commit -m "feat: add unified theme.css with 5 layers (tokens + global typography + .plain)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: 迁移 index.html

**Files:**
- Modify: `index.html`（`<head>` 引入、`:root` 替换、UI 容器加 `.plain`、组件字号/硬编码色值替换）

**Context:** `index.html` 是温暖小家的 landing page，结构为 `<nav>` + `.hero` + `.section` + `<footer>`。UI 容器（nav、hero、cta、footer）需加 `.plain`，以防 Layer 4 全局排版波及（如下划线链接、段落间距）。动态 JS 生成的卡片容器 `.cards` 也加 `.plain`。

- [ ] **Step 1: 在 `<head>` 引入 theme.css**

**File:** `index.html` Line 30 附近（`<link rel="manifest" ...>` 之后、`<style>` 之前）

Edit：
```
old_string:
    <link rel="manifest" href="/site.webmanifest">
    <style>

new_string:
    <link rel="manifest" href="/site.webmanifest">
    <link rel="stylesheet" href="/theme.css">
    <style>
```

- [ ] **Step 2: 替换 `:root` 块**

**File:** `index.html` Line 34-43

Edit：
```
old_string:
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

new_string:
        :root {
            /* 本页别名映射到 theme.css token */
            --secondary: var(--warm-400);
            --accent:    var(--warm-300);
            --card-bg:   var(--surface);
        }
```

说明：`--primary/--primary-light/--background/--text-primary/--text-secondary` 继承自 theme.css Layer 2，不需重复声明。

- [ ] **Step 3: 替换 body 的硬编码背景与字号**

**File:** `index.html` Line 46-51

Edit：
```
old_string:
        body {
            font-family: 'Noto Sans SC', system-ui, sans-serif;
            background: linear-gradient(135deg, #FFF8F0 0%, #FFF0E6 100%);
            color: var(--text-primary);
            line-height: 1.6;
        }

new_string:
        body {
            font-family: 'Noto Sans SC', var(--font-sans);
            background: linear-gradient(135deg, var(--warm-50) 0%, var(--warm-100) 100%);
            color: var(--text-primary);
        }
```

说明：删除 `line-height: 1.6`——Layer 4 的 `html { line-height: var(--text-base-lh) }` 已生效（1.7）。

- [ ] **Step 4: 替换 `.logo` 字号**

**File:** `index.html` Line 69-77

Edit：
```
old_string:
        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--primary);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }

new_string:
        .logo {
            font-size: var(--text-xl);
            line-height: var(--text-xl-lh);
            font-weight: var(--font-bold);
            color: var(--primary);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }
```

- [ ] **Step 5: 替换 `.nav-links` 里的字号与字重**

**File:** `index.html` Line 78-89

Edit：
```
old_string:
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        .nav-links a {
            text-decoration: none;
            color: var(--text-primary);
            font-weight: 500;
            transition: color 0.3s;
        }
        .nav-links a:hover { color: var(--primary); }

new_string:
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        .nav-links a {
            text-decoration: none;
            color: var(--text-primary);
            font-weight: var(--font-medium);
            font-size: var(--text-base);
            transition: color 0.3s;
        }
        .nav-links a:hover { color: var(--primary); }
```

- [ ] **Step 6: 替换 `.hero h1` / `.hero p` / `.cta-button` 字号与字重**

**File:** `index.html` Line 97-126

Edit：
```
old_string:
        .hero h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .hero p {
            font-size: 1.35rem;
            color: var(--text-secondary);
            max-width: 700px;
            margin: 0 auto 2.5rem;
        }
        .cta-button {
            display: inline-block;
            background: var(--primary);
            color: white;
            padding: 14px 36px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            box-shadow: 0 8px 20px rgba(255, 140, 66, 0.3);
            transition: all 0.3s ease;
        }
        .cta-button:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 25px rgba(255, 140, 66, 0.4);
        }

new_string:
        .hero h1 {
            font-size: var(--text-4xl);
            line-height: var(--text-4xl-lh);
            font-weight: var(--font-extrabold);
            margin-bottom: 1rem;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .hero p {
            font-size: var(--text-lg);
            line-height: var(--text-lg-lh);
            color: var(--text-secondary);
            max-width: 700px;
            margin: 0 auto 2.5rem;
        }
        .cta-button {
            display: inline-block;
            background: var(--primary);
            color: white;
            padding: 14px 36px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: var(--font-semibold);
            font-size: var(--text-base);
            box-shadow: 0 8px 20px rgba(201,122,58,.30);
            transition: all 0.3s ease;
        }
        .cta-button:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 25px rgba(201,122,58,.40);
        }
```

说明：Hero 原 3.5rem（≈56px）降为 `--text-4xl`（桌面 40px）——此为主动选择，视觉与其他页面拉齐。

- [ ] **Step 7: 替换 `.section-title` / `.card h3` / `.card p` / `.card-link` 字号与字重**

**File:** `index.html` Line 133-181

Edit：
```
old_string:
        .section-title {
            text-align: center;
            font-size: 2.2rem;
            margin-bottom: 3rem;
        }

new_string:
        .section-title {
            text-align: center;
            font-size: var(--text-3xl);
            line-height: var(--text-3xl-lh);
            font-weight: var(--font-bold);
            margin-bottom: 3rem;
        }
```

Edit：
```
old_string:
        .card h3 {
            font-size: 1.5rem;
            margin-bottom: 0.8rem;
        }
        .card p {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
        }
        .card-link {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

new_string:
        .card h3 {
            font-size: var(--text-xl);
            line-height: var(--text-xl-lh);
            font-weight: var(--font-semibold);
            margin-bottom: 0.8rem;
        }
        .card p {
            font-size: var(--text-base);
            line-height: var(--text-base-lh);
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
        }
        .card-link {
            color: var(--primary);
            text-decoration: none;
            font-weight: var(--font-semibold);
            font-size: var(--text-base);
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
```

`.card-image` 的 `font-size: 4.5rem` 是 emoji 装饰性尺寸，保留不改（emoji 视为图标，非文字排版）。

- [ ] **Step 8: 替换 `footer` 硬编码色值**

**File:** `index.html` Line 182-188

Edit：
```
old_string:
        footer {
            background: #2C2C2C;
            color: #ddd;
            text-align: center;
            padding: 3rem 2rem;
            margin-top: 4rem;
        }

new_string:
        footer {
            background: var(--neutral-800);
            color: var(--neutral-300);
            font-size: var(--text-sm);
            line-height: var(--text-sm-lh);
            text-align: center;
            padding: 3rem 2rem;
            margin-top: 4rem;
        }
```

- [ ] **Step 9: 删除移动端 media query 里的 hero h1 硬编码（clamp 已接管）**

**File:** `index.html` Line 189-192

Edit：
```
old_string:
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.8rem; }
            .nav-links { gap: 1rem; font-size: 0.95rem; }
        }

new_string:
        @media (max-width: 768px) {
            .nav-links { gap: 1rem; font-size: var(--text-sm); }
        }
```

说明：`--text-4xl` 的 clamp 已处理移动端字号（最小 30px），无需 media query 覆盖。

- [ ] **Step 10: 为 UI 容器添加 `class="plain"`**

**File:** `index.html` Line 198-207（`<nav>`）

Edit：
```
old_string:
    <!-- 导航栏 -->
    <nav>
        <div class="nav-container">

new_string:
    <!-- 导航栏 -->
    <nav class="plain">
        <div class="nav-container">
```

**File:** `index.html` Line 224-227（`<footer>`）

Edit：
```
old_string:
    <footer>
        <p>&copy; <span id="current-year"></span> 温暖小家 | 用心为每个家庭打造快乐时光</p>
        <p style="margin-top: 1rem; font-size: 0.9rem;">所有页面均由大模型辅助生成 · 新增内容只需更新 manifest.json</p>
    </footer>

new_string:
    <footer class="plain">
        <p>&copy; <span id="current-year"></span> 温暖小家 | 用心为每个家庭打造快乐时光</p>
        <p style="margin-top: 1rem; font-size: var(--text-sm);">所有页面均由大模型辅助生成 · 新增内容只需更新 manifest.json</p>
    </footer>
```

**File:** `index.html` Line 217-222（`.section`/`.cards`）——卡片区因 JS 动态插入 `<h3>/<p>/<a>`，需加 `.plain` 避免全局排版影响

Edit：
```
old_string:
    <!-- 动态卡片区 -->
    <section class="section" id="explore">
        <h2 class="section-title">探索家庭灵感与成长故事</h2>
        <div class="cards" id="cards-container">
            <!-- JS 动态生成卡片 -->
        </div>
    </section>

new_string:
    <!-- 动态卡片区 -->
    <section class="section" id="explore">
        <h2 class="section-title">探索家庭灵感与成长故事</h2>
        <div class="cards plain" id="cards-container">
            <!-- JS 动态生成卡片 -->
        </div>
    </section>
```

Hero `<section class="hero">` 保持不加 `.plain`——本身只有一个 h1 + p + a，接受 Layer 4 默认排版（组件 CSS 已覆盖字号/字重）。

- [ ] **Step 11: 验证**

运行：
```bash
# 1. 确认 theme.css 引入
grep -c 'href="/theme.css"' index.html
# 期望：1

# 2. 确认无裸 hex（排除 meta/head）
grep -n "#[0-9a-fA-F]\{6\}" index.html | grep -v 'og:\|twitter:\|canonical\|favicon\|manifest\|image\|png\|ico\|svg\|gstatic\|googleapis'
# 期望：无输出

# 3. 确认 .plain 已加到 UI 容器
grep -c 'class="plain"\|class=".* plain"\|class="plain .*"' index.html
# 期望：≥ 3（nav / footer / cards 容器）

# 4. 确认无裸 px/rem 字号（允许 .card-image 的 4.5rem 作为 emoji 装饰；其他 rem 数量应极少）
grep -nE "font-size: [0-9]+(\.[0-9]+)?(px|rem)" index.html
# 期望：仅剩 .card-image（emoji 装饰，已列入例外）
```

- [ ] **Step 12: 启动服务目视验证**

```bash
# 如未启动
npm run dev
```

访问 `http://localhost:3000/index.html`，确认：
- Logo 颜色为暖棕橙（`--warm-500` ≈ `#C97A3A`）
- Hero h1 渐变可见，字号比原来略小（40px 上限，原 56px）
- 卡片背景白色，阴影正常
- 导航链接无下划线（`.plain` 已关闭 Layer 4 的 `a { text-decoration: underline }`）
- Footer 深色背景 + 浅灰文字
- 移动端（375px 窗口宽度）字号自动缩小（clamp 生效）

- [ ] **Step 13: Commit**

```bash
git add index.html
git commit -m "feat: migrate index.html to theme.css tokens and .plain UI scoping

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: 迁移 positive-discipline-revised-nelsen.html

**Files:**
- Modify: `positive-discipline-revised-nelsen.html`

**Context:** 该页有 18 个 `:root` 变量，页面内 CSS 使用这些本页别名（如 `var(--bg)`、`var(--gold)`）。策略：保留 `:root` 变量名，但色值全部改为引用 theme.css token——这样页面内部其余 CSS 无需修改。字号方面需扫描 `<style>` 中所有 `font-size: <数值>` 并替换为 token 引用。

本页 UI 容器：`<header>`（`.header`）、`.nav`、`.main` 内的 `.anki-*` / `.takeaway-*` / `.chapter-grid` 等都是 UI 复合组件。保守起见，整个 `.main` 和 `.header`、`.nav` 都加 `.plain`。

- [ ] **Step 1: 在 `<head>` 引入 theme.css**

**File:** `positive-discipline-revised-nelsen.html` Line 8（`<link href="https://fonts.googleapis.com/..."` 之后、`<style>` 之前）

Edit：
```
old_string:
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>

new_string:
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/theme.css">
<style>
```

- [ ] **Step 2: 替换 `:root` 块（Line 10-32）**

Edit：
```
old_string:
:root {
  --bg: #F7F3EE;
  --surface: #FFFFFF;
  --surface2: #F2EDE6;
  --primary: #231408;
  --secondary: #6B5A47;
  --muted: #9B8B78;
  --border: #E2D8CC;
  --accent: #8B5E14;
  --accent2: #C4891A;
  --gold: #D4A843;
  --gold-light: #FDF3DC;
  --green: #3A6644;
  --green-light: #EAF2ED;
  --blue: #1C4F7A;
  --blue-light: #E8F2FA;
  --coral: #8B3620;
  --coral-light: #FAF0EC;
  --radius: 10px;
  --radius-lg: 16px;
  --shadow: 0 1px 3px rgba(35,20,8,0.07), 0 4px 16px rgba(35,20,8,0.05);
  --shadow-lg: 0 4px 24px rgba(35,20,8,0.12);
}

new_string:
:root {
  /* 颜色：全部引用 theme.css token */
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
  /* shape / shadow */
  --radius:    var(--radius-md);
  --radius-lg: var(--radius-lg);
  --shadow:    var(--shadow-sm);
  --shadow-lg: var(--shadow-lg);
}
```

说明：删除了本页原 `--surface` 和 `--border` 定义——使用 theme.css Layer 2 提供的同名变量。

- [ ] **Step 3: 替换 body 硬编码字号**

**File:** `positive-discipline-revised-nelsen.html` Line 36-43

Edit：
```
old_string:
body {
  font-family: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
  background: var(--bg);
  color: var(--primary);
  line-height: 1.7;
  font-size: 16px;
  min-height: 100vh;
}

new_string:
body {
  font-family: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
  background: var(--bg);
  color: var(--primary);
  min-height: 100vh;
}
```

说明：删 `line-height: 1.7`（Layer 4 的 html 已设 `var(--text-base-lh)` = 1.7）和 `font-size: 16px`（Layer 4 已设 `var(--text-base)`）。

- [ ] **Step 4: 批量替换组件 CSS 中的硬编码 font-size 与 font-weight**

**Context:** 本页 CSS 块很长（Line 10–约 Line 700+）。通过 grep 扫描所有 `font-size:` 与 `font-weight: <数字>` 出现位置，然后按下表替换。先运行 grep 确认位置：

```bash
grep -nE "font-size: [0-9]+(\.[0-9]+)?(px|rem|em)" positive-discipline-revised-nelsen.html | head -80
grep -nE "font-weight: (300|400|500|600|700|800|900)" positive-discipline-revised-nelsen.html | head -40
```

按以下映射表使用 Edit 工具逐项替换（每项一次 Edit 调用）。**所有替换使用 `replace_all: true`**，因为同样的裸数值可能出现多次：

**font-size 映射表：**

| 裸值 | Token | 示例上下文 |
|---|---|---|
| `font-size: 10px` | `font-size: var(--text-xs)` | `.ctrl-label` 等小标签 |
| `font-size: 11px` | `font-size: var(--text-xs)` | `.header-tag` / `.takeaway-num` 等 |
| `font-size: 12px` | `font-size: var(--text-xs)` | `.header-label` / `.legend-item` 等 |
| `font-size: 13px` | `font-size: var(--text-sm)` | `.anki-card` 等 |
| `font-size: 14px` | `font-size: var(--text-sm)` | `.nav-btn` / `.takeaway-body p` 等 |
| `font-size: 15px` | `font-size: var(--text-sm)` | `.header-sub` / `.takeaway-title` 等 |
| `font-size: 16px` | `font-size: var(--text-base)` | 正文 |
| `font-size: 17px` | `font-size: var(--text-base)` | |
| `font-size: 18px` | `font-size: var(--text-lg)` | |
| `font-size: 20px` | `font-size: var(--text-lg)` | |
| `font-size: 22px` | `font-size: var(--text-xl)` | |
| `font-size: 24px` | `font-size: var(--text-2xl)` | `.section-heading` |
| `font-size: 26px` | `font-size: var(--text-2xl)` | |
| `font-size: 28px` | `font-size: var(--text-3xl)` | |
| `font-size: 32px` | `font-size: var(--text-3xl)` | |
| `font-size: clamp(26px, 5vw, 40px)` | `font-size: var(--text-4xl)` | `.header-title` |

**font-weight 映射表：**

| 裸值 | Token |
|---|---|
| `font-weight: 300` | `font-weight: var(--font-normal)` |
| `font-weight: 400` | `font-weight: var(--font-normal)` |
| `font-weight: 500` | `font-weight: var(--font-medium)` |
| `font-weight: 600` | `font-weight: var(--font-semibold)` |
| `font-weight: 700` | `font-weight: var(--font-bold)` |
| `font-weight: 800` | `font-weight: var(--font-extrabold)` |

**执行方式：** 对映射表中每一行，使用 Edit 工具执行一次 `replace_all: true` 替换。即，总共约 22 次 Edit 调用（16 个 font-size + 6 个 font-weight）。

- [ ] **Step 5: 凡出现 font-size token 的声明块，追加配套 line-height**

运行：
```bash
grep -n "font-size: var(--text-" positive-discipline-revised-nelsen.html | head -40
```

对每个匹配行，在紧跟其后追加 `line-height: var(--text-<档位>-lh);`。以最常见的几个类为例：

**示例 Edit：**
```
old_string:
.section-heading {
  font-family: 'Noto Serif SC', serif;
  font-size: var(--text-2xl); font-weight: var(--font-semibold); color: var(--primary);
  margin-bottom: 8px;
}

new_string:
.section-heading {
  font-family: 'Noto Serif SC', serif;
  font-size: var(--text-2xl); line-height: var(--text-2xl-lh);
  font-weight: var(--font-semibold); color: var(--primary);
  margin-bottom: 8px;
}
```

**注意：** 本页选择器极多（≈150 个），line-height 只需加到"主要文字"类上（如 `.header-title`、`.section-heading`、`.takeaway-title`、`.anki-card-front`、`.chapter-title`、`.nav-btn`、正文 `p` 类）。装饰性小标签（`.header-tag` 等）行高用默认即可。使用经验判断——若原选择器声明块已有 `line-height:` 则保留或替换；若无且为文字主体，则补上。

列出需要检视并补 line-height 的关键选择器（**至少**处理这些）：
- `.header-title`
- `.header-sub`
- `.section-heading`
- `.section-desc`
- `.takeaway-title`
- `.takeaway-body p`
- `.chapter-title`（如果存在）
- `.anki-card` 主体
- `.nav-btn`

- [ ] **Step 6: 替换硬编码 rgba/hex 色值（非 `:root`、非分类标签）**

运行：
```bash
grep -nE "#[0-9a-fA-F]{3,6}\b" positive-discipline-revised-nelsen.html | grep -v "^[0-9]*:<\|href\|og:\|twitter\|canonical\|favicon\|manifest\|fonts\.g" | head -40
```

按出现情况逐一 Edit 替换。典型案例：

| 旧 | 新 |
|---|---|
| `color: #F7F3EE` | `color: var(--neutral-50)` |
| `background: #F7F3EE` | `background: var(--neutral-50)` |
| `rgba(247,243,238,0.65)` | 保持，注释来自 neutral-50 |
| `rgba(247,243,238,0.75)` | 保持 |
| `rgba(212,168,67,0.4)` | `rgba(196,137,26,.40)` *(gold-500 RGB=196,137,26)* |
| `rgba(196,137,26,...)` | 保持（已对齐 gold-500） |

**已知例外保留：** `.t-purple/.t-teal/.t-coral/.t-amber/.t-blue` 分类标签色块（Line 151-155）是装饰标签色，保留硬编码。

- [ ] **Step 7: 为 UI 容器添加 `class="plain"`**

**File:** 在 `<body>` 内定位主要容器。运行：
```bash
grep -n "<header\|<nav\|<main\|<footer" positive-discipline-revised-nelsen.html | head -10
```

对找到的 `<header class="header">`、`<nav class="nav">`、`<main class="main">` 依次追加 `plain`：

示例 Edit：
```
old_string: <header class="header">
new_string: <header class="header plain">
```

```
old_string: <nav class="nav">
new_string: <nav class="nav plain">
```

```
old_string: <main class="main">
new_string: <main class="main plain">
```

说明：本页几乎全是 UI 组件（知识图、卡片、Anki、takeaways），整体加 `.plain` 避免全局排版影响。若将来添加"章节正文阅读视图"作为独立容器，可在那个容器上去掉 `plain` 以享受 Layer 4 默认排版。

- [ ] **Step 8: 验证**

```bash
# 1. theme.css 引入
grep -c 'href="/theme.css"' positive-discipline-revised-nelsen.html
# 期望：1

# 2. UI 容器已加 plain
grep -c 'class=".*plain' positive-discipline-revised-nelsen.html
# 期望：≥ 3

# 3. 无裸 font-size 数字（除已知例外）
grep -nE "font-size: [0-9]+(\.[0-9]+)?(px|rem)" positive-discipline-revised-nelsen.html
# 期望：无输出（或仅剩 emoji/icon 场景）

# 4. 无裸 font-weight 数字
grep -nE "font-weight: (300|400|500|600|700|800|900)" positive-discipline-revised-nelsen.html
# 期望：无输出

# 5. 无 :root 外的裸 hex（分类标签除外）
grep -nE "#[0-9a-fA-F]{6}" positive-discipline-revised-nelsen.html | \
  grep -v "og:\|twitter\|canonical\|favicon\|manifest\|fonts\.g\|image" | \
  grep -v "\.t-purple\|\.t-teal\|\.t-coral\|\.t-amber\|\.t-blue"
# 期望：无输出
```

- [ ] **Step 9: 目视验证**

访问 `http://localhost:3000/positive-discipline-revised-nelsen.html`，确认：
- Header 深棕背景 + 金色标签文字
- 卡片分类色（金/绿/蓝/珊瑚）正常
- 导航栏链接无下划线（`.plain` 生效）
- 章节标题字号比原来略大，字重 `--font-semibold`
- 桌面宽屏 / 移动端 375px 均无溢出

- [ ] **Step 10: Commit**

```bash
git add positive-discipline-revised-nelsen.html
git commit -m "feat: migrate positive-discipline page to theme.css tokens and .plain UI scoping

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: 迁移 taoteching-silk.html

**Files:**
- Modify: `taoteching-silk.html`

**Context:** 深色丝绸古风页面。需要覆盖 Layer 2 语义 token（背景/文字变暗），保留分类色（道/德/政/辩/修）作为页面专属已知例外。主容器加 `.plain`；每章 `.chapter` 内的经文/注释**不加** `.plain`——作为文章型正文继承 Layer 4 全局排版（此为产品决定，使 `<p>` 段落自动获得 1.7 行高和段间距）。

- [ ] **Step 1: 在 `<head>` 引入 theme.css**

**File:** `taoteching-silk.html` Line 10

Edit：
```
old_string:
<link rel="canonical" href="https://aigc.jogiter.cn/taoteching-silk.html">
<style>

new_string:
<link rel="canonical" href="https://aigc.jogiter.cn/taoteching-silk.html">
<link rel="stylesheet" href="/theme.css">
<style>
```

- [ ] **Step 2: 替换 `:root` 块（Line 13-46）**

Edit：
```
old_string:
:root {
  --bg:        #0d0d0b;
  --bg2:       #131310;
  --bg3:       #1a1a16;
  --bg4:       #222220;
  --gold:      #c9a84c;
  --gold-lt:   #e4c97e;
  --gold-dk:   #8c6d2a;
  --ink:       #f0ead8;
  --ink2:      #b8b09a;
  --ink3:      #6e6858;
  --border:    rgba(201,168,76,0.15);
  --border2:   rgba(201,168,76,0.30);

  --dao-bg:    rgba(99,80,32,0.18);
  --dao-txt:   #e4c97e;
  --dao-bdr:   rgba(201,168,76,0.35);

  --de-bg:     rgba(32,72,52,0.22);
  --de-txt:    #7ecfa8;
  --de-bdr:    rgba(40,140,90,0.35);

  --pol-bg:    rgba(80,40,20,0.22);
  --pol-txt:   #e0a060;
  --pol-bdr:   rgba(180,90,30,0.35);

  --dial-bg:   rgba(50,30,70,0.22);
  --dial-txt:  #c09ee0;
  --dial-bdr:  rgba(130,70,180,0.35);

  --xiu-bg:    rgba(20,55,80,0.22);
  --xiu-txt:   #70b8e0;
  --xiu-bdr:   rgba(40,120,190,0.35);
}

new_string:
:root {
  /* 深色丝绸主题：覆盖 theme.css Layer 2 语义 token */
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

  /* 本页别名（供原有 CSS 继续使用） */
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

  /* 分类颜色（页面专属，已知例外） */
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

说明：原 `rgba(201,168,76,...)` 基于旧 gold `#C9A84C`；新 theme.css 统一 gold 为 `#C4891A` = RGB(196,137,26)，透明变体相应更新。

- [ ] **Step 3: 替换 body 硬编码字号**

**File:** `taoteching-silk.html` Line 50-57

Edit：
```
old_string:
body {
  background: var(--bg);
  color: var(--ink);
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 14px;
  line-height: 1.7;
  min-height: 100vh;
}

new_string:
body {
  background: var(--bg);
  color: var(--ink);
  font-family: 'Noto Sans SC', sans-serif;
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
  min-height: 100vh;
}
```

说明：本页原 body 字号 14px 是整页基准（UI 密集）；保持 14px 语义改为 `--text-sm` 引用。

- [ ] **Step 4: 批量替换 font-size 与 font-weight**

扫描：
```bash
grep -nE "font-size: [0-9]+(\.[0-9]+)?(px|rem)" taoteching-silk.html
grep -nE "font-weight: (300|400|500|600|700|800)" taoteching-silk.html
```

按下列映射用 Edit（`replace_all: true`）逐条替换。**至少**处理以下映射：

**font-size 映射：**

| 裸值 | Token |
|---|---|
| `font-size: 10px` | `font-size: var(--text-xs)` |
| `font-size: 11px` | `font-size: var(--text-xs)` |
| `font-size: 12px` | `font-size: var(--text-xs)` |
| `font-size: 13px` | `font-size: var(--text-sm)` |
| `font-size: 14px` | `font-size: var(--text-sm)` |
| `font-size: 15px` | `font-size: var(--text-sm)` |
| `font-size: 16px` | `font-size: var(--text-base)` |
| `font-size: 18px` | `font-size: var(--text-lg)` |
| `font-size: 20px` | `font-size: var(--text-lg)` |
| `font-size: 22px` | `font-size: var(--text-xl)` |
| `font-size: 24px` | `font-size: var(--text-2xl)` |
| `font-size: 26px` | `font-size: var(--text-2xl)` |
| `font-size: 28px` | `font-size: var(--text-3xl)` |
| `font-size: 32px` | `font-size: var(--text-3xl)` |
| `font-size: 36px` | `font-size: var(--text-4xl)` |
| `font-size: 40px` | `font-size: var(--text-4xl)` |
| `font-size: 42px` | `font-size: var(--text-4xl)` |

**font-weight 映射：**

| 裸值 | Token |
|---|---|
| `font-weight: 300` | `font-weight: var(--font-normal)` |
| `font-weight: 400` | `font-weight: var(--font-normal)` |
| `font-weight: 500` | `font-weight: var(--font-medium)` |
| `font-weight: 600` | `font-weight: var(--font-semibold)` |
| `font-weight: 700` | `font-weight: var(--font-bold)` |

**注：** 体面的 `font-size: inherit` / `font-size: 0.875em`（em 相对单位）**不替换**，属于刻意相对引用。

- [ ] **Step 5: 给关键文字类补配套 line-height**

关键类（至少处理）：
- `.header-title`（Line 91）
- `.header-sub`（Line 101）
- `.header-eyebrow`（Line 80）
- `.chapter-title`（grep 确认存在）
- 每章节正文段落（若有独立类名）

示例 Edit：
```
old_string:
.header-title {
  font-family: 'Noto Serif SC', serif;
  font-size: var(--text-4xl);
  font-weight: var(--font-semibold);
  color: var(--gold-lt);
  letter-spacing: 0.12em;
  line-height: 1.2;
  margin-bottom: 6px;
}

new_string:
.header-title {
  font-family: 'Noto Serif SC', serif;
  font-size: var(--text-4xl);
  line-height: var(--text-4xl-lh);
  font-weight: var(--font-semibold);
  color: var(--gold-lt);
  letter-spacing: 0.12em;
  margin-bottom: 6px;
}
```

- [ ] **Step 6: 替换遗留硬编码 rgba/hex 色值**

运行：
```bash
grep -nE "rgba\(201,168,76" taoteching-silk.html
```

对每处使用 Edit 替换为 `rgba(196,137,26,...)`（保持 alpha 不变）。典型的 `rgba(201,168,76,0.025)` → `rgba(196,137,26,.025)` 等（Line 65-66 背景纹样）。

- [ ] **Step 7: 为 UI 主容器加 `.plain`**

扫描主容器：
```bash
grep -n "<header\|<main\|<footer" taoteching-silk.html | head -6
```

Edit：
```
old_string: <header>
new_string: <header class="plain">
```

```
old_string: <main>
new_string: <main class="plain">
```

（若页面有 `<footer>` 同样处理）

**重要：** 每章 `.chapter` 容器**不**加 `.plain`——让经文/注释的 `<p>` 继承 Layer 4 的段间距与行高。若观察到主容器内部某些 UI 子组件（如控制栏、标签、切换器）被全局排版干扰，给这些子组件**单独**补 `class="plain"`。

- [ ] **Step 8: 验证**

```bash
# theme.css 引入
grep -c 'href="/theme.css"' taoteching-silk.html  # 期望：1
# UI 容器 plain
grep -c 'class=".*plain' taoteching-silk.html     # 期望：≥ 2
# 无裸字号（分类 txt 保留）
grep -nE "font-size: [0-9]+(\.[0-9]+)?(px|rem)" taoteching-silk.html
# 期望：无输出
# 无裸 font-weight
grep -nE "font-weight: (300|400|500|600|700|800)" taoteching-silk.html
# 期望：无输出
# 只剩已知例外色
grep -nE "#[0-9a-fA-F]{6}" taoteching-silk.html | grep -v "fonts\.g\|canonical\|og:\|twitter"
# 期望：仅剩 --bg4 / --dao-txt / --de-txt / --pol-txt / --dial-txt / --xiu-txt / --primary-light
```

- [ ] **Step 9: 目视验证**

访问 `http://localhost:3000/taoteching-silk.html`，确认：
- 深色背景（近黑）
- 金色大标题、章节标题字号自然
- 分类标签（道/德/政/辩/修）颜色正常
- 经文段落有宽松行高与段间距（Layer 4 作用于 `.chapter` 内的 `<p>`）
- 移动端 375px 标题不溢出

- [ ] **Step 10: Commit**

```bash
git add taoteching-silk.html
git commit -m "feat: migrate taoteching-silk page to theme.css tokens and .plain UI scoping

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 5: 迁移 dual-track-6y.html

**Files:**
- Modify: `dual-track-6y.html`

**Context:** 整页是 Material Design 卡片/时间线/三主题切换器的复合 UI，没有"文章型"正文区。策略：**整个 `<body>` 挂 `.plain`**（或在最外层主容器挂），所有文字字号通过组件 CSS 显式引用 token。`:root` 的 shape/shadow 改引 theme.css token；`[data-theme]` 三套主题色值保留（主题切换器工作依赖）。

- [ ] **Step 1: 在 `<head>` 引入 theme.css**

**File:** `dual-track-6y.html` Line 14

Edit：
```
old_string:
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>

new_string:
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/theme.css">
<style>
```

- [ ] **Step 2: 替换 `:root` 块（Line 21-29）**

Edit：
```
old_string:
:root {
  --md-shape-sm:   8px;
  --md-shape-md:  12px;
  --md-shape-lg:  16px;
  --md-shape-xl:  24px;
  --md-elev-1: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06);
  --md-elev-2: 0 3px 8px rgba(0,0,0,.09), 0 1px 3px rgba(0,0,0,.07);
  --transition: .22s cubic-bezier(.4,0,.2,1);
}

new_string:
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

说明：`--radius-sm: 6px` vs 旧 `8px`；`--radius-md: 10px` vs 旧 `12px`——视觉变化 ≤ 2px，可接受。

- [ ] **Step 3: 替换 body 硬编码 line-height**

定位：
```bash
grep -n "^body " dual-track-6y.html
```

Edit（根据 Line 120-127）：
```
old_string:
body {
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: var(--bg);
  color: var(--on-surface);
  min-height: 100vh;
  line-height: 1.7;
  transition: background var(--transition), color var(--transition);
}

new_string:
body {
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: var(--bg);
  color: var(--on-surface);
  min-height: 100vh;
  transition: background var(--transition), color var(--transition);
}
```

说明：删 `line-height: 1.7`（Layer 4 的 html 已设）。

- [ ] **Step 4: 批量替换 font-size 与 font-weight**

扫描：
```bash
grep -nE "font-size: [0-9]+(\.[0-9]+)?(px|rem)" dual-track-6y.html
grep -nE "font-weight: (300|400|500|600|700|800)" dual-track-6y.html
```

使用同 Task 3/4 的映射表（`replace_all: true`）依次 Edit。裸 em 值（如 `font-size: 0.875em`）保留。

- [ ] **Step 5: 关键文字类补配套 line-height**

关键类（至少处理）：
- `.theme-panel-title`
- `.header-title`（如果存在）
- 时间线节点、卡片标题等主要文字

处理方式同 Task 3 Step 5。

- [ ] **Step 6: 整个 `<body>` 加 `class="plain"`**

**File:** `dual-track-6y.html`，找到 `<body>` 开标签

```bash
grep -n "^<body" dual-track-6y.html
```

Edit：
```
old_string: <body data-theme="coral">
new_string: <body data-theme="coral" class="plain">
```

（若 body 初始属性不同，按实际 `<body ...>` 修改）

**重要：** 若将来在此页加"文章型阅读区"，给那个独立子容器显式去掉 `plain`（通过再嵌一个不带 plain 的子容器）。

- [ ] **Step 7: 验证**

```bash
# theme.css 引入
grep -c 'href="/theme.css"' dual-track-6y.html  # 期望：1
# body plain
grep -c '<body[^>]*class="plain' dual-track-6y.html  # 期望：1
# 无裸字号
grep -nE "font-size: [0-9]+(\.[0-9]+)?(px|rem)" dual-track-6y.html  # 期望：无输出
# 无裸 font-weight
grep -nE "font-weight: (300|400|500|600|700|800)" dual-track-6y.html  # 期望：无输出
# :root 非硬编码（原 --md-shape/--md-elev 已转引用）
grep -nE "#[0-9a-fA-F]{6}" dual-track-6y.html | grep "\-\-md-"  # 期望：无输出
```

说明：`[data-theme]` 块内主题色值和 `.swatch` 内联色值是主题预览用途，列入已知例外，不要试图替换。

- [ ] **Step 8: 目视验证**

访问 `http://localhost:3000/dual-track-6y.html`，确认：
- 默认主题（珊瑚）加载正常
- 右下角主题切换浮动按钮可点击，三套主题切换正常
- 所有卡片圆角、阴影正常
- 时间线节点、标签字号通过 token 生效
- 移动端无溢出

- [ ] **Step 9: Commit**

```bash
git add dual-track-6y.html
git commit -m "feat: migrate dual-track-6y page to theme.css tokens with full body .plain

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 6: 最终验证

**Files:** 无新修改，仅做全局验证

- [ ] **Step 1: 四个 HTML 全部引入 theme.css**

```bash
grep -l 'href="/theme.css"' *.html
```

期望输出（4 个文件）：
```
dual-track-6y.html
index.html
positive-discipline-revised-nelsen.html
taoteching-silk.html
```

- [ ] **Step 2: 四个页面 `<style>` 块内无裸 px/rem 字号**

```bash
for f in index.html dual-track-6y.html taoteching-silk.html positive-discipline-revised-nelsen.html; do
  echo "=== $f ==="
  grep -nE "font-size: [0-9]+(\.[0-9]+)?(px|rem)" "$f"
done
```

期望：四个文件均无输出（或仅 `index.html` 的 `.card-image { font-size: 4.5rem }` emoji 装饰例外）。

- [ ] **Step 3: 四个页面无裸 font-weight 数字**

```bash
for f in index.html dual-track-6y.html taoteching-silk.html positive-discipline-revised-nelsen.html; do
  echo "=== $f ==="
  grep -nE "font-weight: (300|400|500|600|700|800|900)" "$f"
done
```

期望：四个文件均无输出。

- [ ] **Step 4: 四个页面 CSS 区无裸 hex（已知例外除外）**

```bash
for f in index.html dual-track-6y.html taoteching-silk.html positive-discipline-revised-nelsen.html; do
  echo "=== $f ==="
  grep -nE "#[0-9a-fA-F]{6}" "$f" | \
    grep -v 'og:\|twitter\|canonical\|favicon\|manifest\|fonts\.g\|image\|\.png\|\.ico\|\.svg'
done
```

期望：
- `index.html`：无输出
- `positive-discipline-revised-nelsen.html`：仅剩 `.t-purple/.t-teal/.t-coral/.t-amber/.t-blue` 分类标签 5 对（共 10 行）
- `taoteching-silk.html`：仅剩分类 txt 色 5 个 + `--bg4: #222220` + `--primary-light: #e4c97e` + `--surface/surface-2` 深色值
- `dual-track-6y.html`：仅剩 `[data-theme]` 块内三套主题色与 swatch

- [ ] **Step 5: 启动服务四页面逐一目视验证**

```bash
# 如未启动
npm run dev
```

依次访问：
- `http://localhost:3000/` — 暖橙 landing，hero 渐变标题
- `http://localhost:3000/dual-track-6y.html` — 三主题切换均正常
- `http://localhost:3000/taoteching-silk.html` — 深色古风，经文正文段间距舒适
- `http://localhost:3000/positive-discipline-revised-nelsen.html` — 米棕书卷，分类卡片色正常

**每个页面检查：**
- 桌面宽屏（1440px）不溢出、字号合理
- 移动端窗口 375px 宽 hero/标题自动缩小（clamp 生效），不破版
- UI 区链接无意外下划线（`.plain` 生效）
- 正文区（若有）段落有宽松行高（Layer 4 生效）

- [ ] **Step 6: 最终状态检查与提交**

```bash
git status
# 若有未提交的零星修改（如 .gitignore），逐一确认后提交
```

---

## Self-Review 记录

- **Spec coverage:** 五层结构、中文友好 scale、clamp 流体、每字号配套行高、字重 token、字体族 token、取消 `.prose`、`.plain` 反开关、四页迁移策略、已知例外清单——均有对应 Task 覆盖
- **Placeholder scan:** 无 TBD/TODO/implement later
- **Type consistency:** token 命名 `--text-*` / `--text-*-lh` / `--font-*` / `--radius-*` / `--shadow-*` 跨 Task 一致
- **已知风险:** Task 3（positive-discipline）和 Task 4（taoteching）的批量 font-size 替换需要多次 Edit 调用，建议执行者先 grep 确认每个裸数值实际出现的行数再按映射表精准替换；font-weight 替换因数值较少（5-6 种）比较可控

## 后续

Plan 完成后可调用 `superpowers:executing-plans` 或 `superpowers:subagent-driven-development` 执行。
