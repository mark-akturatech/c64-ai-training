# VIC-II Character ROM Mapping (C64)

**Summary:** The VIC-II chip accesses a 16K address window, within which the Character ROM is mirrored at $1000-$1FFF and $9000-$9FFF, allowing character glyph data to be accessible in these regions. To utilize characters in other 16K banks, you must provide a user-defined character set or copy the ROM data into RAM.

**Description**

The VIC-II chip can address only a single 16K block at a time; all display data (screen memory, character shape data, sprite shape data) must reside within that 16K block. On the C64, the system presents a read-only image of the Character ROM at two locations within the VIC-II's addressable 16K window:

- $1000-$1FFF (decimal 4096–8191)
- $9000-$9FFF (decimal 36864–40959)

These ROM images are visible to the VIC-II when it fetches character/glyph data. The Character ROM is not visible in the other two 16K blocks that the VIC-II may be pointed at; if you select one of those other blocks for the VIC, character glyphs must come from RAM (a user-defined charset) or from copied ROM data placed into RAM.

When the CPU accesses memory, it can see the Character ROM at $D000-$DFFF. However, the VIC-II cannot access this area directly. To use the character set in other banks, you can copy the Character ROM data into RAM.

The following machine language routine copies the Character ROM from $D000-$DFFF into RAM at $3000-$3FFF:


This routine disables interrupts, enables access to the Character ROM, sets up source and destination pointers, copies the data, and then restores the system state.

To switch the VIC-II to a different 16K bank, you can modify bits 0 and 1 of the CIA #2 Port A register at $DD00. The following table shows the bit patterns and corresponding banks:

| Bits 1-0 | Bank | Address Range  |
|----------|------|----------------|
| 00       | 3    | $C000-$FFFF    |
| 01       | 2    | $8000-$BFFF    |
| 10       | 1    | $4000-$7FFF    |
| 11       | 0    | $0000-$3FFF    |

To select a bank, ensure bits 0 and 1 are set as outputs by setting bits 0 and 1 of the Data Direction Register at $DD02 to 1. Then, write the desired value to $DD00. For example, to select bank 2:


This code configures the VIC-II to use bank 2 ($8000-$BFFF).

By copying the Character ROM into RAM and selecting the appropriate VIC-II bank, you can utilize custom character sets or the standard character set in any 16K bank.

## Source Code

```assembly
; Disable interrupts
SEI

; Enable access to Character ROM
LDA $01
AND #%11111011
STA $01

; Set source address to $D000
LDX #$D0
LDY #$00

; Set destination address to $3000
LDA #$30
STA $FE
LDA #$00
STA $FF

; Copy 4K of data
LDY #$00
CopyLoop:
    LDA ($FE),Y
    STA ($FF),Y
    INY
    BNE CopyLoop
    INC $FE
    INC $FF
    DEX
    BNE CopyLoop

; Restore I/O configuration
LDA $01
ORA #%00000100
STA $01

; Enable interrupts
CLI
```

```assembly
; Set bits 0 and 1 as outputs
LDA $DD02
ORA #%00000011
STA $DD02

; Select bank 2
LDA $DD00
AND #%11111100
ORA #%00000001
STA $DD00
```


```assembly
; Machine language routine to copy Character ROM into RAM at $3000-$3FFF

SEI             ; Disable interrupts

; Enable access to Character ROM
LDA $01
AND #%11111011
STA $01

; Set source address to $D000
LDX #$D0
LDY #$00

; Set destination address to $3000
LDA #$30
STA $FE
LDA #$00
STA $FF

; Copy 4K of data
LDY #$00
CopyLoop:
    LDA ($FE),Y
    STA ($FF),Y
    INY
    BNE CopyLoop
    INC $FE
    INC $FF
    DEX
    BNE CopyLoop

; Restore I/O configuration
LDA $01
ORA #%00000100
STA $01

CLI             ; Enable interrupts
```

## Key Registers

- **$DD00 (56576):** CIA #2 Port A Data Register
- **$DD02 (56578):** CIA #2 Port A Data Direction Register
- **$01 (1):** Processor Port

## References

- "character_generator_rom_overview_and_bit_values" — expands on why ROM visibility matters and mapping of character bytes to glyphs
- "sample_bank3_switch_program" — contains the machine language copy routine to transfer ROM to RAM