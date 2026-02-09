# Changing VIC-II 16K Bank from BASIC (C64 I/O Map)

**Summary:** Step-by-step BASIC procedure to switch the VIC-II 16K video bank using CIA#2 Port A (Data Direction Register) and VIC-II memory-control register $D018 (53272), plus updating the KERNAL/OS screen pointer at $0288 (648). Includes exact POKE/PEEK lines for selecting banks 0–3 and formulas for character/display memory offsets.

## Procedure
1. Set Data Direction Register A (CIA #2) outputs if necessary. Bits 0–1 of CIA #2 Port A must be outputs to drive the video-bank select lines (this is normally the power-up default).

2. Select the 16K bank (banks 0–3). Use the CIA#2 DDR/Port to drive bits 0–1:
- Make DDR bit(s) outputs (if not already) and write the bank value to Port A with the following BASIC lines (decimal locations shown as in original source):
  - POKE 56578,PEEK(56578) OR 3  (ensure bits 0–1 are outputs)
  - POKE 56576,(PEEK(56576) AND 252) OR (3-BANK)  (BANK must be 0–3)

3. Set the VIC-II register for character memory (2KB offset within the selected 16K block). The VIC-II memory-control register is $D018 (53272). Use:
  - POKE 53272,(PEEK(53272) AND 240) OR TK
  - TK = 2 KBYTE offset from beginning of the selected 16K block (value expressed in the low 4 bits accepted by $D018)

4. Set the VIC-II register for display (screen) memory (K KB offset within the selected 16K block). Use:
  - POKE 53272,(PEEK(53272) AND 15) OR K*16
  - K = KBYTE offset from beginning of the selected 16K block (multiply by 16 to fit into register bits)

Since steps 3 and 4 both modify $D018, they can be combined:
  - POKE 53272,(16*K + TK)

5. Inform the Operating System (KERNAL) where screen memory is so text writes go to the correct bank. Set the OS pointer byte at decimal 648 ($0288):
  - POKE 648, AD/256
  - AD is the actual (absolute) address of screen memory; the POKE sets the high/offset byte the OS uses for text output

Warnings:
- After changing banks, pressing STOP/RESTORE (BRK) can reinitialize the screen display to location 1024 in Bank 0 while leaving the OS pointer at 648 unchanged. This causes typed characters not to appear and can hang the machine until power-cycled.
- Recommended mitigation: disable the RESTORE key (see entries for addresses 792 ($318) and 808 ($328) for disabling RESTORE).

## Source Code
```basic
POKE 56578,PEEK(56578) OR 3: REM SET FOR OUTPUT IF NOT ALREADY
POKE 56576,(PEEK(56576) AND 252) OR (3-BANK): REM BANK IS BANK #, MUST BE 0-3

POKE 53272,(PEEK(53272) AND 240) OR TK: REM TK IS 2 KBYTE OFFSET FROM BEGINNING OF BLOCK
POKE 53272,(PEEK(53272) AND 15) OR K*16: REM K IS KBYTE OFFSET FROM BEGINNING OF BLOCK

REM Combined:
POKE 53272,(16*K+TK)

POKE 648,AD/256: REM AD IS THE ACTUAL ADDRESS OF SCREEN MEMORY
```

## Key Registers
- $DD00-$DD0F - CIA #2 - Port A / Data Direction Register A (use bits 0–1 to select video bank; DDR at $DD02 / decimal 56578)
- $D000-$D02E - VIC-II - memory control registers including $D018 (53272) used for character/display memory pointers
- $0288 - RAM - Operating System screen-memory pointer (decimal 648) — set so KERNAL writes text to the selected VIC display memory

## References
- "cia2_porta_bits_video_bank_selection" — detailed explanation of Bits 0–1 on CIA #2 Port A used to select bank
- "sample_bank3_switch_program" — example BASIC + machine-code implementation of the bank-switch steps