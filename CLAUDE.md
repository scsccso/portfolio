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

# 视觉规范(已锁定,追求 UI/UX 设计师级别的视觉品质,不做保守妥协)

## 色板(维持 Flat UI Colors 基础色不变)
--color-bg: #ECF0F1;
--color-surface: #FFFFFF;
--color-text-primary: #2C3E50;
--color-text-secondary: #5E6869;
--color-accent: #34495E;
--color-accent-soft: #CAD6E2;
--color-border: #BDC3C7;

## 设计目标
本项目视觉标准参照顶级 UI/UX 设计师个人作品集(Dribbble/Behance 上
高赞作品集的水准),不是标准企业官网或简历落地页。每个界面元素都应
体现精心打磨的细节,而非功能性够用即可。

## 全面允许的视觉手法
- 渐变(gradient):按钮、卡片背景、文字均可使用同色系或撞色渐变,
  只要不影响可读性
- 微光/发光效果:hover 状态、强调元素可使用 box-shadow 光晕、
  甚至克制的 glow 效果
- 复杂阴影层次:多层阴影叠加制造真实的空间纵深感,不局限于单一
  轻阴影
- 不规则/不对称布局:允许 bento grid、非对称网格、卡片大小不一
- 微交互:hover 时的 3D 倾斜、缩放、位移效果均可使用
- 自定义光标、鼠标跟随效果:允许实现
- 精致的过渡动画:tab切换、内容加载、滚动进场,都应该有经过设计的
  动画曲线(ease-out/cubic-bezier),不是简单的线性淡入
- 字体排印:允许更大胆的字号对比、字重层次,标题可以远大于正文

## 明确不再限制的旧规则(全部解除)
- 不再禁止渐变文字、渐变背景
- 不再禁止 bento 不规则网格
- 不再禁止鼠标 3D 倾斜跟随、自定义光标
- 不再要求"保守""稳妥"作为设计优先级

## 唯一的底线要求
- 移动端必须可用,不能因为视觉效果导致移动端体验崩坏
- 不使用 Apple Liquid Glass / backdrop-filter 折射效果(纯粹是性能
  兼容性原因,不是审美限制)
- 所有交互仍需处理 prefers-reduced-motion,但视觉丰富度不因此打折扣

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
