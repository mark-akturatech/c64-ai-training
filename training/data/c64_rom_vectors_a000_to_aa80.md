# Commodore 64 BASIC ROM Routine Table ($A000–$AA80)

**Summary:** ROM entry points and vectors for C64 BASIC routines and tables ($A000–$AA80), including ROM control vectors, keyword/function/operator vectors, BASIC interpreter routines (INPUT/LIST/RUN/FOR/GOSUB/RETURN/etc.), error/message tables, and PRINT# handler.

## ROM Routine Table
Each entry below is an entry point or table start in the C64 BASIC ROM image between $A000 and $AA80.

- $A000: ROM control vectors
- $A00C: Keyword action vectors
- $A052: Function vectors
- $A080: Operator vectors
- $A09E: Keywords
- $A19E: Error messages
- $A328: Error message vectors
- $A365: Miscellaneous messages
- $A38A: Scan stack for FOR/GOSUB
- $A3B8: Move memory
- $A3FB: Check stack depth
- $A408: Check memory space
- $A435: Print "OUT OF MEMORY"
- $A437: Error routine
- $A469: BREAK entry
- $A474: Print "READY."
- $A480: Ready for BASIC
- $A49C: Handle new line
- $A533: Re-chain lines
- $A560: Receive input line
- $A579: Crunch tokens
- $A613: Find BASIC line
- $A642: Perform NEW
- $A65E: Perform CLR
- $A68E: Back up text pointer
- $A69C: Perform LIST
- $A742: Perform FOR
- $A7ED: Execute statement
- $A81D: Perform RESTORE
- $A82C: Break
- $A82F: Perform STOP
- $A831: Perform END
- $A857: Perform CONT
- $A871: Perform RUN
- $A883: Perform GOSUB
- $A8A0: Perform GOTO
- $A8D2: Perform RETURN
- $A8F8: Perform DATA
- $A906: Scan for next statement
- $A928: Perform IF
- $A93B: Perform REM
- $A94B: Perform ON
- $A96B: Get fixed point number
- $A9A5: Perform LET
- $AA80: Perform PRINT#

Notes:
- These addresses are the BASIC ROM entry points and tables used by the interpreter for token handling, parsing, control flow, error reporting, and I/O handling.
- For continued ROM routine listings beyond $AA80 see referenced continuation.

## References
- "c64_rom_vectors_aa86_to_bafe" — continuation of ROM routine listings beyond $AA80