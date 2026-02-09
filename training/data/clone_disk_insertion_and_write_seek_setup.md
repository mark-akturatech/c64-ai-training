# Clone-disk switch and begin write phase (BASIC ~640–800)

**Summary:** BASIC fragment that prompts for the clone disk, reopens the 1541 drive (OPEN 15,8,15), initializes RW/RAM and POKE 252,34, then enters a SEEK loop (FOR T = SRW TO ERW) computing NS (sectors per track formula using track thresholds), sets JOB=176 and calls GOSUB 1190 (seek), checks for errors, updates RAM and W (write pointer), and jumps (GOTO 990) into the sector-write routine (not included).

**Program behavior and structure**
- Line 640: Conditional branch if C is zero, skipping the clone-disk write phase (likely returns to an earlier routine).
- Lines 650–660: Print screen header and a user prompt asking to insert the clone disk; then call a user-prompt subroutine (GOSUB 1110).
- Line 680: Reopens the drive with the standard serial channel KERNAL OPEN (OPEN 15,8,15).
- Line 690: Initializes RW (drive/sector index variable) to 0.
- Line 700: Sets RAM base pointer to 8704 (decimal) — this is the buffer/table base used during the write phase.
- Line 710: POKE 252,34 — writes value 34 to zero-page address 252 (decimal $FC).
- Lines 730–780: SEEK loop:
  - FOR T = SRW TO ERW — iterate tracks from SRW (start write track) to ERW (end write track).
  - NS = 20 + 2*(T>17) + (T>24) + (T>30) — compute NS (number of sectors to handle for this track); uses boolean arithmetic (TRUE=1, FALSE=0) with thresholds at tracks 17, 24, 30 (1541 track geometry).
  - JOB = 176 then GOSUB 1190 — set job code for the seek subroutine and call it.
  - Check E (error flag) after the seek and branch if an error occurred (GOTO 820).
  - RAM = RAM + (256*(NS+1)) — advance the RAM pointer by page-sized blocks per sector group.
  - W = W + (NS+1) — advance the overall write pointer by NS+1 sectors (or sector-groups).
- Line 800: GOTO 990 — jump to the write/sector-write routine which is not included in this chunk.

## Source Code
```basic
640 IF C=0 GOTO 1010
650 PRINT "  CLR 1541 BACKUP"
660 PRINT "  COPYING - INSERT CLONE IN DRIVE"
670 GOSUB 1110
680 OPEN 15,8,15
690 RW=0
700 RAM=8704
710 POKE 252,34
720 REM SEEK
730 FOR T=SRW TO ERW
740 NS=20+2*(T>17)+(T>24)+(T>30)
750 JOB=176
760 GOSUB 1190
770 IF E=1 GOTO 820
780 RAM=RAM+(256*(NS+1))
790 W=W+(NS+1)
800 GOTO 990
```

## Key Registers
- (none) — this chunk does not reference hardware I/O registers at $Dxxx/$DCxx/$DDxx/$D4xx etc.; it performs BASIC variable assignments and a POKE to zero-page address 252 decimal ($FC), which is not listed here as a hardware register.

## References
- "backup_overview_and_initialization" — expands on buffer and table initialization performed at program start
- "master_disk_seek_and_read_loops" — expands on the master READ phase and the parallel seek logic used before sector writes