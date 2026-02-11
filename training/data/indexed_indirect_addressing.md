# Indexed, Indirect Addressing (LDA ($C0,X))

**Summary:** The 6502 addressing mode "indexed, indirect" (syntax: LDA ($C0,X)) adds the X register to the zero-page operand first to select a zero-page pointer, then loads the two-byte address stored there and accesses the final memory location; commonly used with X even to step through two-byte pointers (pointer tables in zero page).

## Description
Indexed, indirect addressing performs indexing before indirection: the CPU adds the X register to the supplied zero-page operand (for example $C0), uses that resulting zero-page address as the low byte of a two-byte pointer (reading the low and high bytes from consecutive zero-page locations), and then accesses the effective 16-bit address pointed to.

- Syntax example: LDA ($C0,X) — X is added to $C0 to produce the zero-page pointer location; the two bytes at that zero-page address form the final address to load A from.
- Typical usage: create a table of two-byte pointers in zero page (one pointer per buffer/line). Set X to an even index (0,2,4...) to step pointer-by-pointer. Example use case: multiple serial/telecom lines each with its own buffer; STA ($60,X) stores A into the buffer pointed to by the pointer at $60+$X (where X = line_number*2). To advance the buffer pointer itself, perform INC $60,X (increment the low byte of that pointer).

The mode uses zero-page pointer locations as indirection targets; examples in this chunk show base operands $C0 and $60 and a four-line pointer table occupying four two-byte pointers in zero page.

## Source Code
```asm
; Example: load via indexed, indirect
; If X = #$04 then LDA ($C0,X) reads pointer from $C4/$C5, then loads A from that address
        LDA ($C0,X)

; Example: store into per-line buffer using pointer table at $60 (four pointers, two bytes each)
; X = line_number * 2
        STA ($60,X)

; After storing, bump the pointer so next character goes to the next position
        INC $60,X
```

```text
 $00               $FF
  ++--+--+--+--------+---------------------------------------------------+
  ||..|..|..|        |              MEMORY                               |
  ++--+--+--+--------+---------------------------------------------------+
    ^     ^|                    ^
    |     ||                    |
    |  X  |`--------------------'
    +-----'
    |
  INDEXED, INDIRECT ALLOWS ONE OF SEVERAL
  INDIRECT ADDRESSES TO BE CHOSEN USING
  THE X INDEX REGISTER

  Figure 5.9
```

## Key Registers
- $00C0 - Zero Page - base operand example used with LDA ($C0,X) (zero-page pointer base)
- $0060-$0067 - Zero Page - four 2-byte indirect pointers example (pointers at $60/$61, $62/$63, $64/$65, $66/$67 for per-line buffers)

## References
- "indirect_indexed_addressing" — expands on contrast between (addr),Y and (addr,X) forms