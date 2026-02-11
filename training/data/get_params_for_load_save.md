# KERNAL: Get parameters for LOAD/SAVE ($E1D4-$E1FD)

**Summary:** Disassembly and step-by-step behavior of the KERNAL routine at $E1D4–$E1FD that parses parameters for LOAD/SAVE: clears filename buffer ($FFBD), sets defaults (device = cassette), invokes address/logical setup ($FFBA), checks for end-of-token or ':' ($E206), invokes filename parser ($E257), scans trailing bytes ($E200), and finally jumps to $FFBA to finalize and return.

## Description
This routine prepares arguments for the KERNAL LOAD/SAVE flow. It performs these high-level steps:

- Clears the filename length and filename buffer via LDA #$00 and JSR $FFBD.
- Sets default device number to 1 (cassette) using LDX #$01.
- Sets a default command (zero) with LDY #$00.
- Calls $FFBA to "set logical, first and second addresses" (the KERNAL address/logical setup helper).
- Uses $E206 to test for end-of-token (EOT) or ':' and exit early if present.
- Calls $E257 to evaluate and store the filename string (the filename setter).
- Calls $E206 again to test for EOT or ':' after filename.
- Calls $E200 to scan/consume the next input byte; $E200 will produce a syntax error and warm start if the required byte isn't present.
- Clears command (LDY #$00) and saves the device number to zero-page location $49 (STX $49).
- Calls $FFBA again to (re)establish logical/first/second addresses after the filename/device changes.
- Performs another EOT/':' check ($E206) and another scan/get ($E200).
- Transfers registers to arrange the command/device for the final call, reloads the saved device from $49 into X, and jumps to $FFBA to complete setup and return to the caller.

Notes on register usage and behavior:
- The routine uses X for the default device (LDX #$01) and stores X into $49 later (STX $49) after parsing.
- Y is used for the command field (LDY #$00 sets default/clears).
- Several helper subroutines are used:
  - $FFBD — clear filename buffer/length
  - $FFBA — set logical and address registers (used multiple times; final JMP goes there)
  - $E206 — test for EOT or ':' and exit the routine when appropriate
  - $E257 — filename setter (consume and store filename)
  - $E200 — scan and get byte; on failure, triggers syntax error/warm start
- Final control transfers to $FFBA (JMP) which performs final address/logical setup and returns control to the KERNAL caller.

**[Note: Source may contain an error — the commented "copy command to A" at E1F9 (TXA) conflicts with earlier use of LDY for the command; TXA transfers X→A, while the command was held in Y. The exact intended transfer (TXA vs TYA) is unclear from this fragment.]**

## Source Code
```asm
                                *** get parameters for LOAD/SAVE
.,E1D4 A9 00    LDA #$00        clear file name length
.,E1D6 20 BD FF JSR $FFBD       clear the filename
.,E1D9 A2 01    LDX #$01        set default device number, cassette
.,E1DB A0 00    LDY #$00        set default command
.,E1DD 20 BA FF JSR $FFBA       set logical, first and second addresses
.,E1E0 20 06 E2 JSR $E206       exit function if [EOT] or ":"
.,E1E3 20 57 E2 JSR $E257       set filename
.,E1E6 20 06 E2 JSR $E206       exit function if [EOT] or ":"
.,E1E9 20 00 E2 JSR $E200       scan and get byte, else do syntax error then warm start
.,E1EC A0 00    LDY #$00        clear command
.,E1EE 86 49    STX $49         save device number
.,E1F0 20 BA FF JSR $FFBA       set logical, first and second addresses
.,E1F3 20 06 E2 JSR $E206       exit function if [EOT] or ":"
.,E1F6 20 00 E2 JSR $E200       scan and get byte, else do syntax error then warm start
.,E1F9 8A       TXA             copy command to A
.,E1FA A8       TAY             copy command to Y
.,E1FB A6 49    LDX $49         get device number back
.,E1FD 4C BA FF JMP $FFBA       set logical, first and second addresses and return
```

## References
- "scan_and_get_byte" — details the $E200 scan/consume behavior and error/warm-start handling
- "set_filename_routine" — details the $E257 filename parsing and storage behavior
