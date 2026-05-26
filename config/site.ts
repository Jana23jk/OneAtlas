export const siteConfig = {
  name: "OneAtlas",
  tagline: "Build internal tools at the speed of thought.",
  description:
    "AI-native runtime app platform — ship full-stack apps from prompts, templates, and live runtime.",
  navLinks: [
    { label: "Product",    href: "#how-it-works" },
    { label: "Templates",  href: "#templates" },
    { label: "Security",   href: "/security" },
    { label: "Docs",       href: "/docs" },
  ],
} as const;

export type NavLink = (typeof siteConfig.navLinks)[number];

export const pricingTiers = [
  {
    name: "Free",
    price: null,
    priceLabel: "$0 / mo",
    description: "For solo builders and side projects.",
    cta: "Get Started",
    ctaHref: "/generate",
    highlighted: false,
    features: [
      "Up to 3 apps",
      "5 schema edits / day",
      "Community templates",
      "Public preview links",
    ],
  },
  {
    name: "Pro",
    price: 29,
    priceLabel: "$29 / mo",
    description: "For teams shipping real internal tools.",
    cta: "Start Free Trial",
    ctaHref: "/generate?plan=pro",
    highlighted: true,
    features: [
      "Unlimited apps",
      "Unlimited schema edits",
      "Private deployments",
      "Version history & undo",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: null,
    priceLabel: "Custom",
    description: "For orgs that need control at scale.",
    cta: "Contact Sales",
    ctaHref: "/contact",
    highlighted: false,
    features: [
      "SSO & SAML",
      "Audit logs",
      "Custom retention",
      "SLA guarantee",
    ],
  },
] as const;

export type PricingTier = (typeof pricingTiers)[number];
