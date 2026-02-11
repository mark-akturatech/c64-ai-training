# SETTMO — KERNAL: Set IEEE bus timeout flag ($FFA2)

**Summary:** KERNAL call SETTMO at $FFA2 (65442) sets or clears the IEEE-bus timeout flag using the accumulator (bit 7). When enabled the C64 waits ~64 ms for DAV (Data Address Valid); when disabled no IEEE timeout is used. Use only with an IEEE add-on card.

## Description
This KERNAL routine configures the IEEE-bus timeout behavior used during IEEE device handshakes. The accumulator's bit 7 selects the mode:

- bit 7 = 0: enable timeouts (the C64 waits ~64 ms for DAV; if no response the handshake is aborted and an error condition is recognized).
- bit 7 = 1: disable timeouts.

This routine is intended only for systems with an IEEE add-on card. The Commodore 64 uses this timeout mechanism when reporting "file not found" for OPEN operations over IEEE devices.

## Calling convention
- Call address: $FFA2 (hex) 65442 (decimal)
- Communication registers: A (bit 7 used)
- Preparatory routines: None
- Error returns: None
- Stack requirements: 2 (return address pushed by JSR)
- Registers affected: None

## How to use
To set (enable) timeouts: place 0 in bit 7 of A and call SETTMO.  
To reset (disable) timeouts: place 1 in bit 7 of A and call SETTMO.

Example summary:
- Enable timeouts: A bit7 = 0 -> JSR $FFA2
- Disable timeouts: A bit7 = 1 -> JSR $FFA2

## Source Code
```asm
; Define symbolic name (optional)
SETTMO = $FFA2

; ENABLE TIMEOUTS (bit 7 = 0)
    LDA #$00        ; A = 0000 0000 (bit 7 = 0)
    JSR SETTMO      ; call $FFA2

; DISABLE TIMEOUTS (bit 7 = 1)
    LDA #$80        ; A = 1000 0000 (bit 7 = 1)
    JSR SETTMO      ; call $FFA2

; Example using absolute address instead of symbol:
    LDA #$00
    JSR $FFA2
```

## Key Registers
- $FFA2 - KERNAL ROM - SETTMO (Set IEEE bus timeout flag)  

## References
- "open_kernal_routine" — discusses how timeouts affect OPEN behavior with IEEE devices

## Labels
- SETTMO
