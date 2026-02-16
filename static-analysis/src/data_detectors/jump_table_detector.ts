// ============================================================================
// Jump/Dispatch Table Detector
// Detects tables of code addresses used for indirect dispatch.
// Common patterns:
//   - JMP (addr) with address table
//   - RTS dispatch: push (addr-1) to stack, RTS pops and jumps
//   - Split lo/hi byte address tables indexed by register
// For RTS dispatch, stored addresses are target-1 (RTS adds 1).
// ============================================================================

import type { DataCandidate } from "../types.js";
import type { DetectorContext, DataDetector } from "./types.js";

const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

const MIN_ENTRIES = 2;

export class JumpTableDetector implements DataDetector {
  name = "jump_table";
  description = "Detects jump/dispatch tables containing code addresses (lo/hi byte pairs)";

  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[] {
    const candidates: DataCandidate[] = [];
    const regionSize = region.end - region.start;

    // Need at least space for 2 addresses (4 bytes interleaved, or 2+2 split)
    if (regionSize < MIN_ENTRIES * 2) return candidates;
    if (this.hasCode(region.start, region.end, context)) return candidates;

    // Check if code references this region (indexed reads, pointer refs)
    const isReferenced = this.isReferenced(region, context);

    // Try interleaved address pairs (lo, hi, lo, hi, ...)
    const interleavedResult = this.detectInterleavedTable(memory, region, context);
    if (interleavedResult) {
      const confidence = interleavedResult.knownCodeTargets > 0 ? 80 : 50;
      candidates.push({
        start: region.start,
        end: region.end,
        detector: this.name,
        type: "jump_table",
        subtype: interleavedResult.isRtsDispatch ? "rts_dispatch" : "address_table",
        confidence: isReferenced ? Math.min(confidence + 10, 90) : confidence,
        evidence: this.buildEvidence(
          interleavedResult.entryCount,
          interleavedResult.knownCodeTargets,
          interleavedResult.isRtsDispatch,
          isReferenced,
          "interleaved"
        ),
        label: `jump_table_${interleavedResult.entryCount}`,
        comment: `${interleavedResult.isRtsDispatch ? "RTS dispatch" : "Jump"} table, ${interleavedResult.entryCount} entries (interleaved lo/hi)`,
      });
    }

    // Try split lo/hi tables (all lo bytes, then all hi bytes)
    const splitResult = this.detectSplitTable(memory, region, context);
    if (splitResult && !interleavedResult) {
      const confidence = splitResult.knownCodeTargets > 0 ? 80 : 50;
      candidates.push({
        start: region.start,
        end: region.end,
        detector: this.name,
        type: "jump_table",
        subtype: splitResult.isRtsDispatch ? "rts_dispatch_split" : "address_table_split",
        confidence: isReferenced ? Math.min(confidence + 10, 90) : confidence,
        evidence: this.buildEvidence(
          splitResult.entryCount,
          splitResult.knownCodeTargets,
          splitResult.isRtsDispatch,
          isReferenced,
          "split"
        ),
        label: `jump_table_${splitResult.entryCount}`,
        comment: `${splitResult.isRtsDispatch ? "RTS dispatch" : "Jump"} table, ${splitResult.entryCount} entries (split lo/hi)`,
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

  private isReferenced(
    region: { start: number; end: number },
    context: DetectorContext
  ): boolean {
    for (const edge of context.codeRefs) {
      if (
        (edge.type === "data_read" || edge.type === "pointer_ref") &&
        edge.target >= region.start &&
        edge.target < region.end
      ) {
        return true;
      }
    }
    return false;
  }

  private isValidCodeAddress(addr: number, context: DetectorContext): boolean {
    // Check if the address points to a known code node
    const node = context.tree.findNodeContaining(addr);
    return node !== undefined && node.type === "code";
  }

  private isPlausibleCodeAddress(addr: number): boolean {
    // Must be in typical C64 code address range
    // Avoid zero page, stack, and I/O regions
    return addr >= 0x0200 && addr < 0xfff0 && !(addr >= 0xd000 && addr < 0xe000);
  }

  private detectInterleavedTable(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): { entryCount: number; knownCodeTargets: number; isRtsDispatch: boolean } | null {
    const regionSize = region.end - region.start;
    if (regionSize % 2 !== 0) return null;

    const entryCount = regionSize / 2;
    if (entryCount < MIN_ENTRIES) return null;

    // Read addresses and check validity
    const addresses: number[] = [];
    const rtsAddresses: number[] = []; // addr+1 for RTS dispatch
    let validCount = 0;
    let knownCodeCount = 0;
    let rtsKnownCode = 0;

    for (let i = 0; i < entryCount; i++) {
      const lo = memory[region.start + i * 2];
      const hi = memory[region.start + i * 2 + 1];
      const addr = lo | (hi << 8);
      const rtsAddr = addr + 1;

      addresses.push(addr);
      rtsAddresses.push(rtsAddr);

      if (this.isPlausibleCodeAddress(addr)) {
        validCount++;
        if (this.isValidCodeAddress(addr, context)) knownCodeCount++;
      }
      if (this.isPlausibleCodeAddress(rtsAddr)) {
        if (this.isValidCodeAddress(rtsAddr, context)) rtsKnownCode++;
      }
    }

    // At least half the addresses should be plausible
    if (validCount < entryCount * 0.5) return null;

    // Determine if RTS dispatch (addr-1 pattern)
    const isRtsDispatch = rtsKnownCode > knownCodeCount && rtsKnownCode >= MIN_ENTRIES;
    const effectiveKnownCode = isRtsDispatch ? rtsKnownCode : knownCodeCount;

    // Need at least some evidence
    if (effectiveKnownCode === 0 && validCount < entryCount * 0.8) return null;

    return {
      entryCount,
      knownCodeTargets: effectiveKnownCode,
      isRtsDispatch,
    };
  }

  private detectSplitTable(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): { entryCount: number; knownCodeTargets: number; isRtsDispatch: boolean } | null {
    const regionSize = region.end - region.start;
    if (regionSize % 2 !== 0) return null;

    const halfSize = regionSize / 2;
    if (halfSize < MIN_ENTRIES) return null;

    // First half = lo bytes, second half = hi bytes
    const loStart = region.start;
    const hiStart = region.start + halfSize;

    let validCount = 0;
    let knownCodeCount = 0;
    let rtsKnownCode = 0;

    for (let i = 0; i < halfSize; i++) {
      const lo = memory[loStart + i];
      const hi = memory[hiStart + i];
      const addr = lo | (hi << 8);
      const rtsAddr = addr + 1;

      if (this.isPlausibleCodeAddress(addr)) {
        validCount++;
        if (this.isValidCodeAddress(addr, context)) knownCodeCount++;
      }
      if (this.isPlausibleCodeAddress(rtsAddr)) {
        if (this.isValidCodeAddress(rtsAddr, context)) rtsKnownCode++;
      }
    }

    if (validCount < halfSize * 0.5) return null;

    const isRtsDispatch = rtsKnownCode > knownCodeCount && rtsKnownCode >= MIN_ENTRIES;
    const effectiveKnownCode = isRtsDispatch ? rtsKnownCode : knownCodeCount;

    if (effectiveKnownCode === 0 && validCount < halfSize * 0.8) return null;

    return {
      entryCount: halfSize,
      knownCodeTargets: effectiveKnownCode,
      isRtsDispatch,
    };
  }

  private buildEvidence(
    entryCount: number,
    knownCodeTargets: number,
    isRtsDispatch: boolean,
    isReferenced: boolean,
    layout: string
  ): string[] {
    const evidence: string[] = [];
    evidence.push(`${entryCount} address entries (${layout} layout)`);
    if (knownCodeTargets > 0) {
      evidence.push(
        `${knownCodeTargets}/${entryCount} addresses point to known code regions`
      );
    }
    if (isRtsDispatch) {
      evidence.push("Addresses stored as target-1 (RTS dispatch pattern)");
    }
    if (isReferenced) {
      evidence.push("Referenced by code via indexed read or pointer");
    }
    return evidence;
  }
}
