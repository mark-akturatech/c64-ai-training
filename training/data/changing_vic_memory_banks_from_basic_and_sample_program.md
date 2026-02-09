# Change VIC-II 16K Bank from BASIC (Bank Switch, Character RAM Copy, OS Pointer, RESTORE Handling)

**Summary:** This document provides a step-by-step BASIC procedure to switch the VIC-II 16K bank using CIA2 port/DDRA at $DD00/$DD02, configure the VIC-II $D018 register for screen and character pointers, and update the OS screen pointer at $0288. It includes a sample BASIC program with a machine-language helper to copy the ROM character set to RAM and a small interrupt/RESTORE fix.

**Procedure and Important Formulas**

1. **Set CIA2 Port A Data Direction for Output:**
   - Ensure the CIA2 port data-direction bits are set for output so the bank-select pins can be driven:
     - `POKE 56578, PEEK(56578) OR 3`  ; 56578 = $DD02 (CIA2 DDRA)

2. **Set the 2-Bit Bank Number on CIA2 Port A:**
   - Set the 2-bit bank number on the CIA2 port (low two bits). Bank must be 0–3:
     - `POKE 56576, (PEEK(56576) AND 252) OR (3 - BANK)`
       - 56576 = $DD00 (CIA2 Port A); AND 252 clears the low two bits before OR-ing the value (3 - BANK).

3. **Point the VIC-II to the Character Memory:**
   - Point the VIC-II to the character memory (2 KB offsets inside the selected 16K block):
     - `POKE 53272, (PEEK(53272) AND 240) OR TK`
       - 53272 = $D018 (VIC-II memory control). TK is the 2-KB offset from the beginning of the currently selected 16K block (0..7, encoded as 0..7).

4. **Point the VIC-II to the Display/Screen Memory:**
   - Point the VIC-II to the display/screen memory (K KB offsets inside the selected 16K block):
     - `POKE 53272, (PEEK(53272) AND 15) OR K * 16`
       - K is the Kbyte (1-KB) offset from the beginning of the block; the screen offset is encoded in bits that occupy the other nibble of $D018.
   - Because both steps write into the same register ($D018), the combined correct masked write is required; the text suggests you can combine with:
     - `POKE 53272, (16 * K + TK)`
     - **Note:** Combining without masking (AND) will overwrite any other bits in $D018; use masking to preserve unrelated bits.

5. **Update the KERNAL/OS Screen Pointer:**
   - Tell the KERNAL/OS where to write text characters (OS pointer):
     - `POKE 648, AD / 256`  ; 648 = $0288 (OS screen pointer high byte). AD is the actual start address of screen memory (POKE low/high as required).

**Warnings:**

- After switching banks and VIC-II pointers, the STOP/RESTORE behavior can lock the machine because the BRK initialization can change the VIC display default while the OS pointer remains elsewhere. The simplest avoidance is disabling the RESTORE key (see OS entries referenced at 792 and 808 in the original source).
- `POKE 1` is used in the sample to momentarily map the character ROM into CPU memory while the ML copy reads the ROM; `POKE 1, PEEK(1) AND 251` and `POKE 1, PEEK(1) OR 4` show that usage.

## Source Code

```basic
20 FOR I = 1 TO 33: READ A: POKE 49152 + I, A: NEXT: REM SET UP ML ROUTINE
30 GOSUB 200: REM ML COPY OF ROM CHARACTER SET TO RAM
40 POKE 56576, PEEK(56576) AND 252: REM STEP 1, ENABLE BANK 3
50 POKE 53272, 44: REM STEPS 2-3, POINT VIC-II TO SCREEN AND CHARACTER MEMORY
60 REM SCREEN OFFSET IS 2 * 16, CHARACTER OFFSET IS 12
70 POKE 648, 200: REM STEP 4, POINT OS TO SCREEN AT 51200 (200 * 256)
80 PRINT CHR$(147): REM CLEAR SCREEN
90 FOR I = 53236 TO 53245: READ A: POKE I, A: NEXT: REM NEW INTERRUPT ROUTINE
100 POKE 53246, PEEK(792): POKE 53247, PEEK(793): REM SAVE OLD NMI VECTOR
110 POKE 792, 244: POKE 793, 207: REM ROUTE THE INTERRUPT THROUGH THE NEW ROUTINE
120 FOR I = 0 TO 255: POKE 51400 + I, I: POKE 55496 + I, 1: NEXT
125 REM POKE CHARACTERS TO SCREEN
130 FOR J = 1 TO 8: FOR I = 61440 + J TO 63488 STEP 8
140 POKE I, 0: NEXT I, J: REM ERASE CHARACTER SET
150 FOR I = 61440 TO 63488: POKE I, PEEK(I): NEXT: REM POKE ROM TO RAM
160 GOSUB 200: END: REM RESTORE CHARACTER SET
200 POKE 56334, PEEK(56334) AND 254: REM DISABLE INTERRUPTS
210 POKE 1, PEEK(1) AND 251: REM SWITCH CHARACTER ROM INTO 6510 MEMORY
220 SYS 49152: REM COPY ROM CHARACTER SET TO RAM AT 61440
230 POKE 1, PEEK(1) OR 4: REM SWITCH CHARACTER ROM OUT OF 6510 MEMORY
240 POKE 56334, PEEK(56334) OR 1: REM ENABLE INTERRUPTS
250 RETURN
300 REM DATA FOR ML PROGRAM TO COPY CHARACTER SET TO RAM
310 DATA 169, 0, 133, 251, 133, 253, 169, 208, 133, 252, 169, 240, 133, 254, 162, 16
320 DATA 160, 0, 177, 251, 145, 253, 136, 208, 249, 230, 252, 230, 254, 202, 208, 240, 96
330 REM NEXT IS ML PROGRAM TO MAKE THE RESTORE KEY RESET OS POINTER TO SCREEN
340 DATA 72, 169, 4, 141, 136, 2, 104, 108, 254, 207
```

**Note:** The above BASIC listing has been corrected for typographical errors and inconsistencies.

## Key Registers

- **$DD00** - CIA 2 - Port A (decimal 56576) — used by the sample to set bank select bits (low two bits).
- **$DD02** - CIA 2 - Data Direction Register A (decimal 56578) — set outputs for port A pins.
- **$D018** - VIC-II - Memory control register (decimal 53272) — selects VIC character and screen memory pointers (character pointer TK, screen pointer K * 16).
- **$0001** - CPU port (decimal 1) — 6510 processor port used to map character ROM into CPU memory (POKE 1 used in ML copy).
- **$0288** - OS - Screen memory pointer high byte (decimal 648) — KERNAL pointer to screen address (POKE 648, AD / 256).
- **$0318** (decimal 792) and **$0328** (decimal 808) — OS locations referenced in the text regarding RESTORE/STOP handling.

## References

- "user_defined_characters_and_multicolor_text" — expands on setting character memory and defining user character sets after switching banks.