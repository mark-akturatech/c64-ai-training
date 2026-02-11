# Program header and initial buffer/variable setup for "CERTIFY A DISKETTE" (1541)

**Summary:** Cleaned and corrected BASIC header and initialization for the "CERTIFY A DISKETTE" routine on the 1541: declares a REM title, builds two repeated-character strings with CHR$ (NULL/CHR$(0) and CHR$(15)) in a 32-iteration loop, and DIMs two large string buffers (681). Searchable terms: BASIC, 1541, CHR$, NULL$, WRITE$, FOR...NEXT, DIM, buffer initialization.

**Program header and variable initialization**

This chunk contains the program title REM and a small loop that constructs two repeated-character strings used later as buffers or fill-strings by the certifier. The original source suffered OCR/garbling; the corrected BASIC lines are shown below.

- **Line 100**: REM comment/title identifying the routine and target drive (1541).
- **Lines 110–140**: FOR...NEXT loop (I = 1 TO 32) that appends CHR$(0) to a NULL$ string and CHR$(15) to a WRITE$ string on each iteration. After the loop:
  - NULL$ contains 32 NUL bytes (CHR$(0)).
  - WRITE$ contains 32 copies of CHR$(15), which is the PETSCII code for the control character used to switch to the lowercase/uppercase character set. ([dansanderson.com](https://dansanderson.com/mega65/petscii-codes/?utm_source=openai))
- **Line 150**: DIMs two large string buffers, T$(681) and S$(681), each capable of holding strings up to 681 characters in length. In Commodore BASIC, the DIM statement is used to define the maximum length of a string variable. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_1/page_009.html?utm_source=openai))

No hardware registers are involved in this chunk (pure BASIC string/array setup).

## Source Code

```basic
100 REM CERTIFY A DISKETTE - 1541

110 FOR I = 1 TO 32
120 NULL$ = NULL$ + CHR$(0)
130 WRITE$ = WRITE$ + CHR$(15)
140 NEXT I

150 DIM T$(681), S$(681)
```

Original (garbled) input lines (kept for reference):

```text
100  REM  CERTIFY  A  DISKETTE  -  1541 

no  F0RI  =  1T032 

120  NULL*=NULL«+CHR« (O) 

1 30  WR I TE*=WR I TE*+CHR* (15) 

140  NEXTI 

150  DIMT-/.  (681)  ,S7.  (681) 
```

## References

- "user_prompts_and_drive_check" — expands on user prompts and drive status checking used by the certifier
- "buffer_init_certify_loop_and_restore_bam" — expands on uses of these buffers and variables for writing and certification
