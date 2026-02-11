# Machine Language Monitor .S save format

**Summary:** Describes the MLM .S save command syntax (.S"NAME",device,begin,end+1), device numbers (tape 01, disk 08), example addresses ($033C,$0361), and the BASIC LOAD",8,1 flag to prevent relocation (SOV — start-of-variables pointer).

## Usage
.S saves a block of memory from begin to end+1 (the end parameter must be one more than the last byte you want saved). Syntax:

- .S"NAME",device,begin,end+1

Notes:
- Device numbers: tape examples use 01 (two digits required); disk typically uses 08.
- When the end parameter is given as end+1, the last byte written is at address end (i.e., .S ... ,033C,0361 will save $033C through $0360).
- For disk saves include the drive/filename as shown in the example (e.g., .S"0:PROGRAM",08,033C,0361).
- After saving to disk/tape, loading from BASIC must usually use the optional flag to prevent BASIC relocation: LOAD"PROGRAM",8,1 (the final ,1 requests no relocation on VIC/C64 BASIC).
- The monitor .L load command behaviour varies by monitor; some monitors load without relocating pointers, others may relocate — verify with your monitor.

## Source Code
```text
.S"PROGRAM",01,033C,0361
  ; tape save: device 01 (two digits), saves $033C .. $0360

.S"0:PROGRAM",08,033C,0361
  ; disk save: include drive/filename, device 08

LOAD"PROGRAM",8,1
  ; BASIC load with ,1 flag to prevent relocation (load into original addresses)

; Reminder: .L monitor command may load without relocating pointers depending on monitor
```

## References
- "checking_and_fixing_memory_pointers" — verifying SOV pointer after load and fixing pointers if required