# RESTORE ($A81D) — Perform RESTORE: resets the DATA pointer ($0041-$0042) to the start-of-BASIC pointer ($002B-$002C)

**Summary:** RESTORE (BASIC ROM entry at $A81D) copies the start-of-BASIC pointer at $002B-$002C into the DATA pointer at $0041-$0042 so subsequent READ statements begin from the program start. Useful for restarting DATA reads in a BASIC program.

## Operation
The RESTORE command resets the BASIC interpreter's DATA pointer so that the next READ will fetch the first DATA item in the program. Concretely, the two-byte value stored at $002B-$002C (start-of-BASIC pointer) is copied to $0041-$0042 (DATA pointer). After RESTORE, READ uses the pointer at $0041-$0042 to locate the next DATA token.

**[Note: Source may contain minor errors — original text showed "RESTOR" and a typo "$2V"; the intended addresses are $002B-$002C and $0041-$0042.]**

## Key Registers
- $002B-$002C - BASIC - Start-of-BASIC pointer (two-byte address to program start)
- $0041-$0042 - BASIC - DATA pointer used by READ (two-byte address)

## References
- "read_statement" — expands on READ and how it uses the DATA pointer that RESTORE resets

## Labels
- RESTORE
