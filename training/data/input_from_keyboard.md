# KERNAL: Main keyboard input loop ($E5CA..$E65C)

**Summary:** KERNAL keyboard input loop that polls the keyboard buffer (uses LP2/keyboard-fetch routine), echoes characters to the screen via screen-print routines, intercepts <SHIFT/RUN> ($83) to inject "LOAD <CR> RUN <CR>" into the keyboard buffer, detects carriage return ($0D), computes INDX (input line end), sets CRSV/AUTODN/PNTR/QTSW/LXSP/TBLX flags, and may call the retreat-cursor routine.

**Main keyboard input loop**
This routine repeatedly waits for a key in the keyboard queue, echoes characters to the screen, and handles special cases:

- On entry it calls a screen/output setup JSR ($E716) and transfers the keyboard count NDX from $C6 into BLNSW ($CC) and sets AUTODN ($0292) while looping until a key is present.
- Interrupts are disabled (SEI) before inspecting/altering cursor state: BLNON ($CF) is cleared; if BLNON was set the code fetches the character under the cursor (GDBLN $CE) and the background color (GDCOL $0287) and calls the screen print routine ($EA13) to refresh as needed.
- It calls the KERNAL keyboard-fetch routine ($E5B4) to remove/get the next character from the keyboard buffer.
- If the fetched character equals $83 (SHIFT/RUN), the code injects the nine-character sequence "LOAD <CR> RUN <CR>" by writing bytes from ROM at $ECE6 into the keyboard buffer starting at $0276 and sets NDX to 9; then it returns to the wait loop (so the injected sequence will be processed like typed keys).
- If the fetched character is not $0D (carriage return) the routine restarts the main loop to process further characters.
- On carriage return ($0D) the routine calculates the logical end of the input line:
  - Loads LNMX ($D5) into Y and stores it to CRSV ($D0).
  - Uses the indirect pointer ($D1),Y to read characters from the current screen line, decrementing Y while trailing spaces ($20) are found to compute the printed input end.
  - Increments Y and stores into INDX ($C8) — this marks the end-of-input position on the screen.
  - Clears AUTODN ($0292), stores the Y index into PNTR ($D3) and QTSW ($D4) (reset quotes mode).
- Cursor/position handling:
  - Loads LXSP ($C9) and branches if negative (BMI) to continue without retreating.
  - Otherwise loads TBLX ($D6) into X and calls the retreat-cursor routine ($E6ED).
  - On return, it compares X to LXSP and if equal, reloads cursor column from $CA into PNTR ($D3), then compares PNTR and INDX to decide next action (branch at BCS $E65D — remainder of logic continues beyond this chunk).

Behavioral notes:
- The routine maintains multiple KERNAL variables/flags (see Key Registers) to coordinate cursor blinking, auto-scroll, quotes mode, and the input end pointer.
- The special injection of "LOAD <CR> RUN <CR>" is done by copying 9 bytes from ROM ($ECE6..$ECEE) into the keyboard buffer ($0276..$027E) and setting NDX to 9, so subsequent iterations read those bytes as if typed.
- The routine disables interrupts during sensitive updates (SEI) to avoid race conditions with cursor blink/print operations.

## Source Code
```asm
.,E5CA 20 16 E7 JSR $E716       ; output to screen
.,E5CD A5 C6    LDA $C6         ; read NDX, number of characters in keyboard queue
.,E5CF 85 CC    STA $CC         ; BLNSW, cursor blink enable
.,E5D1 8D 92 02 STA $0292       ; AUTODN, auto scroll down flag
.,E5D4 F0 F7    BEQ $E5CD       ; loop till key is pressed
.,E5D6 78       SEI             ; disable interrupt
.,E5D7 A5 CF    LDA $CF         ; BLNON, last cursor blink (on/off)
.,E5D9 F0 0C    BEQ $E5E7
.,E5DB A5 CE    LDA $CE         ; GDBLN, character under cursor
.,E5DD AE 87 02 LDX $0287       ; GDCOL, background color under cursor
.,E5E0 A0 00    LDY #$00
.,E5E2 84 CF    STY $CF         ; clear BLNON
.,E5E4 20 13 EA JSR $EA13       ; print to screen
.,E5E7 20 B4 E5 JSR $E5B4       ; Get character from keyboard buffer
.,E5EA C9 83    CMP #$83        ; test if <shift/RUN> is pressed
.,E5EC D0 10    BNE $E5FE       ; nope
.,E5EE A2 09    LDX #$09        ; transfer 'LOAD <CR> RUN <CR>' to keyboard buffer
.,E5F0 78       SEI
.,E5F1 86 C6    STX $C6         ; store #9 in NDX, characters in buffer
.,E5F3 BD E6 EC LDA $ECE6,X     ; 'LOAD <CR> RUN <CR>' message in ROM
.,E5F6 9D 76 02 STA $0276,X     ; store in keyboard buffer
.,E5F9 CA       DEX
.,E5FA D0 F7    BNE $E5F3       ; all nine characters
.,E5FC F0 CF    BEQ $E5CD       ; always jump
.,E5FE C9 0D    CMP #$0D        ; carriage return pressed?
.,E600 D0 C8    BNE $E5CA       ; nope, go to start
.,E602 A4 D5    LDY $D5         ; get LNMX, screen line length
.,E604 84 D0    STY $D0         ; CRSV, flag input/get from keyboard
.,E606 B1 D1    LDA ($D1),Y     ; PNT, screen address
.,E608 C9 20    CMP #$20        ; space?
.,E60A D0 03    BNE $E60F       ; nope
.,E60C 88       DEY
.,E60D D0 F7    BNE $E606       ; next
.,E60F C8       INY
.,E610 84 C8    STY $C8         ; store in INDX, end of logical line for input
.,E612 A0 00    LDY #$00
.,E614 8C 92 02 STY $0292       ; AUTODN
.,E617 84 D3    STY $D3         ; PNTR, cursor column
.,E619 84 D4    STY $D4         ; QTSW, reset quotes mode
.,E61B A5 C9    LDA $C9         ; LXSP, cursor X/Y position
.,E61D 30 1B    BMI $E63A
.,E61F A6 D6    LDX $D6         ; TBLX, cursor line number
.,E621 20 ED E6 JSR $E6ED       ; retreat cursor
.,E624 E4 C9    CPX $C9         ; LXSP
.,E626 D0 12    BNE $E63A
.,E628 A5 CA    LDA $CA
.,E62A 85 D3    STA $D3         ; PNTR
.,E62C C5 C8    CMP $C8         ; INDX
.,E62E 90 0A    BCC $E63A
.,E630 B0 2B    BCS $E65D
```

```text
; 'LOAD <CR> RUN <CR>' string at $ECE6
.,ECE6 4C 4F 41 44 0D 52 55 4E 0D
; Corresponding ASCII characters:
; 'L' 'O' 'A' 'D' <CR> 'R' 'U' 'N' <CR>
```

## Key Registers
- $C6  - KERNAL variable - NDX: number of characters in keyboard queue
- $CC  - KERNAL variable - BLNSW: cursor blink enable (saved NDX)
- $0292 - KERNAL RAM - AUTODN: auto-scroll-down flag
- $CF  - KERNAL variable - BLNON: last cursor blink state (on/off)
- $CE  - KERNAL variable - GDBLN: character under cursor
- $0287 - KERNAL RAM - GDCOL: background color under cursor
- $0276-$027E - KERNAL RAM - Keyboard buffer (target for injected "LOAD <CR> RUN <CR>" bytes)
- $ECE6 - ROM - Source string: "LOAD <CR> RUN <CR>" (bytes read by LDA $ECE6,X)
- $C8  - KERNAL variable - INDX: end of logical input line (index)
- $D0  - KERNAL variable - CRSV: saved/active input flag (stores Y from LNMX)
- $D1  - KERNAL variable - PNT pointer (used as indirect pointer for screen line)
- $D3  - KERNAL variable - PNTR: cursor column (updated from computed index)
- $D4  - KERNAL variable - QTSW: quotes mode flag (reset on CR)
- $C9  - KERNAL variable - LXSP: cursor X/Y position (checked for sign)
- $CA  - KERNAL variable - (used to restore PNTR when retreating)
- $D5  - KERNAL variable - LNMX: screen line length (loaded to compute CRSV)
- $D6  - KERNAL variable - TBLX: cursor line number (used by retreat routine)

## References
- "lp2_get_char_from_keyboard_buffer" — expands on keyboard-fetch routine used to obtain characters
- "setup_screen_print" — expands on

## Labels
- NDX
- INDX
- CRSV
- PNTR
- QTSW
