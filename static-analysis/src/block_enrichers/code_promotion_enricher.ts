// ============================================================================
// Code Promotion Enricher
// Promotes data/unknown blocks to code blocks when the code detector has
// identified unreached code islands within them. Splits blocks as needed:
// code islands become code blocks, remaining gaps stay as data/unknown.
// ============================================================================

import { decode, formatInstruction } from "../opcode_decoder.js";
import type { Block, BlockInstruction, BasicBlock, DataCandidate } from "../types.js";
import type { BlockEnricher, EnricherContext } from "./types.js";

const MIN_CONFIDENCE = 30;

export class CodePromotionEnricher implements BlockEnricher {
  name = "code_promotion";
  description = "Promotes data blocks to code when unreached code islands are detected";
  priority = 5; // before sub_splitter (20), label_generator (50), etc.

  enrich(blocks: Block[], context: EnricherContext): Block[] {
    const result: Block[] = [];
    let promotedCount = 0;

    for (const block of blocks) {
      if (block.type !== "data" && block.type !== "unknown") {
        result.push(block);
        continue;
      }

      const codeCandidates = (block.candidates || []).filter(
        (c) => c.type === "code" && c.confidence >= MIN_CONFIDENCE
      );

      if (codeCandidates.length === 0) {
        result.push(block);
        continue;
      }

      // Sort by start address, merge overlapping
      codeCandidates.sort((a, b) => a.start - b.start);
      const merged = mergeOverlapping(codeCandidates);

      // Split block into code and data pieces
      const pieces = this.splitBlock(block, merged, context);
      result.push(...pieces);
      promotedCount += merged.length;
    }

    if (promotedCount > 0) {
      console.error(`  code_promotion: promoted ${promotedCount} unreached code region(s)`);
    }

    return result;
  }

  private splitBlock(
    block: Block,
    codeRegions: DataCandidate[],
    context: EnricherContext
  ): Block[] {
    const pieces: Block[] = [];
    let cursor = block.address;

    for (const region of codeRegions) {
      // Gap before this code region → keep as data
      if (region.start > cursor) {
        const gapBlock = this.buildRemainder(block, cursor, region.start);
        if (gapBlock) pieces.push(gapBlock);
      }

      // The code region itself → promote to code block
      const codeBlock = this.buildCodeBlock(region, context);
      if (codeBlock) {
        pieces.push(codeBlock);
      } else {
        // Decode failed — keep as data
        const fallback = this.buildRemainder(block, region.start, region.end);
        if (fallback) pieces.push(fallback);
      }

      cursor = region.end;
    }

    // Gap after last code region → keep as data
    if (cursor < block.endAddress) {
      const tailBlock = this.buildRemainder(block, cursor, block.endAddress);
      if (tailBlock) pieces.push(tailBlock);
    }

    return pieces;
  }

  private buildCodeBlock(
    candidate: DataCandidate,
    context: EnricherContext
  ): Block | null {
    const instructions: BlockInstruction[] = [];
    let addr = candidate.start;

    while (addr < candidate.end) {
      const inst = decode(context.memory, addr);
      if (!inst || addr + inst.info.bytes > candidate.end) break;

      instructions.push({
        address: inst.address,
        rawBytes: Array.from(inst.rawBytes)
          .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
          .join(" "),
        mnemonic: inst.info.mnemonic,
        operand: formatInstruction(inst).replace(`${inst.info.mnemonic.toUpperCase()} `, ""),
        addressingMode: inst.info.addressingMode,
        label: null,
      });

      addr += inst.info.bytes;
    }

    if (instructions.length === 0) return null;

    // Build basic block (single block for now — sub_splitter can refine later)
    const basicBlocks: BasicBlock[] = [
      {
        start: candidate.start,
        end: addr,
        successors: [],
      },
    ];

    const isSubroutine = candidate.subtype === "unreached_subroutine";

    return {
      id: `${isSubroutine ? "sub" : "frag"}_${candidate.start.toString(16).padStart(4, "0")}`,
      address: candidate.start,
      endAddress: addr,
      type: isSubroutine ? "subroutine" : "fragment",
      reachability: "unproven",
      instructions,
      basicBlocks,
      callsOut: [],
      calledBy: [],
      loopBackEdges: [],
      hardwareRefs: [],
      dataRefs: [],
      smcTargets: [],
      entryPoints: [candidate.start],
      comments: [candidate.comment],
      annotations: {
        promotedFrom: "code_detector",
        confidence: String(candidate.confidence),
        evidence: candidate.evidence.join("; "),
      },
    };
  }

  private buildRemainder(
    originalBlock: Block,
    start: number,
    end: number
  ): Block | null {
    if (end <= start) return null;

    // Filter candidates that fall within this remainder region
    const candidates = (originalBlock.candidates || []).filter(
      (c) => c.type !== "code" && c.start >= start && c.end <= end
    );
    const sorted = [...candidates].sort((a, b) => b.confidence - a.confidence);

    const hasCandidate = sorted.length > 0;

    return {
      id: `${hasCandidate ? "data" : "unknown"}_${start.toString(16).padStart(4, "0")}`,
      address: start,
      endAddress: end,
      type: hasCandidate ? "data" : originalBlock.type,
      reachability: originalBlock.reachability,
      candidates: sorted.length > 0 ? sorted : undefined,
      bestCandidate: sorted.length > 0 ? 0 : undefined,
    };
  }
}

function mergeOverlapping(candidates: DataCandidate[]): DataCandidate[] {
  if (candidates.length <= 1) return candidates;

  const merged: DataCandidate[] = [{ ...candidates[0] }];

  for (let i = 1; i < candidates.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = candidates[i];

    if (curr.start <= prev.end) {
      // Overlapping — extend the previous, keep higher confidence
      prev.end = Math.max(prev.end, curr.end);
      if (curr.confidence > prev.confidence) {
        prev.confidence = curr.confidence;
        prev.subtype = curr.subtype;
        prev.evidence = curr.evidence;
        prev.comment = curr.comment;
      }
    } else {
      merged.push({ ...curr });
    }
  }

  return merged;
}
