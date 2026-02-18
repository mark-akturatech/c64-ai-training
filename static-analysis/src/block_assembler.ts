// ============================================================================
// Step 5: Block Assembler — tree nodes → blocks.json format
// ============================================================================

import { Buffer } from "node:buffer";
import type { DependencyTree } from "./dependency_tree.js";
import { formatInstruction } from "./opcode_decoder.js";
import type {
  Block,
  BlockType,
  DataCandidate,
  DecodedInstruction,
  LoadedRegion,
  TreeNode,
  Reachability,
  BasicBlock,
  BlockInstruction,
} from "./types.js";

/** Base64-encode raw bytes from memory for a given address range. */
function encodeRaw(memory: Uint8Array, start: number, end: number): string {
  return Buffer.from(memory.slice(start, end)).toString("base64");
}

/** Extract the operand portion from a formatted instruction string. */
function extractOperand(inst: DecodedInstruction): string {
  const formatted = formatInstruction(inst);
  const mnemonic = inst.info.mnemonic.toUpperCase();
  // Implied-mode instructions have no operand (formatted === mnemonic)
  if (formatted === mnemonic) return "";
  return formatted.slice(mnemonic.length + 1);
}

export function assembleBlocks(
  tree: DependencyTree,
  dataCandidates: DataCandidate[],
  loadedRegions: LoadedRegion[],
  memory: Uint8Array
): Block[] {
  const blocks: Block[] = [];

  // 1. Code blocks — one per contiguous run of nodes within each subroutine
  //    Only include blocks that fall within loaded regions
  const subroutines = tree.getSubroutines();
  for (const subNodes of subroutines) {
    const inRegion = subNodes.filter((n) => isWithinLoadedRegions(n.start, n.end, loadedRegions));
    if (inRegion.length === 0) continue;
    const contiguousRuns = splitIntoContiguousRuns(inRegion);
    for (const run of contiguousRuns) {
      blocks.push(buildCodeBlock(run, tree, memory));
    }
  }

  // 1b. Remove code blocks that overlap with BASIC programs at $0801.
  //     BASIC data can look like valid 6502 instructions; the line-link
  //     chain is stronger evidence than code discovery in this region.
  const basicCandidate = dataCandidates.find(
    (c) => c.start === 0x0801 && c.type === "basic_program"
  );
  if (basicCandidate) {
    for (let i = blocks.length - 1; i >= 0; i--) {
      const b = blocks[i];
      if (b.address >= basicCandidate.start && b.address < basicCandidate.end) {
        blocks.splice(i, 1);
      }
    }
  }

  // 2. Data blocks — from tree data nodes + candidates
  //    Only include blocks that fall within loaded regions
  for (const [, node] of tree.nodes) {
    if (node.type !== "data") continue;
    if (!isWithinLoadedRegions(node.start, node.end, loadedRegions)) continue;
    const candidates = dataCandidates.filter(
      (c) => c.start >= node.start && c.end <= node.end
    );
    blocks.push(buildDataBlock(node, candidates, memory));
  }

  // 3. Fill gaps — promote to data blocks if candidates exist, else unknown
  blocks.push(...fillGaps(blocks, loadedRegions, dataCandidates, memory));

  return blocks;
}

/** Check that a range falls entirely within at least one loaded region. */
function isWithinLoadedRegions(start: number, end: number, regions: LoadedRegion[]): boolean {
  return regions.some((r) => start >= r.start && end <= r.end);
}

/** Split a subroutine's nodes into contiguous runs (no gaps between nodes). */
function splitIntoContiguousRuns(subNodes: TreeNode[]): TreeNode[][] {
  if (subNodes.length <= 1) return [subNodes];

  // Sort by start address
  const sorted = [...subNodes].sort((a, b) => a.start - b.start);
  const runs: TreeNode[][] = [];
  let currentRun: TreeNode[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    // Nodes are contiguous if the current starts at or before the previous ends
    if (curr.start <= prev.end) {
      currentRun.push(curr);
    } else {
      runs.push(currentRun);
      currentRun = [curr];
    }
  }
  runs.push(currentRun);

  return runs;
}

function buildCodeBlock(subNodes: TreeNode[], tree: DependencyTree, memory: Uint8Array): Block {
  const entry = subNodes[0];
  const subId = entry.subroutineId || entry.id;
  const isFragment = subId.startsWith("frag_");

  // Compute address range
  const address = Math.min(...subNodes.map((n) => n.start));
  const endAddress = Math.max(...subNodes.map((n) => n.end));

  // Collect all instructions
  const allInstructions: BlockInstruction[] = [];
  for (const node of subNodes) {
    if (!node.instructions) continue;
    for (const inst of node.instructions) {
      allInstructions.push({
        address: inst.address,
        rawBytes: Array.from(inst.rawBytes)
          .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
          .join(" "),
        mnemonic: inst.info.mnemonic,
        operand: extractOperand(inst),
        addressingMode: inst.info.addressingMode,
        label: null,
      });
    }
  }

  // Build basic blocks
  const basicBlocks: BasicBlock[] = subNodes.map((node) => ({
    start: node.start,
    end: node.end,
    successors: node.edges
      .filter((e) => e.type === "branch" || e.type === "fallthrough" || e.type === "jump")
      .map((e) => e.target),
  }));

  // Collect edges
  const callsOut: number[] = [];
  const calledBy: number[] = [];
  const hardwareRefs: number[] = [];
  const dataRefs: number[] = [];
  const smcTargets: number[] = [];
  const loopBackEdges: Array<{ from: number; to: number }> = [];

  for (const node of subNodes) {
    for (const edge of node.edges) {
      if (edge.type === "call") callsOut.push(edge.target);
      if (edge.type === "hardware_read" || edge.type === "hardware_write") {
        if (!hardwareRefs.includes(edge.target)) hardwareRefs.push(edge.target);
      }
      if (edge.type === "data_read" || edge.type === "data_write" || edge.type === "pointer_ref") {
        if (!dataRefs.includes(edge.target)) dataRefs.push(edge.target);
      }
      if (edge.type === "smc_write") smcTargets.push(edge.target);
      if (edge.type === "branch" && edge.target < edge.sourceInstruction) {
        loopBackEdges.push({ from: edge.sourceInstruction, to: edge.target });
      }
    }
  }

  // Check for incoming call edges
  const incomingCalls = tree.getEdgesTo(address).filter((e) => e.type === "call");
  calledBy.push(...incomingCalls.map((e) => e.sourceInstruction));

  // Determine if this is an IRQ handler
  const isIrq = incomingCalls.some(
    (e) => e.metadata && (e.metadata as Record<string, unknown>).isIrqHandler
  ) || entry.metadata.isIrqHandler === true;

  // Determine block type
  let blockType: BlockType = "subroutine";
  if (isIrq) blockType = "irq_handler";
  else if (isFragment) blockType = "fragment";

  // Reachability
  const isEntryPoint = subNodes.some((n) => n.metadata.isEntryPoint);
  const reachability: Reachability = entry.metadata.speculative
    ? "indirect"
    : calledBy.length > 0 || incomingCalls.length > 0 || isEntryPoint
      ? "proven"
      : "unproven";

  return {
    id: subId,
    address,
    endAddress,
    type: blockType,
    reachability,
    instructions: allInstructions,
    basicBlocks,
    callsOut: [...new Set(callsOut)],
    calledBy: [...new Set(calledBy)],
    loopBackEdges,
    hardwareRefs,
    dataRefs,
    smcTargets,
    isIrqHandler: isIrq,
    entryPoints: [address],
    raw: encodeRaw(memory, address, endAddress),
  };
}

function buildDataBlock(node: TreeNode, candidates: DataCandidate[], memory: Uint8Array): Block {
  // Sort candidates by confidence
  const sorted = [...candidates].sort((a, b) => b.confidence - a.confidence);

  return {
    id: node.id,
    address: node.start,
    endAddress: node.end,
    type: "data",
    reachability: node.metadata.speculative ? "indirect" : "proven",
    candidates: sorted,
    bestCandidate: sorted.length > 0 ? 0 : undefined,
    raw: encodeRaw(memory, node.start, node.end),
  };
}

function fillGaps(
  blocks: Block[],
  loadedRegions: LoadedRegion[],
  dataCandidates: DataCandidate[],
  memory: Uint8Array
): Block[] {
  const owned = new Set<number>();
  for (const block of blocks) {
    for (let addr = block.address; addr < block.endAddress; addr++) {
      owned.add(addr);
    }
  }

  const gapBlocks: Block[] = [];
  for (const region of loadedRegions) {
    let gapStart: number | null = null;
    for (let addr = region.start; addr <= region.end; addr++) {
      const isGap = addr < region.end && !owned.has(addr);
      if (isGap && gapStart === null) {
        gapStart = addr;
      } else if (!isGap && gapStart !== null) {
        gapBlocks.push(...splitGap(gapStart, addr, dataCandidates, memory));
        gapStart = null;
      }
    }
  }

  return gapBlocks;
}

/** Split a gap into blocks using candidate boundaries rather than one monolithic block. */
function splitGap(gapStart: number, gapEnd: number, dataCandidates: DataCandidate[], memory: Uint8Array): Block[] {
  // Find candidates fully within this gap, sorted by start address then by
  // range size ascending — so narrower (more specific) candidates define block
  // boundaries before broader fallback candidates at the same start position
  const contained = dataCandidates
    .filter((c) => c.start >= gapStart && c.end <= gapEnd)
    .sort((a, b) => a.start - b.start || (a.end - a.start) - (b.end - b.start));

  if (contained.length === 0) {
    // No candidates — entire gap is unknown
    return [makeGapBlock(memory,gapStart, gapEnd, [])];
  }

  // Walk the gap, emitting blocks for each candidate and unknown stretches between them
  const result: Block[] = [];
  let pos = gapStart;

  for (const candidate of contained) {
    // Unknown stretch before this candidate
    if (candidate.start > pos) {
      // Check for partially overlapping candidates in this unknown stretch
      const partial = dataCandidates.filter(
        (c) => c.start < candidate.start && c.end > pos && c.start >= gapStart && c.end <= gapEnd
      );
      result.push(makeGapBlock(memory,pos, candidate.start, partial));
    }

    // Only emit if we haven't already covered this address (avoid duplicates from overlapping candidates)
    if (candidate.start >= pos) {
      // Use the candidate's own end — don't extend to cover overlapping candidates
      // that span a larger range (e.g., a jump_table covering the whole gap should
      // not swallow a code island that starts later)
      const blockEnd = candidate.end;

      // Find all candidates that overlap this block's range
      const colocated = contained.filter(
        (c) => c.start < blockEnd && c.end > candidate.start
      );
      // Sort by confidence DESC, then by range size ASC (prefer specific candidates)
      const sorted = [...colocated].sort((a, b) =>
        b.confidence - a.confidence || (a.end - a.start) - (b.end - b.start)
      );

      result.push({
        id: `data_${candidate.start.toString(16).padStart(4, "0")}`,
        address: candidate.start,
        endAddress: blockEnd,
        type: "data",
        reachability: "unproven",
        candidates: sorted,
        bestCandidate: 0,
        raw: encodeRaw(memory, candidate.start, blockEnd),
      });
      pos = blockEnd;
    }
  }

  // Unknown stretch after last candidate
  if (pos < gapEnd) {
    const partial = dataCandidates.filter(
      (c) => c.start >= pos && c.start < gapEnd && c.end > pos
    );
    result.push(makeGapBlock(memory,pos, gapEnd, partial));
  }

  return result;
}

function makeGapBlock(memory: Uint8Array, start: number, end: number, candidates: DataCandidate[]): Block {
  if (candidates.length > 0) {
    const sorted = [...candidates].sort((a, b) => b.confidence - a.confidence);
    return {
      id: `data_${start.toString(16).padStart(4, "0")}`,
      address: start,
      endAddress: end,
      type: "data",
      reachability: "unproven",
      candidates: sorted,
      bestCandidate: 0,
      raw: encodeRaw(memory, start, end),
    };
  }
  return {
    id: `unknown_${start.toString(16).padStart(4, "0")}`,
    address: start,
    endAddress: end,
    type: "unknown",
    reachability: "unproven",
    raw: encodeRaw(memory, start, end),
  };
}
