# Next track/sector prompt (BASIC)

**Summary:** C64 BASIC snippet that displays suggested next track/sector using nb(1)/nb(2), prompts the user with GET z$ for a single-character response, accepts only 'y' or 'n' (lowercase) and branches to continue loading (GOTO 330) or return to top-of-input (GOTO 320).

## Operation
Prints the suggested "next track and sector" using nb(1) and nb(2), then asks the user whether to use that suggestion. It polls the keyboard with GET z$ in a tight loop until a non-empty character is read. Accepted responses:
- z$ = "y" — loads t and s from nb(1) and nb(2) then jumps to the input/load sequence at line 330.
- z$ = "n" — returns to the top-of-input routine at line 320.
- any other character — ignored; the loop continues waiting for a valid response.

Notes:
- The code compares exact strings "y" and "n" (lowercase); uppercase responses are not handled by this snippet.
- nb(1)/nb(2) are used as the suggested next track/sector values (see referenced chunks for how nb() is produced).

## Source Code
```basic
571 rem******************************
572 rem* next track and sector      *
573 rem******************************
575 print "next track and sector" nb(1) nb(2) "{down}"
580 print "do you want next track and sector"
590 get z$:if z$="" then 590
600 if z$="y" then t=nb(1):s=nb(2):goto 330
610 if z$="n" then 320
620 goto 590
```

## References
- "read_and_crt_display" — expands on how nb(1)/nb(2) are produced to suggest the next block
- "printer_display_loop_reading_disk_buffer" — expands on how nb(1)/nb(2) are produced to suggest the next block
- "load_track_sector_into_disk_buffer" — shows reuse of the track/sector input flow when the user opts to continue