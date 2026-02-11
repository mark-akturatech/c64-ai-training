# Block-Write (B-W) — buffer-pointer written to byte 0 (forward-track pointer overwritten)

**Summary:** Describes a 1541/Commodore DOS block-write (B-W) behavior where bytes 1–255 of the sector are written correctly, but the buffer-pointer's final position is written into sector byte 0 (the forward-track pointer), preserving payload data while destroying the sector's forward link; includes a BASIC test program that demonstrates the effect and uses B-P and B-W.

**Behavior and impact**
- When using the disk command B-W (block-write) to write a buffered sector, the DOS writes bytes 1–255 of the buffer into the target sector exactly as expected, but it writes the buffer-pointer's final position value into byte 0 of the sector (the forward-track pointer).
- Effect: the sector's data payload remains intact, but the forward-track pointer (byte 0) is overwritten with a pointer value (the buffer-pointer final position), destroying the proper link to the next sector/track in a chained file or directory. This breaks file chaining and can corrupt directory or file structures that rely on forward links.
- Typical sequence used by the demo:
  - `OPEN 15,8,15` — open command channel to device 8.
  - Use device commands to prepare for block-write.
  - `OPEN 2,8,2,"#"` — open a data channel (secondary address 2) to fill the 256-byte buffer.
  - Send 256 bytes via `PRINT#2, CHR$(...)` to fill buffer bytes 0–255 (the demo writes values 0–255).
  - `PRINT#15, "B-P";2;6` — set the buffer pointer (B-P) to a chosen offset (example shows 6).
  - `PRINT#15, "B-W";2;0;1;0` — invoke block-write to write buffer to target track/sector.
- Outcome after running the demo on a test diskette: the written sector will contain correct bytes 1–255, but byte 0 will contain the buffer-pointer final position, destroying that sector's forward link.

**Notes**
- The text states that B-W had been previously replaced by U2 elsewhere in the source; this chunk documents the behavior of the legacy B-W command.
- The data integrity of bytes 1–255 is preserved; only the pointer byte (byte 0) is wrong. Recovery requires restoring forward-track pointer values (from backups or by re-linking sectors) — not covered here.
- See referenced chunks for root cause analysis and interactions between block-read and block-write.

## Source Code
```basic
100 REM BLOCK-WRITE (B-W)

110 OPEN 15,8,15

120 PRINT#15, "I0"
130 INPUT#15,EN$,EM$,ET$,ES$
140 IF EN$<>"00" GOTO 260

150 OPEN 2,8,2, "#"

160 PRINT#15, "UI";2;0;1;0
170 INPUT#15,EN$,EM$,ET$,ES$
180 IF EN$<>"00" GOTO 240

190 FOR I=0 TO 255
200 PRINT#2, CHR$(I);
210 NEXT I

220 PRINT#15, "B-P";2;6
230 PRINT#15, "B-W";2;0;1;0

240 CLOSE 2

250 INPUT#15,EN$,EM$,ET$,ES$
260 CLOSE 15
270 END
```

## References
- "block_read_and_block_write_interaction_and_recommendation" — expands on the root cause of the B-R EOI behavior previously described
- "effect_of_block_write_on_subsequent_block_read" — shows practical results when reading the rewritten sector with B-R vs UI
