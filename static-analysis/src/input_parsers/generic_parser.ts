import type { ParsedRegion } from "../types.js";
import type { InputParser } from "./types.js";

export class GenericParser implements InputParser {
  name = "generic";
  extensions = [".asm", ".s"];
  priority = 99;

  detect(data: Uint8Array, filename: string): number {
    const text = new TextDecoder().decode(data.slice(0, 4096));
    const lines = text.split("\n");

    // Look for "addr MNEMONIC" or "$addr: bytes" patterns
    const addrMnemonic = /^[0-9a-fA-F]{4}\s+[A-Z]{3}/;
    const dollarAddr = /^\$[0-9a-fA-F]{4}:/;

    let matchCount = 0;
    let totalLines = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      totalLines++;
      if (addrMnemonic.test(trimmed) || dollarAddr.test(trimmed)) matchCount++;
    }

    if (totalLines === 0) return 0;
    const ratio = matchCount / totalLines;

    if (ratio > 0.5) return 65;
    if (ratio > 0.2) return 40;
    return 0;
  }

  parse(data: Uint8Array): ParsedRegion[] {
    const text = new TextDecoder().decode(data);
    const lines = text.split("\n");

    // Try to extract hex bytes from "addr  XX XX XX  MNEMONIC" format
    const linePattern = /^([0-9a-fA-F]{4})\s+((?:[0-9a-fA-F]{2}\s+)+)\s*[A-Z]{3}/;

    const bytes: number[] = [];
    let startAddr = -1;
    let expectedNext = -1;
    const regions: ParsedRegion[] = [];

    for (const line of lines) {
      const match = linePattern.exec(line.trim());
      if (!match) continue;

      const addr = parseInt(match[1], 16);
      const hexBytes = match[2].trim().split(/\s+/).map((b) => parseInt(b, 16));

      if (addr !== expectedNext && bytes.length > 0) {
        regions.push({ address: startAddr, bytes: new Uint8Array(bytes) });
        bytes.length = 0;
      }

      if (bytes.length === 0) startAddr = addr;
      bytes.push(...hexBytes);
      expectedNext = addr + hexBytes.length;
    }

    if (bytes.length > 0) {
      regions.push({ address: startAddr, bytes: new Uint8Array(bytes) });
    }

    if (regions.length === 0) {
      throw new Error("Generic parser: no recognizable address+byte patterns found");
    }

    return regions;
  }
}
