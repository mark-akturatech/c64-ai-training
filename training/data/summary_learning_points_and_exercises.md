# MACHINE — Key points: JSR, RTS, SYS, CHROUT ($FFD2), indexing, INX/DEX/INY/DEY

**Summary:** Covers calling and returning from machine-language subroutines (JSR/RTS, BASIC SYS), the CHROUT output routine at $FFD2, monitor assembler/disassembler availability, immediate addressing (#), X/Y index registers and the increment/decrement instructions INX/DEX/INY/DEY.

## Core Concepts
- JSR/RTS: Use JSR to call a machine-language subroutine; the subroutine must end with RTS to return to the caller.
- BASIC SYS: BASIC can invoke a machine-language routine via SYS <address>; control returns when the machine routine executes RTS.
- CHROUT ($FFD2): The CHROUT subroutine at $FFD2 outputs a single character (commonly to the screen). It accepts printable characters and special cursor- and color-control characters.
- Monitor tools: Most machine-language monitors provide a small assembler for entering code and a disassembler to inspect or verify assembled code.
- Immediate addressing (#): Prefixing a value with # (immediate mode) tells the CPU to use the value itself rather than treating it as an address to fetch data from.
- Index registers X/Y and indexing: X and Y are index registers. They can be added to base addresses to form effective addresses that change as the program runs (indexing).
- INX/DEX/INY/DEY: X and Y can be incremented/decremented using INX, DEX, INY, and DEY for loop counters or stepping through indexed tables.

## Questions and Projects
- Consult the ASCII table (Appendix D). Hex $93 is "clear screen." Write a program to clear the screen and print "HO HO!".
- Experiment with counting direction: if X was counting up from 0 in an example, what happens if X starts at 5 and counts down?
- Use cursor movements and color codes (if available) plus special ASCII characters to lay out a box. Try the layout in BASIC first; draw a box with the word HELLO inside it.

## Key Registers
- $FFD2 - KERNAL - CHROUT: output character (prints to screen; accepts cursor and color control characters)

## References
- "stopgap_save_using_data_and_poke" — expands on the practical save/reload technique referenced
- "chrout_output_subroutine" — expands on using CHROUT for output and control characters

## Labels
- CHROUT

## Mnemonics
- JSR
- RTS
- INX
- DEX
- INY
- DEY
