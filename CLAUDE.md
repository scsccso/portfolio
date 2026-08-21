# 项目说明

标准的个人作品集网站,参考 vCard 类型的经典开发者作品集结构
(如 codewithsadee/vcard-personal-portfolio 这类被广泛验证的模板)。
核心内容:姓名、职位定位、项目展示(CineVerse)、技能、工作经历、
联系方式。目标是稳定、清晰、专业,不追求复杂的视觉实验。

同时作为 hub,链接到 CineVerse(电影院订票系统,Java Spring Boot +
PostgreSQL + Redis + Next.js)等真实工程项目。

用途:
1. 丰富 GitHub 作品集
2. career fair 现场发放、面试官扫码/访问查看

本文件是本项目的长期开发规则文档,后续所有开发都必须遵守此文件的约定。

---

# 技术栈(已锁定)

- 纯 HTML/CSS/JS,无框架,无构建工具
- 文件结构:
  - content.js — 文案/内容数据
  - render.js — 读取 content.js,渲染 DOM,管理交互逻辑
  - styles.css — 所有样式,颜色/断点用 CSS 变量
  - index.html — 容器结构和挂载点
- 部署目标:GitHub Pages 或 Vercel

---

# 页面结构(参考 vCard 模板逻辑,已锁定)

采用侧边栏 + 主内容区结构(非单页滚动锚点导航):

- **侧边栏(固定)**:头像占位、姓名、职位定位、联系方式图标
  (邮箱/LinkedIn/GitHub),桌面端固定在左侧,移动端收起为顶部
  可展开区域或汉堡菜单
- **主内容区**:顶部 tab 导航切换以下板块:
  1. About — 3-4 句自我介绍
  2. Skills — 分类标签展示(Languages / Backend & Frameworks /
     Frontend / Databases & Infra),简单的等宽网格卡片,不使用
     不规则 bento 拼接
  3. Project — CineVerse 项目展示:描述 + 技术栈标签 + GitHub 链接 +
     三个技术亮点(简单等宽卡片,允许角落有克制的装饰数字,
     不需要复杂背景色块或视差效果)
  4. Experience — 两段实习经历,简洁列表或时间线呈现
  5. Contact — 联系方式卡片/按钮组

---

# 视觉规范(简化版,已锁定)

## 色板(Flat UI Colors 配色方案)
--color-bg: #ECF0F1;
--color-surface: #FFFFFF;
--color-text-primary: #2C3E50;
--color-text-secondary: #5E6869;
--color-accent: #34495E;
--color-accent-soft: #CAD6E2;
--color-border: #BDC3C7;

注:
- --color-text-secondary 在 --color-bg 上对比度 5.00:1(WCAG AA 达标,
  原 #7F8C8D 仅 3.03:1 不达标)。取值方式:保持原色相/饱和度不变,
  仅降低明度,同色系内加深一档。
- --color-accent-soft 已从 --color-border 中拆分为独立浅色调
  (基于 --color-accent 色相的浅色浅灰蓝),不再与 --color-border 同值,
  解决 Skills 卡片边框与 pill 标签背景视觉混淆的问题。

## 装饰手法(大幅简化,替换之前所有复杂规则)
- 卡片:白底,0.5px 边框,轻微圆角(12-14px),hover 时
  translateY(-3px) + box-shadow 加深,仅此而已
- 允许卡片角落一个克制的装饰数字(如 01/02/03),低对比度,
  不遮挡内容
- **不使用**:场景化背景色块、视差滚动、渐变文字、bento 不规则
  拼接网格、卡片背景渐变、鼠标 3D 倾斜跟随、自定义光标
- 强调色仅用于:按钮背景、链接、pill 标签背景/文字、装饰数字
- 允许克制的滚动淡入(整个 section 或卡片统一 opacity+translateY,
  不需要分层错落时序),必须处理 prefers-reduced-motion

## 交互反馈要求(维持不变)
所有可点击元素必须有明确 hover/active/focus 反馈,避免夸张动画。

## 响应式断点(维持不变)
- 桌面: ≥1024px / 平板: 768-1023px / 手机: <768px

## 手机端要求
- 侧边栏在移动端收起为顶部区域或汉堡菜单
- 卡片单列堆叠,正文字号不低于16px

---

# 内容原则(维持不变)

- 不照搬简历原文,不编造未提及的经历/数据
- 具体文案需逐模块跟用户讨论确认
- 未提供文案的模块用 TODO 占位符

---

# 尚未锁定事项

- SEO / Open Graph meta 标签
- 视觉素材来源(个人照片、项目截图)
