# 统一主题与排版系统设计文档（v2）

**日期：** 2026-04-20（v2 修订于 2026-04-24）
**状态：** 待实施
**版本说明：** v2 扩展 v1 的排版设计：将原 `.prose` opt-in 模式改为"全页统一 + 全局排版规则 + `.plain` 反向开关"，并引入中文友好的流体字号 scale。

---

## 目标

将当前四个独立 HTML 页面中分散的 CSS 颜色变量与字号设置归拢到单一 `theme.css` 文件，建立统一的设计 token 体系。新版采用 **Tailwind CSS Typography 风格** 的全局默认排版，所有页面的文字（正文、UI、装饰）字号统一通过 token 引用，达成跨页面视觉度量衡一致。

---

## 文件结构

```
aigc-pages/
├── theme.css                          # 单一主题 + 排版系统
├── index.html
├── dual-track-6y.html
├── taoteching-silk.html
└── positive-discipline-revised-nelsen.html
```

所有 HTML 页面在 `<head>` 最前面引入：

```html
<link rel="stylesheet" href="/theme.css">
```

---

## theme.css 五层结构

### Layer 1：Primitive Tokens（原始色阶 / 圆角 / 阴影）

温暖自然系调色板，为整个系统提供唯一色值来源。

```css
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

### Layer 2：Semantic Color Tokens（颜色语义映射）

默认浅色主题映射。页面可在自己的 `:root` 覆盖。

```css
:root {
  --background:     var(--neutral-50);
  --surface:        var(--neutral-0);
  --surface-2:      var(--neutral-100);
  --primary:        var(--warm-500);
  --primary-light:  var(--warm-300);
  --on-primary:     var(--neutral-0);
  --text-primary:   var(--neutral-700);
  --text-secondary: var(--neutral-500);
  --text-muted:     var(--neutral-400);
  --border:         var(--neutral-200);
  --outline:        var(--neutral-300);
}
```

### Layer 3：Typography Tokens（字号 / 行高 / 字重 / 字体族）

**设计要点：**
- 字号采用 `clamp()` 流体响应式，无 media query
- 中文友好 scale：`base=17px`，适合中文阅读密度
- 每个字号 token 配套一个 `--text-*-lh` 行高 token（显式配对约定）
- 字体族允许页面覆盖（保留各页特色）

```css
:root {
  /* 字号 + 配套行高（clamp 流体） */
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

**使用约定：**
- 引用字号时成对引用行高：`font-size: var(--text-base); line-height: var(--text-base-lh);`
- 不使用 `font` shorthand（会重置 family/weight，风险大）
- 字号 token 内部的 clamp min/max 是实现细节，业务 CSS 不允许出现裸 px/rem 字号

### Layer 4：Global Type Rules（全局排版规则）

取代 v1 的 `.prose` 类。所有 HTML 页面引入 theme.css 后，`html/body/h1–h6/p/ul/ol/li/a/strong/blockquote/code/pre/table/hr/img` 自动获得 Tailwind Typography 风格的默认样式。

```css
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

/* 段落/列表 */
p  { margin: 1.25em 0; }
ul { list-style: disc; padding-left: 1.625em; margin: 1.25em 0; }
ol { list-style: decimal; padding-left: 1.625em; margin: 1.25em 0; }
li { margin: 0.5em 0; }
ul > li::marker,
ol > li::marker { color: var(--text-muted); }

/* 行内元素 */
strong     { font-weight: var(--font-semibold); color: inherit; }
a          { color: var(--primary); text-decoration: underline;
             text-underline-offset: 0.15em; font-weight: var(--font-medium); }
a:hover    { color: var(--primary-light); }

blockquote { border-left: 0.25rem solid var(--primary);
             padding-left: 1em; margin: 1.6em 0;
             font-style: italic; color: var(--text-secondary); }

/* 代码 */
code       { font-family: var(--font-mono); font-size: 0.875em;
             font-weight: var(--font-semibold);
             background: var(--surface-2); padding: 0.2em 0.4em;
             border-radius: var(--radius-sm); }
pre        { background: var(--neutral-800); color: var(--neutral-100);
             padding: 1em 1.2em; border-radius: var(--radius-md);
             overflow-x: auto; margin: 1.75em 0;
             font-size: var(--text-sm); line-height: 1.71; }
pre code   { background: transparent; padding: 0;
             font-weight: var(--font-normal); color: inherit; }

/* 表格 */
table      { width: 100%; border-collapse: collapse; margin: 2em 0;
             font-size: var(--text-sm); }
thead th   { background: var(--surface-2); font-weight: var(--font-semibold);
             padding: 0.6em 0.9em; border-bottom: 1px solid var(--border);
             text-align: left; }
tbody tr   { border-bottom: 1px solid var(--border); }
tbody td   { padding: 0.6em 0.9em; }

/* 分隔与图片 */
hr         { border: none; border-top: 1px solid var(--border); margin: 3em 0; }
img        { max-width: 100%; border-radius: var(--radius-md); }
```

### Layer 5：Escape Hatch — `.plain`（反向开关）

容器加 `class="plain"` 后，内部基础排版规则被取消，供 UI 区使用（导航、按钮组、卡片、footer 等）。

```css
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

**使用原则：**
- `.plain` 是 **容器级** 开关，加在 UI 组件最外层
- `.plain` 内部若仍需特定排版，由组件自己的 CSS 显式定义
- 字号仍需引用 `--text-*` token（`.plain` 只取消排版语义，不取消字号度量衡）

---

## 各页面迁移策略

### `index.html`

- 删除现有 `:root` 中 `--primary/--primary-light/--background/--text-primary/--text-secondary`（由 theme.css Layer 2 提供）
- 保留并映射：`--secondary: var(--warm-400)`、`--accent: var(--warm-300)`、`--card-bg: var(--surface)`
- `<header>`、`<nav>`、`.cta-button`、`<footer>` 加 `class="plain"`
- Hero 区的渐变大标题 `.hero h1`：组件 CSS 显式引用 `var(--text-4xl)` + `var(--text-4xl-lh)` + `var(--font-extrabold)`；自有渐变色保留
- 内容介绍区不加 `.plain`，继承全局排版
- 硬编码色值按 v1 Task 2 迁移

### `positive-discipline-revised-nelsen.html`

- 保留 `:root` 结构，18 个变量的色值全部改为引用 theme.css token
- `<header>`、`.nav`、`.toc`、`.chapter-grid` 卡片列表、`<footer>` 加 `class="plain"`
- 卡片内的装饰性章节标题：在卡片组件 CSS 里显式定义字号/字重/字体（因容器是 `.plain`）
- 未来展开章节的阅读视图不加 `.plain`，自动获得 Tailwind Typography 风格

### `taoteching-silk.html`

- 覆盖 Layer 2 颜色语义为深色丝绸主题（按 v1 Task 4 的方式）
- 主容器（包裹章节索引、UI）加 `.plain`
- 每章 `.chapter` 内的经文/注释正文区 **不加** `.plain`，作为内容区继承全局排版
- 章节大标题（书法风格）：`.chapter-title` CSS 显式指定 `font-family: var(--font-serif)` + `var(--text-4xl)` + 自定义字重
- 分类标签（道/德/政/辩/修）保留硬编码 rgba 文字色（已记入例外清单）

### `dual-track-6y.html`

- 整页为 Material Design 卡片/时间线/主题切换器复合 UI，**整页 `.plain`**
- 所有文字字号通过组件 CSS 显式引用 `--text-*` token 重写
- `:root` 中 `--md-shape-*` 改为引用 theme.css `--radius-*`；`--md-elev-*` 改为引用 `--shadow-*`
- `[data-theme]` 主题切换器逻辑不变，仅色值来源改为 theme token
- 主题切换器 swatch 内联色值保留（作为主题预览色，属已知例外）

---

## 约束与边界

- `theme.css` 仅包含 Layer 1–5；不包含布局、组件类（除 `.plain`）
- 各页面组件样式继续内联在 `<style>` 中，通过 `var(--*)` 引用
- 不引入构建工具，保持纯静态部署兼容性
- 现有 `dual-track-6y.html` 的主题切换功能不做破坏性修改
- 字体族允许组件局部声明特殊字体（如 `taoteching-silk` 的古风书法）；字号、字重必须引用 token

---

## 成功标准

1. 所有页面 `<head>` 引入 `theme.css`
2. 四个页面中不存在直接的硬编码色值（`#xxxxxx`），全部通过 token 变量引用；需要透明度时允许 `rgba()` 形式但基础色须来自 primitive token
3. 四个页面 `<style>` 块中不存在裸 `font-size: <px/rem>` 值（仅允许 `var(--text-*)`）
4. 四个页面不存在裸 `line-height` 数字（必须配对引用 `--text-*-lh`）
5. 字重仅通过 `var(--font-*)` 引用，裸数字仅允许在 token 定义处
6. `npm run dev` 启动后四个页面在桌面（1440px）与移动端（375px）均可读，hero/装饰大字无溢出
7. 视觉与迁移前无肉眼可见退步（字体族与装饰风格保留各页特色）

---

## 已知例外（允许硬编码）

- `taoteching-silk.html` 分类标签文字色（`#e4c97e`、`#7ecfa8` 等五种）：高度特化的页面色，无对应 primitive token
- `taoteching-silk.html` `--bg4: #222220`：深色叠加层色
- `dual-track-6y.html` `[data-theme]` 块内的三套主题色值 + 主题切换器 swatch 内联色：作为主题预览用途保留

---

## 与 v1 的差异小结

| 维度 | v1 | v2 |
|---|---|---|
| 排版入口 | `.prose` opt-in 类 | 全局默认 + `.plain` 反向开关 |
| 字号 scale | 仅 `.prose-sm/.prose/.prose-lg` 三档 | `--text-xs` → `--text-4xl` 共 8 档 |
| 字号基准 | 16px | 17px（中文友好） |
| 响应式 | 无 | `clamp()` 流体 |
| 行高 | `.prose` 内固定 1.75 | 每字号自带配套 `--text-*-lh` |
| 字重 token | 无 | `--font-normal` → `--font-extrabold` 5 档 |
| 字体族 token | 无 | `--font-sans/serif/mono` 三栈 |

---

## 后续步骤

由 `superpowers:writing-plans` 技能根据本 spec 生成新的 Implementation Plan，覆盖 `docs/superpowers/plans/2026-04-20-unified-theme-typography.md`。
