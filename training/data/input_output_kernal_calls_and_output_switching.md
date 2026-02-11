# KERNAL I/O: CHROUT ($FFD2), CHKIN ($FFC6), CHKOUT ($FFC9), CLRCHN ($FFCC), GETIN ($FFE4)

**Summary:** CHROUT ($FFD2) sends an ASCII/PETSCII character to the current output channel (screen, printer, logical file). CHKOUT ($FFC9) and CHKIN ($FFC6) switch CHROUT/GETIN to a previously opened logical file (X contains file number); CLRCHN ($FFCC) restores default screen/keyboard. GETIN ($FFE4) reads keyboard/input into A. CHKOUT/CHKIN/CLRCHN may clobber A and X and can set the carry flag on error.

## Overview
The KERNAL routines CHROUT ($FFD2) and GETIN ($FFE4) implement the program's basic character output and input respectively. By default these use the screen (output) and keyboard (input). CHKOUT ($FFC9) and CHKIN ($FFC6) redirect CHROUT/GETIN to a logical file that has already been OPENed; CLRCHN ($FFCC) disconnects logical files and restores the default channels without closing the files.

Key operational points:
- CHKOUT expects the logical file number in X (LDX #file) and will connect CHROUT to that open logical file. The file must be opened previously.
- CHKIN likewise switches GETIN to a logical input file (also affects registers and status flags).
- CLRCHN disconnects both input and output logical-file connections and returns to screen/keyboard default.
- CHKOUT/CHKIN/CLRCHN may modify registers A and X — save them if needed.
- On VIC and C64, the carry flag (C) may be set to indicate an error when connecting to a channel.
- CHROUT still sends PETSCII/ASCII characters; when routed to printer or disk command channel, behavior follows device handling (e.g., printer interprets control/graphics characters, disk secondary address 15 accepts commands via a command channel file).

Use pattern summary:
- LDX #file_number ; JSR $FFC9  ; route output (CHROUT) to logical file
- JSR $FFD2        ; send characters via CHROUT
- JSR $FFCC        ; restore default I/O (CLRCHN)

## Source Code
```asm
; Example: send "HI" to logical output file 1, then restore screen
        LDX #$01        ; logical file number 1
        JSR $FFC9       ; CHKOUT - route CHROUT to file 1
        LDA #'H'
        JSR $FFD2       ; CHROUT - send 'H' to current output
        LDA #'I'
        JSR $FFD2       ; CHROUT - send 'I'
        JSR $FFCC       ; CLRCHN - restore screen/keyboard

; Example: basic pattern to switch input (mirror usage for CHKIN)
        LDX #$02        ; logical input file number 2
        JSR $FFC6       ; CHKIN - route GETIN to file 2
        JSR $FFE4       ; GETIN - read a character into A
        JSR $FFCC       ; CLRCHN - restore default input
```

```text
  KEYBOARD                +---------+                  ,------.
   +----+         INPUT   |         |   OUTPUT         |      |
   |::::|-o<--O-----------| PROGRAM |------------O-->o-|SCREEN|
   +----+                 |         |                  |      |
           o              +---------+               o  `------'
          /  o                                    o  \
         |  /   CHKIN ($FFC6)     CHKOUT ($FFC9)   \  |
         | |    SETS THE INPUT   SETS THE OUTPUT    | |
        INPUT   SWITCH                    SWITCH  OUTPUT
       DEVICES                                    DEVICES
                        CLRCHN ($FFCC)
                         RESTORES BOTH
                     SWITCHES TO "NORMAL"

  Figure 8.1
```

```text
Subroutine: CHKOUT
Address:    $FFC9
Action:      Switches output path used by CHROUT ($FFD2) so output is
             directed to the logical file specified in X. Logical file
             must be previously opened.
Registers:   A and X will be changed; save sensitive data beforehand.
Status:      On VIC/C64, carry flag (C) indicates problem connecting.

Subroutine: CLRCHN
Address:    $FFCC
Action:      Disconnects input and output from logical files and restores
             default channels (keyboard/screen). Logical files remain open.
Registers:   A and X will be changed.
Status:      On VIC/C64, carry flag (C) may indicate a problem.
```

## Key Registers
- $FFD2 - KERNAL - CHROUT: send ASCII/PETSCII character to current output channel
- $FFE4 - KERNAL - GETIN: read character from current input channel into A
- $FFC9 - KERNAL - CHKOUT: redirect CHROUT output to logical file (X = file)
- $FFC6 - KERNAL - CHKIN: redirect GETIN input to logical file (X = file)
- $FFCC - KERNAL - CLRCHN: restore input/output to default keyboard/screen

## References
- "output_example_print_to_printer" — expands on sending 'HI' to printer using CHKOUT/CHROUT
- "input_example_read_sequential_file" — expands on reading from a logical input file using CHKIN/GETIN

## Labels
- CHROUT
- CHKIN
- CHKOUT
- CLRCHN
- GETIN
