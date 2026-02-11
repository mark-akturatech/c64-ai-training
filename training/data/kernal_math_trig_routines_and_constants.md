# KERNAL Floating‑Point Trig Routines (COS, SIN, TAN, ATN) and Constant Tables

**Summary:** KERNAL ROM routines at $E264 (COS), $E268 (SIN), $E2B4 (TAN), $E30E (ATN) implement trig and inverse‑trig on the 5‑byte floating point FAC1 (angles in radians); constant tables for PI/2, 2*PI, 1/4, SIN/TAN evaluation, and ATN constants live in the ROM range $E2E0–$E33E.

## Description
- COS ($E264): Implements cosine by adding the constant PI/2 (five‑byte float at $E2E0) to FAC1, then falling through to the SIN routine. (Result left in FAC1.)
- SIN ($E268): Evaluates sine of the value in FAC1 (angle in radians) and leaves the result in FAC1. Uses the SIN/TAN evaluation constants table for series/table evaluation.
- TAN ($E2B4): Computes tangent by dividing SIN(angle) by COS(angle); expects angle in FAC1 and leaves TAN(angle) in FAC1.
- ATN ($E30E): Computes arctangent (inverse tangent) of FAC1 using ATNCON constants (table at $E33E) and series/table evaluation.
- Constant tables (range $E2E0–$E30D): contain five‑byte floating point representations for PI/2 (PI2), 2*PI (TWOPI), 1/4 (FR4), and a SIN/TAN constants table (SINCON). SINCON begins with a counter byte of 5 (indicating six entries follow) and is followed by six five‑byte floating point constants used for SIN/COS/TAN evaluation.
- ATNCON ($E33E): Table of constants for ATN (inverse tangent) evaluation; used by ATN routine at $E30E.
- Notes on BASIC interaction: Loading a machine language routine or data file with a non‑relocating LOAD (for example LOAD"FILE",8,1) while a BASIC program is running will resume execution at the BASIC program's current line after the LOAD — common technique is to set and check a flag so the program doesn't continually re‑LOAD. See Source Code for an example BASIC snippet.

## Source Code
```basic
10 IF FLAG=1 THEN GOTO 30
20 FLAG=1:LOAD"FILE",8,1
30 REM PROGRAM CONTINUES HERE
```

```text
Address map / routine list (reference):
$E1BE  (57790)   OPEN    - Perform OPEN (BASIC OPEN calls KERNAL OPEN)
$E1C7  (57799)   CLOSE   - Perform CLOSE (BASIC CLOSE calls KERNAL CLOSE)
$E1D4  (57812)   Set Parameters for LOAD/VERIFY/SAVE - Set filename, logical file, device, secondary address
$E200  (57856)   Skip Comma and Get Integer in .X
$E206  (57862)   Fetch Current Character and Check for End of Line (returns if EOL)
$E20E  (57870)   Check for Comma
$E219  (57881)   Set Parameters for OPEN and CLOSE
$E264  (57956)   COS     - Add PI/2 to FAC1 then fall through to SIN
$E268  (57960)   SIN     - Evaluate SIN(FAC1) (radians), result in FAC1
$E2B4  (58036)   TAN     - Evaluate TAN(FAC1) = SIN/COS
Table Range for SIN/COS/TAN constants:
$E2E0  (58080)   PI2     - Five-byte FP for PI/2
$E2E5  (58085)   TWOPI   - Five-byte FP for 2*PI
$E2EA  (58090)   FR4     - Five-byte FP for 1/4
$E2EF  (58095)   SINCON  - Table: counter byte = 5 (=> six entries), followed by six 5‑byte FP constants
$E30E  (58126)   ATN     - ATN routine (inverse tangent)
$E33E  (58174)   ATNCON  - Table of constants for ATN
```

## Key Registers
- $E1BE - KERNAL ROM - OPEN (BASIC OPEN entry point)
- $E1C7 - KERNAL ROM - CLOSE (BASIC CLOSE entry point)
- $E1D4 - KERNAL ROM - Set parameters for LOAD/VERIFY/SAVE
- $E200 - KERNAL ROM - Skip comma and get integer in .X
- $E206 - KERNAL ROM - Fetch current character and check for EOL
- $E20E - KERNAL ROM - Check for comma
- $E219 - KERNAL ROM - Set parameters for OPEN/CLOSE
- $E264 - KERNAL ROM - COS routine (adds PI/2, falls through to SIN)
- $E268 - KERNAL ROM - SIN routine (evaluates SIN on FAC1)
- $E2B4 - KERNAL ROM - TAN routine (evaluates TAN via SIN/COS)
- $E2E0-$E30D - KERNAL ROM - Table area: PI2, TWOPI, FR4, SINCON (SIN/TAN constants)
- $E30E - KERNAL ROM - ATN routine (arctangent)
- $E33E - KERNAL ROM - ATNCON (ATN constants table)

## References
- "kernal_polynomial_routines_and_rnd_constants" — expands on POLY routines used for series evaluation and related constant tables

## Labels
- COS
- SIN
- TAN
- ATN
- PI2
- TWOPI
- SINCON
- ATNCON
