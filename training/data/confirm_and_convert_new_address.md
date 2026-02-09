# Confirm new load address; split 4‑char hex and convert to two bytes (BASIC)

**Summary:** BASIC snippet that prompts the user to confirm a new 4‑character hex load address (NLA$), splits it into two 2‑char hex halves (HD$ = RIGHT$/LEFT$), calls the hex-to-decimal converter (GOSUB 1060) to produce numeric bytes (D → LOW / HIGH), and checks the TME flag to abort on invalid hex digits. Upon successful conversion, the new load address is written to memory and committed.

**Behavior and flow**
- Prompts the user to confirm the new load address (NLA$). If the response is not "Y", control jumps to line 960 (abort/cleanup).
- Takes the rightmost two characters of NLA$ (low byte hex pair) into HD$, calls the hex-to-decimal converter at GOSUB 1060; the converter returns the numeric byte in D and sets TME = 1 on invalid input. If TME = 1, the sequence aborts (GOTO 960). On success, LOW = D.
- Then takes the leftmost two characters of NLA$ (high byte hex pair) into HD$, calls the same converter; checks TME and aborts on error. On success, HIGH = D.
- On success (both halves valid), the new load address is written to memory and committed.

Notes:
- NLA$ is the 4‑character user-entered hexadecimal string (e.g., "C000").
- HD$ is a temporary 2‑character hex string passed to the converter.
- The converter at line 1060 converts a 2‑char hex string in HD$ to a numeric byte returned in D and sets TME = 1 if any digit is invalid.

## Source Code
```basic
690 INPUT "ARE YOU SURE (Y/N)"; Q$
700 IF Q$ <> "Y" GOTO 960
710 HD$ = RIGHT$(NLA$, 2)
720 GOSUB 1060
730 IF TME = 1 GOTO 960
740 LOW = D

750 HD$ = LEFT$(NLA$, 2)
760 GOSUB 1060
770 IF TME = 1 GOTO 960
780 HIGH = D

790 REM WRITE NEW LOAD ADDRESS TO MEMORY
800 POKE 49152, LOW
810 POKE 49153, HIGH
820 PRINT "NEW LOAD ADDRESS SET TO "; NLA$
830 GOTO 1000

960 REM ABORT/CLEANUP
970 PRINT "INVALID INPUT. OPERATION ABORTED."
980 GOTO 1000

1000 REM END OF PROGRAM
1010 END

1060 REM HEX-TO-DECIMAL CONVERSION SUBROUTINE
1070 TME = 0
1080 D = 0
1090 FOR I = 1 TO 2
1100   C$ = MID$(HD$, I, 1)
1110   IF C$ >= "0" AND C$ <= "9" THEN
1120     N = ASC(C$) - 48
1130   ELSE IF C$ >= "A" AND C$ <= "F" THEN
1140     N = ASC(C$) - 55
1150   ELSE
1160     TME = 1
1170     RETURN
1180   END IF
1190   D = D * 16 + N
1200 NEXT I
1210 RETURN
```

## References
- "compute_and_display_old_load_address_and_prompt_new" — expands on taking the user-entered hex string and confirming it
- "conversion_subroutines_decimal_to_hex_and_hex_to_decimal" — expands on the hex-to-decimal routine called at 1060
- "write_modified_bytes_back_and_commit" — expands on the write/commit steps performed after successful conversion