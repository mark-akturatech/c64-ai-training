import type { DiscoveryPlugin, WalkContext, PluginResult } from "./types.js";
import type { TreeNode } from "../types.js";

export class InlineDataPlugin implements DiscoveryPlugin {
  name = "inline_data_detector";
  description = "Detects inline data between an unconditional jump and the jump target";
  priority = 40;
  phase = "node" as const;

  onNodeComplete(node: TreeNode, ctx: WalkContext): PluginResult | null {
    if (!node.instructions || node.instructions.length === 0) return null;

    // Look at the last instruction — if it's a JMP forward, the bytes between
    // this node's end and the jump target might be inline data
    const lastInst = node.instructions[node.instructions.length - 1];

    if (lastInst.info.flowType !== "jump" || lastInst.info.addressingMode !== "absolute") {
      return null;
    }

    const jumpTarget = lastInst.operandAddress!;
    const dataStart = node.end;

    // Only if jump goes forward and there's a gap
    if (jumpTarget <= dataStart) return null;
    if (jumpTarget - dataStart < 1) return null;
    if (jumpTarget - dataStart > 256) return null;  // sanity: don't create huge data blocks

    // Check that the gap isn't already visited
    for (let addr = dataStart; addr < jumpTarget; addr++) {
      if (ctx.byteRole[addr] !== 0) return null;  // already claimed
    }

    // Mark gap as inline data
    for (let addr = dataStart; addr < jumpTarget; addr++) {
      ctx.byteRole[addr] = 3; // BYTE_DATA
    }

    return {
      newNodes: [
        {
          id: `data_${dataStart.toString(16).padStart(4, "0")}`,
          type: "data",
          start: dataStart,
          end: jumpTarget,
          endConfidence: 95,
          discoveredBy: this.name,
          metadata: { isInlineData: true, precedingJump: lastInst.address },
        },
      ],
    };
  }
}
