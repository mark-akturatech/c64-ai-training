# LUKING ($F5AF) — print "SEARCHING" (and optional "FOR <filename>")

**Summary:** LUKING at $F5AF checks MSGFLG ($9D) and, if messages are enabled, calls MSG ($F12F) to print the message "SEARCHING"; if FNLEN ($B7) ≠ 0 it prints "FOR" (and then calls the filename output routine). Searchable terms: $F5AF, $F12F, $9D (MSGFLG), $B7 (FNLEN), MSG, OUTFN, "SEARCHING", "FOR".

**Description**
This KERNAL subroutine is the small message-dispatch used by file-open/file-search sequences to notify the user that the system is searching for a file.

Behavior:
- Load MSGFLG at zero page $9D and test sign bit. Only when A is negative (bit 7 = 1) does the routine proceed to print; otherwise it returns immediately. (MSGFLG is the KERNAL message flag.)
- If messages are enabled, set Y to #$0C and JSR $F12F (MSG). The LDY value selects the "SEARCHING" text entry expected by the MSG routine (MS5-MS1 offset).
- After printing "SEARCHING", load FNLEN from $B7. If FNLEN = 0, the routine returns (no filename printing).
- If FNLEN ≠ 0, set Y to #$17 and JSR $F12F to print "FOR" (MS6-MS1 offset). Execution then continues into the code that outputs the actual filename (the filename-output subroutine, typically OUTFN), which is beyond the shown fragment.

Notes:
- MSG ($F12F) is the KERNAL message printer that uses Y as an index into a message table (MSn). The LDY constants (#$0C, #$17) are offsets selecting which message to print.
- FNLEN ($B7) is the file-name length variable in the zero page — used to decide whether to append "FOR <name>".
- The shown fragment does not include the following code that performs the filename output (a separate routine—see OUTFN / output_filename_subroutine).

## Source Code
```asm
.,F5AF A5 9D    LDA $9D         ; LUKING  LDA MSGFLG      ;SUPPOSED TO PRINT?
.,F5B1 10 1E    BPL $F5D1       ;         BPL    LD115           ;...NO
.,F5B3 A0 0C    LDY #$0C        ;         LDY    #MS5-MS1        ;"SEARCHING"
.,F5B5 20 2F F1 JSR $F12F       ;         JSR    MSG
.,F5B8 A5 B7    LDA $B7         ;         LDA    FNLEN
.,F5BA F0 15    BEQ $F5D1       ;         BEQ    LD115
.,F5BC A0 17    LDY #$17        ;         LDY    #MS6-MS1        ;"FOR"
.,F5BE 20 2F F1 JSR $F12F       ;         JSR    MSG
.,F5C1 20 00 F6 JSR $F600       ;         JSR    OUTFN           ;OUTPUT FILE NAME
.,F5C4 4C D1 F5 JMP $F5D1       ;         JMP    LD115
```

## References
- "ieee_load_open_and_address_fetch" — expands on calls from the IEEE open sequence that trigger this message
- "tape_load_dispatch_and_file_search" — expands on usage during tape search sequences
- "output_filename_subroutine" — expands on the routine used to print the actual filename after "FOR"

## Labels
- LUKING
- MSGFLG
- FNLEN
