# BASIC: prompt and read track/sector into drive buffer (PRINT#15 "U1")

**Summary:** This BASIC program prompts the user for a track and sector number, validates the input, optionally echoes the values to the screen or printer, and sends a CBM DOS command via channel 15 to position the drive and read the specified sector into the drive buffer. It includes error checking and reads the first byte from the disk buffer after loading the sector.

**Operation:**
- **Initialization:**
  - Opens channels:
    - Channel 15: Command channel to the disk drive.
    - Channel 2: Data channel for reading from the disk.
    - Channel 4: Printer output channel.
  - Sets `d$` to the device number of the disk drive (default is "8").
  - Sets `jj$` to control echoing:
    - "s" to echo to the screen.
    - "p" to echo to the printer.
    - Any other value to suppress echoing.
- **User Input:**
  - Prompts for track (`t`) and sector (`s`) numbers.
- **Validation:**
  - Checks if the track number is within the valid range (1 to 35). If not, it:
    - Sends an initialize command to the disk drive.
    - Closes all opened channels.
    - Prints "end" and stops the program.
- **Echoing:**
  - If `jj$` is "s", prints the track and sector numbers to the screen.
  - If `jj$` is "p", prints the track and sector numbers to the printer.
- **Disk Operation:**
  - Sends the "U1" command to the disk drive to position the head and read the specified track and sector into the drive buffer.
  - Calls the error-checking subroutine at line 650.
  - Reads the first byte from the disk buffer.

## Source Code
```basic
10 rem******************************
20 rem* initialize channels and    *
30 rem* variables                  *
40 rem******************************
50 open 15,8,15
60 open 2,8,2
70 open 4,4
80 d$="8"
90 jj$="s" : rem set to "s" for screen echo, "p" for printer echo, or any other value for no echo
100 rem******************************
110 rem* load track and sector      *
120 rem* into disk buffer           *
130 rem******************************
140 input "{down}{right*2}track, sector";t,s
150 if t<1 or t>35 then print#15,"I" d$:close 2:close 4:close 15:print "end":end
160 if jj$="s" then print "{down}{right*2}track" t " sector" s "{down}"
170 if jj$="p" then print#4:print#4,"track" t " sector" s:print#4
180 print#15,"U1:2," d$;t;s:gosub 650
190 rem******************************
200 rem* read first byte from       *
210 rem* disk buffer                *
220 rem******************************
230 get#2,a$:print "First byte: ";asc(a$)
240 rem******************************
250 rem* error-checking subroutine  *
260 rem******************************
650 input#15,en,em$,et,es
660 if en<>0 then print "Disk error: ";en;" ";em$;" at track ";et;" sector ";es
670 return
```

## References
- "device_selection_and_file_opening" — required channel opens and device selection for PRINT#15 usage
- "read_byte0_and_m_r_commands" — reading the drive buffer starting at byte 0 after U1 read
- "next_track_sector_prompt_and_loop" — iterating to next sector using nb() results