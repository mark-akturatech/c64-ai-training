# BASIC Output: PRINT and OPEN for Screen, Printer, Disk, Tape, Modem

**Summary:** Covers BASIC output to screen (PRINT) and external devices (OPEN / PRINT#), device numbers ($1 cassette, $2 modem, $3 screen, $4/$5 printer, $8-$11 disk), control codes (RETURN = CHR$(13)), and differences between SPC and TAB when printing. References VIC-II (colors/screen) and sound chapters.

**Screen output and control codes**
PRINT in BASIC sends text to the screen and uses BASIC control functions and control-character codes to affect cursor position and screen formatting. The source explicitly notes the character code for RETURN is CHR$(13). BASIC control functions mentioned: TAB (tabulate to column) and SPC (space), which affect cursor/screen layout; control codes (CHR$ values) affect cursor and screen formatting.

The text refers readers to the VIC-II (VIC) and graphics chapter for color and low-level screen manipulation, and to the sound chapter for audio — those details are covered elsewhere.

**Output to other devices (OPEN and PRINT#)**
To send output to devices other than the screen (cassette, printer, disk drive, modem, etc.), BASIC opens a device channel with OPEN and then sends characters with PRINT#. The OPEN statement format used is:

OPEN file#, device#, number, string

The meaning of the parameters varies by device (device number and the "number" argument select modes such as input/output/command channel). Once OPENed, use PRINT# file#, "text" to send text to the device.

Notes on behavior:
- SPC works on the printer the same way it does on the screen (inserts spaces).
- TAB does not work correctly on the printer because TAB calculates the current position based on the cursor's position on the screen, not the paper; therefore TAB targets screen columns rather than printed-paper columns.
- The OPEN statement for the printer also selects which character set will be used (upper-case-with-graphics or upper- and lower-case).

**Examples of OPEN statement for printer:**
- `OPEN 1,4,0` opens the printer in upper-case-with-graphics mode.
- `OPEN 1,4,7` opens the printer in upper-and-lower-case mode.

## Source Code
```basic
100 OPEN 4,4: PRINT# 4, "WRITING ON PRINTER"
110 OPEN 3,8,3,"0:DISK-FILE,S,W":PRINT#3,"SEND TO DISK"
120 OPEN 1,1,1,"TAPE-FILE": PRINT#1,"WRITE ON TAPE"
130 OPEN 2,2,0,CHR$(10):PRINT#2,"SEND TO MODEM"
```

```text
FORMAT: OPEN file#, device#, number, string

+--------+---------+---------------------+------------------------------+
| DEVICE | DEVICE# |       NUMBER        |            STRING            |
+--------+---------+---------------------+------------------------------+
| CASSETTE | 1    | 0 = Input           | File Name                    |
|         |       | 1 = Output          |                              |
|         |       | 2 = Output with EOT |                              |
| MODEM   | 2     | 0                   | Control Registers            |
| SCREEN  | 3     | 0,1                 |                              |
| PRINTER | 4 or 5| 0 = Upper/Graphics  | Text Is PRINTED              |
|         |       | 7 = Upper/Lower Case|                              |
| DISK    | 8 to 11| 2-14 = Data Channel | Drive #, File Name           |
|         |       |                     | File Type, Read/Write        |
|         |       | 15 = Command        | Command                      |
|         |       |      Channel        |                              |
+--------+---------+---------------------+------------------------------+
```

## References
- "vic_registers_overview" — expands on VIC chip controls (colors and screen modes)