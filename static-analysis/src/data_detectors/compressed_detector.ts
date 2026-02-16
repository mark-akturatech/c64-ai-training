// ============================================================================
// Compressed / Encrypted Data Detector
// Uses Shannon entropy analysis to detect compressed or encrypted data.
// Also checks for known packer signatures:
//   - Exomizer (common C64 cruncher)
//   - ByteBoozer (fast C64 packer)
//   - Pucrunch (efficient C64 packer)
// High entropy (>7.5 bits/byte) over a substantial region (>256 bytes)
// suggests data that has been compressed, encrypted, or is random.
// ============================================================================

import type { DataCandidate } from "../types.js";
import type { DetectorContext, DataDetector } from "./types.js";

const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

const MIN_REGION_FOR_ENTROPY = 256;
const HIGH_ENTROPY_THRESHOLD = 7.5; // bits per byte (max is 8.0)
const MODERATE_ENTROPY_THRESHOLD = 7.0;

// Known packer signatures (byte patterns at start of packed data)
interface PackerSignature {
  name: string;
  pattern: number[];
  offset: number; // offset from region start to check
}

const PACKER_SIGNATURES: PackerSignature[] = [
  {
    // Exomizer v2/v3 forward decruncher marker
    // Typical Exomizer stream starts with specific bit patterns
    name: "Exomizer",
    pattern: [0x00, 0x00],
    offset: 0,
  },
  {
    // ByteBoozer v2 signature
    // ByteBoozer packed data starts with a specific header
    name: "ByteBoozer",
    pattern: [0x00],
    offset: 0,
  },
];

// More reliable: check for Exomizer/ByteBoozer decrunch routine signatures
// These are code patterns that appear in the decruncher stub
const DECRUNCH_PATTERNS = {
  exomizer: {
    // Exomizer uses a characteristic sequence in its decruncher
    description: "Exomizer decruncher",
    // The get_bits routine in Exomizer uses ROL + BCC pattern
  },
  byteboozer: {
    description: "ByteBoozer decruncher",
    // ByteBoozer has a characteristic LDA (zp),Y + DEY pattern
  },
};

export class CompressedDetector implements DataDetector {
  name = "compressed";
  description = "Detects compressed/encrypted data via Shannon entropy analysis and packer signatures";

  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[] {
    const candidates: DataCandidate[] = [];
    const regionSize = region.end - region.start;

    if (regionSize < MIN_REGION_FOR_ENTROPY) return candidates;
    if (this.hasCode(region.start, region.end, context)) return candidates;

    // Check for known packer signatures first
    const packerMatch = this.checkPackerSignatures(memory, region, context);
    if (packerMatch) {
      candidates.push({
        start: region.start,
        end: region.end,
        detector: this.name,
        type: "compressed_data",
        subtype: `packed_${packerMatch.name.toLowerCase()}`,
        confidence: 80,
        evidence: [
          `Known packer signature: ${packerMatch.name}`,
          `Region size: ${regionSize} bytes`,
          ...packerMatch.evidence,
        ],
        label: `packed_${packerMatch.name.toLowerCase()}`,
        comment: `${packerMatch.name}-packed data, ${regionSize} bytes`,
      });
      return candidates;
    }

    // Calculate Shannon entropy
    const entropy = this.calculateEntropy(memory, region.start, region.end);

    if (entropy >= HIGH_ENTROPY_THRESHOLD) {
      // High entropy — likely compressed or encrypted
      const flatness = this.calculateFlatness(memory, region.start, region.end);

      candidates.push({
        start: region.start,
        end: region.end,
        detector: this.name,
        type: "compressed_data",
        subtype: flatness > 0.9 ? "encrypted_or_random" : "compressed",
        confidence: 60,
        evidence: [
          `Shannon entropy: ${entropy.toFixed(3)} bits/byte (threshold: ${HIGH_ENTROPY_THRESHOLD})`,
          `Byte distribution flatness: ${(flatness * 100).toFixed(1)}%`,
          `Region size: ${regionSize} bytes`,
          flatness > 0.9
            ? "Very uniform distribution suggests encryption or random data"
            : "High entropy suggests compression (some structure remains)",
        ],
        label: flatness > 0.9 ? "encrypted_data" : "compressed_data",
        comment: `${flatness > 0.9 ? "Encrypted/random" : "Compressed"} data, entropy ${entropy.toFixed(2)} bits/byte, ${regionSize} bytes`,
      });
    } else if (entropy >= MODERATE_ENTROPY_THRESHOLD && regionSize >= 512) {
      // Moderate entropy — possibly compressed with lower ratio
      candidates.push({
        start: region.start,
        end: region.end,
        detector: this.name,
        type: "compressed_data",
        subtype: "possibly_compressed",
        confidence: 35,
        evidence: [
          `Shannon entropy: ${entropy.toFixed(3)} bits/byte (moderate, threshold: ${MODERATE_ENTROPY_THRESHOLD})`,
          `Region size: ${regionSize} bytes`,
          "Moderate entropy — could be lightly compressed data or complex structured data",
        ],
        label: "possibly_compressed",
        comment: `Possibly compressed data, entropy ${entropy.toFixed(2)} bits/byte, ${regionSize} bytes`,
      });
    }

    return candidates;
  }

  private hasCode(start: number, end: number, context: DetectorContext): boolean {
    for (let i = start; i < end; i++) {
      if (context.byteRole[i] === ROLE_OPCODE || context.byteRole[i] === ROLE_OPERAND) {
        return true;
      }
    }
    return false;
  }

  /**
   * Calculate Shannon entropy of a byte sequence.
   * Returns bits per byte (0-8 range).
   * 0 = all same byte, 8 = perfectly uniform distribution.
   */
  private calculateEntropy(
    memory: Uint8Array,
    start: number,
    end: number
  ): number {
    const len = end - start;
    if (len === 0) return 0;

    // Count byte frequencies
    const freq = new Uint32Array(256);
    for (let i = start; i < end; i++) {
      freq[memory[i]]++;
    }

    // Calculate entropy: H = -sum(p * log2(p))
    let entropy = 0;
    for (let i = 0; i < 256; i++) {
      if (freq[i] === 0) continue;
      const p = freq[i] / len;
      entropy -= p * Math.log2(p);
    }

    return entropy;
  }

  /**
   * Calculate how "flat" the byte distribution is.
   * A perfectly uniform distribution returns 1.0.
   * Uses chi-squared-like metric: 1 - normalized variance.
   */
  private calculateFlatness(
    memory: Uint8Array,
    start: number,
    end: number
  ): number {
    const len = end - start;
    if (len === 0) return 0;

    const freq = new Uint32Array(256);
    for (let i = start; i < end; i++) {
      freq[memory[i]]++;
    }

    const expected = len / 256;
    let sumSqDiff = 0;
    for (let i = 0; i < 256; i++) {
      const diff = freq[i] - expected;
      sumSqDiff += diff * diff;
    }

    // Normalize: max variance is when one byte has all counts
    const maxVariance = expected * expected * 255 + (len - expected) * (len - expected);
    const normalizedVariance = sumSqDiff / maxVariance;

    return Math.max(0, 1 - normalizedVariance);
  }

  private checkPackerSignatures(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): { name: string; evidence: string[] } | null {
    // Instead of just checking byte patterns (which are unreliable for
    // Exomizer/ByteBoozer since their packed data has no fixed header),
    // check if the code references suggest a decruncher is present.

    // Look for code nodes that reference both the packed data region
    // AND write to memory in a decompression pattern
    const references = this.getRegionReferences(region, context);
    if (references.length === 0) return null;

    // Check for Exomizer-style patterns:
    // The decruncher typically reads from the packed data and writes
    // sequentially to a destination address
    for (const edge of references) {
      const sourceNode = context.tree.findNodeContaining(edge.sourceInstruction);
      if (!sourceNode || sourceNode.type !== "code") continue;

      // Check if the source node's metadata suggests a packer
      if (sourceNode.metadata?.packerType) {
        const packerName = String(sourceNode.metadata.packerType);
        return {
          name: packerName,
          evidence: [
            `Decruncher code at $${sourceNode.start.toString(16).padStart(4, "0")} references packed data`,
            `Packer identified from decruncher pattern: ${packerName}`,
          ],
        };
      }
    }

    // Check if the region itself has metadata suggesting it's packed
    if (context.treeNode?.metadata?.packerType) {
      const packerName = String(context.treeNode.metadata.packerType);
      return {
        name: packerName,
        evidence: [
          `Region metadata indicates packer: ${packerName}`,
        ],
      };
    }

    return null;
  }

  private getRegionReferences(
    region: { start: number; end: number },
    context: DetectorContext
  ): import("../types.js").TreeEdge[] {
    const refs: import("../types.js").TreeEdge[] = [];
    for (const edge of context.codeRefs) {
      if (
        (edge.type === "data_read" || edge.type === "pointer_ref") &&
        edge.target >= region.start &&
        edge.target < region.end
      ) {
        refs.push(edge);
      }
    }
    return refs;
  }
}
