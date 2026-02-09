# BASIC initialization and startup routines (ROM $E30E–$E460)

**Summary:** Describes BASIC/Kernal startup and initialization routines and data in ROM ($E30E–$E460): ATN/ATNCON arctangent routine and constant table, warm/cold start entries ($E37B/$E394), INIT/INITAT and CHRGET relocation to zero page ($E3BF/$E3A2), initial RND seed ($E3BA → $008B), printing of BASIC startup messages ($E422), and the BASIC vectors table and its copy to RAM ($E447/$E453). Searchable terms: $E30E, $E37B, $E394, $E3A2, $E3BF, $E3BA, $E422, $E447, $E453, CHRGET, RND seed, vectors at $0300.

## Routine summaries and data locations

- $E30E (58126) — ATN
  - Computes arc tangent of the value in FAC1 (FAC1 = floating accumulator) using a 12-term series. Result left in FAC1.

- $E33E (58174) — ATNCON
  - Constant table used by ATN: begins with a count byte of 11 followed by 12 five-byte floating-point constants used by the ATN evaluation series.
  - **[Note: Source may contain an error — table described as "count byte of 11" but followed by 12 constants.]**

- $E37B (58235) — Warm Start BASIC
  - Entry point used by BASIC when invoked from the BRK handler (BRK at $FE66 decimal 65126).
  - Calls Kernal CLRCHN to close files, sets default devices, resets stack and BASIC program pointers, and vectors through the RAM vector at $0300 to continue to READY prompt and main BASIC loop.

- $E38B (58251) — Error Message Handler
  - Vectorized via RAM vector at $0300. Uses X register as index to print either an error message from the message table at $A193 (41363) or the READY prompt, then continues through vector at $0302 to the main BASIC loop.

- $E394 (58260) — Cold Start BASIC
  - Executed at power-up. Initializes BASIC interpreter state, sets up RAM vectors (copied to $0300), calls INIT to set zero-page defaults and copy routines, prints start-up messages, then enters main loop via warm-start exit.

- $E3A2 (58274) — INITAT (CHRGET text)
  - ROM copy of the CHRGET routine text. BASIC initialization copies this ROM text into page 0 (zero page) at address 115 decimal ($73). When wedge code modifies CHRGET, execution can jump to either ROM or RAM copy.

- $E3BA (59298) — Initial RND Seed Value
  - Five-byte floating-point constant stored in ROM and transferred at power-up to zero-page address 139 decimal ($8B). This is the default RND seed: without explicit seeding (negative or zero argument), RND will return the same sequence each power-up.

- $E3BF (58303) — INIT (Initialize BASIC)
  - Called by Cold Start to initialize BASIC zero-page locations to fixed values. Includes the copy of the CHRGET routine from ROM ($E3A2) to zero-page address 115 ($73).

- $E422 (58402) — Print BASIC Start-Up Messages
  - Prints the banner "**** COMMODORE 64 BASIC V2 ****", computes free memory, and prints the "BYTES FREE" message.

- $E447 (58439) — Table of Vectors to Important BASIC Routines
  - ROM table containing vectors (addresses) for key BASIC routines. These are intended to be relocated to RAM.

- $E453 (58451) — Copy BASIC Vectors to RAM
  - Subroutine invoked by Cold Start to copy the ROM vector table into RAM starting at $0300 (768 decimal).

- $E460 (58464) — WORDS
  - ROM area holding power-up/start-up message text (the messages printed by $E422 and related routines).

## Source Code

(omitted — original source contained descriptive offsets and summaries but no assembly listings or program text to include)

## Key Registers

(omitted — this chunk documents ROM routines and memory/vector locations, not hardware chip registers)

## References
- "chapter7_kernal_rom_intro_and_ram_underlying_kernal" — expanded context for power-up routines and RAM-under-Kernal behavior