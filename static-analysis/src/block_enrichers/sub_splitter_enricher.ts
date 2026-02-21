import type { Block } from "../types.js";
import type { BlockEnricher, EnricherContext } from "./types.js";

const DEFAULT_THRESHOLD = 120;

export class SubSplitterEnricher implements BlockEnricher {
  name = "sub_splitter";
  description = "Breaks oversized blocks into sub-blocks at natural boundaries";
  priority = 20;

  enrich(blocks: Block[], context: EnricherContext): Block[] {
    const result: Block[] = [];

    for (const block of blocks) {
      if (
        block.type !== "subroutine" &&
        block.type !== "irq_handler" &&
        block.type !== "fragment"
      ) {
        result.push(block);
        continue;
      }

      const instrCount = block.instructions?.length || 0;
      if (instrCount <= DEFAULT_THRESHOLD) {
        result.push(block);
        continue;
      }

      // Find split points
      const splitPoints = findSplitPoints(block);
      if (splitPoints.length === 0) {
        result.push(block);
        continue;
      }

      // Split tree nodes at the corresponding addresses
      const instructions = block.instructions || [];
      for (const splitIdx of splitPoints) {
        const splitAddr = instructions[splitIdx]?.address;
        if (splitAddr !== undefined) {
          // Find the tree node that contains this address and split it
          const treeNode = context.tree.findNodeContaining(splitAddr);
          if (treeNode && splitAddr > treeNode.start && splitAddr < treeNode.end) {
            try {
              context.tree.splitNode(treeNode.start, splitAddr);
            } catch {
              // Node may have already been split by a previous split point
            }
          }
        }
      }

      // Split into sub-blocks
      const subBlocks = splitAtPoints(block, splitPoints);
      result.push(...subBlocks);
    }

    return result;
  }
}

function findSplitPoints(block: Block): number[] {
  const points: number[] = [];
  const instructions = block.instructions || [];
  if (instructions.length === 0) return points;

  // Loop headers (back-edge targets)
  if (block.loopBackEdges) {
    for (const edge of block.loopBackEdges) {
      const idx = instructions.findIndex((i) => i.address === edge.to);
      if (idx > 0) points.push(idx);
    }
  }

  // After long linear sequences (every ~80 instructions)
  for (let i = 80; i < instructions.length; i += 80) {
    // Find nearest branch/jump nearby
    for (let j = Math.max(0, i - 10); j < Math.min(instructions.length, i + 10); j++) {
      const mnemonic = instructions[j].mnemonic;
      if (
        ["jmp", "jsr", "rts", "rti", "bne", "beq", "bcc", "bcs", "bpl", "bmi", "bvc", "bvs"].includes(mnemonic)
      ) {
        if (!points.includes(j + 1) && j + 1 < instructions.length) {
          points.push(j + 1);
        }
        break;
      }
    }
  }

  // Deduplicate and sort
  return [...new Set(points)].sort((a, b) => a - b);
}

function splitAtPoints(block: Block, splitIndices: number[]): Block[] {
  const instructions = block.instructions || [];
  const allIndices = [0, ...splitIndices, instructions.length];
  const subBlocks: Block[] = [];
  const siblingIds: string[] = [];

  // Generate sibling IDs first
  for (let i = 0; i < allIndices.length - 1; i++) {
    siblingIds.push(`${block.id}__part${i}`);
  }

  const summaries: Record<string, string> = {};

  for (let i = 0; i < allIndices.length - 1; i++) {
    const start = allIndices[i];
    const end = allIndices[i + 1];
    const subInsts = instructions.slice(start, end);
    const subId = siblingIds[i];

    const first = subInsts[0];
    const last = subInsts[subInsts.length - 1];
    summaries[subId] = `Lines ${start + 1}-${end}: ${first.mnemonic.toUpperCase()} ${first.operand} ... ${last.mnemonic.toUpperCase()} ${last.operand}`;

    subBlocks.push({
      ...block,
      id: subId,
      address: first.address,
      endAddress: last.address + last.rawBytes.split(" ").length,
      instructions: subInsts,
      parentBlock: block.id,
      subBlockIndex: i,
      subBlockCount: allIndices.length - 1,
      siblings: siblingIds.filter((id) => id !== subId),
      siblingSummaries: summaries,
    });
  }

  return subBlocks;
}
