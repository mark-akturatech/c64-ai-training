# MACHINE — Changing Memory and Registers

**Summary:** Describes screen-editing memory with the .M display and writing changes by typing over bytes and pressing RETURN; describes editing CPU registers with .R and warns against changing SR and SP. Searchable terms: .M, .R, screen editing, RETURN, PC, AC, XR, YR, SR, SP.

## Changing Memory Contents
To modify memory after a memory display (for example from .M), move the cursor so it sits over the displayed hex byte you want to change, type the new value, and press RETURN. Pressing RETURN commits the change to memory (do not move to the next line before pressing RETURN). This is the same screen-editing behaviour used when editing BASIC program lines.

After making edits, confirm changes by issuing another .M memory display.

## Changing Registers
Use the .R command to display CPU registers and edit their contents by typing over the displayed values and pressing RETURN to commit changes. The registers you may change include PC, AC, XR, and YR (PC = program counter; AC = accumulator; XR/YR = X/Y index registers).

Do not change SR or SP unless you understand the consequences: SR is the processor status register (flags) and SP is the stack pointer (system stack index); altering them can cause unpredictable or system-breaking behaviour.

## References
- "displaying_memory_and_format" — shows the memory display format you edit with screen editing
- "entering_program_with_mlm" — practical example of entering assembled bytes by editing memory