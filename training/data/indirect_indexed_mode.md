# Indirect indexed addressing ((zp),Y)

**Summary:** Indirect indexed addressing ((zp),Y) uses a zero-page pointer (low byte at zp addr, high byte at next zp addr) and adds the Y register to form the final 16-bit effective address; example: LDA ($02),Y with $02=$45, $03=$1E and Y=$00 accesses $1E45.

## Description
Indirect indexed mode (often written (zp),Y) requires the pointer to reside in zero page. The operand is a single zero-page address whose byte contains the low-order byte of the target address; the next zero-page location (address+1) contains the high-order byte. The CPU forms a 16-bit base address from these two bytes and then adds the Y register to that base to obtain the effective memory address.

Key points:
- Only the Y register may be used as the index in this mode.
- The pointer must be in zero page (addresses $0000–$00FF).
- The instruction operand is the zero-page pointer address; the processor reads two consecutive zero-page bytes (low then high) to form the base address, then adds Y.
- Example addressing: low = (zp), high = (zp+1), effective = (high<<8 | low) + Y.

Example scenario from source:
- $0002 contains $45 (low byte)
- $0003 contains $1E (high byte)
- LDY #$00
- LDA ($02),Y accesses $1E45 (since $1E<<8 + $45 + $00 = $1E45)

## Source Code
```asm
    ; Set up indirect pointer at zero page $02/$03 and use LDA ($02),Y
    LDA #$00      ; load low order actual base address
    STA $02       ; set the low byte of the indirect address
    LDA #$16      ; load high order indirect address
    STA $03       ; set the high byte of the indirect address
    LDY #$05      ; set the indirect index (Y)
    LDA ($02),Y   ; load indirectly indexed by Y
```

## Key Registers
- $0002-$0003 - Zero Page - low/high bytes of the indirect base pointer used by (zp),Y

## References
- "indexed_addressing_and_indexing" — expands on how Y is used as the index in indirect indexed mode
- "indexed_indirect_mode" — compares with indexed indirect where X indexes the pointer