# File transfer example — BASIC front-end with KERNAL calls (machine code at $0A00)

**Summary:** Example C64 file-transfer: BASIC opens logical files and calls a machine-language routine at $0A00 that uses KERNAL vectors $FFC6/$FFE4 (input), $FFC9/$FFD2 (output), and $FFCC (clear channel). Preserves ST (status at $0090) via PHP/PLP and preserves the input character with PHA/PLA; adjust start-of-variables ($002D/$002E) to $0A1F.

## Overview
This packet shows a two-part file-transfer program:

- BASIC front-end: prompts for input and output devices (disk, tape, screen), opens logical files (OPEN), and SYSs into a machine-language routine.
- Machine-language routine (resident at $0A00): repeatedly selects an input device, reads a character, preserves the device-status (ST) and the character, clears the input channel, selects the output device, outputs the character, clears the output channel, restores ST flags, and branches on the Z flag to continue or finish.

Key operational rules preserved from the source:
- Do not switch input and output simultaneously (i.e., call both CHKIN and CHKOUT without an intervening CLRCHN). Peripherals expect exclusive occupancy of the bus.
- ST (status byte) reports the status of the last device handled; therefore check ST immediately after input and save its condition before performing the output (which would overwrite ST).
- Preserve the input character across CLRCHN (CLRCHN destroys A) by pushing it to the stack (PHA); preserve flags (including Z) by pushing processor status (PHP) and restoring later with PLP so the end-of-file condition can be tested (BEQ).

Before running the machine code, move the BASIC start-of-variables pointer ($002D/$002E) so it points to $0A1F (one byte after the RTS at $0A1E), otherwise BASIC variables will overwrite the machine code.

Note: On PET/CBM machines ST resides at $0096 instead of $0090 (adjust code accordingly).

## Machine-code flow and stack usage
Step-by-step flow and rationale:

1. CHKIN (JSR $FFC6) to select the input logical device (LDX #$01 before JSR in this example).
2. Read one character from the input device with JSR $FFE4 — result returned in A and ST updated to indicate status (EOF sets Z).
3. Preserve the processor flags (including Z) by executing PHP so the Z state is saved on the stack.
4. Preserve the A register (the character read) by executing PHA — now two items are on the stack: flags, then A.
5. CLRCHN (JSR $FFCC) to disconnect input. CLRCHN destroys A, so do this only after saving A.
6. CHKOUT (JSR $FFC9 with LDX #$02 in this example) to select the output device.
7. Recover the character with PLA, then output it with JSR $FFD2 (CHROUT).
8. CLRCHN (JSR $FFCC) to disconnect the output device.
9. Restore flags with PLP. If Z is set (meaning ST was zero at input — EOF not reached depending on device semantics), branch back to the input loop (BEQ $0A00). If not, RTS to return to BASIC so BASIC can CLOSE files.

This ordering ensures ST refers to the input condition when checked, and that devices are not fighting for the bus.

## Source Code
```basic
100 PRINT "FILE TRANSFER"
110 INPUT "INPUT FROM (DISK,TAPE)";A$
120 IF LEFT$(A$,1)="T" THEN OPEN 1:GOTO 160
130 IF LEFT$(A$,1)<>"D" GOTO 110
140 INPUT "DISK FILE NAME";N$
150 OPEN 1,8,3,N$
160 INPUT "TO (DISK,TAPE,SCREEN)";B$
170 IF LEFT$(B$,1)="S" THEN OPEN 2,3:GOTO240
180 IF LEFT$(B$,1)="D" GOTO 210
190 IF LEFT$(B$,1)<>"T" GOTO 160
200 IF LEFT$(A$,1)="T" GOTO 160
210 INPUT "OUTPUT FILE NAME";F$
220 IF LEFT$(B$,1)="D" THEN OPEN 2,8,4,"0:"+N$+",S,W"
230 IF LEFT$(B$,1)="T" THEN OPEN 2,1,1,N$
240 SYS xxxx
250 CLOSE 2:CLOSE 1
```

```asm
.A 0A00  LDX #$01
.A 0A02  JSR $FFC6      ; CHKIN (select input)
.A 0A05  JSR $FFE4      ; GET/READ character into A, ST updated
.A 0A08  LDX $90        ; load ST address (zero-page $90) into X (source used this as a reference)
.A 0A0A  PHP            ; push processor status (preserve Z and other flags)
.A 0A0B  PHA            ; push A (preserve input character)
.A 0A0C  JSR $FFCC      ; CLRCHN (disconnect input) - destroys A
.A 0A0F  LDX #$02
.A 0A11  JSR $FFC9      ; CHKOUT (select output)
.A 0A14  PLA            ; pull A (restore character)
.A 0A15  JSR $FFD2      ; CHROUT (output A)
.A 0A18  JSR $FFCC      ; CLRCHN (disconnect output)
.A 0A1B  PLP            ; pull processor status (restore flags)
.A 0A1C  BEQ $0A00      ; if Z set (ST condition saved earlier), loop
.A 0A1E  RTS            ; return to BASIC
```

Notes in source: The assembly listing is shown using the original labels/addresses. The BASIC line 240 must be changed to SYS 2560 (decimal) to run the code at $0A00, and start-of-variables ($002D/$002E) must be set to $0A1F.

## Key Registers
- $002D-$002E - BASIC - start-of-variables pointer (must point to $0A1F to protect ML code at $0A00-$0A1E)
- $0090 - C64/BASIC - ST (status byte of last device handled); PET/CBM uses $0096
- $FFC6 - KERNAL - CHKIN (select input logical device) [called with channel in X in this example]
- $FFE4 - KERNAL - call used to read/get a character from the current input device (returns in A; updates ST)
- $FFC9 - KERNAL - CHKOUT (select output logical device)
- $FFD2 - KERNAL - CHROUT (output character in A to current output device)
- $FFCC - KERNAL - CLRCHN (clear/disconnect current channel)

## References
- "switching_input_chkin_and_clrchn" — expands on Using CHKIN/CHKOUT/CLRCHN in coordinated file transfers

## Labels
- CHKIN
- GETIN
- CHKOUT
- CHROUT
- CLRCHN
- ST
