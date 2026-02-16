// ============================================================================
// ROM Shadow Detector
// Detects RAM regions that are unmodified copies of C64 BASIC/KERNAL/CHARGEN ROM.
// When a VSF snapshot dumps the full 64KB RAM, the areas under banked-in ROM
// often contain the original ROM image — these should be flagged as unused
// rather than analysed as code/data.
// Partial matches indicate turbo loader patches or custom modifications.
//
// ROM files are loaded from VICE installation (standard locations).
// If ROMs aren't found, the detector silently does nothing.
// ============================================================================

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { DataCandidate } from "../types.js";
import type { DetectorContext, DataDetector } from "./types.js";

const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

interface RomImage {
  name: string;
  label: string;
  ramStart: number;   // where this ROM maps in address space
  ramEnd: number;      // exclusive
  data: Uint8Array;
}

// Project-local ROM data directory (primary — shipped with the tool)
const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCAL_ROM_DIR = join(__dirname, "..", "..", "data");

// Fallback: standard VICE ROM file search paths
const VICE_ROM_SEARCH_PATHS = [
  "/usr/share/vice/C64",
  "/usr/local/share/vice/C64",
  `${process.env.HOME}/.local/share/vice/C64`,
  `${process.env.HOME}/.var/app/net.sf.VICE/data/vice/C64`,
  "/Applications/Vice/C64",
  "/opt/homebrew/share/vice/C64",
];

// Known ROM filenames by type — try in order (most common first)
const KERNAL_ROMS = [
  "kernal-901227-03.bin",  // most common C64
  "kernal-901227-02.bin",
  "kernal-901227-01.bin",
  "kernal-251104-04.bin",  // SX-64
  "kernal",                // generic name
];

const BASIC_ROMS = [
  "basic-901226-01.bin",   // standard C64 BASIC v2
  "basic",                 // generic name
];

const CHARGEN_ROMS = [
  "chargen-901225-01.bin", // standard C64 character ROM
  "chargen",               // generic name
];

export class RomShadowDetector implements DataDetector {
  name = "rom_shadow";
  description = "Detects unmodified copies of C64 BASIC/KERNAL/CHARGEN ROM in RAM";

  private romImages: RomImage[] | null = null;
  private loadAttempted = false;

  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[] {
    // Lazy-load ROM images on first call
    if (!this.loadAttempted) {
      this.loadAttempted = true;
      this.romImages = this.loadRomImages();
    }

    if (!this.romImages || this.romImages.length === 0) return [];

    const candidates: DataCandidate[] = [];

    for (const rom of this.romImages) {
      // Check if this region overlaps with the ROM's address range
      const overlapStart = Math.max(region.start, rom.ramStart);
      const overlapEnd = Math.min(region.end, rom.ramEnd);
      if (overlapStart >= overlapEnd) continue;

      // Compare bytes
      const overlapSize = overlapEnd - overlapStart;
      const romOffset = overlapStart - rom.ramStart;

      let matchCount = 0;
      let firstMismatch = -1;
      let lastMismatch = -1;
      const mismatchRanges: Array<{ start: number; end: number }> = [];
      let mismatchRunStart: number | null = null;

      for (let i = 0; i < overlapSize; i++) {
        const ramByte = memory[overlapStart + i];
        const romByte = rom.data[romOffset + i];
        if (ramByte === romByte) {
          matchCount++;
          if (mismatchRunStart !== null) {
            mismatchRanges.push({ start: mismatchRunStart, end: overlapStart + i });
            mismatchRunStart = null;
          }
        } else {
          if (firstMismatch === -1) firstMismatch = overlapStart + i;
          lastMismatch = overlapStart + i;
          if (mismatchRunStart === null) mismatchRunStart = overlapStart + i;
        }
      }
      if (mismatchRunStart !== null) {
        mismatchRanges.push({ start: mismatchRunStart, end: overlapEnd });
      }

      const matchPct = Math.round((matchCount / overlapSize) * 100);

      // Need at least 50% match to consider it a ROM shadow
      if (matchPct < 50) continue;

      const evidence: string[] = [];
      let confidence: number;
      let subtype: string;

      if (matchPct === 100) {
        confidence = 95;
        subtype = "exact_copy";
        evidence.push(`Exact match: ${overlapSize} bytes identical to ${rom.name}`);
      } else if (matchPct >= 90) {
        confidence = 85;
        subtype = "patched";
        evidence.push(`${matchPct}% match to ${rom.name} (${overlapSize - matchCount} bytes modified)`);
        if (mismatchRanges.length <= 5) {
          for (const r of mismatchRanges) {
            evidence.push(`  Modified: $${r.start.toString(16).padStart(4, "0")}-$${(r.end - 1).toString(16).padStart(4, "0")} (${r.end - r.start} bytes)`);
          }
        } else {
          evidence.push(`  ${mismatchRanges.length} modified regions`);
        }
      } else if (matchPct >= 70) {
        confidence = 60;
        subtype = "heavily_patched";
        evidence.push(`${matchPct}% match to ${rom.name} (${mismatchRanges.length} modified regions)`);
      } else {
        confidence = 35;
        subtype = "partial_match";
        evidence.push(`${matchPct}% match to ${rom.name} — may be replaced ROM or coincidental`);
      }

      evidence.push(`ROM: ${rom.label} ($${rom.ramStart.toString(16).padStart(4, "0")}-$${(rom.ramEnd - 1).toString(16).padStart(4, "0")})`);

      candidates.push({
        start: overlapStart,
        end: overlapEnd,
        detector: this.name,
        type: "rom_shadow",
        subtype,
        confidence,
        evidence,
        label: `${rom.name}_shadow`,
        comment: `${rom.label} ROM shadow (${matchPct}% match), ${overlapSize} bytes`,
      });
    }

    return candidates;
  }

  private loadRomImages(): RomImage[] {
    const images: RomImage[] = [];

    const kernalData = this.findAndLoadRom(KERNAL_ROMS, 8192);
    if (kernalData) {
      images.push({
        name: "kernal",
        label: "KERNAL",
        ramStart: 0xe000,
        ramEnd: 0x10000,
        data: kernalData,
      });
    }

    const basicData = this.findAndLoadRom(BASIC_ROMS, 8192);
    if (basicData) {
      images.push({
        name: "basic",
        label: "BASIC",
        ramStart: 0xa000,
        ramEnd: 0xc000,
        data: basicData,
      });
    }

    const chargenData = this.findAndLoadRom(CHARGEN_ROMS, 4096);
    if (chargenData) {
      images.push({
        name: "chargen",
        label: "Character ROM",
        ramStart: 0xd000,
        ramEnd: 0xe000,
        data: chargenData,
      });
    }

    return images;
  }

  private findAndLoadRom(filenames: string[], expectedSize: number): Uint8Array | null {
    const searchPaths = [LOCAL_ROM_DIR, ...VICE_ROM_SEARCH_PATHS];
    for (const searchPath of searchPaths) {
      for (const filename of filenames) {
        const fullPath = join(searchPath, filename);
        if (existsSync(fullPath)) {
          try {
            const data = readFileSync(fullPath);
            if (data.length === expectedSize) {
              return new Uint8Array(data);
            }
          } catch {
            // Can't read — try next
          }
        }
      }
    }
    return null;
  }
}
