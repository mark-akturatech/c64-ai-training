import type { ParsedRegion } from "../types.js";
import type { InputParser } from "./types.js";

export class PrgParser implements InputParser {
  name = "prg";
  extensions = [".prg"];
  priority = 10;

  detect(data: Uint8Array, filename: string): number {
    const ext = filename.toLowerCase();
    if (data.length < 3) return 0;

    const loadAddr = data[0] | (data[1] << 8);

    if (ext.endsWith(".prg")) {
      // Valid load address in typical C64 range
      if (loadAddr >= 0x0200 && loadAddr <= 0xCFFF) return 90;
      // .prg extension but unusual address
      return 60;
    }

    return 0;
  }

  parse(data: Uint8Array): ParsedRegion[] {
    if (data.length < 3) {
      throw new Error("PRG file too small (need at least 3 bytes: 2-byte header + data)");
    }

    const loadAddr = data[0] | (data[1] << 8);
    const programData = data.slice(2);

    if (loadAddr + programData.length > 0x10000) {
      throw new Error(
        `PRG data would exceed 64KB: load=$${loadAddr.toString(16)}, size=${programData.length}`
      );
    }

    return [{
      address: loadAddr,
      bytes: programData,
    }];
  }
}
