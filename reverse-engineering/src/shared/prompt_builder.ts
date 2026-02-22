// ============================================================================
// Prompt Builder — assembles AI prompt sections with token budgeting
//
// Takes context contributions from all context providers, sorts by priority,
// and assembles them into a single prompt string. Supports token budgeting
// to prevent exceeding model context limits.
// ============================================================================

import type { ContextContribution } from "../types.js";

const DEFAULT_MAX_TOKENS = 8000;

export interface PromptBuilderOptions {
  maxTokens?: number;
  systemPrefix?: string;
  userSuffix?: string;
}

export interface BuiltPrompt {
  system: string;
  user: string;
  totalTokenEstimate: number;
  sectionsIncluded: string[];
  sectionsTruncated: string[];
}

/**
 * Build a structured prompt from context contributions.
 * Sections are ordered by priority (lower number = earlier in prompt).
 * If total tokens would exceed budget, lower-priority sections are truncated.
 */
export function buildPrompt(
  contributions: ContextContribution[],
  block: { address: number; type: string; instructions?: unknown[] },
  options: PromptBuilderOptions = {},
): BuiltPrompt {
  const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;

  // Sort by priority (lower = more important = earlier)
  const sorted = [...contributions].sort((a, b) => a.priority - b.priority);

  const sections: string[] = [];
  const sectionsIncluded: string[] = [];
  const sectionsTruncated: string[] = [];
  let tokenBudget = maxTokens;

  // Reserve tokens for system prefix + user suffix
  const prefixTokens = estimateTokens(options.systemPrefix ?? "");
  const suffixTokens = estimateTokens(options.userSuffix ?? "");
  tokenBudget -= prefixTokens + suffixTokens + 200; // 200 for block header

  // Add block header
  const blockHeader = `## Block at $${hex(block.address)} (${block.type})`;
  sections.push(blockHeader);

  for (const contrib of sorted) {
    if (tokenBudget <= 0) {
      sectionsTruncated.push(contrib.section);
      continue;
    }

    if (contrib.tokenEstimate <= tokenBudget) {
      sections.push(`### ${contrib.section}\n${contrib.content}`);
      sectionsIncluded.push(contrib.section);
      tokenBudget -= contrib.tokenEstimate;
    } else {
      // Truncate to fit remaining budget
      const truncated = truncateToTokens(contrib.content, tokenBudget);
      sections.push(`### ${contrib.section} (truncated)\n${truncated}`);
      sectionsTruncated.push(contrib.section);
      tokenBudget = 0;
    }
  }

  const system = options.systemPrefix
    ? `${options.systemPrefix}\n\n${sections.join("\n\n")}`
    : sections.join("\n\n");

  const user = options.userSuffix ?? "";

  return {
    system,
    user,
    totalTokenEstimate: maxTokens - tokenBudget,
    sectionsIncluded,
    sectionsTruncated,
  };
}

/**
 * Rough token estimate (~4 chars per token for English/code).
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function truncateToTokens(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n... (truncated)";
}

function hex(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, "0");
}
