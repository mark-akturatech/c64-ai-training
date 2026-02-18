// ============================================================================
// prg2vsf — Core logic for patching VICE .vsf snapshots with .prg payloads
// ============================================================================

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = resolve(__dirname, "..", ".vsf_template.vsf");

const VSF_MAGIC = "VICE Snapshot File\x1a";
const MODULE_HEADER_SIZE = 22;

export interface Module {
  name: string;
  majorVersion: number;
  minorVersion: number;
  headerOffset: number;
  dataOffset: number;
  dataSize: number;
}

export interface PrgInfo {
  loadAddress: number;
  payload: Uint8Array;
  endAddress: number;
}

/**
 * Parse a .prg file: 2-byte LE load address header + payload.
 */
export function parsePrg(data: Uint8Array): PrgInfo {
  if (data.length < 3) {
    throw new Error("PRG file too small (need at least 3 bytes: 2-byte header + data)");
  }
  const loadAddress = data[0] | (data[1] << 8);
  const payload = data.subarray(2);
  return { loadAddress, payload, endAddress: loadAddress + payload.length };
}

/**
 * Parse a BASIC SYS stub to find the machine code entry point.
 * Returns the SYS address, or null if no SYS stub detected.
 */
export function detectBasicSys(payload: Uint8Array, loadAddress: number): number | null {
  if (loadAddress !== 0x0801) return null;
  if (payload.length < 10) return null;

  // BASIC line: next_ptr(2) line_num(2) tokens... 0x00
  const nextPtr = payload[0] | (payload[1] << 8);
  if (nextPtr === 0) return null;

  // Search for SYS token ($9E) in the first line
  for (let i = 4; i < Math.min(20, payload.length); i++) {
    if (payload[i] === 0x00) break;
    if (payload[i] === 0x9e) {
      // Parse decimal number after SYS
      let j = i + 1;
      while (j < payload.length && payload[j] === 0x20) j++; // skip spaces
      let addr = 0;
      let hasDigits = false;
      while (j < payload.length && payload[j] >= 0x30 && payload[j] <= 0x39) {
        addr = addr * 10 + (payload[j] - 0x30);
        hasDigits = true;
        j++;
      }
      if (hasDigits && addr >= 0 && addr <= 0xffff) {
        return addr;
      }
    }
  }
  return null;
}

/**
 * Scan a VSF file for module headers.
 * Uses heuristic byte-by-byte scanning (robust to unknown header extensions).
 */
export function scanModules(data: Uint8Array): Module[] {
  const modules: Module[] = [];
  let i = 0;

  while (i < data.length - MODULE_HEADER_SIZE) {
    // Check for valid ASCII module name (2-15 printable chars, null-padded)
    const nullPos = data.indexOf(0, i);
    const nameLen = nullPos - i;
    if (nameLen < 2 || nameLen > 15) {
      i++;
      continue;
    }

    let validName = true;
    for (let k = i; k < i + nameLen; k++) {
      if (data[k] < 0x20 || data[k] > 0x7e) {
        validName = false;
        break;
      }
    }
    if (!validName) {
      i++;
      continue;
    }

    // Remaining name bytes must be null
    let validPadding = true;
    for (let k = i + nameLen; k < i + 16; k++) {
      if (data[k] !== 0) {
        validPadding = false;
        break;
      }
    }
    if (!validPadding) {
      i++;
      continue;
    }

    // Version bytes (sanity check)
    const major = data[i + 16];
    const minor = data[i + 17];
    if (major > 10 || minor > 10) {
      i++;
      continue;
    }

    // Module size (LE uint32)
    const size =
      data[i + 18] |
      (data[i + 19] << 8) |
      (data[i + 20] << 16) |
      ((data[i + 21] << 24) >>> 0);

    if (size < MODULE_HEADER_SIZE || size > data.length) {
      i++;
      continue;
    }
    if (i + size > data.length + 1000) {
      i++;
      continue;
    }

    const name = String.fromCharCode(...data.slice(i, i + nameLen));
    modules.push({
      name,
      majorVersion: major,
      minorVersion: minor,
      headerOffset: i,
      dataOffset: i + MODULE_HEADER_SIZE,
      dataSize: size - MODULE_HEADER_SIZE,
    });

    i += size;
  }

  return modules;
}

/**
 * Find a module by name.
 */
export function findModule(modules: Module[], name: string): Module | null {
  return modules.find((m) => m.name === name) ?? null;
}

/**
 * Load the VSF template from disk.
 */
export function loadTemplate(): Uint8Array {
  const data = readFileSync(TEMPLATE_PATH);
  const magic = String.fromCharCode(...data.subarray(0, VSF_MAGIC.length));
  if (magic !== VSF_MAGIC) {
    throw new Error(`Invalid VSF template: bad magic at ${TEMPLATE_PATH}`);
  }
  return new Uint8Array(data);
}

export interface PatchOptions {
  loadAddress: number;
  payload: Uint8Array;
  entryPoint: number;
  hasBasicSys: boolean;
  fullRam?: boolean;
}

/**
 * Patch a VSF template with a PRG payload and entry point.
 *
 * For BASIC SYS programs: injects "RUN\r" into the keyboard buffer and
 * lets the template's KERNAL input loop execute it naturally. This ensures
 * proper BASIC context (return address on stack, pointers set up).
 *
 * For non-BASIC programs (--pc or no SYS stub): sets PC directly.
 */
export function patchVsf(template: Uint8Array, opts: PatchOptions): Uint8Array {
  const modules = scanModules(template);
  const c64mem = findModule(modules, "C64MEM");
  const maincpu = findModule(modules, "MAINCPU");

  if (!c64mem) throw new Error("Template VSF missing C64MEM module");
  if (!maincpu) throw new Error("Template VSF missing MAINCPU module");

  const vsf = new Uint8Array(template);

  // Patch RAM: C64MEM layout is 4-byte prefix (processor port state) + 65536 bytes RAM + 15-byte suffix
  const C64MEM_RAM_PREFIX = 4;
  const ramOffset = c64mem.dataOffset + C64MEM_RAM_PREFIX;

  if (opts.loadAddress + opts.payload.length > 0x10000) {
    throw new Error(
      `PRG overflows 64KB: load=$${hex16(opts.loadAddress)} + ${opts.payload.length} bytes = $${hex16(opts.loadAddress + opts.payload.length)}`
    );
  }

  vsf.set(opts.payload, ramOffset + opts.loadAddress);

  if (opts.hasBasicSys) {
    // BASIC SYS stub: put "RUN\r" in keyboard buffer so BASIC executes it on resume
    // $C6 = keyboard buffer length, $0277-$0280 = keyboard buffer
    vsf[ramOffset + 0xc6] = 4;
    vsf[ramOffset + 0x0277] = 0x52; // R
    vsf[ramOffset + 0x0278] = 0x55; // U
    vsf[ramOffset + 0x0279] = 0x4e; // N
    vsf[ramOffset + 0x027a] = 0x0d; // RETURN
  } else {
    // No BASIC stub: set PC directly
    // MAINCPU register offsets differ by version:
    //   v1.1 (VICE 3.5):  PC at +8-9
    //   v1.4 (VICE 3.10): PC at +12-13
    const cpu = maincpu.dataOffset;
    const pcOffset = maincpu.majorVersion >= 1 && maincpu.minorVersion >= 4 ? 12 : 8;
    vsf[cpu + pcOffset] = opts.entryPoint & 0xff;
    vsf[cpu + pcOffset + 1] = (opts.entryPoint >> 8) & 0xff;
  }

  return vsf;
}

export function hex16(n: number): string {
  return n.toString(16).toUpperCase().padStart(4, "0");
}
