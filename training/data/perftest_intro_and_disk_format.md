# PERFORMANCE TEST — program header and startup (BASIC)

**Summary:** C64/VIC-20 BASIC startup fragment (tok64 tokenized header) that opens device channels (OPEN 1,8,15), initializes variables (lt, lt$, nt, ti$, tt), prompts the user with PETSCII-format text, waits for RETURN, issues the disk-new command via the serial channel (PRINT#1 "n0:test disk,00"), constructs message strings (c1$, c2$, cc$), and calls the I/O response handler (GOSUB 1840) with early-failure branching to GOSUB 1880.

**Startup sequence and disk-new command**

This chunk is the initial portion of a PERFORMANCE TEST BASIC program (tokenized with tok64). It targets VIC-20 and Commodore 64 systems using a single floppy drive and performs the following actions in order:

- Program header and target notes appear (tokenized start invocation: "start tok64 perftest.prg").
- Device channel setup: `OPEN 1,8,15` and `OPEN 15,8,15` to open the disk drive (device 8) and secondary channel 15 for command/response.
- Variable initialization:
  - `lt = 35` and `lt$ = STR$(lt)`
  - `nt = 30`
  - `ti$` initialized to "000000"
  - `tt = 18`
  (Variables are prepared for timing/response testing; meanings are left as in-source.)
- Screen and user prompts use PETSCII-style tokens embedded in strings (examples: "{clear}", "{down}", "{reverse on}", "{reverse off}", and sequences like "{175*22}", "{183*22}").
- A wait-for-key loop:
  - A short pause (`FOR i=0 TO 50: GET a$: NEXT`)
  - Then `GET a$: IF a$<>CHR$(13) THEN 1210` loops until the user presses RETURN (`CHR$(13)`).
- Disk-new command:
  - The program sends the disk NEW command to the drive via the command channel: `PRINT#1,"n0:test disk,00"`
  - It constructs user-visible messages:
    - `c1$ = "   disk new command   " + CHR$(13)`
    - `c2$ = "{down} wait about 80 seconds"`
    - `cc$ = c1$ + c2$`
  - Calls `GOSUB 1840` to handle the device response and display messages.
- Early-failure test:
  - After returning from the I/O response handler, the program tests `IF ti<nt THEN 1370` — if the response timing (`ti`) is less than `nt`, it prints messages indicating the system is not responding correctly and jumps to `GOSUB 1880` for failure handling.

This chunk contains the UI and command-sending portion; the I/O response handling and the mechanical/file test stages are implemented elsewhere (referenced by `GOSUB 1840` and `GOSUB 1880` and further stages).

## Source Code

```basic
start tok64 perftest.prg
 1000 rem  performance test  2.0
 1010 :
 1020 rem  vic-20 and commodore 64
 1030 rem  single floppy drive
 1040 :
 1050 open 1,8,15:open 15,8,15
 1060 lt=35
 1070 lt$=str$(lt)
 1080 nt=30
 1090 print "{clear}{down}{175*22}"
 1100 print "   performance test"
 1110 print "{183*22}"
 1120 print
 1130 print "  insert scratch"
 1140 print
 1150 print "    diskette in drive"
 1160 print
 1170 print "{down}   press {reverse on}return{reverse off}"
 1180 print
 1190 print "          when ready{down}"
 1200 for i=0 to 50:get a$:next
 1210 get a$:if a$<>chr$(13) then 1210
 1220 :
 1230 :
 1240 ti$="000000"
 1250 tt=18
 1260 print#1,"n0:test disk,00"
 1270 c1$="   disk new command   "+chr$(13)
 1280 c2$="{down} wait about 80 seconds"
 1290 cc$=c1$+c2$:gosub 1840
 1300 if ti<nt then 1370
 1310 print "{down}system is"
 1320 print "{down}        not responding"
 1330 print "correctly to commands"
 1340 gosub 1880
```

## Key Registers

- **lt**: Line threshold value, set to 35.
- **lt$**: String representation of `lt`.
- **nt**: Numeric threshold, set to 30.
- **ti$**: Time string, initialized to "000000".
- **tt**: Time threshold, set to 18.

## References

- "perftest_io_response_handler" — handles device reply to commands sent here (`GOSUB 1840 / 1880`)
- "perftest_mechanical_file_test" — next test stage when disk-new succeeds (mechanical and file operations)