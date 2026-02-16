// ============================================================================
// Jump Table Resolver — tree-phase plugin
// Cross-references pointer writes in walked code with JMP ($xxxx) instructions
// to discover additional jump targets beyond the snapshot-time value.
//
// Handles the common C64 pattern:
//   LDA #<target / STA ptr / LDA #>target / STA ptr+1  (setup)
//   JMP (ptr)                                           (dispatch)
//
// Also scans unclaimed memory for JMP ($xxxx) patterns, but with strict
// validation to avoid false positives from data that happens to contain $6C.
// ============================================================================

import { OPCODE_TABLE } from "../opcode_table.js";
import type { DiscoveryPlugin, WalkContext, PluginResult } from "./types.js";
import type { DependencyTree } from "../dependency_tree.js";

const BYTE_UNKNOWN = 0;
const JMP_INDIRECT_OPCODE = 0x6c;

// JAM/KIL opcodes — invalid for target validation
const JAM_OPCODES = new Set([
  0x02, 0x12, 0x22, 0x32, 0x42, 0x52,
  0x62, 0x72, 0x92, 0xb2, 0xd2, 0xf2,
]);

export class JumpTableResolverPlugin implements DiscoveryPlugin {
  name = "jump_table_resolver";
  description = "Resolves indirect jump targets by cross-referencing pointer writes with JMP ($xxxx)";
  priority = 90; // tree-phase, runs after all other plugins
  phase = "tree" as const;

  onTreeComplete(tree: DependencyTree, ctx: WalkContext): PluginResult | null {
    // 1. Collect pointer addresses from walked JMP ($xxxx) instructions
    const walkedPointers = new Set<number>();

    for (const [, node] of tree.nodes) {
      if (node.type !== "code") continue;
      for (const edge of node.edges) {
        if (edge.type === "indirect_jump" && edge.metadata) {
          const ptrAddr = edge.metadata.pointerAddress as number | undefined;
          if (ptrAddr !== undefined) {
            walkedPointers.add(ptrAddr);
          }
        }
      }
    }

    // 2. Scan unclaimed memory for JMP ($xxxx) patterns (strict validation)
    const scannedPointers = this.scanForIndirectJumps(ctx.memory, ctx.byteRole);

    // Merge both sets
    const allPointers = new Set([...walkedPointers, ...scannedPointers]);
    if (allPointers.size === 0) return null;

    // 3. Build STA write map: which addresses are written with immediate values
    const staWrites = this.collectStaWrites(tree);

    // 4. Resolve targets
    const newTargets: number[] = [];
    const seenTargets = new Set<number>();

    for (const ptrAddr of allPointers) {
      // Method A: Cross-reference with STA writes in code
      const loWrites = staWrites.get(ptrAddr) || [];
      const hiWrites = staWrites.get(ptrAddr + 1) || [];

      // Pair lo/hi writes from the same node (same setup sequence)
      for (const loWrite of loWrites) {
        for (const hiWrite of hiWrites) {
          if (loWrite.nodeStart === hiWrite.nodeStart) {
            const target = loWrite.value | (hiWrite.value << 8);
            if (this.isPlausibleTarget(target, ctx.memory) && !seenTargets.has(target)) {
              seenTargets.add(target);
              newTargets.push(target);
            }
          }
        }
      }

      // Method B: Read snapshot memory (only for walked pointers — higher confidence)
      if (walkedPointers.has(ptrAddr)) {
        const snapshotLo = ctx.memory[ptrAddr];
        const snapshotHi = ctx.memory[(ptrAddr + 1) & 0xffff];
        const snapshotTarget = snapshotLo | (snapshotHi << 8);
        if (this.isPlausibleTarget(snapshotTarget, ctx.memory) && !seenTargets.has(snapshotTarget)) {
          seenTargets.add(snapshotTarget);
          newTargets.push(snapshotTarget);
        }
      }
    }

    // 5. For walked pointers, check adjacent table entries
    // Only expand from walked pointers (confirmed JMP sites), not scanned ones
    for (const ptrAddr of walkedPointers) {
      this.expandFromPointer(ptrAddr, ctx.memory, seenTargets, newTargets);
    }

    // Filter out targets already in the tree
    const actualNewTargets = newTargets.filter(
      (t) => !tree.hasNode(t) && ctx.byteRole[t] === BYTE_UNKNOWN
    );

    if (actualNewTargets.length === 0) return null;

    console.error(
      `  jump_table_resolver: found ${actualNewTargets.length} new target(s) ` +
      `(${walkedPointers.size} walked + ${scannedPointers.length} scanned pointers)`
    );

    return { newTargets: actualNewTargets };
  }

  /**
   * Scan unclaimed memory for JMP ($xxxx) patterns.
   * Strict validation: requires the resolved target to start with a valid opcode,
   * and the bytes around the JMP to look like code context (not random data).
   */
  private scanForIndirectJumps(memory: Uint8Array, byteRole: Uint8Array): number[] {
    const pointerAddresses: number[] = [];

    for (let addr = 0x0200; addr < 0xfffe; addr++) {
      if (byteRole[addr] !== BYTE_UNKNOWN) continue;
      if (memory[addr] !== JMP_INDIRECT_OPCODE) continue;
      if (byteRole[addr + 1] !== BYTE_UNKNOWN || byteRole[addr + 2] !== BYTE_UNKNOWN) continue;

      const ptrAddr = memory[addr + 1] | (memory[addr + 2] << 8);

      // Pointer address validation
      if (ptrAddr < 0x0200) continue;                          // not ZP/stack
      if (ptrAddr >= 0xd000 && ptrAddr < 0xe000) continue;     // not I/O

      // Read target from snapshot
      const target = memory[ptrAddr] | (memory[(ptrAddr + 1) & 0xffff] << 8);
      if (!this.isPlausibleTarget(target, memory)) continue;

      // Context validation: check that surrounding bytes also look like code.
      // Look backwards for a plausible preceding instruction ending.
      // Common patterns before JMP: RTS ($60), terminal branch, STA, etc.
      let hasCodeContext = false;

      // Check if the byte before could be the end of a valid instruction
      if (addr > 0 && byteRole[addr - 1] !== BYTE_UNKNOWN) {
        // Previous byte is known code — strong context
        hasCodeContext = true;
      } else {
        // Check if bytes 1-3 positions before decode as valid instructions ending at addr
        for (let lookback = 1; lookback <= 3 && addr - lookback >= 0; lookback++) {
          const prevAddr = addr - lookback;
          if (byteRole[prevAddr] !== BYTE_UNKNOWN) continue;
          const prevOpcode = memory[prevAddr];
          if (JAM_OPCODES.has(prevOpcode)) continue;
          const info = OPCODE_TABLE[prevOpcode];
          if (info.bytes === lookback) {
            hasCodeContext = true;
            break;
          }
        }
      }

      // Also check: the 3 bytes after the JMP should not look like another JMP ($xxxx)
      // to the same pointer (that would be data, not a real JMP)
      if (addr + 3 < 0xffff && memory[addr + 3] === JMP_INDIRECT_OPCODE) {
        // Two consecutive JMP ($xxxx) — this IS a common jump table pattern
        // (like $8010/$8013/$8016), so accept it even without backward context
        hasCodeContext = true;
      }

      if (!hasCodeContext) continue;

      pointerAddresses.push(ptrAddr);
    }

    return pointerAddresses;
  }

  /**
   * Expand from a known pointer address to find adjacent table entries.
   * Conservative: only check +2 increments, require valid target opcodes,
   * and stop at the first invalid entry.
   */
  private expandFromPointer(
    baseAddr: number,
    memory: Uint8Array,
    seenTargets: Set<number>,
    newTargets: number[]
  ): void {
    // Check forward: +2, +4, +6 (max 4 extra entries)
    for (let offset = 2; offset <= 8; offset += 2) {
      const candidate = baseAddr + offset;
      if (candidate >= 0xffff) break;

      const target = memory[candidate] | (memory[candidate + 1] << 8);
      if (!this.isPlausibleTarget(target, memory)) break;

      if (!seenTargets.has(target)) {
        seenTargets.add(target);
        newTargets.push(target);
      }
    }
  }

  /** Scan all code nodes for LDA #imm / STA addr patterns */
  private collectStaWrites(
    tree: DependencyTree
  ): Map<number, Array<{ value: number; nodeStart: number; instrAddr: number }>> {
    const writes = new Map<number, Array<{ value: number; nodeStart: number; instrAddr: number }>>();

    for (const [, node] of tree.nodes) {
      if (node.type !== "code" || !node.instructions) continue;

      const insts = node.instructions;
      for (let i = 1; i < insts.length; i++) {
        const sta = insts[i];
        if (
          sta.info.mnemonic === "sta" &&
          (sta.info.addressingMode === "absolute" || sta.info.addressingMode === "zero_page") &&
          sta.operandAddress !== undefined
        ) {
          const lda = insts[i - 1];
          if (
            lda.info.mnemonic === "lda" &&
            lda.info.addressingMode === "immediate" &&
            lda.operandValue !== undefined
          ) {
            const addr = sta.operandAddress;
            let entries = writes.get(addr);
            if (!entries) {
              entries = [];
              writes.set(addr, entries);
            }
            entries.push({
              value: lda.operandValue,
              nodeStart: node.start,
              instrAddr: sta.address,
            });
          }
        }
      }
    }

    return writes;
  }

  /** Check if an address is a plausible code target */
  private isPlausibleTarget(addr: number, memory: Uint8Array): boolean {
    if (addr < 0x0200 || addr >= 0x10000) return false;
    if (addr >= 0xd000 && addr < 0xe000) return false;

    // Target must start with a valid, non-JAM opcode
    if (JAM_OPCODES.has(memory[addr])) return false;

    return true;
  }
}
