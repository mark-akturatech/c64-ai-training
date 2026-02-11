# 1541 Initialization, Error Handling, and Embedded SAVE/LOAD Machine Code (BASIC + DATA)

**Summary:** BASIC routines to initialize the 1541 drive, handle errors, and embed machine code for SAVE/LOAD operations.

**Initialization and Error-Handling Overview**

This chunk contains BASIC support routines used to:

- **Initialize Communications with the 1541 Disk Drive:**
  - Open the command/error channel (`OPEN 15,8,15`).
  - Send the initialize command (`PRINT#15,"I"`).
  - Read the four status bytes returned on the error channel (`INPUT#15,EN$,EM$,ET$,ES$`).

- **Test Status Bytes and Handle Errors:**
  - If `EN$` equals "00", return immediately.
  - Otherwise, print an error message, close the channel, and branch to an error handler (`GOTO 670`).

- **Handle File-Related Errors:**
  - Open a file for operations (`OPEN 2,8,2,"O:"+F$+","+T$+","+RW$`).
  - Read the error/status bytes and handle them similarly.

- **Embed Machine Code for SAVE/LOAD Operations:**
  - Provide `DATA` statements containing machine-code bytes for loader/saver routines invoked by `SYS`.

**Variables Used:**

- `EN$`, `EM$`, `ET$`, `ES$`: Status bytes read from the drive.
- `F$`, `T$`, `RW$`: Strings used to build the `OPEN` command for file operations.
- Channels: 15 for drive initialization/error reads; 2 for disk commands.

**Caveats and Source Issues:**

- The original text contained OCR artifacts (e.g., '*' in place of '$', 'O' in place of '0'). These have been corrected.
- The listing refers to a `GOTO 670` and other external flow not present in this chunk.

## Source Code

```basic
800 REM INITIALIZATION

810 OPEN 15,8,15
820 PRINT#15,"I"
830 INPUT#15,EN$,EM$,ET$,ES$
840 IF EN$="00" THEN RETURN
850 PRINT "  <:DOWN>  ";EN$;"  ";EM$;",";ET$;",";ES$
860 CLOSE 15
870 GOTO 670

880 REM FILE NOT FOUND - FILE EXISTS
890 OPEN 2,8,2,"O:"+F$+","+T$+","+RW$
900 INPUT#15,EN$,EM$,ET$,ES$
910 IF EN$="00" THEN RETURN
920 CLOSE 2
930 PRINT "  <:DOWN>  ";EN$;",";EM$;",";ET$;",";ES$
940 PRINT " <:down> <:rvs>failed<roff>"
950 INPUT#15,EN$,EM$,ET$,ES$
960 CLOSE 15
970 GOTO 670

980 REM LOAD - SAVE (embedded machine-code DATA follows)

990 DATA 162,2,32,198,255,160,0,32
1000 DATA 228,255,145,251,32,183,255,41
1010 DATA 64,208,8,200,208,241,230,252
1020 DATA 76,5,192,132,251,32,204,255
1030 DATA 96,162,2,32,201,255,160,0
1040 DATA 177,253,32,210,255,196,251,240
1050 DATA 3,200,208,244,230,254,76,38
1060 DATA 192,165,254,197,252,208,242,132
1070 DATA 253,32,204,255,96,234,234,234
```

**Notes About the DATA Block:**

- These bytes correspond to a 6502 machine code routine for SAVE/LOAD operations.
- The assembly source corresponding to these bytes is provided below.

```assembly
; Assembly source corresponding to the embedded machine-code DATA

LDX #$02
JSR $FFC6
LDY #$00
JSR $FFE4
STA ($FB),Y
JSR $FFB7
AND #$40
BNE $08
INY
BNE $F1
INC $FC
JMP $C005
STY $FB
JSR $FFCC
RTS
LDX #$02
JSR $FFC9
LDY #$00
LDA ($FD),Y
JSR $FFD2
CPY $FB
BEQ $03
INY
BNE $F4
INC $FE
JMP $C026
LDA $FE
CMP $FC
BNE $F2
STY $FD
JSR $FFCC
RTS
NOP
NOP
NOP
```

## Key Registers

- **$FB**: Pointer used in indirect addressing.
- **$FC**: Pointer used in indirect addressing.
- **$FD**: Pointer used in indirect addressing.
- **$FE**: Pointer used in indirect addressing.

## References

- "1541_copy_basic_main_program" — Expands on main program `SYS` calls that rely on this initialization and the DATA machine code loader/saver.
- "copy_file_source_listing_assembly_stub" — Assembler source listing and PAL/assembly stub corresponding to the embedded machine-code bytes.
- "support_routines_delay_and_return" — Error-handling and flow-control routines that return to or are jumped to from the code above.

## Labels
- FB
- FC
- FD
- FE
