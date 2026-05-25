import type { AppTemplate } from "@/types/app";
import { templates } from "@/config/templates";

interface MatchResult {
  template: AppTemplate;
  confidence: number;
  matchedKeywords: string[];
}

function normalizePrompt(prompt: string): string[] {
  return prompt
    .toLowerCase()
    .split(/[\s,.!?;:()]+/)
    .filter((word) => word.length > 0);
}

function calculateScore(
  promptWords: string[],
  template: AppTemplate
): { score: number; matchedKeywords: string[] } {
  let score = 0;
  const matchedKeywords: string[] = [];

  // Score tags
  for (const tag of template.tags) {
    const tagLower = tag.toLowerCase();
    
    // Exact match
    if (promptWords.includes(tagLower)) {
      score += 1;
      matchedKeywords.push(tag);
    } else {
      // Partial match
      for (const word of promptWords) {
        if (word.includes(tagLower) || tagLower.includes(word)) {
          score += 0.5;
          matchedKeywords.push(tag);
          break;
        }
      }
    }
  }

  // Score template name words
  const nameWords = template.name.toLowerCase().split(/\s+/);
  for (const nameWord of nameWords) {
    if (promptWords.includes(nameWord)) {
      score += 1;
      matchedKeywords.push(nameWord);
    }
  }

  // Score category
  const categoryLower = template.category.toLowerCase();
  if (promptWords.includes(categoryLower)) {
    score += 1;
    matchedKeywords.push(template.category);
  }

  return { score, matchedKeywords };
}

export function matchTemplate(
  prompt: string
): MatchResult | null {
  if (!prompt || prompt.trim().length === 0) {
    return null;
  }

  const promptWords = normalizePrompt(prompt);
  let bestMatch: MatchResult | null = null;
  let bestScore = 0;

  for (const template of templates) {
    const { score, matchedKeywords } = calculateScore(promptWords, template);
    
    // Calculate confidence: (score / template.tags.length) clamped to 0-1
    const confidence = Math.min(
      Math.max(score / template.tags.length, 0),
      1
    );
    const roundedConfidence = Math.round(confidence * 100) / 100;

    if (roundedConfidence >= 0.15 && roundedConfidence > bestScore) {
      bestScore = roundedConfidence;
      bestMatch = {
        template,
        confidence: roundedConfidence,
        matchedKeywords: [...new Set(matchedKeywords)], // Remove duplicates
      };
    }
  }

  return bestMatch;
}

export function suggestReformulation(prompt: string): string {
  return "Try describing the type of data you're managing, e.g. 'a CRM for tracking customers and deals' or 'an analytics dashboard for revenue metrics'.";
}
