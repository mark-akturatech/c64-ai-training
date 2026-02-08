#!/usr/bin/env python3
"""Extract C64 memory map symbols from mapping-c64.txt.

Parses lines like:
    43-44         $2B-$2C        TXTTAB
    53248         $D000          SP0X
    0             $0             D6510

Produces:
  1. KickAssembler include file (includes/c64_symbols.asm) - base .const only
  2. Full address lookup (includes/c64_address_map.asm) - every address mapped,
     with SYMBOL+N for intermediate bytes of multi-byte locations
"""

import re
import sys
from pathlib import Path
from collections import Counter

# Match: decimal(-decimal)  hex_addr(-hex_addr)  SYMBOL
ENTRY_RE = re.compile(
    r'^(\d+)(-(\d+))?\s+'            # decimal addr + optional range end
    r'\$([0-9A-Fa-f]+)'              # hex addr base
    r'(-\$([0-9A-Fa-f]+))?\s+'       # optional hex range end
    r'([A-Za-z_][A-Za-z0-9_]*)\s*$'  # symbol name
)

# Known typos in the source document - decimal addr is truth, fix hex
HEX_CORRECTIONS = {
    53290: "D02A",  # SP3COL - doc says $D01A
    53291: "D02B",  # SP4COL - doc says $D01B
    53292: "D02C",  # SP5COL - doc says $D01C
    53293: "D02D",  # SP6COL - doc says $D01D
    53294: "D02E",  # SP7COL - doc says $D01E
}


def disambiguate_name(name: str, hex_addr: str, all_addrs: list[str]) -> str:
    """Give duplicate symbols contextual suffixes based on memory region.

    Uses all_addrs (all addresses for this symbol name) to pick the best
    disambiguation strategy.
    """
    addr = int(hex_addr, 16)

    # If all duplicates are in the same broad region, use the hex address
    regions = set()
    for a in all_addrs:
        v = int(a, 16)
        if v <= 0xFF:
            regions.add("zp")
        elif 0xA000 <= v <= 0xBFFF:
            regions.add("basic")
        elif 0xE000 <= v <= 0xFFFF:
            regions.add("kernal")
        else:
            regions.add("other")

    # If all in same region, suffix with hex address for clarity
    if len(regions) == 1:
        return f"{name}_{hex_addr}"

    # Different regions - use region name
    if addr <= 0xFF:
        return name  # zero-page gets the plain name
    elif 0xA000 <= addr <= 0xBFFF:
        return name + "_BASIC"
    elif 0xE000 <= addr <= 0xFFFF:
        return name + "_KERNAL"
    return name


def extract_symbols(input_path: Path) -> list[tuple[str, str, int]]:
    """Return list of (symbol, hex_addr, byte_count) tuples."""
    symbols = []

    for line in input_path.read_text().splitlines():
        m = ENTRY_RE.match(line.strip())
        if not m:
            continue

        dec_start = int(m.group(1))
        dec_end = int(m.group(3)) if m.group(3) else dec_start
        hex_addr = m.group(4).upper()
        name = m.group(7)

        # Apply hex corrections
        if dec_start in HEX_CORRECTIONS:
            corrected = HEX_CORRECTIONS[dec_start]
            if hex_addr != corrected:
                print(f"  Correcting {name}: ${hex_addr} -> ${corrected}")
                hex_addr = corrected

        byte_count = dec_end - dec_start + 1
        symbols.append((name, hex_addr, byte_count))

    return symbols


def deduplicate(symbols: list[tuple[str, str, int]]) -> list[tuple[str, str, int]]:
    """Disambiguate duplicate symbol names with contextual suffixes."""
    counts = Counter(name for name, _, _ in symbols)
    dupes = {k for k, v in counts.items() if v > 1}

    # Build lookup of all addresses per duplicate name
    dupe_addrs: dict[str, list[str]] = {}
    for name, addr, _ in symbols:
        if name in dupes:
            dupe_addrs.setdefault(name, []).append(addr)

    result = []
    for name, addr, nbytes in symbols:
        if name in dupes:
            result.append((disambiguate_name(name, addr, dupe_addrs[name]), addr, nbytes))
        else:
            result.append((name, addr, nbytes))

    # Verify - fall back to numbered suffixes if still ambiguous
    final_counts = Counter(name for name, _, _ in result)
    remaining = {k for k, v in final_counts.items() if v > 1}
    if remaining:
        print(f"  WARNING: Still have duplicates: {remaining}")
        seen: dict[str, int] = {}
        fixed = []
        for name, addr, nbytes in result:
            if name in remaining:
                seen.setdefault(name, 0)
                seen[name] += 1
                if seen[name] > 1:
                    fixed.append((f"{name}_{seen[name]}", addr, nbytes))
                else:
                    fixed.append((name, addr, nbytes))
            else:
                fixed.append((name, addr, nbytes))
        return fixed

    return result


def build_address_map(symbols: list[tuple[str, str, int]]) -> dict[int, str]:
    """Build complete address -> symbol mapping, filling in +N for multi-byte."""
    # First pass: assign base symbols to their addresses
    base_map: dict[int, str] = {}
    for name, hex_addr, _ in symbols:
        addr = int(hex_addr, 16)
        base_map[addr] = name

    # Second pass: fill in +N for multi-byte entries, but only if the
    # address doesn't already have its own named symbol
    full_map: dict[int, str] = dict(base_map)
    for name, hex_addr, nbytes in symbols:
        addr = int(hex_addr, 16)
        for offset in range(1, nbytes):
            target = addr + offset
            if target not in base_map:
                full_map[target] = f"{name}+{offset}"

    return full_map


def format_consts(symbols: list[tuple[str, str, int]]) -> str:
    """Format base symbols as KickAssembler .const definitions."""
    regions = [
        ("Zero Page ($00-$FF)", 0x00, 0xFF),
        ("Page 1 ($100-$1FF) - Processor Stack", 0x100, 0x1FF),
        ("Pages 2-3 ($200-$3FF) - OS Working Storage", 0x200, 0x3FF),
        ("Screen Memory & BASIC Text ($400-$9FFF)", 0x400, 0x9FFF),
        ("BASIC ROM ($A000-$BFFF)", 0xA000, 0xBFFF),
        ("VIC-II Registers ($D000-$D3FF)", 0xD000, 0xD3FF),
        ("SID Registers ($D400-$D7FF)", 0xD400, 0xD7FF),
        ("Color RAM ($D800-$DBFF)", 0xD800, 0xDBFF),
        ("CIA 1 ($DC00-$DC0F)", 0xDC00, 0xDC0F),
        ("CIA 2 ($DD00-$DD0F)", 0xDD00, 0xDD0F),
        ("KERNAL ROM ($E000-$FFFF)", 0xE000, 0xFFFF),
    ]

    lines = [
        "// C64 Memory Map Symbols",
        "// Extracted from 'Mapping the Commodore 64' by Sheldon Leemon",
        "// Multi-byte locations: use SYMBOL+1, SYMBOL+2 etc. for subsequent bytes",
        "// See c64_address_map.asm for the complete address-to-symbol lookup",
        "//",
    ]

    max_len = max(len(s[0]) for s in symbols)
    assigned = set()

    for region_name, lo, hi in regions:
        region_syms = []
        for i, (name, addr, nbytes) in enumerate(symbols):
            addr_int = int(addr, 16)
            if lo <= addr_int <= hi and i not in assigned:
                region_syms.append((name, addr, nbytes))
                assigned.add(i)

        if region_syms:
            lines.append("")
            lines.append(f"// === {region_name} ===")
            lines.append("")
            for name, addr, nbytes in region_syms:
                padding = " " * (max_len - len(name) + 1)
                comment = f"  // {nbytes} bytes" if nbytes > 1 else ""
                lines.append(f".const {name}{padding}= ${addr}{comment}")

    # Unassigned
    unassigned = [(n, a, nb) for i, (n, a, nb) in enumerate(symbols) if i not in assigned]
    if unassigned:
        lines.append("")
        lines.append("// === Other ===")
        lines.append("")
        for name, addr, nbytes in unassigned:
            padding = " " * (max_len - len(name) + 1)
            comment = f"  // {nbytes} bytes" if nbytes > 1 else ""
            lines.append(f".const {name}{padding}= ${addr}{comment}")

    lines.append("")
    return "\n".join(lines)


def format_address_map(address_map: dict[int, str]) -> str:
    """Format complete address->symbol lookup as a comment-based reference."""
    lines = [
        "// C64 Complete Address-to-Symbol Map",
        "// Every documented address mapped to its symbol",
        "// SYMBOL+N entries are intermediate bytes of multi-byte locations",
        "//",
        "// Format: $ADDR = SYMBOL",
        "//",
    ]

    regions = [
        ("Zero Page", 0x00, 0xFF),
        ("Page 1 - Processor Stack", 0x100, 0x1FF),
        ("Pages 2-3 - OS Working Storage", 0x200, 0x3FF),
        ("Screen Memory & BASIC Text", 0x400, 0x9FFF),
        ("BASIC ROM", 0xA000, 0xBFFF),
        ("VIC-II Registers", 0xD000, 0xD3FF),
        ("SID Registers", 0xD400, 0xD7FF),
        ("Color RAM", 0xD800, 0xDBFF),
        ("CIA 1", 0xDC00, 0xDC0F),
        ("CIA 2", 0xDD00, 0xDD0F),
        ("KERNAL ROM", 0xE000, 0xFFFF),
    ]

    emitted = set()
    for region_name, lo, hi in regions:
        entries = [(a, s) for a, s in address_map.items() if lo <= a <= hi]
        if not entries:
            continue
        entries.sort()
        lines.append("")
        lines.append(f"// === {region_name} ===")
        for addr, sym in entries:
            lines.append(f"// ${addr:04X} = {sym}")
            emitted.add(addr)

    # Anything not in a region
    remaining = [(a, s) for a, s in address_map.items() if a not in emitted]
    if remaining:
        remaining.sort()
        lines.append("")
        lines.append("// === Other ===")
        for addr, sym in remaining:
            lines.append(f"// ${addr:04X} = {sym}")

    lines.append("")
    return "\n".join(lines)


def main():
    input_path = Path(__file__).parent.parent / "documents" / "mapping-c64.txt"
    consts_path = Path(__file__).parent.parent / "includes" / "c64_symbols.asm"
    map_path = Path(__file__).parent.parent / "includes" / "c64_address_map.asm"

    if not input_path.exists():
        print(f"ERROR: {input_path} not found", file=sys.stderr)
        sys.exit(1)

    consts_path.parent.mkdir(parents=True, exist_ok=True)

    symbols = extract_symbols(input_path)
    print(f"Extracted {len(symbols)} raw symbols")

    counts = Counter(name for name, _, _ in symbols)
    dupes = {k: v for k, v in counts.items() if v > 1}
    if dupes:
        print(f"Duplicate symbols (will be disambiguated): {dupes}")

    symbols = deduplicate(symbols)

    # Build the full address map with +N gap filling
    address_map = build_address_map(symbols)
    base_count = len(symbols)
    plus_n_count = sum(1 for v in address_map.values() if "+" in v)
    print(f"Address map: {len(address_map)} entries ({base_count} base + {plus_n_count} gap-filled)")

    # Write both files
    consts_path.write_text(format_consts(symbols))
    print(f"Written {consts_path}")

    map_path.write_text(format_address_map(address_map))
    print(f"Written {map_path}")


if __name__ == "__main__":
    main()
