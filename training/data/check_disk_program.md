# CHECK DISK (Program "CHECK DISK" ver 1.4)

**Summary:** BASIC disk-check/diagnostic program for the C64 that scans disk blocks, writes a 255-byte randomized test pattern to a block (channel 2 "#"), issues drive commands on channel 15 (e.g., "v", "b-a:", "u2:2,", "i") to attempt block allocation and to read drive responses, and logs bad track/sector combinations into arrays t() and s().

**Program Overview**

This BASIC listing scans floppy disk blocks on a specified device (variable dn=8), generates a 255-byte pseudo-random test pattern (a$), writes the pattern to the drive data channel (OPEN 2,...,"#"), and communicates with the 1541-style drive via the command channel (OPEN 15,...). It tries to allocate bad blocks via the "b-a:" command (block-allocate—BAM interaction) and records track/sector failures in arrays t() and s(). A minimal read routine (lines 900–930) reads/decodes errors returned on channel 15.

Key operational points preserved from the source:

- **Device number variable:** dn=8
- **Bad-block arrays:** DIM t(100):DIM s(100)
- **Pattern generator:** n% = rnd(ti)*255 and a$ built with 255 characters using CHR$(255 AND (i+n%))
- **Data write performed to channel 2** opened as the data channel with record type "#"
- **Drive control commands** transmitted via channel 15 using PRINT#15 with string commands: "v"d$, "b-a:"d$;t;s, "u2:2,"d$;t;s, and "i" d$
- **Error/read handling** via INPUT#15,en,em$,et,es and a subroutine at 900 to display and process errors
- **Program prints a report** of bad blocks and attempts allocation/reporting at the end

**Drive Commands Used (as Sent to Channel 15)**

- **PRINT#15,"v"d$** — This command is sent early in the program. The "v" command is not standard in Commodore DOS and may be a custom or undocumented command specific to certain drive configurations.
- **PRINT#15,"b-a:"d$;t;s** — Block-allocate command. Attempts to allocate a block at the specified track (t) and sector (s). If successful, the block is marked as allocated in the BAM (Block Availability Map).
- **PRINT#15,"u2:2,"d$;t;s** — Block-write command. Writes data from the computer to the specified track and sector on the disk.
- **PRINT#15,"i" d$** — Initialize command. Reinitializes the drive, resetting the error channel and updating the BAM.

**Variables, Arrays, and Flow**

- **dn** — Device number (default 8)
- **t(100), s(100)** — Arrays to store bad track/sector pairs
- **n%** — Seed offset for pattern generation: n% = rnd(ti)*255
- **a$** — 255-character test pattern assembled with CHR$() of (255 AND (i+n%)) for i=1..255
- **nb** — Counter for number of checked blocks (initialized to 0)
- **j** — Index into t() and s() for bad blocks (initialized to 0)

**Main loop pattern:**

1. Generate pattern (lines 45–60)
2. Write pattern to data channel (open 2, print#2,a$;)
3. Attempt block allocation via "b-a:" and read drive response via INPUT#15
4. On error non-zero, process (some errors indicate end-of-track/operation)
5. Record bad block into t(j),s(j) and increment j, loop

**Error Handling and Read Routine**

- **INPUT#15,en,em$,et,es** reads 4 fields from channel 15: numeric error code (en), error message (em$), track (et), and sector (es)
- **Subroutine at 900:**
  - INPUT#15,en,em$,et,es
  - If en=0 RETURN
  - Prints error details and sends PRINT#15,"i" d$ to the drive (line 920–930)
- If drive returns en=0, program continues; non-zero en causes display and recording of the failed block

**Output / Reporting**

- The program prints progress messages including "checked blocks" count and prints a table of bad blocks at the end
- If no bad blocks are found, the program prints a positive message and ends
- After reporting, it re-opens channel 2 to attempt allocation reporting for each recorded bad block (lines 217–250)

## Source Code

```basic
1 rem check disk -- ver 1.4
2 dn=8:rem floppy device number
5 dim t(100):dim s(100):rem bad track, sector array
9 print "{clear}{down*3}{175*21}"
10 print " check disk program"
12 print "{183*21}"
20 d$="0"
30 open 15,dn,15
35 print#15,"v"d$
45 n%=rnd(ti)*255
50 a$="":for i=1 to 255:a$=a$+chr$(255 and (i+n%)):next
60 gosub 900
70 open 2,dn,2,"#"
80 print:print#2,a$;
85 t=1:s=0
90 print#15,"b-a:"d$;t;s
100 input#15,en,em$,et,es
110 if en=0 then 130
115 if et=0 then 200:rem end
120 print#15,"b-a:"d$;et;es:t=et:s=es
130 print#15,"u2:2,"d$;t;s
134 nb=nb+1:print" checked  blocks"nb
135 print " track    {left*4}" t;" sector    {left*4}" s "{up*2}"
140 input#15,en,em$,et,es
150 if en=0 then 85
160 t(j)=t:s(j)=s:j=j+1
165 print "{down*2}bad block:{left*2}",t;s""
170 goto 85
200 print#15,"i" d$
210 gosub 900
212 close 2
215 if j=0 then print "{down*3}{right*3}no bad blocks!":end
217 open 2,dn,2,"#"
218 print "{down*2}bad blocks","track","sector"
220 for i=0 to j-1
230 print#15,"b-a:";d$,t(i);s(i)
240 print,,t(i),s(i)
250 next
260 print "{down}" j "bad blocks have been allocated"
270 close 2:end
900 input#15,en,em$,et,es
910 if en=0 then return
920 print "{down*2}error #"en,em$;et;es""
930 print#15,"i" d$
```
