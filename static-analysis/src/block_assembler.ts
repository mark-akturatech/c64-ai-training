// ============================================================================
// Step 5: Block Assembler — tree nodes → blocks.json format
// ============================================================================

import type { DependencyTree } from "./dependency_tree.js";
import { formatInstruction } from "./opcode_decoder.js";
import type {
  Block,
  BlockType,
  DataCandidate,
  LoadedRegion,
  TreeNode,
  Reachability,
  BasicBlock,
  BlockInstruction,
} from "./types.js";

export function assembleBlocks(
  tree: DependencyTree,
  dataCandidates: DataCandidate[],
  loadedRegions: LoadedRegion[]
): Block[] {
  const blocks: Block[] = [];

  // 1. Code blocks — one per contiguous run of nodes within each subroutine
  const subroutines = tree.getSubroutines();
  for (const subNodes of subroutines) {
    const contiguousRuns = splitIntoContiguousRuns(subNodes);
    for (const run of contiguousRuns) {
      blocks.push(buildCodeBlock(run, tree));
    }
  }

  // 2. Data blocks — from tree data nodes + candidates
  for (const [, node] of tree.nodes) {
    if (node.type !== "data") continue;
    const candidates = dataCandidates.filter(
      (c) => c.start >= node.start && c.end <= node.end
    );
    blocks.push(buildDataBlock(node, candidates));
  }

  // 3. Fill gaps — promote to data blocks if candidates exist, else unknown
  blocks.push(...fillGaps(blocks, loadedRegions, dataCandidates));

  return blocks;
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

function buildCodeBlock(subNodes: TreeNode[], tree: DependencyTree): Block {
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
        operand: formatInstruction(inst).replace(`${inst.info.mnemonic.toUpperCase()} `, ""),
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
  };
}

function buildDataBlock(node: TreeNode, candidates: DataCandidate[]): Block {
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
  };
}

function fillGaps(
  blocks: Block[],
  loadedRegions: LoadedRegion[],
  dataCandidates: DataCandidate[]
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
        // Check if any data candidates overlap this gap
        const overlapping = dataCandidates.filter(
          (c) => c.start < addr && c.end > gapStart!
        );
        if (overlapping.length > 0) {
          const sorted = [...overlapping].sort((a, b) => b.confidence - a.confidence);
          gapBlocks.push({
            id: `data_${gapStart.toString(16).padStart(4, "0")}`,
            address: gapStart,
            endAddress: addr,
            type: "data",
            reachability: "unproven",
            candidates: sorted,
            bestCandidate: 0,
          });
        } else {
          gapBlocks.push({
            id: `unknown_${gapStart.toString(16).padStart(4, "0")}`,
            address: gapStart,
            endAddress: addr,
            type: "unknown",
            reachability: "unproven",
          });
        }
        gapStart = null;
      }
    }
  }

  return gapBlocks;
}
