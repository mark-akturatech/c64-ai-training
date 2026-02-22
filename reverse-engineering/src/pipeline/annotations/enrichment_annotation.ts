// Enrichment Annotation (Priority 20)
// Annotations from Stage 1 enrichment plugins.

import type { AnnotationSource, AnnotationSourceInput } from "./types.js";

export class EnrichmentAnnotation implements AnnotationSource {
  name = "enrichment";
  priority = 20;

  annotate(input: AnnotationSourceInput): string | null {
    // Look through enrichments for this instruction's address
    for (const enrichment of input.enrichments) {
      if (enrichment.data?.instructionAddress === input.instruction.address) {
        return enrichment.annotation;
      }
    }
    return null;
  }
}
