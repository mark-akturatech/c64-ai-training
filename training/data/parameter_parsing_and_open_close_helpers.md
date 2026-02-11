# KERNAL parameter helpers (SLPARA / COMBYT / DEFLT / CMMERR / OCPARA) — $E1D4-$E261

**Summary:** Routines at $E1D4-$E261 that parse BASIC text parameters for SAVE/LOAD/VERIFY/OPEN/CLOSE using KERNAL SETNAM ($FFBD) and SETLFS ($FFBA); use CHRGOT text input helper and zero-page temporaries ($49/$4A and $22/$23).

## Overview
This chunk documents five tightly-related BASIC/KERNAL helper routines used to parse optional and required parameters from the BASIC text buffer and to prepare KERNAL calls:

- SLPARA ($E1D4): parse filename, device (FA) and secondary address (SA) for SAVE/LOAD/VERIFY; sets defaults FA=#$01, SA=#$00 and calls SETNAM/SETLFS as needed.
- COMBYT ($E200): check for comma then read a single-byte parameter into X (delegates to comma-check and byte-input code).
- DEFLT ($E206): test CHRGOT to see if an optional parameter exists; if not, pops return address to exit both the helper and its caller.
- CMMERR ($E20E): confirm presence of a comma and ensure it is not immediately followed by terminator (syntax error otherwise).
- OCPARA ($E219): parse OPEN/CLOSE parameters: logical file number (required), optional device, optional secondary address, optional filename; stores temporary values in zero page and calls SETNAM/SETLFS.

Common behavior and conventions:
- Default device number = #$01, default secondary address = #$00 (unless a serial device is detected — see OCPARA).
- Filename handling uses SETNAM ($FFBD); file/device/secondary setup uses SETLFS ($FFBA).
- Text parsing and CHRGOT (character-available test) are performed by calling code at $0079 and the local text helper range at $E200-$E21F.
- Temporary storage: zero-page bytes used are $49 and $4A (FA/SA), and $22/$23 are used as pointers to a provided filename.

## Routine details

SLPARA ($E1D4)
- Purpose: Get filename, device number (FA) and secondary address (SA) for SAVE/LOAD/VERIFY.
- Behavior:
  - Clears filename length (LDA #$00) and calls SETNAM ($FFBD) to select a null filename by default.
  - Sets defaults: X = #$01 (device), Y = #$00 (secondary).
  - Calls SETLFS ($FFBA) with defaults.
  - Calls DEFLT ($E206) to check whether text ended; if not, proceeds to parse filename, then re-invokes SETNAM.
  - Uses COMBYT-like flow to fetch optional FA and SA parameters (input one-byte parameters into X), storing FA into $49 and then calling SETLFS again to apply the device; later fetches SA, moves it into Y and finally calls SETLFS with both device and secondary address set.
- Exit: JMP $FFBA at $E1FD performs final SETLFS then returns to caller.

COMBYT ($E200)
- Purpose: Check for comma, then input a single byte parameter into X.
- Behavior:
  - JSR $E20E (CMMERR / comma-confirm).
  - JMP $B79E — the system byte-input routine that places the parameter in X.

DEFLT ($E206)
- Purpose: Determine if an optional parameter exists (via CHRGOT) and handle early exit if not present.
- Behavior:
  - JSR $0079 to get CHRGOT (sets A to last character or null).
  - If CHRGOT indicates a character (BNE), return normally (RTS).
  - If no character (BEQ), PLA twice to remove the return address off the stack so that execution returns from both this routine and its caller — effectively aborting the calling call chain when an optional parameter is absent.

CMMERR ($E20E)
- Purpose: Confirm that the next text character is a comma, and that the comma is not immediately followed by a terminator (syntax check).
- Behavior:
  - JSR $AEFD to confirm comma existence.
  - JSR $0079 to get CHRGOT and test if the character after comma is not a terminator (BNE -> normal continuation).
  - If terminator found (null), jump to $AF08 to generate a SYNTAX error.

OCPARA ($E219)
- Purpose: Parse parameters for OPEN/CLOSE: logical file number (mandatory), optional device, optional secondary address, optional filename.
- Behavior:
  - Clears filename (LDA #$00) and calls SETNAM ($FFBD) to make filename null by default.
  - Confirms that TXTPNT is not a terminator (JSR $E211) — logical file number is compulsory.
  - Reads one-byte logical file number into X via $B79E and stores it to $49 (temporary / <FORPNT).
  - Sets defaults: X(register) = #$01 (device), Y = #$00 (secondary), and calls SETLFS ($FFBA).
  - Uses DEFLT/COMBYT/CMMERR-style checks to read optional device into X, then stores it into $4A for later (>FORPNT).
  - Special-case for serial devices: compares device (X) with #$03 (CPX #$03). If device >= 3, executes DEY to set secondary address to $FF (i.e. serial device secondary address $FF). If device < 3, leaves SA at #$00.
  - Calls SETLFS with the chosen device/secondary, then parses optional SA (if present), transfers SA into Y, restores FA from $4A, LA from $49, and calls SETLFS again to apply final parameters.
  - If a filename is present, it evaluates the expression (JSR $AD9E), does string housekeeping (JSR $B6A3), reads filename pointers from $22/$23 and calls SETNAM ($FFBD).
- Exit: Final JMP to SETNAM ($FFBD) then return to caller.

Notes on stack behavior:
- DEFLT deliberately removes the return address to cause an early return from the calling sequence when an optional parameter is absent — this is used to let callers cleanly abort further parsing and leave defaults in place.

## Source Code
```asm
.,E1D4 A9 00    LDA #$00        clear length of filename
.,E1D6 20 BD FF JSR $FFBD       SETNAM
.,E1D9 A2 01    LDX #$01        default FA, device number is #01
.,E1DB A0 00    LDY #$00        default SA, secondary address is #00
.,E1DD 20 BA FF JSR $FFBA       SETLFS, and device number
.,E1E0 20 06 E2 JSR $E206       test if "end of line", if so end here
.,E1E3 20 57 E2 JSR $E257       set up given filename and perform SETNAM
.,E1E6 20 06 E2 JSR $E206       test if "end of line", if so end here
.,E1E9 20 00 E2 JSR $E200       check for comma, and input one byte, FA, to (X)
.,E1EC A0 00    LDY #$00
.,E1EE 86 49    STX $49
.,E1F0 20 BA FF JSR $FFBA       perform new SETLFS with device number
.,E1F3 20 06 E2 JSR $E206       test if "end of line", if so end here
.,E1F6 20 00 E2 JSR $E200       check for comma, and input one byte, SA, to (X)
.,E1F9 8A       TXA             transfer (X) to (Y)
.,E1FA A8       TAY
.,E1FB A6 49    LDX $49         get FA
.,E1FD 4C BA FF JMP $FFBA       perform SETLFS with both device number and secondary
                                address. Then exit

.,E200 20 0E E2 JSR $E20E       check for comma
.,E203 4C 9E B7 JMP $B79E       input one byte parameter to (X)

.,E206 20 79 00 JSR $0079       get CHRGOT
.,E209 D0 02    BNE $E20D       if last character is a character, do normal exit
.,E20B 68       PLA             else, remove return address
.,E20C 68       PLA             to exit this AND the calling routine.
.,E20D 60       RTS             exit

.,E20E 20 FD AE JSR $AEFD       confirm comma
.,E211 20 79 00 JSR $0079       get CHRGOT
.,E214 D0 F7    BNE $E20D       else than null
.,E216 4C 08 AF JMP $AF08       execute SYNTAX error

.,E219 A9 00    LDA #$00        default filename is null
.,E21B 20 BD FF JSR $FFBD       SETNAM
.,E21E 20 11 E2 JSR $E211       confirm TXTPNT is no terminator, if so - error
.,E221 20 9E B7 JSR $B79E       input one byte character to (X)
.,E224 86 49    STX $49         store logical filenumber in <FORPNT
.,E226 8A       TXA             set default parameters to
.,E227 A2 01    LDX #$01        device = #1
.,E229 A0 00    LDY #$00        secondary address = #0
.,E22B 20 BA FF JSR $FFBA       SETLFS
.,E22E 20 06 E2 JSR $E206       test if "end of line", if so end here
.,E231 20 00 E2 JSR $E200       check for comma, and input FA, device number
.,E234 86 4A    STX $4A         store in >FORPNT
.,E236 A0 00    LDY #$00        secondary address = #0
.,E238 A5 49    LDA $49         logical file number from temp store
.,E23A E0 03    CPX #$03        test if serial device
.,E23C 90 01    BCC $E23F       nope
.,E23E 88       DEY             if serial, set secondary address to $ff
.,E23F 20 BA FF JSR $FFBA       SETLFS
.,E242 20 06 E2 JSR $E206       test if "end of line", if so end here
.,E245 20 00 E2 JSR $E200       check for comma, and input SA, secondary address
.,E248 8A       TXA
.,E249 A8       TAY             SA to (Y)
.,E24A A6 4A    LDX $4A         FA
.,E24C A5 49    LDA $49         LA
.,E24E 20 BA FF JSR $FFBA       SETLFS
.,E251 20 06 E2 JSR $E206       test if "end of line", if so end here
.,E254 20 0E E2 JSR $E20E       check for comma only
.,E257 20 9E AD JSR $AD9E       evaluate expression in text
.,E25A 20 A3 B6 JSR $B6A3       do string housekeeping
.,E25D A6 22    LDX $22         pointers to given filename
.,E25F A4 23    LDY $23
.,E261 4C BD FF JMP $FFBD       SETNAM and exit
```

## Key Registers
- $0022-$0023 - zero page - pointer to given filename (low/high)
- $0049 - zero page - temporary store (logical file number / FA)
- $004A - zero page - temporary store (device/SA or >FORPNT)

## References
- "basic_file_commands_sys_save_load_verify_open_close" — expands on parameters used by SAVE/LOAD/VERIFY/SETNAM/SETLFS
- "file_io_and_serial_open_close" — expands on serial device handling when opening/closing files

## Labels
- SLPARA
- COMBYT
- DEFLT
- CMMERR
- OCPARA
