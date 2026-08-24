# CLAUDE.md — Ong Shan Chun Portfolio (Hacker Terminal Edition)

## 项目定位(第四版方向,基于用户提供的现成模板改写)

用户提供了一份完整的"Cybersecurity Expert"模板(index.html + style.css + main.js,
matrix雨背景、终端启动动画、霓虹绿荧光风格)。**这份代码是起点,视觉系统整体保留,
不重新设计**——任务是把模板里网络安全顾问的虚构人设和内容,替换成 Ong Shan Chun
真实的全栈/后端工程师身份和真实经历。

## 硬性要求:内容真实性(不可协商)

原模板里以下内容**必须全部删除,不能沿用**,这些是网络安全顾问营销模板的虚构占位:

- Hero stats 的 500+ Systems Secured / 10 Years Experience / 25 Certifications /
  200+ Clients Protected —— 全部是编的,一个都不能留。
- Certifications 区块的 CEH / CISSP / OSCP —— 用户没有这些证书,不能出现。
- "ELITE SECURITY EXPERT" / "Cybersecurity Expert" / "Penetration Testing" 这套
  定位文案 —— 用户是全栈/后端开发者,不是网络安全顾问。
- RTL 语言切换按钮及相关代码(`dirToggle`、`[dir="rtl"]`那些CSS规则)—— 跟中文/
  英文内容场景无关,是模板作者留的通用功能,直接删掉,不用保留骨架。

## 内容映射(把模板结构套上真实内容)

- **Hero badge**: "ELITE SECURITY EXPERT" → "FULL-STACK DEVELOPER"
- **Hero title**(原 PROTECTING / DIGITAL / FRONTIERS 三个词):换成描述用户自己的
  说法,具体文案跟用户单独讨论确定,不要自己编。
- **Hero stats 四个数字卡片**:换成真实、可查证的数字。可参考简历里的真实说法,例如
  "20+"(CineVerse 后台管理页面数量)、"25+"(AI协作交付的功能数)、真实实习时长、
  真实技术栈广度这类。**没有合适的真实数字,宁可少放一张卡,也不能编数字凑数。**
- **hacks-slider**(原"Security Operations"轮播):改成"What I Built",每张slide
  对应CineVerse的一个真实技术亮点——Redis并发锁、Stripe幂等支付、JWT认证、后台
  报表这几个,具体文案跟真实简历内容对齐。
- **about-section 的4个 feature-card**(原 Ethical Hacking / Network Security /
  Security Architecture / Incident Response):换成真实技术专长分类,具体标题跟
  用户讨论后确定。
- **about-section 的 security-terminal 可视化**(原 `nmap -sS target.com` 端口
  扫描演示):**必须换掉**,不能保留任何渗透测试/黑客工具相关的命令演示,换成跟
  他技术相关的真实终端演示,比如 `redis-cli` 加锁相关命令。
- **services-section**(原 Penetration Testing / Vulnerability Assessment /
  Security Consulting 三张卡):建议改成"核心能力"类内容,例如 Backend
  Architecture / Concurrency & Systems / Full-Stack Delivery,具体文案待讨论,
  不要保留任何安全服务相关表述。
- **certifications-section**:用户没有专业认证,改成 Education 区块,呈现真实的
  学历信息(TAR UMT学位、Dean's List荣誉),不要留空也不要编证书凑数。
- **contact-section**:邮箱等联系方式换成真实信息。**表单必须改成真的能用**——
  现在提交只弹一个假的 `alert()`,消息根本没发出去。改成 `mailto:` 链接,或接一个
  免费表单服务(如 Formspree)让它真的能收到消息,二选一,不能继续用假表单。

## 技术层面必须修复的问题

- **`prefers-reduced-motion` 完全没有处理**——matrix雨canvas、loader进场动画、
  hero元素逐个飞入(anime.js)、卡片hover发光/扫光,全部是持续性或装饰性动效,
  原代码里一处判断都没有。这个必须补上:开启该系统设置时,跳过loader动画直接
  显示内容、matrix canvas暂停或不渲染、其余进场动画直接以最终状态显示。
- **移动端性能需要验证**:matrix canvas逐帧重绘 + 粒子系统(30个浮动粒子)在低端
  手机上可能吃性能,必要时降低移动端的粒子数量/matrix刷新频率,或移动端直接关闭
  matrix背景只保留纯色深色背景。
- 字体 `Tajawal` 原本是为配合RTL阿拉伯语场景选的字体,现在RTL整个删除了,这个
  字体要不要保留由实现时判断(继续用没问题,是个正常的几何无衬线体,只是原来的
  选择理由不成立了,不强制换)。

## 不变的部分

- 内容原则不变:不替用户编造经历、数据、成就;About/Skills等文案模块逐个跟用户
  讨论定稿,不能自己脑补。
- 技术栈约束不变:纯HTML/CSS/JS,不上构建工具,CDN引入的库(anime.js、GSAP+
  ScrollTrigger、Font Awesome、Google Fonts)保留原样即可,不需要新增。

## 尚未锁定,需要跟用户单独讨论

- Hero title 具体三个词怎么写
- Hero stats 四个数字具体用哪几个真实数据
- about-section 四个技术专长分类的具体标题和描述
- services-section("核心能力")三张卡的具体文案
- 联系表单最终用 mailto 还是接第三方表单服务

## 当前状态

第四版方向:基于用户提供的Cybersecurity Expert模板,视觉系统(matrix雨/终端启动/
霓虹绿荧光)整体保留,内容全部替换为真实信息,删除虚构成就、虚构证书、RTL功能、
渗透测试相关表述。技术上补齐 `prefers-reduced-motion` 处理、验证移动端性能、
修复假的联系表单。D:\dev\Portfolio 现在已经放好了一份基础模板(index.html/style.css/main.js,
黑客终端风格,来自一个网络安全顾问模板)和新版CLAUDE.md。
