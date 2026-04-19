# 统一主题与排版系统设计文档

**日期：** 2026-04-20  
**状态：** 待实施

---

## 目标

将当前四个独立 HTML 页面中分散的 CSS 颜色变量归拢到单一 `theme.css` 文件，建立统一的设计 token 体系，并为所有页面提供基于 `@tailwindcss/typography` 风格的默认排版。

---

## 文件结构

```
aigc-pages/
├── theme.css                          # 新增：全局主题 + 排版
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

## theme.css 三层结构

### Layer 1：Primitive Tokens（原始色阶）

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

### Layer 2：Semantic Tokens（语义映射）

默认映射，页面可在自己的 `:root` 中覆盖。

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

### Layer 3：Typography（`.prose` 排版）

参考 `@tailwindcss/typography`，作用域限定在 `.prose` 内，不污染全局样式。

覆盖范围：

| 元素 | 处理方式 |
|------|---------|
| `p` | 行高 1.75，颜色 `--text-primary`，段间距 `1.25em` |
| `h1–h6` | 字重 700，颜色 `--text-primary`，下边距 `0.5em` |
| `a` | 颜色 `--primary`，hover 下划线 |
| `ul / ol` | 缩进 `1.5em`，列表符号颜色 `--text-muted` |
| `blockquote` | 左边框 `--primary`，斜体，颜色 `--text-secondary` |
| `code` (inline) | 背景 `--surface-2`，圆角 `--radius-sm`，字号 `0.875em` |
| `pre > code` | 深色背景，`--neutral-800`，padding `1em` |
| `table` | 边框 `--border`，`th` 背景 `--surface-2` |
| `hr` | 颜色 `--border`，`margin: 2em 0` |
| `img` | `max-width: 100%`，圆角 `--radius-md` |

尺寸变体：
- `.prose-sm`：基础字号 `14px`
- `.prose`：基础字号 `16px`（默认）
- `.prose-lg`：基础字号 `18px`

---

## 各页面迁移策略

### index.html
- 删除现有 `:root`（8 个变量），直接使用 `theme.css` 语义 token
- 内容区 `<main>` 或文章区加 `class="prose"`

### taoteching-silk.html
- 保留深色视觉：在页面自己的 `:root` 中覆盖背景/文字语义 token
  ```css
  :root {
    --background:     var(--neutral-900);
    --surface:        var(--neutral-800);
    --text-primary:   var(--neutral-100);
    --text-secondary: var(--neutral-300);
    --primary:        var(--gold-500);
    --border:         rgba(201,168,76,0.20);
  }
  ```
- 其余专属变量（`--dao-bg`、`--de-bg` 等）保留，改为引用 primitive token

### positive-discipline-revised-nelsen.html
- 删除现有 `:root`，全部改用 `theme.css` 语义 token
- 卡片分类色直接引用功能色 token：`--gold-500`、`--green-500`、`--blue-500`、`--coral-500`
- 圆角改用 `--radius-md` / `--radius-lg`
- 阴影改用 `--shadow-sm` / `--shadow-lg`

### dual-track-6y.html
- `:root` 中现有 shape/shadow 变量改为引用 `theme.css` 的 `--radius-*` 和 `--shadow-*`
- 主题切换器内的硬编码色值（如 `#C95E2F`、`#4D8A6D`）改为引用 primitive token
- 切换器动态写入的主题变量改为覆盖语义 token

---

## 约束与边界

- `theme.css` 不包含任何布局、组件类（只有 token + `.prose`）
- 各页面组件样式继续内联在 `<style>` 中，使用 token 变量引用
- 不引入构建工具，保持纯静态部署兼容性
- `dual-track-6y.html` 的主题切换功能不做破坏性修改，仅替换色值来源

---

## 成功标准

1. 所有页面 `<head>` 中引入 `theme.css`
2. 四个页面中不存在直接的硬编码色值（`#xxxxxx`），全部通过 token 变量引用；需要透明度时允许使用 `rgba()` 形式但基础色须来自 primitive token 对应的色值（如 `--gold-500` 对应 `#C4891A`，透明变体写作 `rgba(196,137,26,0.20)`）
3. 内容区使用 `.prose` 后排版视觉一致
4. `npm run dev` 启动后四个页面视觉与迁移前无肉眼可见退步
