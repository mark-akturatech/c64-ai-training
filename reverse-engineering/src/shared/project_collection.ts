// ============================================================================
// Project Collection — Qdrant collection for project-specific block embeddings
//
// Stores analyzed blocks with their purposes, categories, and variable maps.
// Enables cross-block similarity search and pattern matching within a project.
// ============================================================================

import type {
  ProjectCollectionInterface,
  BlockAnalysis,
  VariableMapData,
  NormalizedPattern,
  SimilarBlock,
  VariableUsage,
  PatternMatch,
} from "../types.js";

/**
 * In-memory project collection for Stage 2+3.
 * In production, this would use Qdrant. For now, we store blocks locally
 * and do simple text matching for similarity search.
 */
export class ProjectCollection implements ProjectCollectionInterface {
  private blocks = new Map<string, BlockAnalysis>();
  private patterns = new Map<string, { analysis: BlockAnalysis; pattern: NormalizedPattern }>();

  async embedBlock(analysis: BlockAnalysis, _varDict?: VariableMapData): Promise<void> {
    this.blocks.set(analysis.blockId, analysis);
  }

  async searchSimilar(query: string, _hardwareRefs: string[], limit = 5): Promise<SimilarBlock[]> {
    const results: SimilarBlock[] = [];
    const queryLower = query.toLowerCase();

    for (const analysis of this.blocks.values()) {
      const text = `${analysis.purpose} ${analysis.category} ${analysis.algorithm ?? ""}`.toLowerCase();
      // Simple token overlap scoring
      const queryTokens = queryLower.split(/\s+/);
      const textTokens = text.split(/\s+/);
      const overlap = queryTokens.filter(t => textTokens.includes(t)).length;
      if (overlap > 0) {
        results.push({
          blockId: analysis.blockId,
          purpose: analysis.purpose,
          category: analysis.category,
          score: overlap / queryTokens.length,
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  async searchByVariable(address: string, limit = 5): Promise<VariableUsage[]> {
    const results: VariableUsage[] = [];

    for (const analysis of this.blocks.values()) {
      if (analysis.variables && analysis.variables[address]) {
        results.push({
          blockId: analysis.blockId,
          variableName: analysis.variables[address],
          scope: "local",
          confidence: "MEDIUM",
        });
      }
    }

    return results.slice(0, limit);
  }

  async promoteToPatterns(block: BlockAnalysis, normalized: NormalizedPattern): Promise<void> {
    this.patterns.set(block.blockId, { analysis: block, pattern: normalized });
  }

  async searchPatterns(query: string, _hardwareRefs: string[], limit = 5): Promise<PatternMatch[]> {
    const results: PatternMatch[] = [];
    const queryLower = query.toLowerCase();

    for (const { pattern } of this.patterns.values()) {
      if (pattern.pattern.toLowerCase().includes(queryLower) ||
          pattern.category.toLowerCase().includes(queryLower)) {
        results.push({
          pattern: pattern.pattern,
          category: pattern.category,
          score: 0.8,
          source: "project_collection",
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}
