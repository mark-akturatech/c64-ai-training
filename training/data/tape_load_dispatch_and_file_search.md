# KERNAL: Tape Load Entry & Header Dispatch ($F533–$F56A)

**Summary:** Disassembly of the KERNAL tape-load entry sequence ($F533–$F56A). Detects cassette device, calls ZZZ to set tape pointers, calls CSTE1/LUKING to inform the user and print "SEARCHING", uses FNLEN/FAF to find a named file or FAH to find any header, checks STATUS ($90) SPERR bit, and inspects X (file-type) against #$01 (BLF) and #$03 (PLF) to choose load behavior.

## Operation / Flow

- $F533: LSR A — test device number (LSR puts bit0 into carry). If carry set, device is cassette; otherwise jump to ERROR9 ($F713) for an invalid device.
- $F539: JSR ZZZ ($F7D0) — set tape pointers. If ZZZ returns with carry (failure/allocation error), jump to ERROR9.
- $F541: JSR CSTE1 ($F817) — inform user about cassette-button usage. Immediately following this JSR, the code tests the carry (BCS $F5AE) — a set carry indicates the user pressed STOP (or CSTE1 signalled a stop), so the routine jumps to LD190 (stop-key handling).
- $F546: JSR LUKING ($F5AF) — display the "SEARCHING" message.
- $F549: LDA FNLEN ($B7) — if FNLEN == 0, no filename was supplied; branch to LD150 to search for any header (FAH). If a filename exists:
  - $F54D: JSR FAF ($F7EA) — find a file on tape matching the filename. FAF returns:
    - BCC (clear carry) → success (branch to LD170 at $F55D),
    - BEQ (zero) → stop-key pressed (branch LD190 at $F5AE),
    - BCS (carry set) → end-of-tape or not found (branch LD90 at $F530).
- $F556: (No FNLEN) JSR FAH ($F72C) — find any header. FAH returns similar codes:
  - BEQ → stop-key,
  - BCS → no header / end-of-tape (branch LD90).
- $F55D: On a found header, load STATUS from $90 and AND #$10 (SPERR bit). If the SPERR bit result is non-zero, branch to LD190 (abort/stop-key handling).
- $F564–$F56A: Inspect X (file-type byte):
  - CPX #$01 (BLF) — if equal, branch to LD178: it's a movable file (BLF).
  - CPX #$03 (PLF) — if equal, fall through to handle as program (PLF).
  - If neither, the code continues as "something else" (branch back to LD112 at $F549 to re-evaluate or search).

Notes:
- Routine labels (ZZZ/FAF/FAH/CSTE1/LUKING/ERROR9) and branch targets are preserved from the disassembly comments.
- FNLEN is at $B7 in this listing; STATUS is at $90 and bit-mask #$10 is tested as SPERR.
- X contains the file-type value loaded earlier by the header-parsing code (not shown here). The comparisons to #$01 and #$03 select BLF and PLF handling paths.

## Source Code
```asm
        ;LOAD FROM TAPE
        ;
.,F533  4A        LSR             LD100  LSR A
.,F534  B0 03     BCS $F539       BCS    LD102           ;IF C-SET THEN IT'S CASSETTE
        ;
.,F536  4C 13 F7  JMP $F713       JMP    ERROR9          ;BAD DEVICE #
        ;
.,F539  20 D0 F7  JSR $F7D0       LD102  JSR ZZZ         ;SET POINTERS AT TAPE
.,F53C  B0 03     BCS $F541       BCS    LD104
.,F53E  4C 13 F7  JMP $F713       JMP    ERROR9          ;DEALLOCATED...
.,F541  20 17 F8  JSR $F817       LD104  JSR CSTE1       ;TELL USER ABOUT BUTTONS
.,F544  B0 68     BCS $F5AE       BCS    LD190           ;STOP KEY PRESSED?
.,F546  20 AF F5  JSR $F5AF       JSR    LUKING          ;TELL USER SEARCHING
        ;
.,F549  A5 B7     LDA $B7         LD112  LDA FNLEN       ;IS THERE A NAME?
.,F54B  F0 09     BEQ $F556       BEQ    LD150           ;NONE...LOAD ANYTHING
.,F54D  20 EA F7  JSR $F7EA       JSR    FAF             ;FIND A FILE ON TAPE
.,F550  90 0B     BCC $F55D       BCC    LD170           ;GOT IT!
.,F552  F0 5A     BEQ $F5AE       BEQ    LD190           ;STOP KEY PRESSED
.,F554  B0 DA     BCS $F530       BCS    LD90            ;NOPE...END OF TAPE
        ;
.,F556  20 2C F7  JSR $F72C       LD150  JSR FAH         ;FIND ANY HEADER
.,F559  F0 53     BEQ $F5AE       BEQ    LD190           ;STOP KEY PRESSED
.,F55B  B0 D3     BCS $F530       BCS    LD90            ;NO HEADER
        ;
.,F55D  A5 90     LDA $90         LD170  LDA STATUS
.,F55F  29 10     AND #$10        AND    #SPERR          ;MUST GOT HEADER RIGHT
.,F561  38        SEC             SEC
.,F562  D0 4A     BNE $F5AE       BNE    LD190           ;IS BAD
        ;
.,F564  E0 01     CPX #$01        CPX    #BLF            ;IS IT A MOVABLE PROGRAM...
.,F566  F0 11     BEQ $F579       BEQ    LD178           ;YES
        ;
.,F568  E0 03     CPX #$03        CPX    #PLF            ;IS IT A PROGRAM
.,F56A  D0 DD     BNE $F549       BNE    LD112           ;NO...ITS SOMETHING ELSE
```

## References
- "nload_device_checks_and_basic_errors" — expands on device checks and error handling when device indicates tape (carry set)
- "tape_addressing_and_block_load" — continues after header/file-type handling to compute start address and perform block load
- "luking_message_subroutine" — covers the "SEARCHING" message routine (LUKING) and user prompts

## Labels
- ZZZ
- CSTE1
- LUKING
- FAF
- FAH
- ERROR9
- FNLEN
- STATUS
