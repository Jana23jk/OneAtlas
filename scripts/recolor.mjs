import fs from "fs";
import path from "path";

const replacements = [
  [/#635BFF/gi, "#7A73FF"],
  [/#0A2540/gi, "#1A1F36"],
  [/#F7F8FF/gi, "#F8F9FF"],
  [/#00D4B1/gi, "#7A73FF"],
  [/#00D4FF/gi, "#7A73FF"],
  [/#FF5996/gi, "#FFB17A"],
  [/#F8BC42/gi, "#FFB17A"],
  [/rgba\(99,\s*91,\s*255/g, "rgba(122, 115, 255"],
  [/rgba\(0,\s*212,\s*177/g, "rgba(122, 115, 255"],
  [/rgba\(0,\s*212,\s*255/g, "rgba(122, 115, 255"],
  [/rgba\(255,\s*89,\s*150/g, "rgba(255, 177, 122"],
  [/brand-primary-light/g, "brand-primary"],
  [/brand-pink/g, "brand-accent"],
  [/brand-teal/g, "brand-primary"],
  [/brand-cyan/g, "brand-primary"],
  [/brand-yellow/g, "brand-accent"],
  [/from-\[#7A73FF\] to-\[#7A73FF\]/g, "from-[#7A73FF] to-[#6B64E8]"],
  [/linear-gradient\(90deg,\s*#7a73ff,\s*#7a73ff\)/gi, "#7A73FF"],
  [/linear-gradient\(90deg,\s*#635bff,\s*#7a73ff\)/gi, "#7A73FF"],
];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (!["node_modules", ".next", ".git"].includes(name)) walk(p);
    } else if (/\.(tsx|ts|css)$/.test(name)) {
      let content = fs.readFileSync(p, "utf8");
      const orig = content;
      for (const [re, rep] of replacements) {
        content = content.replace(re, rep);
      }
      if (content !== orig) {
        fs.writeFileSync(p, content);
        console.log("updated", p);
      }
    }
  }
}

walk("app");
walk("components");
