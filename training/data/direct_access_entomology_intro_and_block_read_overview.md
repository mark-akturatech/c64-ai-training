# Direct-Access Entomology — Block-Read (B-R) anomalies

**Summary:** Notes on DOS V2.6 direct-access anomalies: the traditional Block-Read (B-R) is unreliable; GET# returns a byte count tied to the track number, produces an erroneous EOI (End-Or-Identify), sets the C64 status variable ST to 64, repeats bytes on further reads, and requires resetting the buffer pointer to access byte 0.

**Block-Read (B-R) behavior and observed anomalies**

- The B-R (block-read) command under DOS V2.6 is reported as unreliable when compared to the single-sector U1 command.
- When a buffer filled by B-R is read from BASIC using GET#, the number of bytes returned equals the track number that was accessed (i.e., reading a sector on track N yields N bytes) rather than the expected full sector length.
- Example observed case: any sector on track 15 returns only 15 bytes and then an erroneous End-Or-Identify (EOI) condition is reported.
- After this erroneous EOI, the C64 status variable ST is set to 64.
- Any further attempts to GET# from the same buffer simply return the same sequence of bytes repeatedly (no advancing or fresh data).
- The byte at buffer position 0 is unreachable unless the buffer pointer is explicitly reset to position 0 (the source references doing this in "line 190" of an example program).
- These behaviors indicate that B-R on DOS V2.6 can deliver truncated transfers, incorrect EOI signaling, and buffer-pointer/state inconsistencies that make reliable block reads impossible without special handling.

## Source Code

```basic
110 MB = 7936:REM $1F00
120 INPUT "TRACK TO READ";T
130 INPUT "SECTOR TO READ";S
140 OPEN 15,8,15
150 OPEN 5,8,5,"#"
160 PRINT#15,"U1";5;0;T;S
170 FOR I = MB TO MB + 255
180 GET#5,A$:IF A$ = "" THEN A$ = CHR$(0)
190 POKE I,ASC(A$)
200 NEXT
210 CLOSE 5:CLOSE 15
220 END
```

## References

- "Inside Commodore DOS" by Richard Immers and Gerald G. Neufeld — discusses B-R command anomalies and recommends using U1 instead.
- "Commodore 1541 User's Guide" — provides examples of using U1 for block reads.
