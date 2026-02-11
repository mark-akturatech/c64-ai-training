# KERNAL: SAVE (SAVE RAM) — vector from $FFD8

**Summary:** KERNAL SAVE handler invoked via vector $FFD8; copies a start pointer from zero page ($00/$01) into STAL ($00C1/$00C2), stores end+1 into $00AE/$00AF, then JMPs through ISAVE vector at $0332 to device-specific save routine; checks device number in $00BA (FA) and rejects illegal devices (keyboard 0 and screen 3).

**Operation**
This KERNAL fragment implements the entry-side work for the SAVE routine (the routine the $FFD8 vector points to). On entry:
- X/Y must contain the block end address + 1. These are stored to EAL ($00AE/$00AF).
- A is used as an index into zero page to fetch the start pointer bytes from $00/$01; those bytes are copied into STAL ($00C1/$00C2) which the I/O routine expects.
- Execution then transfers to the device-specific save implementation via the indirect vector at $0332 (ISAVE).
- After returning to the KERNAL fragment, it loads the current device number from $00BA (FA) and enforces legal device numbers:
  - Device 0 (keyboard) → jump to I/O error handler (illegal device).
  - Device 3 (screen) → jump to I/O error handler (illegal device).
  - Devices less than 3 (i.e. 1 = cassette/tape) branch to an output-error handler (code branches to $F659).

This code is purely the caller-side setup and device-number validation; the actual device-specific save-to-serial implementation is reached through the ISAVE vector at $0332.

## Source Code
```asm
                                *** SAVE: SAVE RAM
                                The KERNAL routine SAVE ($FFD8) jumps to this routine. On
                                entry, (X/Y) must hold the end address+1 of the area of
                                memory to be saved. (A) holds the pointer to the start
                                address of the block, held in zeropage. The current device
                                number is checked to ensure that it is neither keyboard
                                (0) or screen (3). Both of these result in ?ILLEGAL DEVICE
                                NUMBER.
.,F5DD 86 AE    STX $AE         EAL , end address of block +1
.,F5DF 84 AF    STY $AF
.,F5E1 AA       TAX             move start pointer to (X)
.,F5E2 B5 00    LDA $00,X
.,F5E4 85 C1    STA $C1         STAL, start address of block
.,F5E6 B5 01    LDA $01,X
.,F5E8 85 C2    STA $C2
.,F5EA 6C 32 03 JMP ($0332)     vector ISAVE, points to $F5ED
.,F5ED A5 BA    LDA $BA         FA, current device number
.,F5EF D0 03    BNE $F5F4       ok
.,F5F1 4C 13 F7 JMP $F713       I/O error #9, illegal device number
.,F5F4 C9 03    CMP #$03        screen?
.,F5F6 F0 F9    BEQ $F5F1       yep, output error
.,F5F8 90 5F    BCC $F659       less than 3, ie. tape, output error
```

## Key Registers
- $FFD8 - KERNAL vector entry for SAVE (JMP into this handler)
- $0332 - Vector (ISAVE) - indirect jump to device-specific save routine
- $0000-$0001 - Zero Page - pointer to start address of block (low/high)
- $00AE-$00AF - Zero Page - EAL (end address + 1) stored from X/Y
- $00C1-$00C2 - Zero Page - STAL (start address used by I/O routines)
- $00C3-$00C4 - Zero Page - MEMUSS (saved via ISAVE vector; KERNAL workspace)
- $00BA - Zero Page - FA (current device number checked by SAVE)

## References
- "save_to_serial_bus" — actual save-to-serial implementation follows the ISAVE vector (device-specific code)

## Labels
- SAVE
- ISAVE
- EAL
- STAL
- MEMUSS
- FA
