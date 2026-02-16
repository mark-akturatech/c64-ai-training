import type { ParsedRegion } from "../types.js";
import type { InputParser } from "./types.js";

export class ViceParser implements InputParser {
  name = "vice";
  extensions = [".asm", ".dump"];
  priority = 20;

  detect(data: Uint8Array, filename: string): number {
    const text = new TextDecoder().decode(data.slice(0, 4096));
    const lines = text.split("\n");

    const pattern = /^>C:[0-9a-fA-F]{4}\s+[0-9a-fA-F]{2}/;
    let matchCount = 0;
    let totalLines = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      totalLines++;
      if (pattern.test(trimmed)) matchCount++;
    }

    if (totalLines === 0) return 0;
    const ratio = matchCount / totalLines;

    if (ratio > 0.5) return 90;
    if (ratio > 0.2) return 70;
    return 0;
  }

  parse(data: Uint8Array): ParsedRegion[] {
    const text = new TextDecoder().decode(data);
    const lines = text.split("\n");
    const pattern = /^>C:([0-9a-fA-F]{4})\s+((?:[0-9a-fA-F]{2}\s*)+)/;

    const regions: Map<number, number[]> = new Map();
    let currentStart = -1;
    let currentBytes: number[] = [];
    let expectedNext = -1;

    for (const line of lines) {
      const match = pattern.exec(line.trim());
      if (!match) continue;

      const addr = parseInt(match[1], 16);
      const hexBytes = match[2].trim().split(/\s+/).map((b) => parseInt(b, 16));

      if (addr !== expectedNext && currentBytes.length > 0) {
        regions.set(currentStart, currentBytes);
        currentBytes = [];
      }

      if (currentBytes.length === 0) {
        currentStart = addr;
      }

      currentBytes.push(...hexBytes);
      expectedNext = addr + hexBytes.length;
    }

    if (currentBytes.length > 0) {
      regions.set(currentStart, currentBytes);
    }

    return Array.from(regions.entries()).map(([address, bytes]) => ({
      address,
      bytes: new Uint8Array(bytes),
    }));
  }
}
