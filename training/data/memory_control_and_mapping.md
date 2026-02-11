# Memory map control via $0001 (6510 I/O port)

**Summary:** The 6510 I/O port at $0001 provides the three least-significant control lines (bits 0–2) used to select the C64 primary memory maps and to choose whether I/O devices or the character ROM are visible at $D000–$DFFF; five total bank-control lines exist (two are cartridge signals, normally pulled high).

**Memory mapping control (bits at $0001)**

The 6510 CPU contains an internal 8-bit I/O port at address $0001 whose three least significant bits control the system memory map:

- **Bit 0 (LORAM):** Controls the visibility of the BASIC ROM at $A000–$BFFF.
  - 1: BASIC ROM is visible.
  - 0: RAM is visible.

- **Bit 1 (HIRAM):** Controls the visibility of the KERNAL ROM at $E000–$FFFF.
  - 1: KERNAL ROM is visible.
  - 0: RAM is visible.

- **Bit 2 (CHAREN):** Controls the visibility of I/O devices or the character ROM at $D000–$DFFF.
  - 1: I/O devices are visible.
  - 0: Character ROM is visible.

The combination of LORAM and HIRAM bits selects one of four primary memory configurations:

- **%11 (LORAM=1, HIRAM=1):** BASIC and KERNAL ROMs are visible.
- **%10 (LORAM=0, HIRAM=1):** KERNAL ROM is visible; BASIC ROM is replaced by RAM.
- **%01 (LORAM=1, HIRAM=0):** BASIC ROM is visible; KERNAL ROM is replaced by RAM.
- **%00 (LORAM=0, HIRAM=0):** Both BASIC and KERNAL ROMs are replaced by RAM.

When both LORAM and HIRAM are set to 0, the system provides access to the full 64K of RAM, and the CHAREN bit has no effect in this configuration.

In addition to these three CPU-controlled lines, there are two cartridge-controlled bank lines (GAME and EXROM). These lines are internally pulled high when no cartridge is present and can be ignored for disk-only programs. Altogether, there are five control lines that determine the memory layout.

Memory map changes are performed entirely in software by writing appropriate bit patterns to $0001. The following table summarizes the memory configurations based on the LORAM, HIRAM, and CHAREN bits:

| LORAM | HIRAM | CHAREN | $A000–$BFFF | $D000–$DFFF | $E000–$FFFF |
|-------|-------|--------|-------------|-------------|-------------|
| 1     | 1     | 1      | BASIC ROM   | I/O         | KERNAL ROM  |
| 1     | 1     | 0      | BASIC ROM   | Char ROM    | KERNAL ROM  |
| 1     | 0     | 1      | BASIC ROM   | I/O         | RAM         |
| 1     | 0     | 0      | BASIC ROM   | Char ROM    | RAM         |
| 0     | 1     | 1      | RAM         | I/O         | KERNAL ROM  |
| 0     | 1     | 0      | RAM         | Char ROM    | KERNAL ROM  |
| 0     | 0     | 1      | RAM         | I/O         | RAM         |
| 0     | 0     | 0      | RAM         | Char ROM    | RAM         |

*Note: The VIC (graphics chip) bank selection can be set with assembler macros such as `SetVICBank`. The VIC bank selection details are covered elsewhere (see References).*

## Source Code

```assembly
.macro SetVICBank(bank)
    lda $dd00
    and #%11111100
    ora #3-bank
    sta $dd00
.endmacro
```

*This macro sets the VIC-II to use one of the four 16K memory banks. The `bank` parameter should be 0, 1, 2, or 3.*

## Key Registers

- **$0001 - 6510 I/O Port:**
  - **Bit 0 (LORAM):** 1 = BASIC ROM at $A000–$BFFF; 0 = RAM.
  - **Bit 1 (HIRAM):** 1 = KERNAL ROM at $E000–$FFFF; 0 = RAM.
  - **Bit 2 (CHAREN):** 1 = I/O at $D000–$DFFF; 0 = Character ROM.

## References

- "c64_address_space_and_bank_switching" — expands on general bank switching rationale and bank-control signals.
- "graphics_memory_locations_and_vic_bank_selection" — expands on VIC-II bank selection specifics and $DD00/$DD02 controls.

## Labels
- $0001
- LORAM
- HIRAM
- CHAREN
