#!/usr/bin/env python3
# /// script
# dependencies = ["openai", "requests"]
# ///
"""
Query the Qdrant C64 knowledge base with hybrid search.

Combines semantic vector search with keyword filtering on tags (hex addresses,
KERNAL labels, register mnemonics, color names). When known tags are detected
in the query, runs a filtered search to find documents tagged with those terms.

Usage:
    uv run scripts/query_qdrant.py "What does setting 53280, 13 do?"
    uv run scripts/query_qdrant.py "STA $D016,16"
    uv run scripts/query_qdrant.py --limit 5 "SID voice 1 ADSR"
    uv run scripts/query_qdrant.py --raw "already enriched query"
    uv run scripts/query_qdrant.py --enrich-only "53280 and 13"
"""

import json
import os
import re
import sys

import requests
from openai import OpenAI

# Configuration — matches import_qdrant.py
QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "c64_training"
EMBEDDING_MODEL = "text-embedding-3-large"
DEFAULT_LIMIT = 15
FETCH_LIMIT = 20          # always overfetch, then trim by quality
MIN_SCORE_RATIO = 0.6     # drop results scoring < 60% of the best hit


# ---------------------------------------------------------------------------
# C64 memory map — standard address ranges for query context enrichment
# Ordered most-specific first so narrower ranges match before broader ones.
# ---------------------------------------------------------------------------

C64_MEMORY_MAP = [
    # SID voices (must come before SID general)
    (0xD400, 0xD406, "SID Voice 1", "frequency, pulse width, waveform, ADSR"),
    (0xD407, 0xD40D, "SID Voice 2", "frequency, pulse width, waveform, ADSR"),
    (0xD40E, 0xD414, "SID Voice 3", "frequency, pulse width, waveform, ADSR"),
    (0xD415, 0xD418, "SID Filter/Volume", "filter cutoff, resonance, routing, volume, filter mode"),
    (0xD419, 0xD41C, "SID Misc", "potentiometer, oscillator, envelope readback"),
    # SID general
    (0xD400, 0xD7FF, "SID", "Sound Interface Device"),
    # VIC-II specific groups
    (0xD000, 0xD00F, "VIC-II Sprite Position", "sprite X/Y coordinates"),
    (0xD010, 0xD010, "VIC-II Sprite MSB X", "sprite X position bit 8"),
    (0xD011, 0xD011, "VIC-II Control 1", "scroll Y, screen height, bitmap mode, screen enable, raster bit 8"),
    (0xD012, 0xD012, "VIC-II Raster", "current raster line / raster IRQ trigger"),
    (0xD015, 0xD015, "VIC-II Sprite Enable", "sprite display enable bits"),
    (0xD016, 0xD016, "VIC-II Control 2", "scroll X, screen width, multicolor mode"),
    (0xD017, 0xD017, "VIC-II Sprite Y-Expand", "sprite double-height bits"),
    (0xD018, 0xD018, "VIC-II Memory Setup", "screen RAM and character/bitmap memory pointers"),
    (0xD019, 0xD01A, "VIC-II Interrupt", "interrupt status and enable (raster, sprite, lightpen)"),
    (0xD01B, 0xD01C, "VIC-II Sprite Priority/Multicolor", "sprite-to-background priority, multicolor enable"),
    (0xD01D, 0xD01D, "VIC-II Sprite X-Expand", "sprite double-width bits"),
    (0xD01E, 0xD01F, "VIC-II Sprite Collision", "sprite-sprite and sprite-background collision"),
    (0xD020, 0xD020, "VIC-II Border Color", "border color (16 colors, bits 0-3)"),
    (0xD021, 0xD024, "VIC-II Background Colors", "background colors 0-3"),
    (0xD025, 0xD026, "VIC-II Sprite Multicolor", "shared sprite multicolor 0-1"),
    (0xD027, 0xD02E, "VIC-II Sprite Colors", "individual sprite colors 0-7"),
    # VIC-II general
    (0xD000, 0xD3FF, "VIC-II", "Video Interface Controller"),
    # CIA chips
    (0xDC00, 0xDC0F, "CIA 1", "keyboard, joystick, timer A/B, TOD clock, IRQ"),
    (0xDD00, 0xDD0F, "CIA 2", "serial bus, VIC bank, timer A/B, TOD clock, NMI"),
    # Color RAM
    (0xD800, 0xDBFF, "Color RAM", "per-character color nybbles"),
    # Common RAM areas
    (0x0000, 0x00FF, "Zero Page", "fast storage, CPU indirect addressing"),
    (0x0100, 0x01FF, "Stack", "6510 hardware stack"),
    (0x0200, 0x03FF, "OS Work Area", "BASIC/KERNAL variables, input buffer"),
    (0x0400, 0x07FF, "Screen RAM", "default 40x25 character screen"),
    (0x0800, 0x9FFF, "BASIC Program Area", "BASIC program text, variables, arrays"),
    (0xA000, 0xBFFF, "BASIC ROM", "BASIC interpreter"),
    (0xE000, 0xFFFF, "KERNAL ROM", "operating system routines, I/O, vectors"),
]


# ---------------------------------------------------------------------------
# Known C64 tags — for query-side detection and tag filtering
# ---------------------------------------------------------------------------

# KERNAL API entry point labels (jump table $FF81-$FFF3)
KERNAL_LABELS = {
    "ACPTR", "CHKIN", "CHKOUT", "CHRIN", "CHROUT", "CINT", "CIOUT",
    "CLALL", "CLOSE", "CLRCHN", "GETIN", "IOBASE", "IOINIT", "LISTEN",
    "LOAD", "MEMBOT", "MEMTOP", "OPEN", "PLOT", "RAMTAS", "RDTIM",
    "READST", "RESTOR", "SAVE", "SCNKEY", "SCREEN", "SECOND", "SETLFS",
    "SETMSG", "SETNAM", "SETTIM", "SETTMO", "STOP", "TALK", "TKSA",
    "TALKSA", "UDTIM", "UNLSN", "UNTLK", "UNTALK", "VECTOR",
}

# I/O register symbolic names (Mapping the C64 / common usage)
REGISTER_MNEMONICS = {
    # VIC-II
    "SP0X", "SP0Y", "SP1X", "SP1Y", "SP2X", "SP2Y", "SP3X", "SP3Y",
    "SP4X", "SP4Y", "SP5X", "SP5Y", "SP6X", "SP6Y", "SP7X", "SP7Y",
    "MSIGX", "SCROLY", "RASTER", "LPENX", "LPENY", "SPENA", "SCROLX",
    "YXPAND", "VMCSB", "VICIRQ", "IRQMASK", "SPBGPR", "SPMC", "XXPAND",
    "SPSPCL", "SPBGCL", "EXTCOL", "BGCOL0", "BGCOL1", "BGCOL2", "BGCOL3",
    "SPMC0", "SPMC1",
    "SP0COL", "SP1COL", "SP2COL", "SP3COL", "SP4COL", "SP5COL", "SP6COL", "SP7COL",
    # SID
    "FRELO1", "FREHI1", "PWLO1", "PWHI1", "VCREG1", "ATDCY1", "SUREL1",
    "FRELO2", "FREHI2", "PWLO2", "PWHI2", "VCREG2", "ATDCY2", "SUREL2",
    "FRELO3", "FREHI3", "PWLO3", "PWHI3", "VCREG3", "ATDCY3", "SUREL3",
    "CUTLO", "CUTHI", "RESON", "SIGVOL", "POTX", "POTY", "RANDOM", "ENV3",
    # CIA 1
    "CIAPRA", "CIAPRB", "CIDDRA", "CIDDRB", "TIMALO", "TIMAHI", "TIMBLO",
    "TIMBHI", "TODTEN", "TODSEC", "TODMIN", "TODHRS", "CIASDR", "CIAICR",
    "CIACRA", "CIACRB",
    # CIA 2
    "CI2PRA", "CI2PRB", "C2DDRA", "C2DDRB", "TI2ALO", "TI2AHI", "TI2BLO",
    "TI2BHI", "TO2TEN", "TO2SEC", "TO2MIN", "TO2HRS", "CI2SDR", "CI2ICR",
    "CI2CRA", "CI2CRB",
}

# C64 color names (VIC-II 4-bit palette) — single-word only for tag matching
COLOR_NAMES = {
    "BLACK", "WHITE", "RED", "CYAN", "PURPLE", "GREEN", "BLUE", "YELLOW",
    "ORANGE", "BROWN",
}

# Combined set of all known single-word tags for fast lookup
ALL_KNOWN_TAGS = KERNAL_LABELS | REGISTER_MNEMONICS | COLOR_NAMES

# Pre-compiled pattern for stripping known tags from queries
_KNOWN_TAG_PATTERN = re.compile(
    r'(?<!\w)(' + '|'.join(re.escape(t) for t in sorted(ALL_KNOWN_TAGS, key=len, reverse=True)) + r')(?!\w)',
    re.IGNORECASE
)


def extract_known_tags(query: str) -> list[str]:
    """Extract known C64 labels, mnemonics, and color names from query.

    Returns uppercase tag strings that match known terms.
    """
    tags = set()
    words = re.findall(r'\b[A-Za-z][A-Za-z0-9_]{1,7}\b', query)
    for word in words:
        up = word.upper()
        if up in ALL_KNOWN_TAGS:
            tags.add(up)
    return sorted(tags)


def lookup_address_region(addr_int: int) -> list[str]:
    """Look up which C64 memory regions an address falls into.

    Returns a list of region descriptions, most-specific first.
    Stops after 2 matches (specific + general is enough context).
    """
    regions = []
    for start, end, name, desc in C64_MEMORY_MAP:
        if start <= addr_int <= end:
            regions.append(f"{name} ({desc})")
            if len(regions) >= 2:
                break
    return regions


# ---------------------------------------------------------------------------
# Number enrichment
# ---------------------------------------------------------------------------

def _is_likely_value(token: str, context_left: str) -> bool:
    """Heuristic: skip numbers that look like prose (Chapter 3, 3 voices, etc).

    We enrich numbers that are:
    - Prefixed with $ or %  (always enrich)
    - >= 10 decimal digits (likely an address or register value)
    - Preceded by a comma, register-ish word, or start of string
    """
    if token.startswith("$") or token.startswith("%"):
        return True

    # Single-digit bare numbers are almost always prose — unless they
    # matched as post-comma values (already filtered by regex context)
    stripped = token.lstrip("0")
    if len(stripped) <= 1 and not token.startswith("0x"):
        # Check if preceded by comma (value parameter like POKE addr,val)
        ctx = context_left.rstrip()
        if ctx and ctx[-1] == ",":
            return True
        return False

    # Numbers >= 10 are worth enriching (register values, addresses, flags)
    return True


def enrich_number(token: str) -> str:
    """Convert a single number token into a multi-base annotation.

    Rules:
    - $XXXX  → hex input.  Add decimal; add binary if value ≤ 255
    - %XXXX  → binary input. Add decimal and hex
    - bare   → decimal input. Add hex; add binary if value ≤ 255
    """
    try:
        if token.startswith("$"):
            val = int(token[1:], 16)
            hex_str = token.upper()
            parts = [hex_str, str(val)]
            if val <= 255:
                parts.append(f"%{val:08b}")
            return " / ".join(parts)

        if token.startswith("%"):
            val = int(token[1:], 2)
            parts = [token, str(val), f"${val:02X}"]
            return " / ".join(parts)

        # Bare decimal
        val = int(token)
        parts = [token, f"${val:04X}" if val > 255 else f"${val:02X}"]
        if val <= 255:
            parts.append(f"%{val:08b}")
        return " / ".join(parts)

    except ValueError:
        return token


# Pattern matches: $XXXX, %01010101, bare decimals, or single digits after comma
_NUM_PATTERN = re.compile(
    r"""
    (?<!\w)          # not preceded by a word char
    (
      \$[0-9A-Fa-f]{1,4}   # hex: $00 - $FFFF
      | %[01]{4,8}          # binary: %0000 - %00000000
      | [0-9]{2,5}          # decimal: 10 - 65535
    )
    (?!\w)           # not followed by a word char
    |
    (?<=,)\s*        # after a comma (value parameter context)
    ([0-9]{1,5})     # single or multi-digit number
    (?!\w)
    """,
    re.VERBOSE,
)

# Pattern for extracting hex addresses from query (for keyword filtering)
# Only match 4-digit hex — shorter values ($00, $20, $FF) are immediate values, not registers
_HEX_ADDR_PATTERN = re.compile(
    r'(?<!\w)\$([0-9A-Fa-f]{4})(?!\w)'
)


def extract_hex_addresses(query: str) -> list[str]:
    """Extract hex address tokens from query for keyword filtering.

    Returns uppercase hex strings without $ prefix (e.g. ["D020", "D016"]).
    Only includes 4-digit hex addresses (>= $0100) — short values like $00, $FF
    are immediate values, not register addresses.
    Also converts bare decimals > 255 to hex for filtering.
    """
    addrs = set()
    # Direct hex: $D020, $d016 (4-digit only)
    for m in _HEX_ADDR_PATTERN.finditer(query):
        addrs.add(m.group(1).upper())

    # Bare decimals > 255 that are likely addresses
    for m in _NUM_PATTERN.finditer(query):
        token = m.group(1) or m.group(2)
        if not token or token.startswith("$") or token.startswith("%"):
            continue
        try:
            val = int(token)
            if val > 255:
                addrs.add(f"{val:04X}")
        except ValueError:
            pass

    return sorted(addrs)


def enrich_query(query: str) -> str:
    """Find numbers in a query and append base-converted annotations + memory region context."""
    matches = list(_NUM_PATTERN.finditer(query))
    if not matches:
        return query

    annotations = []
    region_annotations = []
    seen = set()
    seen_regions = set()
    for m in matches:
        token = m.group(1) or m.group(2)  # group 2 is post-comma single digits
        if not token or token in seen:
            continue
        seen.add(token)
        if not _is_likely_value(token, query[:m.start()]):
            continue
        enriched = enrich_number(token)
        if enriched != token:
            annotations.append(f"{token} = {enriched}")

        # Look up memory region for addresses > 255
        try:
            if token.startswith("$"):
                val = int(token[1:], 16)
            elif token.startswith("%"):
                val = int(token[1:], 2)
            else:
                val = int(token)
            if val > 255:
                regions = lookup_address_region(val)
                for r in regions:
                    if r not in seen_regions:
                        seen_regions.add(r)
                        region_annotations.append(f"${val:04X} → {r}")
        except ValueError:
            pass

    parts = []
    if annotations:
        parts.append("; ".join(annotations))
    if region_annotations:
        parts.append("; ".join(region_annotations))

    if not parts:
        return query

    return query + "\n[" + " | ".join(parts) + "]"


def has_natural_language(query: str) -> bool:
    """Check if query has meaningful natural language beyond just addresses/numbers/tags.

    Returns False for queries like "$D016", "CHROUT", "EXTCOL BGCOL0", "STA $D020,7".
    Returns True for "what does $D020 do" or "how to use CHROUT to print".
    """
    # Strip hex addresses, 6502 mnemonics, known tags, numbers, punctuation
    stripped = _HEX_ADDR_PATTERN.sub("", query)
    stripped = re.sub(r'(?<!\w)(LDA|STA|STX|STY|LDX|LDY|ADC|SBC|AND|ORA|EOR|'
                      r'INC|DEC|INX|INY|DEX|DEY|ASL|LSR|ROL|ROR|BIT|CMP|CPX|CPY|'
                      r'JMP|JSR|RTS|RTI|BRK|NOP|BCC|BCS|BEQ|BNE|BMI|BPL|BVC|BVS|'
                      r'CLC|SEC|CLD|SED|CLI|SEI|CLV|PHA|PLA|PHP|PLP|TAX|TXA|TAY|TYA|'
                      r'TSX|TXS)(?!\w)', '', stripped, flags=re.IGNORECASE)
    # Strip known C64 tags (KERNAL labels, register mnemonics, color names)
    stripped = _KNOWN_TAG_PATTERN.sub('', stripped)
    stripped = re.sub(r'[0-9$%,#()\s]+', ' ', stripped)
    words = [w for w in stripped.split() if len(w) > 1]
    return len(words) >= 2


# ---------------------------------------------------------------------------
# Qdrant search
# ---------------------------------------------------------------------------

def get_embedding(client: OpenAI, text: str) -> list[float]:
    response = client.embeddings.create(model=EMBEDDING_MODEL, input=[text])
    return response.data[0].embedding


def qdrant_search(vector: list[float], limit: int, filter_tags: list[str] | None = None) -> list[dict]:
    """Vector search, optionally filtered to points with matching tags metadata."""
    body = {
        "vector": vector,
        "limit": limit,
        "with_payload": True,
    }
    if filter_tags:
        # Filter on tags metadata field (keyword indexed)
        # Hex addresses are $-prefixed: "$D020". Labels/mnemonics are plain: "CHROUT".
        body["filter"] = {
            "should": [
                {"key": "tags", "match": {"value": tag}}
                for tag in filter_tags
            ]
        }
    r = requests.post(
        f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points/search",
        json=body,
    )
    r.raise_for_status()
    return r.json().get("result", [])


def merge_results(primary: list[dict], secondary: list[dict], limit: int) -> list[dict]:
    """Merge two result sets, deduplicating by point id. Primary results come first."""
    seen = set()
    merged = []
    for hit in primary:
        pid = hit.get("id")
        if pid not in seen:
            seen.add(pid)
            merged.append(hit)
    for hit in secondary:
        pid = hit.get("id")
        if pid not in seen:
            seen.add(pid)
            merged.append(hit)
    return merged[:limit]


def trim_by_score(results: list[dict], limit: int) -> list[dict]:
    """Adaptively trim results based on score quality.

    Keeps results that score >= MIN_SCORE_RATIO of the best hit's score,
    capped at limit. This way narrow queries with a few great matches
    return fewer results, while broad queries with many good matches
    return more.
    """
    if not results:
        return results
    best_score = results[0].get("score", 0)
    if best_score <= 0:
        return results[:limit]
    cutoff = best_score * MIN_SCORE_RATIO
    trimmed = [r for r in results if r.get("score", 0) >= cutoff]
    return trimmed[:limit]


# ---------------------------------------------------------------------------
# Output formatting
# ---------------------------------------------------------------------------

def format_results(results: list[dict], search_mode: str = "") -> str:
    """Format search results for consumption by Claude."""
    if not results:
        return "No results found."

    parts = []
    if search_mode:
        parts.append(f"_Search mode: {search_mode}_\n")

    for i, hit in enumerate(results, 1):
        payload = hit.get("payload", {})
        score = hit.get("score", 0)
        title = payload.get("title", payload.get("filename", "untitled"))
        filename = payload.get("filename", "")
        doc_type = payload.get("type", "unknown")
        document = payload.get("document", "")
        refs = payload.get("references", [])

        header = f"### Result {i}: {title}"
        meta_parts = [f"score={score:.3f}", f"type={doc_type}"]
        if filename:
            meta_parts.append(f"file={filename}")
        meta = " | ".join(meta_parts)

        result_parts = [header, f"_{meta}_", "", document]

        if refs:
            result_parts.append("\n**Related chunks:**")
            for ref in refs:
                result_parts.append(f"- `{ref['chunk']}` — {ref['description']}")

        parts.append("\n".join(result_parts))

    return "\n\n---\n\n".join(parts)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    limit = DEFAULT_LIMIT
    raw = False
    enrich_only = False
    query_parts = []

    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--limit" and i + 1 < len(args):
            limit = int(args[i + 1])
            i += 2
        elif args[i] == "--raw":
            raw = True
            i += 1
        elif args[i] == "--enrich-only":
            enrich_only = True
            i += 1
        else:
            query_parts.append(args[i])
            i += 1

    query = " ".join(query_parts)
    if not query:
        print("Usage: uv run scripts/query_qdrant.py [--limit N] [--raw] [--enrich-only] \"query\"")
        sys.exit(1)

    # Enrich
    if raw:
        enriched = query
    else:
        enriched = enrich_query(query)

    if enrich_only:
        print(enriched)
        return

    # Extract hex addresses and known tags for keyword filtering
    hex_addrs = extract_hex_addresses(query)
    known_tags = extract_known_tags(query)
    filter_tags = [f"${addr}" for addr in hex_addrs] + known_tags
    has_filters = bool(filter_tags)
    nl = has_natural_language(query)

    if enriched != query:
        print(f"Enriched query:\n  {enriched}", file=sys.stderr)
    if filter_tags:
        print(f"Filter tags: {', '.join(filter_tags)}", file=sys.stderr)
    print(f"Natural language: {'yes' if nl else 'no'}", file=sys.stderr)
    print(file=sys.stderr)

    # Check deps
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY not set", file=sys.stderr)
        sys.exit(1)

    try:
        requests.get(f"{QDRANT_URL}/collections", timeout=3)
    except requests.ConnectionError:
        print(f"Error: Cannot connect to Qdrant at {QDRANT_URL}", file=sys.stderr)
        sys.exit(1)

    client = OpenAI(api_key=api_key)

    # ---------------------------------------------------------------------------
    # Search strategy:
    #   tags + natural language → filtered vector (primary) + unfiltered vector (fill)
    #   tags only               → filtered vector (keyword match, ranked by relevance)
    #   no tags                 → standard semantic search
    # ---------------------------------------------------------------------------

    fetch = max(FETCH_LIMIT, limit)

    if has_filters and nl:
        # Hybrid: filtered vector search primary, unfiltered to fill remaining slots
        vector = get_embedding(client, enriched)
        filtered = qdrant_search(vector, fetch, filter_tags=filter_tags)
        unfiltered = qdrant_search(vector, fetch)
        results = merge_results(filtered, unfiltered, fetch)
        results = trim_by_score(results, limit)
        mode = f"hybrid (filtered on {', '.join(filter_tags)} + semantic)"

    elif has_filters and not nl:
        # Tag lookup: filtered vector search for ranked results
        vector = get_embedding(client, enriched)
        results = qdrant_search(vector, fetch, filter_tags=filter_tags)
        results = trim_by_score(results, limit)
        mode = f"filtered ({', '.join(filter_tags)})"

    else:
        # Pure semantic search
        vector = get_embedding(client, enriched)
        results = qdrant_search(vector, fetch)
        results = trim_by_score(results, limit)
        mode = "semantic"

    print(format_results(results, search_mode=mode))


if __name__ == "__main__":
    main()
