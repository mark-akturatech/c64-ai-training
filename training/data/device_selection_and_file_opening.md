# Select output device and open I/O channels

**Summary:** BASIC fragment that sets a default drive variable (d$="0"), prompts the user to choose output device via GET (jj$), confirms screen or printer choice, and opens I/O channels with OPEN statements (OPEN 15,8,15,"i"+d$:GOSUB 650; OPEN 4,4; OPEN 2,8,2,"#":GOSUB 650). Calls GOSUB 650 for error handling.

## Purpose and behavior
This BASIC snippet performs initial selection of the program's output device and opens the required I/O channels:

- Line 251 initializes the drive string to "0" (d$="0").
- Lines 253–256 display a prompt asking the user to choose screen (s) or printer (p), using embedded display control codes (reverse on/off, cursor movement like {down}{left}). The exact control-code strings are defined elsewhere (see referenced chunk).
- Line 254 uses GET to read a single character into jj$ and loops until a key is pressed (GET returns empty if no key yet).
- Lines 255–256 print a confirmation line depending on whether the user pressed "s" or "p".
- Line 260 issues OPEN 15,8,15,"i"+d$:GOSUB 650 — opens the command/utility channel (logical channel 15) to device 8 (disk drive) with the string "i"+d$; GOSUB 650 is called to handle any error returned by the OPEN.
- Line 265 opens logical channel 4 to device/secondary 4 (OPEN 4,4) — commonly used for other I/O on this program.
- Line 270 opens logical channel 2 to device 8, secondary 2, with name "#" (OPEN 2,8,2,"#"), then calls GOSUB 650 again for error handling.

Notes:
- OPEN 15,8,15 is the standard PET/CBM-style command channel open to the disk drive (device 8); the fragment constructs the device string with "i"+d$ (using d$ = "0" by default).
- GOSUB 650 is the program's error routine (see referenced subroutine chunk) and will handle OPEN failures or drive errors.

## Source Code
```basic
 251 d$="0"
 253 print "        {reverse on}s{reverse off}creen{down}{left*8}";\
     "or {down}{left}{reverse on}p{reverse off}rinter"
 254 get jj$:if jj$="" then 254
 255 if jj$="s" then print "        {down}{reverse on}screen";\
     "{reverse off}"
 256 if jj$="p" then print "        {down}{reverse on}printer";\
     "{reverse off}"
 260 open 15,8,15,"i"+d$:gosub 650
 265 open 4,4
 270 open 2,8,2,"#":gosub 650
```

## References
- "display_ts_overview_and_constants" — expands on string constants used for prompts and output  
- "load_track_sector_into_disk_buffer" — expands on subsequent disk commands that use opened channels  
- "subroutines_header_and_error_routine" — expands on error handling (GOSUB 650)
