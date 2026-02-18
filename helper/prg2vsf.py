#!/usr/bin/env python3
"""
Convert a C64 .prg file to a VICE .vsf snapshot file.

Generates a VICE 3.x compatible snapshot by:
1. Creating a template snapshot via VICE (cached on first run)
2. Patching the 64KB RAM with the PRG payload
3. Setting the CPU PC to the program entry point

Usage:
    python3 prg2vsf.py input.prg [-o output.vsf] [--pc 0x0810]
    python3 prg2vsf.py input.prg --full-ram     # PRG is raw 64KB, no 2-byte header

Entry point detection:
    1. --pc override (if given)
    2. BASIC SYS stub parsing (if detected)
    3. Load address (fallback)
"""

import argparse
import os
import struct
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
TEMPLATE_PATH = SCRIPT_DIR / ".vsf_template.vsf"
MODULE_HEADER_SIZE = 22


def main():
    args = parse_args()

    # Read PRG
    prg_data = Path(args.input).read_bytes()

    if args.full_ram:
        if len(prg_data) != 65536:
            die(f"--full-ram expects exactly 65536 bytes, got {len(prg_data)}")
        load_address = 0x0000
        payload = prg_data
    else:
        if len(prg_data) < 3:
            die("PRG file too small (need at least 3 bytes: 2-byte header + data)")
        load_address = prg_data[0] | (prg_data[1] << 8)
        payload = prg_data[2:]

    end_address = load_address + len(payload)
    if end_address > 0x10000:
        die(f"PRG overflows 64KB: load=${load_address:04X} + {len(payload)} bytes = ${end_address:04X}")

    print(f"PRG: load=${load_address:04X}  end=${end_address:04X}  size={len(payload)} bytes")

    # Determine entry point
    if args.pc is not None:
        entry = args.pc
        entry_source = "command line"
    else:
        sys_addr = detect_basic_sys(payload, load_address)
        if sys_addr is not None:
            entry = sys_addr
            entry_source = f"BASIC SYS stub"
        else:
            entry = load_address
            entry_source = "load address"
    print(f"Entry: ${entry:04X} ({entry_source})")

    # Get or create template
    template = get_template()

    # Find modules
    modules = scan_modules(template)
    c64mem = find_mod(modules, "C64MEM")
    maincpu = find_mod(modules, "MAINCPU")

    if not c64mem:
        die("Template VSF missing C64MEM module")
    if not maincpu:
        die("Template VSF missing MAINCPU module")

    # Patch
    vsf = bytearray(template)

    # Patch RAM in C64MEM (last 65536 bytes of module data)
    # The template already has a fully booted C64 state — screen RAM ($0400)
    # filled with spaces, KERNAL vectors, BASIC workspace, etc.
    # We only overwrite the region covered by the PRG payload.
    prefix_size = c64mem["data_size"] - 65536
    ram_offset = c64mem["data_offset"] + prefix_size

    # Write PRG payload over the template's existing RAM
    for i, b in enumerate(payload):
        vsf[ram_offset + load_address + i] = b

    # Patch MAINCPU registers
    # v1.4 layout: +8=A, +9=X, +10=Y, +11=SP, +12-13=PC(LE), +14=Status
    cpu = maincpu["data_offset"]
    vsf[cpu + 8] = 0x00   # A
    vsf[cpu + 9] = 0x00   # X
    vsf[cpu + 10] = 0x00  # Y
    vsf[cpu + 11] = 0xFF  # SP
    vsf[cpu + 12] = entry & 0xFF         # PC lo
    vsf[cpu + 13] = (entry >> 8) & 0xFF  # PC hi
    vsf[cpu + 14] = 0x20  # Status: NV-BDIZC = 00100000 (I=0, interrupts enabled)

    # Write output
    output = args.output
    if not output:
        stem = Path(args.input).stem
        output = str(Path(args.input).parent / f"{stem}.vsf")

    Path(output).write_bytes(bytes(vsf))
    print(f"Output: {output} ({len(vsf)} bytes)")


def detect_basic_sys(payload: bytes, load_address: int) -> int | None:
    """Parse a BASIC SYS stub to find the machine code entry point."""
    if load_address != 0x0801:
        return None
    if len(payload) < 10:
        return None

    # BASIC line format: next_line_ptr(2) line_num(2) token data 0x00
    # SYS token = 0x9E
    next_ptr = payload[0] | (payload[1] << 8)
    if next_ptr == 0:
        return None

    # Find SYS token ($9E) in the first line
    for i in range(4, min(20, len(payload))):
        if payload[i] == 0x00:
            break
        if payload[i] == 0x9E:
            # Parse decimal number after SYS
            digits = []
            j = i + 1
            # Skip spaces
            while j < len(payload) and payload[j] == 0x20:
                j += 1
            while j < len(payload) and 0x30 <= payload[j] <= 0x39:
                digits.append(payload[j] - 0x30)
                j += 1
            if digits:
                addr = 0
                for d in digits:
                    addr = addr * 10 + d
                if 0 <= addr <= 0xFFFF:
                    return addr
    return None


def get_template() -> bytes:
    """Get or create a VICE snapshot template."""
    if TEMPLATE_PATH.exists():
        data = TEMPLATE_PATH.read_bytes()
        if data[:19] == b"VICE Snapshot File\x1a":
            return data

    print("Generating VSF template via VICE...", file=sys.stderr)

    vice = find_vice()
    if not vice:
        die(
            "Cannot find x64sc or x64 in PATH.\n"
            "Install VICE or create a template manually:\n"
            f"  Place a valid .vsf file at {TEMPLATE_PATH}"
        )

    with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as f:
        # Break at BASIC idle loop ($A474) so the template has a fully
        # booted C64 state (CPU port, SP, KERNAL vectors all initialised)
        f.write(f'break A474\ng\ndump "{TEMPLATE_PATH}"\nquit\n')
        cmd_file = f.name

    try:
        result = subprocess.run(
            [vice, "-warp", "+sound", "-console", "-nativemonitor",
             "-moncommands", cmd_file],
            capture_output=True, text=True, timeout=30,
        )
    except subprocess.TimeoutExpired:
        die("VICE timed out while generating template")
    finally:
        os.unlink(cmd_file)

    if not TEMPLATE_PATH.exists():
        die(f"VICE failed to create template.\nstderr: {result.stderr[-500:]}")

    print(f"Template saved: {TEMPLATE_PATH}", file=sys.stderr)
    return TEMPLATE_PATH.read_bytes()


def find_vice() -> str | None:
    """Find VICE executable."""
    for name in ("x64sc", "x64"):
        try:
            subprocess.run([name, "--version"], capture_output=True, timeout=5)
            return name
        except (FileNotFoundError, subprocess.TimeoutExpired):
            continue
    return None


def scan_modules(data: bytes) -> list[dict]:
    """Scan a VSF file for module headers."""
    modules = []
    i = 0
    while i < len(data) - MODULE_HEADER_SIZE:
        name_bytes = data[i : i + 16]
        null_pos = name_bytes.find(0)
        if null_pos < 2 or null_pos > 15:
            i += 1
            continue
        if not all(0x20 <= b <= 0x7E for b in name_bytes[:null_pos]):
            i += 1
            continue
        if not all(b == 0 for b in name_bytes[null_pos:16]):
            i += 1
            continue
        major, minor = data[i + 16], data[i + 17]
        if major > 10 or minor > 10:
            i += 1
            continue
        size = struct.unpack_from("<I", data, i + 18)[0]
        if size < MODULE_HEADER_SIZE or size > len(data):
            i += 1
            continue
        if i + size > len(data) + 1000:
            i += 1
            continue
        name = name_bytes[:null_pos].decode("ascii")
        modules.append(
            {
                "name": name,
                "header_offset": i,
                "data_offset": i + MODULE_HEADER_SIZE,
                "data_size": size - MODULE_HEADER_SIZE,
            }
        )
        i += size
    return modules


def find_mod(modules: list[dict], name: str) -> dict | None:
    return next((m for m in modules if m["name"] == name), None)


def parse_args():
    p = argparse.ArgumentParser(description="Convert C64 .prg to VICE .vsf snapshot")
    p.add_argument("input", help="Input .prg file")
    p.add_argument("-o", "--output", help="Output .vsf file (default: <input>.vsf)")
    p.add_argument(
        "--pc",
        type=lambda x: int(x, 0),
        help="Override entry point address (e.g. 0x0810 or 2064)",
    )
    p.add_argument(
        "--full-ram",
        action="store_true",
        help="Input is raw 64KB RAM dump (no 2-byte PRG header)",
    )
    return p.parse_args()


def die(msg: str):
    print(f"Error: {msg}", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
