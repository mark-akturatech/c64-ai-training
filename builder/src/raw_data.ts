// ============================================================================
// Raw Data — decode block.raw or load from --binary file
// ============================================================================

import { readFileSync } from "node:fs";
import { Buffer } from "node:buffer";

/**
 * Load a PRG file into a 64K memory image.
 * Returns the memory array and the load/end addresses.
 */
export function loadPrg(path: string): { memory: Uint8Array; loadAddress: number; endAddress: number } {
  const data = readFileSync(path);
  const loadAddress = data[0] | (data[1] << 8);
  const payload = data.subarray(2);
  const memory = new Uint8Array(65536);
  memory.set(payload, loadAddress);
  return { memory, loadAddress, endAddress: loadAddress + payload.length };
}

/** Decode base64-encoded raw bytes from a block. */
export function decodeRaw(raw: string): Uint8Array {
  return new Uint8Array(Buffer.from(raw, "base64"));
}

/**
 * Get bytes for an address range, preferring block.raw, falling back to memory image.
 */
export function getBytes(
  start: number,
  length: number,
  blockRaw: string | undefined,
  blockAddress: number,
  memory?: Uint8Array
): Uint8Array | null {
  if (blockRaw) {
    const decoded = decodeRaw(blockRaw);
    const offset = start - blockAddress;
    if (offset >= 0 && offset + length <= decoded.length) {
      return decoded.slice(offset, offset + length);
    }
  }
  if (memory) {
    return memory.slice(start, start + length);
  }
  return null;
}
