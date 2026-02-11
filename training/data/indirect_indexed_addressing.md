# Indirect, indexed addressing (LDA ($C0),Y)

**Summary:** LDA ($C0),Y — indirect, indexed addressing: the operand is a zero-page address holding a two-byte (low byte first) base address; the Y register is added to that base to form the final effective address. The indirect pointer must reside in zero page and the mode is ideal for scanning a chunk of memory by changing Y.

## Mechanism
Indirect, indexed addressing takes a zero-page pointer (two bytes, low byte at the specified zero-page address, high byte at the next zero-page address) and adds the Y register to that 16-bit base to produce the effective address used by the instruction. The zero-page pointer is fully controllable at runtime, so you can point the instruction at any 16-bit address by storing the desired low/high bytes into zero page.

Key points:
- Operand is a zero-page address (e.g. $C0). The processor reads two bytes at that zero-page address and the next one to form a 16-bit base address (low byte first).
- The Y register is added to that 16-bit base to form the effective address used by the memory access.
- This allows a single instruction to scan data within a 256-byte chunk (using Y) while the chunk’s base is moved by storing a new pointer into zero page.

Contrast (brief): this is the (indirect),Y form — different from (indirect,X) which uses X to modify the zero-page pointer before loading the two-byte base (X-first vs Y-second).

## Typical usage pattern
- Store the low and high bytes of the start of a logical data chunk (record, table row, screen line, etc.) into two consecutive zero-page bytes.
- Use LDA ($zz),Y (or other (addr),Y instructions) with Y scanning through that chunk (0..255).
- When you need to operate on the next chunk, update the two zero-page bytes to point to the next chunk start; reuse the same Y-based scan code.

This combination is particularly convenient for repeated scans of fixed-size records or for screen manipulation: the indirect pointer anchors the base of the current record/page and Y indexes within it.

## Source Code
```asm
; Example assembly illustrating the addressing mode semantics
; (no machine-cycle timing shown)

        LDA ($C0),Y    ; Load A from address formed by word at $00C0 + Y

; Memory example:
; $00C0 = $11    ; low byte of pointer
; $00C1 = $22    ; high byte of pointer
; Y = #$03
; Effective address = $2211 + $03 = $2214
; So LDA ($C0),Y loads from $2214
```

```text
  $00            $FF
 +-------+---+------+---------------------------------------------------+
 |       |   |      |              MEMORY                               |
 +-------+---+------+---------------------------------------------------+
          ^ |            ^  ^
          | |            |  |
          | |            +--'
          | `------------' Y
     INDIRECT
     ADDRESS

 Figure 5.7
```

```text
 .--------------DATA IN MEMORY--------------.
 |                                          |
 v                                          v
+--------------+--------------+--------------+
|  NAME, ETC.  |  NAME, ETC.  |  NAME, ETC.  |
+--------------+--------------+--------------+
 ^              ^              ^
 |              |              |
 A              B

 Figure 5.8
```

## References
- "indexed_indirect_addressing" — compares with X-first (indexed, indirect) mode
- "screen_manipulation_setup_and_indirect_pointer" — practical use for screen memory across pages

## Mnemonics
- LDA
