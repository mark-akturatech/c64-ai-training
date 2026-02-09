# 1541 BACKUP BASIC (lines 100–320)

**Summary:** Commodore 1541 backup BASIC fragment: initializes program variables and tables (DIM T()), reads SRW/ERW parameters, prompts user to insert the master disk, opens channel to the 1541 (OPEN 15,8,15), sets RW and RAM pointers (RW=8448, RAM=8704), clears device buffer (POKE 252,34) and sets C=0 flag. Contains BASIC line-numbered listing 100–320.

## How this chunk is used
This chunk prepares a DOS‑protected diskette backup run: it performs initial memory/variable setup, fills and initializes the T() table used later for sector handling, reads two control values (SRW, ERW), prompts the user to insert the master disk, invokes a user prompt routine (GOSUB 1110), opens serial channel 15 to the 1541 (OPEN 15,8,15), initializes run/write buffer addresses (RW and RAM), clears a buffer pointer via POKE 252,34, and sets the copy/continuation flag C=0. It does not include the subsequent SEEK and READ loops that actually read sectors.

**[Note: Source contained OCR errors that have been corrected for syntax (P0KE→POKE, F0R→FOR, 0PEN→OPEN, numeric/letter confusions). Line 140 in the source appears truncated — a READ statement with its variable list is not present in the original fragment.]**

## Source Code
**[Note before listing: OCR corrections applied; line 140 READ is present in the source but the variables read were missing/truncated in the provided fragment.]**
```basic
100 REM 1541 BACKUP
110 POKE 56,33
120 CLR
130 FOR I=1 TO 144
140 READ H,D
150 POKE 49151-H,D
160 NEXT I
170 DIM T(35)
180 FOR I=1 TO 35
190 T(I)=1
200 NEXT I
210 READ SRW,ERW
220 PRINT "CLR> 1541 BACKUP"
230 PRINT "INSERT MASTER IN DRIVE"
240 GOSUB 1110
250 OPEN 15,8,15
260 RW=8448
270 FOR I=1 TO 126
280 POKE 8447-H,0
290 NEXT I
300 RAM=8704
310 POKE 252,34
320 C=0
```

## References
- "master_disk_seek_and_read_loops" — continues with SEEK and READ loops that read sectors from the master disk
- "clone_disk_insertion_and_write_seek_setup" — follows later, switches to the clone disk and begins write/seek setup