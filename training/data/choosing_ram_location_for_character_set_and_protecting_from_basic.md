# Character-set placement and protecting RAM-based character sets ($3000, POKE 53272)

**Summary:** Recommends safe RAM start addresses for custom character sets on the C64 (avoid $0000 and $0800; $3000 / 12288 recommended), shows how to point the VIC to that bank by poking the low 4 bits of $D018 (53272), and gives BASIC snippets to check/free memory and reduce BASIC's available memory so BASIC won't overwrite the character RAM.

**Explanation**
- Do NOT place a RAM-based character set at $0000 (0) — page zero holds important system vectors/data.  
- Do NOT place a character set at $0800 (2048) — this is where BASIC stores the program text.  
- A safe experimental location is $3000 (12288). To make the VIC use a character set starting at $3000, set the low 4 bits of the VIC memory-control register (decimal 53272, $D018) to 12 (decimal). The example below performs that change and immediately causes the screen characters to appear as garbage until a valid character set is installed there.

- To restore normal screen characters after pointing VIC at uninitialized memory, press RUN/STOP then RESTORE (this resets BASIC/VIC pointers to the default bank).

- To protect a RAM-based character set from being overwritten by BASIC, reduce the amount of memory BASIC thinks it has available (the physical RAM remains unchanged; BASIC's pointers are altered). The excerpt shows how to display available memory and then reduce BASIC's memory before running CLR so BASIC's program area won't overlap the character RAM.

- The PRINT expression shown uses FRE(0) and a signed check to display the amount of free memory; the POKE sequence that follows is intended to move BASIC's memory top/bottom pointers so CLR prevents BASIC from allocating into your character RAM.

## Source Code
```basic
10 POKE 53272,(PEEK(53272)AND240)+12
20 REM screen will show garbage until characters exist at $3000
30 REM restore with RUN/STOP then RESTORE

PRINT FRE(0)-(SGN(FRE(0))<0)*65535

POKE 52,48:POKE 56,48:CLR
```

## Key Registers
- $D018 (53272) - VIC-II - Memory control register (low 4 bits select character/screen memory bank/base).
- $0034 (52) - Pointer to the start of BASIC program text (low byte).
- $0035 (53) - Pointer to the start of BASIC program text (high byte).
- $0038 (56) - Pointer to the end of BASIC program text (high byte).

## References
- "programmable_characters_overview_and_considerations" — RAM tradeoffs and precautions for character sets  
- "copy_characters_from_ROM_to_RAM_example_program" — example program copying ROM characters to RAM and using these steps