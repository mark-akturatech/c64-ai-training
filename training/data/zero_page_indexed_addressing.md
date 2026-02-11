# Zero-Page, Indexed Addressing (e.g., LDA $E0,X)

**Summary:** Zero-page, indexed addressing (LDA $E0,X) adds the X (or in two cases Y) index to a zero-page base and wraps within page $00 (low byte only). Effective address never leaves zero page; this enables full 256-byte reach of zero page and two's-complement-style negative indexing (e.g., X=$FF means -1).

## Overview
Zero-page, indexed addressing uses a one-byte base address in $00–$FF. The CPU adds the selected index register (normally X; only LDX and STX support zero-page,Y) to that base and discards any carry beyond the low byte. Because the high byte is lost, the resulting effective address is always within zero page ($0000–$00FF).

This behavior differs from absolute, indexed addressing where the index can carry into the high byte and access other pages. Zero-page, indexed addressing therefore:

- Always remains in zero page (effective address = (base + index) & $FF).
- Can use wrap-around arithmetic (e.g., $E0 + $50 = $130 → effective low byte $30).
- Provides a form of negative indexing by treating index register values as two's-complement offsets (X=$FF = -1, X=$FE = -2, etc.).
- Typically uses X; only LDX/STX accept the Y register in zero-page indexed mode.

## Behavior and effects
- Address calculation: effective_address = (zero_page_base + index) & $FF. The high byte is effectively discarded.
- Wrap-around example: LDA $E0,X with X = $50:
  - $E0 + $50 = $130 → low byte $30 → effective address $0030.
- Because the effective address cannot leave page $00, zero-page, indexed addressing can reach any of the 256 zero-page locations from any other by choosing an appropriate index value.
- Negative indexing: by loading X with values near $FF you can index downward from a base address without explicit subtraction instructions.
- Use cases: compact addressing of small buffers, tables, and frequently accessed variables—limited by the small size and existing allocations of zero page on Commodore machines.

## Source Code
```asm
; Example illustrating wrap-around
; Assume X = $50
        LDA $E0,X    ; ($E0 + $50) & $FF = $30 → loads from $0030
```

```text
   $00     $FF $100
  +-----------+----------------------------------------------------------+
  |           |                     MEMORY                               |
  +-----------+----------------------------------------------------------+
    ^     ^ ^
    |     | |
    |     +-'
  |-'     +---|
          |
        BASE
       ADDRESS

Figure: zero-page base with wrap-around into low byte
```

## References
- "zero_page_addressing" — expands on advantages and costs of using zero page

## Mnemonics
- LDA
- LDX
- STX
