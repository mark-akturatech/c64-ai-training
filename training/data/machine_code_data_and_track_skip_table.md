# *C000 Machine-code DATA block and Track-skip Table (BASIC DATA lines 1340–1535)

**Summary:** BASIC DATA statements containing machine-code bytes intended to be POKEd/SYSed into $C000 (drive/resident routine marker *C000) and a REM TRACK table of track numbers to skip/process (track-skip table values: 1,6,7,12,13,17,18,24,25,30,31,35).

**Description**
This chunk is a BASIC listing of DATA statements that encode a machine-language routine beginning at $C000 and a following DATA table used as a track-skip list (labelled REM TRACK). The DATA bytes form an assembled drive/resident routine; the final DATA line lists track numbers to be used by the routine (presumably to skip or process specific tracks). The listing as provided contains OCR/artifact errors that have been corrected in the normalized copy below.

Minimal usage (as implied by the source): read the DATA bytes and POKE them into memory starting at $C000 (decimal 49152) and then SYS to $C000 to run the resident routine. The REM TRACK DATA table contains the track numbers referenced by the routine.

## Source Code
Original OCR source (verbatim):
```basic
1340  DATA  77,  45,  82,  O,  4,255,128,  77 
1350  DATA  45,  87,  O,  4,  32,169,  0,133 
1360  DATA251, 141,  3,192,  32,  34,192,169 
1370  DATA128, 133,251, 141,  3,192,  32,  34 
1380  DATA 192,  96,162,  15,  32,201,255,162 
1390  DATA  0,189,  0,192,  32,210,255,232 
1400  DAT A224,  7,208,245,  32,204,255,162 
1410  DATA  15,  32,198,255,160,  O,  32,207 
1 420  DATA255 ,145,251, 200 , 1 92 , 1 29 , 208 , 246 
1430  DATA  32,204,255,  96,169,  0,141,  10 
1440  DATA 192,240,  11,173,  10,192,  24,105 
1450  DATA  32,141,  10,192,240,  47,162,  15 
1460  DATA  32,201,255,162,  0,189,  7,192 
1470  DATA  32,210,255,232,224,  6,208,245 
1480  DATA 173,  10,192,133,251,160,  0,177 
1490  DATA251,  32,210,255,200,192,  32,208 
1500  DATA246, 169,  13,  32,210,255,  32,204 
1510  DATA255, 169,  0,240,198,  96,234,234 
1520  REM  TRACK 

1530  DATA1,6, 7, 12, 13, 17, 18,24,25,30,31,3 
5 
```

Normalized / corrected DATA listing (suitable for READ/POKE into $C000):
```basic
1340 DATA 77,45,82,0,4,255,128,77
1350 DATA 45,87,0,4,32,169,0,133
1360 DATA 251,141,3,192,32,34,192,169
1370 DATA 128,133,251,141,3,192,32,34
1380 DATA 192,96,162,15,32,201,255,162
1390 DATA 0,189,0,192,32,210,255,232
1400 DATA 224,7,208,245,32,204,255,162
1410 DATA 15,32,198,255,160,0,32,207
1420 DATA 255,145,251,200,192,129,208,246
1430 DATA 32,204,255,96,169,0,141,10
1440 DATA 192,240,11,173,10,192,24,105
1450 DATA 32,141,10,192,240,47,162,15
1460 DATA 32,201,255,162,0,189,7,192
1470 DATA 32,210,255,232,224,6,208,245
1480 DATA 173,10,192,133,251,160,0,177
1490 DATA 251,32,210,255,200,192,32,208
1500 DATA 246,169,13,32,210,255,32,204
1510 DATA 255,169,0,240,198,96,234,234
1520 REM TRACK
1530 DATA 1,6,7,12,13,17,18,24,25,30,31,35
```

Notes:
- The normalized listing corrects OCR artifacts (letters mistaken for digits, split numbers, mis-spaced line numbers) while preserving the original byte sequence as intended by the BASIC DATA block.
- These are decimal byte values; to place them at $C000 use BASIC READ/POKE sequence or an equivalent loader. (The source implies POKEd/SYSed into $C000.)

## References
- "format_two_digit_str_and_c000_marker" — expands on the *C000 machine-code marker referenced by the BASIC listing
- "assembly_header_and_system_constants" — expands on the assembly source listing that corresponds to these DATA bytes
