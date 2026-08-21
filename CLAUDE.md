# 项目说明

个人作品集网站,定位为 UI/UX 设计能力与"AI-native 开发流程"展示品——
展示如何指挥 AI(Claude Code)完成一个有产品级质感的网站,呼应简历中
"directing AI-native development workflows to accelerate delivery
without sacrificing engineering rigor"这句话。

页面同时作为 hub,链接到 CineVerse(电影院订票系统,Java Spring Boot +
PostgreSQL + Redis + Next.js)等真实工程项目——**后端工程能力由 CineVerse
承担展示,这个 portfolio 网站本身不需要证明后端能力,只需要证明设计感
和交互品味**。

用途优先级:
1. (主要)丰富 GitHub 作品集,展示 UI/UX 设计与 AI 协作开发能力
2. (次要)career fair 现场发放、面试官扫码/访问查看

本文件是本项目的长期开发规则文档,后续所有开发都必须遵守此文件的约定,
不得擅自偏离。

---

# 技术栈(已锁定,不引入框架/构建工具)

- 纯 HTML/CSS/JS,无 React/Vue 等前端框架,无 Webpack/Vite 等构建工具
- 鼠标交互效果(卡片倾斜跟随、自定义光标等)一律用原生 JS 实现,
  不引入 GSAP/Three.js 等动效库
- 文件结构保持数据与渲染逻辑分离:
  - content.js — 文案/内容数据
  - render.js — 读取 content.js,渲染成 DOM,同时管理交互逻辑
    (鼠标倾斜、自定义光标、滚动触发)
  - styles.css — 所有样式,颜色/断点用 CSS 变量
  - index.html — 容器结构和挂载点
- 部署目标:GitHub Pages 或 Vercel(纯静态站)

---

# 设计参照(已更新,不再以 Apple HIG 为唯一参照)

本项目采用"场景化混合设计语言"——不同类型的内容区块采用不同的设计参照,
而不是全站统一一种视觉逻辑:

## 叙事性场景(Hero / About)—— 编辑感排版参照
参照 Stripe 早期主页、Arc 浏览器官网的设计逻辑:
- 超大字号标题主导视觉,非对称网格布局(不强制居中对称)
- 滚动进场时,不同元素分层次、不同时序进入(标题先进,配图/数据稍晚
  从侧边或下方跟入),不是简单的统一淡入
- 强调色可用于渐变文字效果(如标题局部文字用 --color-accent 到
  --color-accent-on-soft 的渐变,搭配 background-clip: text)

## 信息密集场景(Skills / Featured Project)—— Bento Grid + 微光质感参照
参照 Linear、Vercel、Raycast 等开发者工具产品的设计语言:
- 卡片以不规则大小拼接成 bento grid(便当盒网格),不是整齐划一的
  三栏等宽卡片
- hover 状态允许卡片边框泛出柔和光晕(box-shadow 配合
  --color-accent 的低透明度色值,如 rgba(63, 118, 160, 0.25)
  这类已在项目里验证过的写法),光晕范围克制,不铺满整个背景
- 允许局部使用微妙渐变背景(卡片背景色从纯色到极浅同色系渐变过渡),
  不允许多色鲜艳渐变

## 微交互(全站通用)
- CineVerse 技术亮点卡片、Skills 标签等可交互元素,鼠标悬停时允许
  轻微 3D 倾斜跟随效果(cursor-follow tilt,根据鼠标在卡片内的相对
  位置计算 rotateX/rotateY,倾斜幅度需克制,不超过 8-10 度)
- 可交互元素(链接、按钮、卡片)hover 时,允许自定义光标形态变化
  (如变成描边圆圈,或圆圈内浮现"查看"等提示文字),桌面端生效,
  移动端(触屏)不适用此效果,需做设备检测降级处理

---

# 视觉规范(已锁定,如需变更必须先跟用户确认,不得自行调整)

## 色板(维持上一轮已确定的暖色调,不变)

--color-bg: #FAF6F0;
--color-surface: #FFFFFF;
--color-text-primary: #2B2621;
--color-text-secondary: #6E6259;
--color-accent: #3F76A0;
--color-accent-soft: #EAF4FB;
--color-accent-on-soft: #2F5A78;
--color-border: #DED7CC;

## 装饰性视觉手法(本轮松绑,替换原"明确不允许的技法"章节)

- 允许克制使用渐变(同色系微妙过渡,不允许多色鲜艳撞色渐变)
- 允许克制使用微光/发光效果(box-shadow 光晕,基于 --color-accent
  的低透明度值,不允许大面积发光背景或霓虹感)
- 允许局部材质质感(如卡片轻微噪点纹理增加触感),需保持克制,
  不能影响文字可读性
- 仍然严禁:Apple Liquid Glass 或 backdrop-filter + SVG 折射畸变效果
  (性能与兼容性原因不变)
- 仍然严禁:套用任何原生 App 专属组件规范(Tab Bar、Navigation Bar、
  Sheet、watchOS/visionOS 控件、SF Symbols)

## 排版层级(维持不变)
- 各 section 主标题字号提升至 32-40px,font-weight 600,
  letter-spacing 收紧(-0.3px ~ -0.5px)
- 正文关键词允许局部加粗高亮,每段最多 1-2 处
- 数据类信息可做成 metrics 数字条,配合滚动触发数字递增动画

## 交互反馈要求(维持不变)
所有可点击元素必须有明确 hover/active/focus 反馈,避免夸张动画
(弹跳/旋转/粒子效果),transition 保持简单过渡。

## 滚动交互(在原有基础上扩展)
- Intersection Observer 实现 section 淡入 + 轻微上移(维持不变)
- 叙事性场景新增:分层次、错落时序的进场动画(标题/正文/配图不同时序)
- 必须处理 prefers-reduced-motion: reduce

## 响应式断点(维持不变)
- 桌面: ≥1024px / 平板: 768-1023px / 手机: <768px

## 手机端硬性要求(维持不变,新增交互降级说明)
- 导航汉堡菜单、卡片单列堆叠、正文字号不低于16px
- 自定义光标效果、3D 倾斜跟随效果仅桌面端生效,触屏设备自动降级为
  普通 hover 反馈,不强制在移动端模拟这些效果

---

# 页面结构(维持不变,单页滚动 + 锚点导航)

1. Hero — 采用叙事性排版设计语言
2. About — 采用叙事性排版设计语言
3. Skills — 采用 Bento Grid 设计语言
4. Featured Project — CineVerse — 采用 Bento Grid + 微光设计语言,
   技术亮点卡片加入鼠标倾斜跟随效果
5. Work Experience — 叙事性呈现
6. Contact — 简单卡片/按钮组

---

# 内容原则(维持不变)

- 不照搬简历原文,不编造未提及的经历/数据
- 具体文案需逐模块跟用户讨论确认
- 未提供文案的模块用 TODO 占位符

---

# 尚未锁定事项

- SEO / Open Graph meta 标签
- 视觉素材来源(个人照片、项目截图)
