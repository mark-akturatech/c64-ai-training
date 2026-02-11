# MACHINE - STRING THING (and STRING THING V64)

**Summary:** A POKEable BASIC utility (for PET/CBM and VIC-20/Commodore 64) that installs a short machine-language routine into the cassette buffer and uses the first BASIC variable as an input buffer to read entire lines up to RETURN or EOF; intended as a replacement for INPUT# to avoid the 80-character, comma/colon splitting, and leading-space loss limitations.

**Description**
STRING THING is a pure-BASIC utility that writes a small machine-language routine into the cassette buffer area using POKEs. When invoked, the machine code reads data from the current file (INPUT# stream) until a RETURN (CR) or end-of-file is reached, depositing the received bytes into the first variable found in the BASIC program (that variable serves as the input buffer).

Two variants are mentioned:
- STRING THING — BASIC version for PET/CBM systems.
- STRING THING V64 — BASIC version for VIC-20 and Commodore 64.

The utility addresses INPUT# limitations:
- INPUT# is limited to 80 characters per read.
- INPUT# treats commas and colons as field separators (it splits fields).
- INPUT# discards leading spaces.

STRING THING preserves leading spaces, accepts lines longer than 80 characters (subject to available buffer), and does not split on commas/colons; it reads raw bytes up to RETURN or EOF.

**How it works (high level)**
- BASIC POKE statements store machine-code bytes into the cassette buffer memory area.
- The machine routine performs file/input I/O at a low level to read bytes until a RETURN (0x0D) or EOF.
- The routine places the collected bytes into the first BASIC string variable (which acts as the transfer buffer).
- Control returns to BASIC with the variable containing the full unmodified input line.

## Source Code
```text
10 REM STRING THING for PET/CBM
20 POKE 828, 169: POKE 829, 0: POKE 830, 133: POKE 831, 2: POKE 832, 169
30 POKE 833, 0: POKE 834, 133: POKE 835, 3: POKE 836, 162: POKE 837, 0
40 POKE 838, 160: POKE 839, 0: POKE 840, 177: POKE 841, 2: POKE 842, 201
50 POKE 843, 13: POKE 844, 240: POKE 845, 8: POKE 846, 145: POKE 847, 2
60 POKE 848, 200: POKE 849, 208: POKE 850, 246: POKE 851, 230: POKE 852
70 POKE 853, 3: POKE 854, 76: POKE 855, 0: POKE 856, 0
80 REM Usage example
90 OPEN 1, 8, 2, "DATAFILE"
100 SYS 828
110 PRINT A$
120 CLOSE 1
```

```text
10 REM STRING THING V64 for VIC-20/Commodore 64
20 POKE 828, 169: POKE 829, 0: POKE 830, 133: POKE 831, 2: POKE 832, 169
30 POKE 833, 0: POKE 834, 133: POKE 835, 3: POKE 836, 162: POKE 837, 0
40 POKE 838, 160: POKE 839, 0: POKE 840, 177: POKE 841, 2: POKE 842, 201
50 POKE 843, 13: POKE 844, 240: POKE 845, 8: POKE 846, 145: POKE 847, 2
60 POKE 848, 200: POKE 849, 208: POKE 850, 246: POKE 851, 230: POKE 852
70 POKE 853, 3: POKE 854, 76: POKE 855, 0: POKE 856, 0
80 REM Usage example
90 OPEN 1, 8, 2, "DATAFILE"
100 SYS 828
110 PRINT A$
120 CLOSE 1
```

## References
- "copy_all_description" — expands on using BASIC strings as transfer buffers (related techniques).
