# SID Initialization — clear registers and set master volume

**Summary:** Example 6502 assembly to clear SID registers at $D400.. and set master volume at $D418 (SID 6581/8580). Shows indexed STA loop and a write to $D418 to select maximum volume/no filter modes.

**Initialization procedure**
The snippet clears the SID register block and then writes the master-volume byte. It uses X-indexed stores to sweep a block of SID I/O addresses and then explicitly sets $D418 (master volume).

Behavior notes:
- The loop writes STA $D400,X with X descending from the initial LDX value down to 0, clearing the SID register block.
- The final STA to $D418 sets master volume to maximum (lower 4 bits = $0F) while leaving higher bits clear (no filter routing enabled).

**[Note: Source may contain an error — LDX #$18 results in stores from $D418 down to $D400 inclusive (25 bytes), not exactly 24; the comment "24 registers (+ a few extra doesn't hurt)" explains this is intentional.]**

## Source Code
```asm
; Clear all SID registers
lda #$00
ldx #$18          ; 24 registers (+ a few extra doesn't hurt)
clear:
sta $d400,x
dex
bpl clear

; Set master volume
lda #$0f          ; Maximum volume, no filter modes
sta $d418
```

## Key Registers
- $D400-$D406 - SID - Voice 1 registers (frequency low/high, pulse width low/high, control, ADSR)
- $D407-$D40D - SID - Voice 2 registers (frequency low/high, pulse width low/high, control, ADSR)
- $D40E-$D414 - SID - Voice 3 registers (frequency low/high, pulse width low/high, control, ADSR)
- $D415-$D418 - SID - Filter and global registers (filter parameters and master volume at $D418)

## References
- "complete_register_map_intro" — SID base address $D400 and mirror behavior
- "known_quirks" — write-only behavior and safe clearing techniques

## Labels
- MASTER_VOLUME
