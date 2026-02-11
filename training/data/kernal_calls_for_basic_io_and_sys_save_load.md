# Kernal routines used by BASIC (SYS / SAVE / VERIFY / LOAD) and RND(0) issues

**Summary:** Describes BASIC-callable Kernal entry points at $E0F9, $E12A, $E156, $E165, $E168 and their effects on BASIC memory/variables; also documents RND(0) deficiencies tied to CIA #1 Time-of-Day (TOD) registers ($DC08-$DC0B) and Timer A high ($DC05).

**RND(0) deficiencies (C64)**
- The floating-point RND(0) implementation on the C64 is unreliable for producing a sequence of random numbers by repeated RND(0) calls.
- Cause 1: CIA #1 Time-of-Day clock (TOD) at $DC08-$DC0B does not start automatically — it remains zero until the tenth-of-second register is written. The Operating System does not start this clock, so the two TOD registers used by RND(0) are typically zero.
- Cause 2: TOD registers use BCD encoding, not full binary 0–255 range, so they do not produce a uniform 0–255 byte distribution.
- Cause 3: CIA Timer A high register (used in the final floating point value) only ranges up to 66, further constraining the numeric range so certain values are never produced.
- Result: RND(0) by itself cannot be relied on to produce a full-range sequence of pseudorandom values.

**Kernal entry points called by BASIC**
- $E0F9 (57593) — Call Kernal I/O Routines
  - Used by BASIC to invoke Kernal CHROUT, CHRIN, CHKOUT, CHKIN and GETIN.
  - Handles errors returned from the call.
  - Allocates a 512-byte buffer at the top of BASIC when needed.
  - If the RS-232 device is opened, executes a CLR to clear memory as required.
- $E12A (57642) — SYS
  - Prepares for a machine-language call (SYS).
  - Before JSR to the target address, loads .A, .X, .Y, .P from storage at 780–783 ($030C–$030F).
  - After RTS returns, stores .A, .X, .Y, .P back to 780–783 ($030C–$030F).
  - (Effect: preserves CPU state across ML calls requested by BASIC.)
- $E156 (57686) — SAVE
  - Sets the save range to start/end of BASIC program text using pointers at 43 ($002B) and 45 ($002D).
  - Calls the Kernal SAVE routine.
  - Implication: any memory range can be saved by adjusting those two pointers and then restoring them.
- $E165 (57701) — VERIFY
  - Sets the load/verify flag at 10 ($000A).
  - Falls through into the LOAD routine (no separate Kernal call).
- $E168 (57704) — LOAD
  - Sets the load address to BASIC start (pointer at 43 / $002B) and calls Kernal LOAD.
  - On successful load:
    - Relinks BASIC so internal link pointers match the new load address.
    - Resets the end-of-BASIC pointer to the new end of program text.
  - Behavior notes:
    - If LOAD occurs while a program is running, BASIC pointers are reset so the program will start executing from the beginning (i.e., the program will re-run).
    - A CLR is not performed, so variables existing before the LOAD remain in memory and retain their values.
    - The pointer to the variable area is not modified; if the newly loaded program is longer than the previous program, the variable table can be partially overwritten (data corruption risk).
    - To prevent automatic re-running after a non-relocating LOAD, a common practice is to include a flag variable in the program to track whether the LOAD has occurred. For example:


      In this pattern, the variable `A` is checked to determine if the LOAD has already been performed. If `A` is 0, the program sets `A` to 1 and performs the LOAD. Upon re-running after the LOAD, `A` is 1, so the LOAD is skipped, and execution continues. ([retrocomputing.stackexchange.com](https://retrocomputing.stackexchange.com/questions/4845/why-does-this-basic-program-keep-restarting?utm_source=openai))

## Source Code

      ```basic
      10 IF A=0 THEN A=1:LOAD "PROGRAM",8,1
      20 REM Continue execution after LOAD
      ```


## Key Registers
- $DC08-$DC0B - CIA #1 - Time-of-Day (TOD) registers (tenth-sec, sec, min, hours) — used by RND(0)
- $DC05 - CIA #1 - Timer A high (Timer A low at $DC04) — mentioned as limited to 0–66 output range
- $000A - Zero page - Load/verify flag (set by VERIFY)
- $002B - Zero page - Pointer: start of BASIC program text (used by SAVE/LOAD)
- $002D - Zero page - Pointer: end of BASIC program text (used by SAVE)
- $030C-$030F - Zero page (780–783) - Storage area for .A/.X/.Y/.P saved/restored by SYS
- $E0F9 - ROM (Kernal) - BASIC → Kernal I/O entry
- $E12A - ROM (Kernal) - SYS entry (save/restore registers around ML calls)
- $E156 - ROM (Kernal) - SAVE entry (sets save range, calls Kernal SAVE)
- $E165 - ROM (Kernal) - VERIFY entry (sets verify flag, falls through to LOAD)
- $E168 - ROM (Kernal) - LOAD entry (sets load address, calls Kernal LOAD, relinks BASIC)

## References
- "kernal_chrin_chrout_and_file_routines" — expands on higher-level CHRIN/CHROUT/OPEN/CLOSE routines used by BASIC

## Labels
- SYS
- SAVE
- VERIFY
- LOAD
