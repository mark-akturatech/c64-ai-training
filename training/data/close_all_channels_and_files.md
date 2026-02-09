# KERNAL: Close all channels and files (entry $F32F)

**Summary:** Clears the open-file count ($0098) and resets logical I/O device assignments (input $0099, output $009A). If the previous input/output devices were not the screen (device #$03) or keyboard (#$00), the routine issues UNLISTEN/UNTALK via JSR $EDFE / JSR $EDEF to the serial bus.

## Description
This KERNAL routine performs a full close/cleanup of logical file and channel state:

- Clears the open logical-file counter at zero page $0098 (sets it to 0).
- Sets X to the screen device number (#$03) and compares it with the current output device number stored at $009A. If X < $009A (i.e., screen device number is less than the stored output device number), the routine calls the UNLISTEN serial command (JSR $EDFE) to terminate any open output TALK/DEVICE connection; otherwise it skips the UNLISTEN.
  - Implementation detail: CPX $9A followed by BCS branches when X >= $009A; the JSR is executed only when carry is clear (X < memory).
- Compares X (screen) with the input device number at $0099 similarly; if X < $0099 it calls UNTALK (JSR $EDEF) to terminate any open input TALK/DEVICE connection; otherwise it skips the UNTALK.
- Stores the screen device number into $009A (making the screen the current output device).
- Stores 0 into $0099 (making the keyboard the current input device).
- Returns to the caller (RTS).

Behavioral summary (in execution order):
1. Clear open-file count: $0098 := 0
2. If screen < output-device then UNLISTEN (JSR $EDFE)
3. If screen < input-device then UNTALK  (JSR $EDEF)
4. $009A := screen (output := screen)
5. $0099 := 0      (input := keyboard)
6. RTS

**[Note: Source may contain an error — the original inline comment "if <= screen skip" is ambiguous; the actual CPX/BCS sequence skips the JSR when X >= $009A (carry set).]**

## Source Code
```asm
.,F32F A9 00    LDA #$00        clear A
.,F331 85 98    STA $98         clear the open file count

                                *** close input and output channels
.,F333 A2 03    LDX #$03        set the screen device
.,F335 E4 9A    CPX $9A         compare the screen with the output device number
.,F337 B0 03    BCS $F33C       if >= output-device skip the serial bus UNLISTEN
.,F339 20 FE ED JSR $EDFE       else command the serial bus to UNLISTEN
.,F33C E4 99    CPX $99         compare the screen with the input device number
.,F33E B0 03    BCS $F343       if >= input-device skip the serial bus UNTALK
.,F340 20 EF ED JSR $EDEF       else command the serial bus to UNTALK
.,F343 86 9A    STX $9A         save the screen as the output device number
.,F345 A9 00    LDA #$00        set the keyboard as the input device
.,F347 85 99    STA $99         save the input device number
.,F349 60       RTS
```

## Key Registers
- $0098-$009A - Zero page - open file count ($0098), input device number ($0099), output device number ($009A)

## References
- "open_logical_file" — expands on Open logic (increments/decrements the same open-file counter cleared here)