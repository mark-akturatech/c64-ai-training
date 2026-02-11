# Read first byte of drive buffer (BASIC, GET#15, b-p, m-r)

**Summary:** BASIC sequence that positions the 1541 drive file pointer with "b-p:2,1", issues a memory-read "m-r" with CHR$(0)CHR$(5), then GET#15 to read a$(0) (byte 0) from the drive; blank reads are replaced with nl$ and flow branches to screen/printer routines based on jj$.

## Description
- Purpose: read byte 0 from the drive buffer (disk drive memory) into the program string variable a$(0) and branch to the appropriate display routine.
- Steps performed:
  1. Send the positioning command "b-p:2,1" to the drive on channel 15 to set the file pointer (prepare the drive buffer).
  2. Send the memory-read command "m-r" followed by two characters CHR$(0)CHR$(5) to initiate a memory read from the drive (the two characters are sent as raw bytes).
  3. Use GET#15,a$(0) to read the first byte returned by the drive into a$(0).
  4. If the read produced an empty string (a$(0)=""), substitute nl$ (a newline/string placeholder).
  5. Branch: if jj$="s" the code proceeds to the screen display handler (branch target 431); if jj$="p" it jumps to the printer display loop (branch target 460).
- Notes:
  - Commands are sent to the drive over channel 15 (standard serial channel to 1541-style drives).
  - The code treats a blank read specially by replacing it with nl$ before continuing.
  - Branch targets (431 and 460) are entry points for routines elsewhere: 431 is the screen-mode reader, 460 is the printer-mode reader.

## Source Code
```basic
 360 rem******************************
 370 rem* read byte 0 of disk buffer *
 390 rem******************************
 400 print#15,"b-p:2,1"
 410 print#15,"m-r"chr$(0)chr$(5)
 420 get#15,a$(0):if a$(0)="" then a$(0)=nl$
 428 if jj$="s" then 430
 430 if jj$="p"then 460
 431 rem******************************
```

## References
- "load_track_sector_into_disk_buffer" — expands on loading track/sector into the drive buffer (must be called before this sequence)
- "read_and_crt_display" — expands on the screen-mode reader (branch target 431)
- "printer_display_loop_reading_disk_buffer" — expands on the printer-mode reader (branch target 460)