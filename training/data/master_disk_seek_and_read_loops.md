# SEEK and READ phase (BASIC lines ~330–630) — master disk read loop, sector counting, buffer pointers, drive calls

**Summary:** This Commodore 64 BASIC routine (lines ~330–630) orchestrates the process of reading data from a disk by iterating over specified tracks and sectors, managing buffer pointers, and interfacing with the disk drive.

**Description**

The routine performs the following operations:

- **Track Iteration:** Loops from `SRW` (Start Read Window) to `ERW` (End Read Window) to process each track within the specified range.

- **Sector Calculation:** Determines the number of sectors (`NS`) per track using the formula:


  This formula aligns with the 1541 disk drive's sector distribution:

  - Tracks 1–17: 21 sectors
  - Tracks 18–24: 19 sectors
  - Tracks 25–30: 18 sectors
  - Tracks 31–35: 17 sectors

  The formula calculates `NS` such that `NS + 1` equals the number of sectors for the current track.

- **Track Skipping:** Checks if the current track should be skipped using the `T()` array:


  If `T(T)` is zero, the track is skipped, and the program jumps to line 410.

- **Drive Seek:** Sets the `JOB` variable to 176 and calls subroutine at line 1190 to position the drive head:


  The subroutine at line 1190 handles the drive seek operation.

- **Error Handling:** Checks the error code `E` returned from the seek operation:


  If `E` equals 1, the program proceeds to line 470 to handle the error.

- **Buffer Management:** Adjusts buffer pointers and counters:


  - `RW` is decremented by the number of sectors plus one.
  - `RAM` is incremented to point to the next buffer location.
  - The high byte of `RAM` is stored in memory location 252.
  - `R` is incremented to keep track of the total sectors processed.

- **Sector Reading:** Loops through each sector on the current track:


  - Calls subroutine at line 1300 to read the sector.
  - Prints the current track and sector number.
  - Sets `JOB` to 128 and calls subroutine at line 1190 again.
  - Checks the error code `E` and handles errors accordingly.
  - Calls machine language routine at address 49165.
  - Sets flag `C` to 1.
  - Marks the buffer as valid by poking 1 into `RW`.
  - Increments `RW` and `RAM` to point to the next buffer location.
  - Updates the high byte of `RAM` in memory location 252.

- **Completion:** After processing all sectors on all tracks, the program closes the disk channel:


## Source Code

  ```basic
  NS = 20 + 2 * (T > 17) + (T > 24) + (T > 30)
  ```

  ```basic
  IF T(T) = 0 GOTO 410
  ```

  ```basic
  JOB = 176
  GOSUB 1190
  ```

  ```basic
  IF E = 1 GOTO 470
  ```

  ```basic
  RW = RW - (NS + 1)
  RAM = RAM + (256 * (NS + 1))
  POKE 252, (RAM / 256)
  R = R + (NS + 1)
  ```

  ```basic
  FOR S = 0 TO NS
    GOSUB 1300
    PRINT "TRACK "; T; " - SECTOR "; S
    JOB = 128
    GOSUB 1190
    IF E = 1 GOTO 550
    R = R + 1
    IF E <> 4 AND E <> 5 GOTO 540
    SYS 49165
    C = 1
    POKE RW, 1
    RW = RW + 1
    RAM = RAM + 256
    POKE 252, (RAM / 256)
  NEXT S
  ```

  ```basic
  CLOSE 15
  ```


```basic
330 REM SEEK

340 FOR T = SRW TO ERW

350 NS = 20 + 2 * (T > 17) + (T > 24) + (T > 30)

360 IF T(T) = 0 GOTO 410

370 JOB = 176

380 GOSUB 1190

390 IF E = 1 GOTO 470

400 T(T) = 0

410 RW = RW - (NS + 1)

420 RAM = RAM + (256 * (NS + 1))

430 POKE 252, (RAM / 256)

440 R = R + (NS + 1)

450 GOTO 620

460 REM READ

470 FOR S = 0 TO NS

480 GOSUB 1300

490 PRINT "TRACK "; T; " - SECTOR "; S

500 JOB = 128

510 GOSUB 1190

520 IF E = 1 GOTO 550

530 R = R + 1

540 IF E <> 4 AND E <> 5 GOTO 540

550 SYS 49165

560 C = 1

570 POKE RW, 1

580 RW = RW + 1

590 RAM = RAM + 256

600 POKE 252, (RAM / 256)

610 NEXT S

620 NEXT T

630 CLOSE 15
```

## Key Registers

- **SRW, ERW:** Define the range of tracks to be processed.
- **T():** Array indicating which tracks to process or skip.
- **NS:** Number of sectors per track, calculated for each track.
- **RW:** Buffer index or write pointer, adjusted per sector.
- **RAM:** Memory address pointer for the buffer, incremented by 256 per sector.
- **R:** Counter for the total number of sectors processed.
- **E:** Error code returned from subroutine calls, used for error handling.
- **JOB:** Command byte set before calling subroutine at line 1190, with values 176 and 128 observed.
- **C:** Flag set to 1 after a successful read operation.

## References

- "backup_overview_and_initialization" — details earlier initialization steps, including drive opening, buffer setup, and the `T()` table.
- "clone_disk_insertion_and_write_seek_setup" — discusses the process of inserting the clone disk and setting up for writing after closing the master disk.