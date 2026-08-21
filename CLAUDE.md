# 项目说明

个人自我介绍作品集网站,作为 hub 页面,链接到 CineVerse(电影院订票系统,Java Spring Boot + PostgreSQL + Redis + Next.js)等作品集项目。

用途:career fair 现场发放、面试官扫码/访问查看。

本文件是本项目的长期开发规则文档,后续所有开发都必须遵守此文件的约定,不得擅自偏离。

---

# 技术栈(已锁定,不引入框架/构建工具)

- 纯 HTML/CSS/JS,无 React/Vue 等前端框架,无 Webpack/Vite 等构建工具
- 文件结构必须保持数据与渲染逻辑分离:
  - `content.js` — 存放所有文案/内容数据(姓名、简介、技能列表、项目信息等)
  - `render.js` — 读取 `content.js` 的数据,负责渲染成 DOM
  - `styles.css` — 所有样式,颜色/断点使用 CSS 变量,不允许硬编码色值散落在各处
  - `index.html` — 只负责容器结构和挂载点,不写死具体文案内容
  - 目的:后续更新简历内容/项目信息时,只需改 `content.js`,不需要动 HTML 结构或 `render.js` 逻辑
- 部署目标:GitHub Pages 或 Vercel(纯静态站,不需要 server-side 逻辑)

---

# 设计参考来源

本项目已安装 Claude Code agent skill「apple-hig」(来自 justinwetch/HIGAgentSkills)。

仅取用其中 Design Principles / Typography / Layout / Motion / Color 等平台通用美学原则作为视觉参考。

严禁套用任何原生 App 专属组件规范,包括但不限于:Tab Bar、Navigation Bar、Sheet、watchOS/visionOS 专属控件、SF Symbols 图标系统。本项目是网页,不是原生 App,不允许出现"看起来像 iOS App 界面"的视觉效果。

首次读取该 skill 时,请先输出你读取到的 skill 文件摘要(文件名、版本信息、覆盖范围),供用户核实版本是否符合预期,不要默认跳过这一步。

---

# 视觉规范(已锁定,如需变更必须先跟用户确认,不得自行调整)

## 色板(写死为 CSS 变量,不允许在组件里散落硬编码色值)

```css
--color-bg: #F5F5F7;
--color-surface: #FFFFFF;
--color-text-primary: #1D1D1F;
--color-text-secondary: #6E6E73;
--color-accent: #0071E3;
--color-border: #D2D2D7;
```

## 排版层级(新增,已锁定)

- 各 section 主标题(如 Hero 姓名、Featured Project 标题)字号提升至 32-40px,font-weight 600,letter-spacing 轻微收紧(-0.3px ~ -0.5px),制造第一眼冲击力
- 正文段落中的关键词允许用 --color-text-primary + font-weight 600 局部加粗高亮,不需要整段平铺,但不允许滥用,每段最多高亮 1-2 处
- 数据类信息(如项目数量、功能交付数量等,必须是简历/用户提供的真实数字,不可虚构)可做成独立的 metrics 数字条,大字号数字(24-28px, weight 600)+ 小字说明(13px, --color-text-secondary),横向排列,配合上下 border 分隔线

## 卡片视觉技法(新增,已锁定)

- 允许在卡片角落使用超大号(40-48px)、低对比度(背景色 --color-bg 同色或更浅)的装饰性数字/序号(如 01/02/03),作为背景层视觉元素,不遮挡主要内容,z-index 层级需保证正文文字在数字之上
- 卡片圆角可提升至 12-14px,hover 状态允许 translateY(-3px ~ -4px) 上浮 + box-shadow 加深(轻微,不使用夸张阴影),transition 保持简单过渡
- CTA 按钮(如"查看仓库")允许使用实心圆角胶囊(pill)样式:background: var(--color-accent),文字白色,border-radius ≥ 20px,hover 时允许轻微 transform 或 box-shadow 反馈

## 交互反馈要求(维持原规则,未变更)

所有可点击元素(按钮、链接、导航项、卡片)必须有明确的 hover / active / focus 状态反馈。避免使用过度装饰性的动画(禁止用夸张的弹跳、旋转、粒子效果等),保持 Apple 风格的克制感,过渡使用简单的 transition,不用复杂的关键帧动画。

## 滚动交互(新增,已锁定)

- 允许使用原生 JS(Intersection Observer API,不引入第三方库)实现 section 进入视口时的淡入 + 轻微上移动效(opacity 0→1 配合 translateY(12px→0),duration 300-500ms,ease-out)
- metrics 数字条中的数字允许配合滚动触发做数字递增动画(从 0 数到目标值),同样只用原生 JS 实现,不引入动画库
- 以上滚动动效必须保持克制,不允许弹跳(bounce)、旋转、缩放溢出等夸张效果,且需在 prefers-reduced-motion: reduce 时自动禁用或大幅简化

## 明确不允许的技法(维持原规则,未变更)

- 严禁 Apple Liquid Glass 或任何 backdrop-filter + SVG 折射畸变效果(性能开销大且非 Chromium 浏览器支持不一致,与本项目"眼前一亮但克制"的定位不符)
- 严禁套用任何原生 App 专属组件规范(Tab Bar、Navigation Bar、Sheet、watchOS/visionOS 专属控件、SF Symbols 图标系统)
- 严禁使用渐变(gradient)背景、噪点纹理、发光(glow)特效

## 响应式断点(维持原规则,未变更)

- 桌面: ≥1024px
- 平板: 768px–1023px
- 手机: <768px

## 手机端硬性要求(维持原规则,未变更)

- 导航必须改为汉堡菜单或底部固定导航,禁止把桌面横向导航直接等比缩小
- 项目卡片改为单列堆叠,不允许横向滚动或多列挤压
- 正文字号不低于 16px

---

# 页面结构(单页滚动 + 锚点导航,已锁定)

1. **Hero**
   - 姓名、职位定位、一句话简介、CTA 按钮(跳转 Projects 区块或 CineVerse repo)

2. **About**
   - 3-4 句自我介绍,不得照搬简历原文措辞或结构

3. **Skills**
   - 分类标签/卡片形式呈现:Languages / Backend & Frameworks / Frontend / Databases & Infra
   - 不使用简历式的分号堆砌纯文本列表,要有视觉分组

4. **Featured Project — CineVerse**(全站重点模块)
   - 项目描述
   - 技术栈标签(Java, Spring Boot, PostgreSQL, Redis, Next.js, TypeScript, Stripe API)
   - GitHub 链接(github.com/scsccso/cineverse)
   - 关键技术亮点必须单独列出展示,不可一笔带过,包括:
     - Redis 分布式锁防止并发超卖/双重预订
     - Stripe 幂等支付流水线 + webhook 竞态处理
     - JWT 认证(内存 access token + httpOnly refresh token 轮换)

5. **Work Experience**
   - 两段实习经历(Data Alliance Sdn Bhd / Greenwave Technology Sdn Bhd)
   - 简化呈现,不是简历式项目符号堆砌,用更叙述性/精简的方式呈现

6. **Contact**
   - 邮箱 / LinkedIn / GitHub,做成简单的联系方式卡片或按钮组

## 导航

- 顶部固定导航条(sticky/fixed),对应以上 section 锚点跳转
- 桌面端横向排列
- 手机端收起为汉堡菜单

---

# 内容原则(重要,必须遵守)

- 可以参考用户简历内容作为素材来源,但绝对不能直接照搬简历原文文字或结构进网站
- 每个模块具体放什么内容、怎么措辞,需要逐个模块跟用户讨论确认,不允许自行编造用户没有提及的经历、成果或数据
- 如果某个模块的具体文案用户还没提供,先用清晰标注的占位符(例如 `// TODO: 待用户提供 About 文案`),不要自己编一段放上去充数

---

# 尚未锁定事项(遇到以下内容,必须先跟用户确认再动手,不允许自行决定)

- SEO / Open Graph meta 标签(分享预览图、描述文案)
- 视觉素材来源(个人照片、项目截图从哪里来,谁提供/如何生成)
