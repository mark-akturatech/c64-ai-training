# C-64 Reference Resources (Mapping, Programmer's Reference, All About Your C-64, VIC-II article)

**Summary:** Curated primary references for C‑64 demo programming: a full memory map (addresses like $0000–$FFFF, I/O ranges), opcode table with cycle counts and addressing modes (useful for timing and raster code), and an in‑depth VIC‑II (MOS 6567/6569) hardware article (registers such as $D000-$D02E, raster at $D012, sprite registers, etc.). Also a practical HTML reference ("All About Your C-64") for quick bit/layout lookups.

## Overview
- Mapping the C-64 — a thorough memory map covering RAM, ROM, I/O, and commonly used system vectors and addresses; useful for placing code/data in zero page, screen memory, colour RAM, and I/O ($D000-$D02E VIC-II, $D400-$D418 SID, $DC00/$DD00 CIAs).
- Programmer's Reference Guide — contains an opcode table with addressing modes and cycle counts (essential for precise cycle-counted raster loops and self-modifying timing), plus mnemonics and instruction encodings.
- All About Your C-64 — an HTML-friendly cheat-sheet style reference with bitfields and register summaries for the VIC-II, SID, CIAs and other system parts; handy for quick lookup while coding.
- The MOS 6567/6569 Video Controller (VIC-II) — Christian Bauer’s comprehensive article covering VIC-II internals, register behaviour, raster timing, sprite handling and subtle hardware quirks; invaluable for demo effects and cycle-accurate tricks.

Notes:
- Use the Programmer's Reference Guide opcode cycles together with the VIC-II raster timing (raster at $D012) when crafting cycle-exact raster bars and sprite multiplexing.
- The VIC-II register block is commonly referenced as $D000-$D02E; SID voice/register ranges are $D400-$D414 (voices) and $D415-$D418 (filter).
- Some mirrors/archives host compressed copies (e.g., .gz) of the VIC-II article; decompress before viewing.

## References
- "Mapping the C-64" — Memory map and address explanations (Project 64): http://project64.c64.org/index.html
- "Programmer's Reference Guide" — Opcode table with cycles and addressing modes (Project 64): http://project64.c64.org/index.html
- "All About Your C-64" — Practical HTML reference/cheatsheet (The Dreams): http://www.the-dreams.de/
- "The MOS 6567/6569 Video Controller (VIC-II) and its Application in the C-64" — Christian Bauer (FTP mirror): ftp://ftp.funet.fi/pub/cbm/documents/chipdata/VIC-Article.gz
