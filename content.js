// content.js — 所有文案 / 内容数据。render.js 从这里读取数据渲染 DOM。
// 当前均为占位骨架,等待用户逐模块提供真实文案,禁止在此编造实际内容。
// 已加 TODO 注释的字符串字段,需在拿到真实文案后原样替换。

const content = {
  sidebar: {
    name: "// TODO: 待用户提供姓名",
    role: "// TODO: 待用户提供职位定位",
    // TODO: 头像图片路径,视觉素材来源未定(见 CLAUDE.md「尚未锁定事项」)。
    // 为 null 时 render.js 渲染占位图标。
    avatar: null,
  },

  about: {
    // TODO: 待用户提供 3-4 句自我介绍(不得照搬简历原文措辞或结构)
    paragraphs: ["// TODO: 待用户提供 About 文案"],
  },

  skills: {
    categories: [
      {
        title: "Languages",
        items: [], // TODO: 待用户提供该分类技能列表
      },
      {
        title: "Backend & Frameworks",
        items: [], // TODO: 待用户提供该分类技能列表
      },
      {
        title: "Frontend",
        items: [], // TODO: 待用户提供该分类技能列表
      },
      {
        title: "Databases & Infra",
        items: [], // TODO: 待用户提供该分类技能列表
      },
    ],
  },

  project: {
    // Featured Project — CineVerse
    // 以下 name / stack / githubUrl / highlights[].title 已确认,非占位符
    name: "CineVerse",
    description: "// TODO: 待用户提供项目描述",
    stack: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Redis",
      "Next.js",
      "TypeScript",
      "Stripe API",
    ],
    githubUrl: "https://github.com/scsccso/cineverse",
    highlights: [
      {
        title: "Redis 分布式锁防止并发超卖/双重预订",
        description: "// TODO: 待用户提供该技术亮点的详细描述",
      },
      {
        title: "Stripe 幂等支付流水线 + webhook 竞态处理",
        description: "// TODO: 待用户提供该技术亮点的详细描述",
      },
      {
        title: "JWT 认证(内存 access token + httpOnly refresh token 轮换)",
        description: "// TODO: 待用户提供该技术亮点的详细描述",
      },
    ],
  },

  experience: {
    // company 已确认,非占位符;其余字段待用户提供
    positions: [
      {
        company: "Data Alliance Sdn Bhd",
        role: "// TODO: 待用户提供职位名称",
        period: "// TODO: 待用户提供时间段",
        summary: "// TODO: 待用户提供叙述性简介(非简历式项目符号堆砌)",
      },
      {
        company: "Greenwave Technology Sdn Bhd",
        role: "// TODO: 待用户提供职位名称",
        period: "// TODO: 待用户提供时间段",
        summary: "// TODO: 待用户提供叙述性简介(非简历式项目符号堆砌)",
      },
    ],
  },

  contact: {
    email: "// TODO: 待用户提供邮箱",
    linkedin: "// TODO: 待用户提供 LinkedIn 链接",
    github: "// TODO: 待用户提供 GitHub 链接",
  },
};
