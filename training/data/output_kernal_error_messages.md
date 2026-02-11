# OUTPUT KERNAL ERROR MESSAGES (I/O ERROR #)

**Summary:** KERNAL error-printing entry points load an error code into A and call CLRCHN ($FFCC) to close channels; if MSGFLG ($009D) is set, the KERNAL prints "I/O ERROR #" via the print routine at $F12F and outputs the digit using CHROUT ($FFD2) after converting with ORA #$30. Stack entries around the numeric print are preserved (PHA/PLA).

**Description**
This KERNAL fragment implements centralized I/O error reporting. Multiple entry points place an error number (#1..#9) in A and transfer control to the common print/return sequence. The sequence:

- Pushes A on the stack (PHA) before closing channels.
- Calls CLRCHN ($FFCC) to close all I/O channels.
- Tests the byte at $009D (MSGFLG) with BIT to determine whether KERNAL messages are enabled.
- If MSGFLG is set, JSR $F12F is invoked to print the literal "I/O ERROR #" (string printing handled by that routine).
- The original error number is restored from the stack (PLA), re-pushed (PHA) to preserve stack contents across the print routine, then converted to ASCII with ORA #$30 and sent to CHROUT ($FFD2).
- Finally, the saved stack entry is pulled (PLA), the carry flag is set (SEC), and RTS returns.

Important implementation details preserved in the code:
- Error number is passed in A (e.g., LDA #$01 .. LDA #$09 at the entry points).
- CLRCHN is used to ensure channels are closed before any output.
- MSGFLG test (BIT $009D) gates whether text output occurs.
- Numeric conversion uses ASCII offset ORA #$30 rather than table lookup.
- CHROUT ($FFD2) is the low-level single-character output used for the digit.
- Stack manipulation: PHA before CLRCHN, then PLA / PHA around the print and CHROUT calls to preserve the original stack state.

## Source Code
```asm
.; F6FB-F72B - OUTPUT KERNAL ERROR MESSAGES
.; Entry point for error #1: Too many files
F6FB A9 01    LDA #$01
F6FD 4C 15 F7 JMP ERROR_HANDLER

.; Entry point for error #2: File open
F700 A9 02    LDA #$02
F702 4C 15 F7 JMP ERROR_HANDLER

.; Entry point for error #3: File not open
F705 A9 03    LDA #$03
F707 4C 15 F7 JMP ERROR_HANDLER

.; Entry point for error #4: File not found
F70A A9 04    LDA #$04
F70C 4C 15 F7 JMP ERROR_HANDLER

.; Entry point for error #5: Device not found
F70F A9 05    LDA #$05
F711 4C 15 F7 JMP ERROR_HANDLER

.; Entry point for error #6: Not input file
F714 A9 06    LDA #$06
F716 4C 15 F7 JMP ERROR_HANDLER

.; Entry point for error #7: Not output file
F719 A9 07    LDA #$07
F71B 4C 15 F7 JMP ERROR_HANDLER

.; Entry point for error #8: Missing filename
F71E A9 08    LDA #$08
F720 4C 15 F7 JMP ERROR_HANDLER

.; Entry point for error #9: Illegal device number
F723 A9 09    LDA #$09
F725 4C 15 F7 JMP ERROR_HANDLER

ERROR_HANDLER:
F728 48       PHA
F729 20 CC FF JSR $FFCC       ; CLRCHN, close all I/O channels
F72C A0 00    LDY #$00
F72E 24 9D    BIT $009D       ; Test MSGFLG, KERNAL messages enabled
F730 50 0A    BVC $F73C       ; If not set, skip message output
F732 20 2F F1 JSR $F12F       ; Print "I/O ERROR #"
F735 68       PLA
F736 48       PHA
F737 09 30    ORA #$30        ; Convert (A) to ASCII number
F739 20 D2 FF JSR $FFD2       ; Use CHROUT to print number in (A)
F73C 68       PLA
F73D 38       SEC
F73E 60       RTS
```

## Key Registers
- $009D - KERNAL - MSGFLG (message enable flag tested with BIT)
- $FFCC - KERNAL - CLRCHN (close all I/O channels)
- $FFD2 - KERNAL - CHROUT (single-character output routine)
- $F12F - KERNAL - print routine used to emit "I/O ERROR #"
- $F6FB-$F72B - KERNAL - entry block / error-print sequence

## References
- "clrchn_restore_default_io" — explains CLRCHN usage to close channels before printing error messages
- Commodore 64 KERNAL source code: [GitHub - mist64/c64rom](https://github.com/mist64/c64rom)

## Labels
- CLRCHN
- CHROUT
- MSGFLG
