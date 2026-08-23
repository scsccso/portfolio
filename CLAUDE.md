# CLAUDE.md — Ong Shan Chun Portfolio

## 项目定位

个人作品集网站,作为 hub 页面,链接到 CineVerse(Java Spring Boot + PostgreSQL + Redis
的电影院订票系统)等作品集项目。用途:career fair 发放、面试官查看。目标是"产品级
UI/UX + Mac 风格 + 强交互",而不是通用简历模板站。

## 角色定位(不变)

Claude Code 是唯一实际写代码的一方。用户在另一个 Claude 对话里做需求梳理和审阅,
不会在这里直接写 prompt 之外的决策 —— 遇到不确定的内容取舍(简历文字怎么改写、
个人经历怎么呈现),**停下来问,不要自己编**。

## 技术栈(硬约束)

- 纯 HTML / CSS / JS。不使用 React / Vue / 任何前端框架。不使用 npm / Vite /
  Webpack 等构建工具 —— 项目应该能直接用浏览器打开 `index.html` 或部署为静态文件,
  不需要任何安装/编译步骤。
- **允许通过 CDN `<script>` / `<link>` 标签引入库**(这不等于"上构建工具"):
  - **GSAP + ScrollTrigger**(cdnjs,2026 年已完全免费商用)—— 全站唯一的动画 /
    滚动编排引擎。所有滚动触发的动效都通过它实现,**不要**同时使用原生 CSS
    `scroll-timeline` / `view-timeline`,两套滚动动画系统混用会增加维护成本。
  - **Lenis**(cdnjs 或 jsdelivr)—— 全局平滑惯性滚动。
  - **Google Fonts: Space Grotesk**(标题字重 500 / 700)。
- 文件架构:
  - `content.js` — 全部个人数据(占位内容与真实内容切换只改这一个文件)
  - `render.js` — 把 content.js 的数据注入 DOM
  - `styles.css` — 设计 token 用 CSS 自定义属性
  - `index.html` — 只负责结构和占位符,不写死内容
- 部署目标:GitHub Pages 或 Vercel(静态站)

## 设计 Token

```css
--bg: #F5F5F7;
--surface: #FFFFFF;
--text-primary: #1D1D1F;
--text-secondary: #6E6E73;
--accent: #0071E3;
--border: #D2D2D7;

/* 深色面板例外 token —— 仅用于 Mac 窗口代码预览 / Hero 聚光灯区域,
   不是全站暗色模式,类比 macOS 里 Terminal/Xcode 在浅色系统里本身是深色界面 */
--dark-panel-bg: #161616;
--dark-panel-bg-deep: #0a0a0f;
```

- 标题字体:Space Grotesk;正文:系统 sans-serif 字体栈(`-apple-system` 等)。
- 移动端正文字号不低于 16px(防止 iOS 自动缩放),这是硬性要求。

## 响应式断点(不变)

- 桌面 ≥1024px / 平板 768–1023px / 手机 <768px
- 手机端硬性要求:导航改为汉堡菜单(禁止桌面横向导航直接缩小);卡片单列堆叠;
  正文字号不低于 16px。

## 信息架构 —— Bento Grid(正式取代最早锁定的"单页滚动 + 锚点导航"方案)

首屏是一个卡片网格,不是纵向长页面:

```
[ Hero(大) ]        [ CineVerse(大) ]
[About] [Skills] [WorkExperience] [Contact]
```

移动端降级为单列堆叠。

## 全局交互层

1. **液态玻璃导航条(Liquid Glass Nav)**——页面顶部,初始透明,滚动经过 Hero
   区域后(用 IntersectionObserver 监听一个 sentinel 元素)平滑过渡为磨砂玻璃质感
   (`backdrop-filter: blur() saturate()` + 半透明背景 + 细边框)。移动端收进汉堡
   菜单,同样保留玻璃质感。
2. **Cmd+K 命令面板**——全局 `⌘K` / `Ctrl+K` 快捷键唤出搜索框,可跳转 About /
   Skills / Featured Project / Work Experience / Contact,可打开 GitHub、发邮件、
   下载简历。纯 vanilla JS:模糊子序列匹配、方向键选择、Enter 确认、Esc 关闭。
   导航条上留一个不显眼的 `⌘K` 提示。
3. **磁性按钮效果**——只用在主要 CTA 按钮上(例如"查看 CineVerse"/"下载简历"),
   不要用在导航链接或所有可点击元素上。
4. GSAP + ScrollTrigger 是全站唯一的滚动动效引擎(见"技术栈"约束)。
5. Lenis 全局初始化,提供平滑滚动手感。

## Hero 区

- Kinetic 标题动效:姓名逐字符错落浮现入场(GSAP timeline,`stagger` + 缓动曲线),
  必须遵守 `prefers-reduced-motion`——如果用户开启了减少动效,直接展示静态文字,
  不播放动画。
- 光标聚光灯效果:仅限 Hero 区域这一块深色背景面板,径向渐变跟随鼠标。
- 一句话定位 + 一个磁性 CTA 按钮(指向 CineVerse 或 GitHub)。

## CineVerse 项目卡片(bento 里最大的一张)

- **悬浮 3D 倾斜**:鼠标位置驱动 `rotateX`/`rotateY`,配合跟随鼠标的高光
  (radial-gradient)扫过卡片表面。
- **滚动触发的机制动效**(GSAP ScrollTrigger):卡片进入可视区域时,自动播放
  Redis 分布式锁的并发抢票模拟——3 个请求同时发起,只有一个真正拿到锁(绿色成功
  态),另外两个显示"锁已被占用"(灰/红态),锁持有一段时间后自动释放并重置。
- **内嵌 Mac 窗口风格代码预览**:红/黄/绿三个圆点做窗口装饰,深色面板,展示
  **真实**代码片段(例如 `DistributedLock.java` 里 `setIfAbsent` 加锁那几行),
  不要用 "Hello World" 这类占位符内容;配 `Java` / `Redis` 标签 pill。
- **展开交互**:点击卡片用 **View Transitions API** 做平滑形态过渡,展开后
  显示:
  - 项目真实的文件树结构(嵌套 folder/file 列表,高亮一个当前文件)
  - 关键技术决策的简短说明段落(JWT 刷新令牌轮换、Stripe 幂等 webhook + 人工
    对账状态、原生 SQL 聚合)——用文字块呈现,**不要**做成可点击的节点式架构图,
    保持 case-study 阅读体验而不是交互图表。
- **自定义光标仅限这张卡片的交互区域**,不做全站替换:默认指针在这个区域内换成
  一个跟随的小圆点,划过展开入口时放大并显示"查看"文字提示。卡片以外的区域保持
  系统默认指针 —— 全局替换指针在移动端直接失效,也是"廉价感"而非"高级感"的
  常见来源。

## GitHub 活跃度卡片(独立小卡片)

- 提交热力图(周 × 天网格,hover 显示具体日期和提交次数),真实 GitHub 用户名
  接入后用 `fetch()` 拉取公开 API 数据;接入前先用示例数据占位。
- 语言占比条(按真实技术栈权重分段)。
- 统计数字(仓库数、CineVerse star 数、连续提交天数、今年提交数)——数字滚动
  动画,**必须**用 IntersectionObserver / ScrollTrigger 门控,滚动到可视区域才
  触发,不要一加载就放完。
- CineVerse 置顶仓库迷你卡片,附真实 GitHub 链接。

## About / Skills / Work Experience / Contact 卡片

内容尚未锁定,逐模块单独讨论。**不要**把简历原文照搬进这些卡片,也不要替用户
编造经历或成果。

## 可选彩蛋(优先级最低,时间不够可以跳过)

页面角落一个不起眼的 terminal/CLI 入口,输入 `help` 显示几个自定义命令。纯
vanilla JS。不能干扰主导航,也不能对非技术访客造成困扰或误导。

## 内容原则(不变)

- 简历内容不得逐字照搬进任何模块。
- 每个内容模块(About 文案、Skills 呈现方式、Work Experience 摘要)在写进
  `content.js` 定稿前,先跟用户单独讨论。
- 不替用户编造经历、数据或成果。

## 尚未锁定,后续迭代需要确认(不要擅自决定)

- SEO / Open Graph meta(分享预览图、描述文案)
- 视觉素材来源(个人照片、项目截图 —— 谁提供 / 如何生成)
- About / Skills / Work Experience 的最终文案

## 当前状态

第一版实现使用占位内容(见随附的启动 prompt),验证交互效果后再逐步替换为真实
个人信息。
