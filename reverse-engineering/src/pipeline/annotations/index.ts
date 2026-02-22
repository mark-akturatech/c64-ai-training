// ============================================================================
// Annotation Source Registry — static imports for all annotation sources
// ============================================================================

import type { AnnotationSource, AnnotationSourceInput } from "./types.js";

import { SymbolDbAnnotation } from "./symbol_db_annotation.js";
import { EnrichmentAnnotation } from "./enrichment_annotation.js";
import { ConstantAnnotation } from "./constant_annotation.js";
import { KernalApiAnnotation } from "./kernal_api_annotation.js";

export function createAllAnnotationSources(): AnnotationSource[] {
  const sources: AnnotationSource[] = [
    new SymbolDbAnnotation(),
    new EnrichmentAnnotation(),
    new ConstantAnnotation(),
    new KernalApiAnnotation(),
  ];
  sources.sort((a, b) => a.priority - b.priority);
  return sources;
}

/**
 * Try all annotation sources in priority order. Returns the first non-null result.
 * If ALL return null, the instruction should go to the AI batch.
 */
export function annotateInstruction(
  sources: AnnotationSource[],
  input: AnnotationSourceInput,
): { annotation: string; source: string } | null {
  for (const src of sources) {
    const result = src.annotate(input);
    if (result !== null) {
      return { annotation: result, source: src.name };
    }
  }
  return null;
}
