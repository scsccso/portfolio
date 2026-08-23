/**
 * Single source of truth for all copy and data on the site.
 * Swap placeholder values here — render.js never hardcodes content.
 */
const CONTENT = {
  site: {
    name: "Your Name",
    role: "Full-Stack Software Engineer",
    monogram: "YN",
    email: "hello@example.com",
    githubUrl: "https://github.com/yourusername",
    githubUsername: "yourusername",
    resumeUrl: "#",
  },

  nav: [
    { label: "About", target: "about" },
    { label: "Skills", target: "skills" },
    { label: "CineVerse", target: "cineverse" },
    { label: "Experience", target: "experience" },
    { label: "Contact", target: "contact" },
  ],

  hero: {
    greeting: "Hi, I'm",
    name: "Your Name",
    tagline: "Full-stack engineer who cares about the details most people skip.",
    cta: { label: "View CineVerse", target: "cineverse" },
  },

  cineverse: {
    label: "Featured Project",
    title: "CineVerse",
    subtitle: "A full-stack cinema ticketing platform built for concurrency at scale.",
    tags: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
    expandHint: "View case study",
    githubUrl: "https://github.com/yourusername/cineverse",
    githubLabel: "View source",

    code: {
      filename: "DistributedLock.java",
      language: "Java",
      badge: "Redis",
      lines: [
        "public class DistributedLock {",
        "",
        "    private final StringRedisTemplate redis;",
        '    private static final String PREFIX = "lock:seat:";',
        "",
        "    public boolean tryLock(String seatId, String owner, Duration ttl) {",
        "        String key = PREFIX + seatId;",
        "        Boolean ok = redis.opsForValue()",
        "                .setIfAbsent(key, owner, ttl);",
        "        return Boolean.TRUE.equals(ok);",
        "    }",
        "",
        "    public void unlock(String seatId, String owner) {",
        "        String key = PREFIX + seatId;",
        "        if (owner.equals(redis.opsForValue().get(key))) {",
        "            redis.delete(key);",
        "        }",
        "    }",
        "}",
      ],
    },

    lockDemo: {
      caption: "SETNX lock:seat:14B",
      requests: [
        { id: "a", label: "Request A" },
        { id: "b", label: "Request B" },
        { id: "c", label: "Request C" },
      ],
      idleText: "Idle",
      lockedText: "Lock acquired",
      blockedText: "Lock held",
    },

    fileTree: {
      name: "cineverse/",
      type: "folder",
      children: [
        {
          name: "src/main/java/com/cineverse/",
          type: "folder",
          children: [
            {
              name: "booking/",
              type: "folder",
              children: [
                { name: "BookingController.java", type: "file" },
                { name: "BookingService.java", type: "file" },
                { name: "SeatLockService.java", type: "file" },
              ],
            },
            {
              name: "payment/",
              type: "folder",
              children: [
                { name: "StripeWebhookController.java", type: "file" },
                { name: "PaymentReconciliationJob.java", type: "file" },
              ],
            },
            {
              name: "auth/",
              type: "folder",
              children: [
                { name: "JwtTokenProvider.java", type: "file" },
                { name: "RefreshTokenService.java", type: "file" },
              ],
            },
            {
              name: "common/redis/",
              type: "folder",
              children: [
                { name: "DistributedLock.java", type: "file", current: true },
              ],
            },
            { name: "CineVerseApplication.java", type: "file" },
          ],
        },
        { name: "src/main/resources/application.yml", type: "file" },
        { name: "pom.xml", type: "file" },
      ],
    },

    decisions: [
      {
        title: "JWT refresh token rotation",
        body: "Access tokens are short-lived. Every refresh issues a brand-new refresh token and invalidates the old one, so a stolen refresh token only works once before the rotation breaks the chain and the session family gets revoked.",
      },
      {
        title: "Idempotent Stripe webhooks",
        body: "Stripe events are de-duplicated by event ID before they touch booking state. If a payment succeeds but the booking write fails, the order drops into a “pending reconciliation” status instead of silently retrying — it waits for a manual check rather than guessing.",
      },
      {
        title: "Raw SQL for aggregation",
        body: "Seat-occupancy and revenue reporting queries are hand-written SQL instead of JPA-generated queries. The aggregations are heavy enough that controlling the exact query plan mattered more than staying inside the ORM.",
      },
    ],
  },

  about: {
    heading: "About",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent volutpat, nisl eget cursus scelerisque, dolor sapien fermentum velit, at cursus arcu mi sed metus.",
      "Sed euismod, nunc eget consectetur sagittis, nisl enim tempor sapien, at cursus arcu mi sed metus. Pellentesque habitant morbi tristique senectus et netus.",
    ],
  },

  skills: {
    heading: "Skills",
    groups: [
      { label: "Languages", items: ["Java", "TypeScript", "JavaScript", "Python", "SQL"] },
      { label: "Frameworks", items: ["Spring Boot", "React", "Node.js"] },
      { label: "Infrastructure", items: ["PostgreSQL", "Redis", "Docker", "AWS"] },
      { label: "Tools", items: ["Git", "Linux", "Figma"] },
    ],
  },

  experience: {
    heading: "Work Experience",
    items: [
      {
        role: "Software Engineer Intern",
        org: "Placeholder Tech Co.",
        period: "Summer 2025",
        bullets: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "Sed do eiusmod tempor incididunt ut labore et dolore magna.",
        ],
      },
      {
        role: "Teaching Assistant",
        org: "Placeholder University",
        period: "2024 – 2025",
        bullets: [
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
        ],
      },
    ],
  },

  contact: {
    heading: "Let's Connect",
    body: "Lorem ipsum dolor sit amet — open to new grad and internship opportunities.",
    cta: { label: "Download Résumé", href: "#" },
    email: "hello@example.com",
    socials: [
      { label: "GitHub", href: "https://github.com/yourusername" },
      { label: "LinkedIn", href: "#" },
    ],
  },

  github: {
    username: "yourusername",
    heatmapWeeks: 52,
    stats: {
      repos: 21,
      stars: 5,
      streakLabel: "Current streak",
      yearLabel: "Contributions this year",
    },
    languages: [
      { name: "Java", percent: 42, color: "#f89820" },
      { name: "JavaScript", percent: 24, color: "#f1e05a" },
      { name: "SQL", percent: 16, color: "#4a90d9" },
      { name: "CSS", percent: 11, color: "#8a5cf5" },
      { name: "Other", percent: 7, color: "#8a8f98" },
    ],
    pinnedRepo: {
      name: "cineverse",
      description: "Full-stack cinema ticketing platform — Spring Boot, PostgreSQL, Redis.",
      language: "Java",
      stars: 5,
      url: "https://github.com/yourusername/cineverse",
    },
  },

  commands: [
    { label: "Go to About", group: "Navigate", action: "scroll", target: "about" },
    { label: "Go to Skills", group: "Navigate", action: "scroll", target: "skills" },
    { label: "Go to CineVerse", group: "Navigate", action: "scroll", target: "cineverse" },
    { label: "Go to Work Experience", group: "Navigate", action: "scroll", target: "experience" },
    { label: "Go to Contact", group: "Navigate", action: "scroll", target: "contact" },
    { label: "Open GitHub Profile", group: "Links", action: "link", target: "https://github.com/yourusername" },
    { label: "Send an Email", group: "Links", action: "mailto", target: "hello@example.com" },
    { label: "Download Résumé", group: "Links", action: "link", target: "#" },
  ],
};
