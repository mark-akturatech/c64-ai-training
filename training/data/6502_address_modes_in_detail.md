# 6502 Addressing Modes (implied, A, immediate, absolute, zero-page, indexed, indirect)

**Summary:** Coverage of 6502 addressing modes: implied, accumulator (A), immediate (#), absolute (abs), zero-page (zpg), indexed absolute (abs,X and abs,Y) with page-crossing note, zero-page indexed (zpg,X and zpg,Y), indirect (JMP (abs)), pre-indexed indirect ((zp,X) aka (X,ind)) and post-indexed indirect ((zp),Y aka (ind),Y). Notes on the NMOS JMP indirect page-wrap bug and WDC W65C02 extensions (zero-page indirect and absolute-indexed-indirect).

## Overview
This node documents the operational semantics and timing-related behavior (page crossing, wrap) for the primary 6502 address modes used by instructions and examples of their opcode encoding bytes. It focuses on effective-address calculation rules and the consequences for instruction length and cycle timing (relative statements as in original source).

- Implied (impl) and Accumulator (A): no memory operand (operand is implied or in A).
- Immediate (#): operand is the following byte.
- Absolute (abs): 16-bit address follows (2 bytes), full 16-bit addressing.
- Zero-page (zpg): single-byte address, accesses $0000–$00FF; wrapped low-addressing and generally faster.
- Indexed absolute (abs,X / abs,Y): add X or Y to 16-bit base; instruction length is 3 bytes; one extra cycle vs. non-indexed absolute to compute effective address; additional cycle if addition crosses a page boundary (high-byte changes).
- Zero-page indexed (zpg,X / zpg,Y): single-byte base plus index; instruction length is 2 bytes; no page-crossing penalty because address wraps within zero-page (high-byte never affected). Most zero-page indexed modes use X; LDX supports zpg,Y.
- Indirect (JMP (abs)): reads a 16-bit pointer (low byte then high byte) from the given address and jumps to that fetched 16-bit address. On NMOS 6502, if the pointer address low byte is $FF the high byte is fetched from the low byte's page wrap (bug). W65C02 fixes this and inserts an extra cycle when the indirect operand crosses a page boundary.
- (zp,X) (pre-indexed indirect, "zeropage,X" / "LDA ($70,X)"): add X to the zero-page pointer (wrap within zero-page), then fetch the two-byte pointer from that zero-page location (low/high) and use it as the effective address. No page-crossing penalty for the zero-page pointer arithmetic itself.
- (zp),Y (post-indexed indirect, "zeropage),Y" / "LDA ($70),Y"): fetch 16-bit pointer from zero-page address, then add Y to that fetched 16-bit address to form effective address; if adding Y crosses a page boundary an extra cycle is required.

## Absolute Indexed (abs,X and abs,Y)
- Operation: effective_address = base_16bit + X (or + Y).
- Encoding: 3 bytes (opcode, low, high).
- Timing: typically one cycle slower than non-indexed absolute forms due to index addition; if the addition changes the high byte (page crossing) an additional cycle is taken.
- Use cases: table lookups, stepping through contiguous memory buffers.

## Zero-Page and Zero-Page Indexed (zpg, zpg,X, zpg,Y)
- Zero-page: base is one byte; effective_address = $00XX.
- Zero-page indexed: effective_address = ($00base + X) & $00FF (wraps in zero-page). LDX supports zpg,Y form.
- Encoding: zero-page forms are 2 bytes (opcode, zp-byte).
- Timing: generally one CPU cycle faster (or one less) than comparable absolute-indexed forms; no page-crossing penalty because high byte never changes (wrap-around occurs in low byte).

## Indirect Addressing and NMOS JMP Bug
- JMP (abs) indirect: the instruction takes a 16-bit pointer address; the processor reads the two bytes at that pointer (low then high) and jumps to that fetched 16-bit address.
- NMOS 6502 bug: if the pointer low byte is $FF (e.g. JMP ($12FF)), the high byte is fetched from $1200 (wrap within the same page) instead of $1300. This is an implementation bug in NMOS 6502 and affects vectors that sit at a page boundary.
- W65C02 behavior: the WDC W65C02 corrects this bug (fetches the high byte from the next address across page boundary) and, when necessary, inserts an extra cycle for that corrected fetch.

## Pre- and Post-Indexed Indirect Modes
- Pre-indexed indirect (X,ind) / (zp,X) notation: add X to zero-page pointer (wrap in zero-page), then fetch 16-bit pointer at that zero-page location; effective_address = read16($00[(zp + X) & $FF]).
- Post-indexed indirect (ind,Y) / (zp),Y notation: read 16-bit pointer from zero-page address, then add Y to that 16-bit value to get effective_address; page-crossing by adding Y may cause an extra cycle.
- Page-crossing note: post-indexed indirect ((zp),Y) can incur the same extra-cycle penalty as abs,X/Y when the Y addition changes the high byte of the fetched pointer. Pre-indexed (zp,X) does not incur a page-crossing penalty from the zero-page wrap.

## W65C02 Extensions
- WDC W65C02 adds additional indirect addressing forms:
  - Zero-page indirect (JMP (zpg)): allows JMP to use a zero-page pointer directly (fetch 16-bit pointer from zero-page).
  - Absolute indexed indirect (JMP (abs,X)): absolute base plus X, then treat that address as pointer to indirect target (absolute-indexed-indirect). Behavior and cycle costs differ from NMOS variants; the W65C02 also corrects the NMOS JMP page-wrap bug and may add cycles for the corrected fetch.

## Source Code
```asm
; Examples from source text (opcode bytes shown)
; Absolute indexed example
LDA $3120,X        ; opcode BD 20 31
; bytes: BD 20 31
; If X = $12, effective address = $3120 + $12 = $3132
; Value at $3132 loaded into A

; Zero-page indexed example
LDA $80,X          ; opcode B6 80
; bytes: B6 80
; If X = $02, effective address = $0080 + $02 = $0082 (wraps in zero page)
; Value at $0082 loaded into A

; Example table (mnemonic, shown instruction bytes from source)
; Note: cycles not specified in source, only relative statements.
```

```text
Mnemonic examples and bytes (from source):
LDA $3120,X    -> BD 20 31
LDA $80,X      -> B6 80
LDX $8240,Y    -> (absolute,Y example; opcode not provided in source)
INC $1400,X    -> (absolute,X example; opcode not provided in source)
LSR $82,X      -> (zero-page,X example; opcode not provided in source)
LDX $60,Y      -> (zero-page,Y example; opcode not provided in source)
JMP (abs)      -> (indirect JMP; opcode 6C low high)
```

## References
- "indirect_and_indexed_indirect_examples" — expands on examples of JMP ($FF82), LDA ($70,X), LDA ($70),Y
- "w65c02_extensions_address_modes" — expands on W65C02 extra modes and behavior differences

## Mnemonics
- JMP
