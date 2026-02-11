# Note: BASIC ROM / Kernal ROM routine split ($BFFF / $E000)

**Summary:** Describes the routine split between BASIC ROM (ends at $BFFF) and the Kernal ROM (begins at $E000) on the C64, and the appended JMP $E000 which causes BASIC routines in the C64 Kernal to be three bytes higher in memory than the VIC-20 equivalents.

## Split between BASIC ROM and Kernal ROM
The BASIC ROM image is terminated at address $BFFF (49151); the C64 Kernal ROM begins at $E000 (57344). To bridge a routine that continues past the BASIC ROM end, a JMP $E000 instruction is appended at the BASIC ROM end so execution continues in the Kernal ROM. That appended three-byte JMP causes the start addresses of BASIC routines located in the combined Kernal image to be three bytes higher than their equivalents on the VIC-20 (i.e., routine labels/entry points are offset by +3 bytes in the C64 Kernal image).

Footer/trailer lines are present in the source (trailer/footer text included alongside this note).

## References
- "bf52_unused_area" — expands on Physical layout note adjacent to ROM data and unused area remarks.
- "exp_constants_and_exp_function" — expands on Example of a routine (EXP) that is split between BASIC ROM and Kernal ROM.