// ============================================================================
// VICE Snapshot File (.vsf) Parser
// Extracts full 64KB RAM, CPU state (PC as entry point), banking state
// from VICE emulator snapshots.
// ============================================================================

import type { ParsedRegion } from "../types.js";
import type { InputParser } from "./types.js";

const VSF_MAGIC = "VICE Snapshot File\x1a";
const MODULE_HEADER_SIZE = 22; // 16 name + 2 version + 4 size

interface VsfModule {
  name: string;
  majorVersion: number;
  minorVersion: number;
  dataOffset: number; // file offset of module data (after header)
  dataSize: number;   // size of data (excluding header)
}

interface CpuState {
  a: number;
  x: number;
  y: number;
  sp: number;
  pc: number;
  status: number;
}

export class VsfParser implements InputParser {
  name = "vsf";
  extensions = [".vsf"];
  priority = 10;

  detect(data: Uint8Array, filename: string): number {
    if (data.length < VSF_MAGIC.length) return 0;

    // Check magic bytes
    const header = String.fromCharCode(...data.slice(0, VSF_MAGIC.length));
    if (header !== VSF_MAGIC) return 0;

    // Verify it's a C64 snapshot
    const machineArea = String.fromCharCode(
      ...data.slice(0x15, 0x25)
    ).replace(/\0/g, "");
    if (machineArea.startsWith("C64")) return 95;

    // VSF but not C64
    return 30;
  }

  parse(data: Uint8Array, _filename: string): ParsedRegion[] {
    // Parse file header
    const header = String.fromCharCode(...data.slice(0, VSF_MAGIC.length));
    if (header !== VSF_MAGIC) {
      throw new Error("Not a VICE Snapshot File");
    }

    // Scan for modules
    const modules = this.scanModules(data);

    // Extract CPU state from MAINCPU
    const cpuModule = modules.find((m) => m.name === "MAINCPU");
    if (!cpuModule) throw new Error("VSF missing MAINCPU module");
    const cpu = this.parseCpu(data, cpuModule);

    // Extract RAM from C64MEM
    const memModule = modules.find((m) => m.name === "C64MEM");
    if (!memModule) throw new Error("VSF missing C64MEM module");
    const { ram, cpuPortData, cpuPortDir } = this.parseC64Mem(data, memModule);

    // Extract CIA2 $DD00 for VIC bank (optional)
    const cia2Module = modules.find((m) => m.name === "CIA2");
    const dd00 = cia2Module ? data[cia2Module.dataOffset] : 0xC7;

    // Determine banking state from CPU port ($01) and CIA2
    const bankBits = (~dd00) & 0x03;
    const vicBankBase = bankBits * 0x4000;
    const basicVisible = (cpuPortData & 0x01) !== 0 && (cpuPortData & 0x02) !== 0;
    const kernalVisible = (cpuPortData & 0x02) !== 0;
    const ioVisible = (cpuPortData & 0x04) !== 0 && (cpuPortData & 0x02) !== 0;

    // Load full 64KB RAM so the tree walker can resolve pointers and decode
    // instructions across the entire address space. The binary_loader will
    // split loaded regions based on banking hints to exclude ROM, I/O, and
    // stack areas from gap-fill analysis.
    const regions: ParsedRegion[] = [
      { address: 0x0000, bytes: ram.slice(0x0000, 0x10000) },
    ];

    // Build entry point and banking hints on the first region
    const entryHints: Array<{address: number; source: string; description: string}> = [];

    // PC is always an entry point
    entryHints.push({
      address: cpu.pc,
      source: "snapshot_pc",
      description: `Snapshot PC=$${cpu.pc.toString(16).toUpperCase().padStart(4, "0")} (A=$${cpu.a.toString(16).toUpperCase().padStart(2, "0")} X=$${cpu.x.toString(16).toUpperCase().padStart(2, "0")} Y=$${cpu.y.toString(16).toUpperCase().padStart(2, "0")} SP=$${cpu.sp.toString(16).toUpperCase().padStart(2, "0")})`,
    });

    // IRQ vector from RAM $0314/$0315 (if not default KERNAL handler)
    const irqAddr = ram[0x0314] | (ram[0x0315] << 8);
    if (irqAddr !== 0xEA31 && irqAddr !== 0xEA7E && irqAddr >= 0x0200) {
      entryHints.push({
        address: irqAddr,
        source: "snapshot_vector",
        description: `IRQ vector $0314=$${irqAddr.toString(16).toUpperCase().padStart(4, "0")}`,
      });
    }

    // NMI vector from RAM $0318/$0319 (if not default KERNAL handler)
    const nmiAddr = ram[0x0318] | (ram[0x0319] << 8);
    if (nmiAddr !== 0xFE47 && nmiAddr !== 0xFE43 && nmiAddr >= 0x0200) {
      entryHints.push({
        address: nmiAddr,
        source: "snapshot_vector",
        description: `NMI vector $0318=$${nmiAddr.toString(16).toUpperCase().padStart(4, "0")}`,
      });
    }

    // BRK vector from RAM $0316/$0317
    const brkAddr = ram[0x0316] | (ram[0x0317] << 8);
    if (brkAddr !== 0xFE66 && brkAddr >= 0x0200) {
      entryHints.push({
        address: brkAddr,
        source: "snapshot_vector",
        description: `BRK vector $0316=$${brkAddr.toString(16).toUpperCase().padStart(4, "0")}`,
      });
    }

    // Attach hints to the first region's metadata
    regions[0].entryPointHints = entryHints;
    regions[0].bankingHints = {
      cpuPort: cpuPortData,
      basicRomVisible: basicVisible,
      kernalRomVisible: kernalVisible,
      ioVisible,
      charRomVisible: (cpuPortData & 0x04) === 0 && (cpuPortData & 0x02) !== 0,
      vicBank: bankBits,
      vicBankBase,
    };

    return regions;
  }

  private scanModules(data: Uint8Array): VsfModule[] {
    const modules: VsfModule[] = [];

    // Scan for module headers by looking for known module names
    // This is more robust than assuming fixed header sizes across VICE versions
    for (let i = 0; i < data.length - MODULE_HEADER_SIZE; i++) {
      const nameBytes = data.slice(i, i + 16);

      // Module name: printable ASCII followed by nulls
      const nullPos = nameBytes.indexOf(0);
      if (nullPos < 2 || nullPos > 15) continue;

      // Check all chars before null are printable ASCII
      let allPrintable = true;
      for (let j = 0; j < nullPos; j++) {
        if (nameBytes[j] < 0x20 || nameBytes[j] > 0x7E) {
          allPrintable = false;
          break;
        }
      }
      if (!allPrintable) continue;

      // Check rest is all null
      let allNull = true;
      for (let j = nullPos; j < 16; j++) {
        if (nameBytes[j] !== 0) { allNull = false; break; }
      }
      if (!allNull) continue;

      // Check version bytes are reasonable
      const major = data[i + 16];
      const minor = data[i + 17];
      if (major > 10 || minor > 10) continue;

      // Check size field
      const size =
        data[i + 18] |
        (data[i + 19] << 8) |
        (data[i + 20] << 16) |
        (data[i + 21] << 24);

      if (size < MODULE_HEADER_SIZE || size > data.length) continue;
      if (i + size > data.length + 1000) continue;

      const name = String.fromCharCode(...nameBytes.slice(0, nullPos));

      modules.push({
        name,
        majorVersion: major,
        minorVersion: minor,
        dataOffset: i + MODULE_HEADER_SIZE,
        dataSize: size - MODULE_HEADER_SIZE,
      });

      // Skip past this module to avoid false matches inside module data
      i += size - 1; // -1 because loop increments
    }

    return modules;
  }

  private parseCpu(data: Uint8Array, mod: VsfModule): CpuState {
    const d = mod.dataOffset;
    // MAINCPU register offsets differ by module version:
    //   v1.1 (VICE 3.5):  +4=A, +5=X, +6=Y, +7=SP, +8-9=PC, +10=Status
    //   v1.4 (VICE 3.10): +8=A, +9=X, +10=Y, +11=SP, +12-13=PC, +14=Status
    const regBase = mod.majorVersion >= 1 && mod.minorVersion >= 4 ? 8 : 4;
    return {
      a: data[d + regBase],
      x: data[d + regBase + 1],
      y: data[d + regBase + 2],
      sp: data[d + regBase + 3],
      pc: data[d + regBase + 4] | (data[d + regBase + 5] << 8),
      status: data[d + regBase + 6],
    };
  }

  private parseC64Mem(
    data: Uint8Array,
    mod: VsfModule
  ): { ram: Uint8Array; cpuPortData: number; cpuPortDir: number } {
    const d = mod.dataOffset;

    // C64MEM layout: 4-byte prefix (CPU port state) + 65536 bytes RAM + suffix
    // First 2 bytes of prefix are CPU port data ($01) and direction ($00)
    const cpuPortData = data[d];
    const cpuPortDir = data[d + 1];

    if (mod.dataSize < 65538) {
      throw new Error(
        `C64MEM module too small: ${mod.dataSize} bytes (need at least 65538)`
      );
    }

    // Old VICE (no suffix): dataSize - 65536 = correct prefix size
    // New VICE 3.10 (15-byte suffix): dataSize - 65536 = 19, wrong
    // Prefix is always small (2-4 bytes), so cap at 4
    const calcPrefix = mod.dataSize - 65536;
    const prefixSize = calcPrefix > 8 ? 4 : calcPrefix;
    const ramOffset = d + prefixSize;
    const ram = data.slice(ramOffset, ramOffset + 65536);

    return { ram, cpuPortData, cpuPortDir };
  }
}
