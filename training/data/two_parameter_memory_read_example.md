# Two-parameter memory-read example (M-R) — buffer #0 ($0300-$03FF)

**Summary:** Demonstrates indexed memory-read from a disk buffer using OPEN 2,8,2,"#0", DRIVE command to load track/sector into buffer ($0300-$03FF), issuing PRINT#15,"M-R" CHR$(i) CHR$(3) to request bytes by index, and GET#15 to retrieve each byte to the C64 for printing. Searchable terms: OPEN, PRINT#15, GET#15, M-R, $0300-$03FF, buffer #0.

## Description
- Line 150: Opens logical file 2 to device 8 with secondary address 2 and selects buffer number 0 as the workspace (buffer #0 corresponds to $0300-$03FF).
- Line 160: Sends a drive command to transfer a disk block (drive 0, track 18, sector 0) into the device buffer assigned to logical file 2. (Shown as PRINT#15,"U1";2;0;18;0 in the example.)
- Line 190: Begins a loop over 256 indices (0–255) covering the entire buffer range $0300–$03FF.
- Line 200: Issues the indexed memory-read command to the drive/command channel. The example sends PRINT#15,"M-R" followed by CHR$(i) and CHR$(3) to request the byte at index i from the selected buffer. (The listing uses the command channel device 15 for control and M-R requests.)
- Line 210+: Uses GET#15 to receive the single-byte response from the command channel and transfers it into the C64 (A$). The program converts null bytes (CHR$(0)) to CHR$(0) explicitly and prints the byte's numeric ASCII value; where the value is in the printable ASCII range (typically 32–126) it also prints the corresponding character.

Notes:
- This example uses the command channel (device #15) to issue drive commands and to perform GET#15 to read responses.
- Buffer #0 coverage: $0300–$03FF (256 bytes). The program indexes that buffer by sending the index as a single-byte parameter (CHR$(i)) to the M-R command.

## Source Code
```basic
150 OPEN 2,8,2,"#0"
160 PRINT#15,"U1";2;0;18;0
170 FOR I=0 TO 255
180 PRINT#15,"M-R";CHR$(I);CHR$(3)
190 GET#15,A$
200 IF A$=CHR$(0) THEN V=0: GOTO 220
210 V=ASC(A$)
220 IF V>=32 AND V<=126 THEN PRINT I;V;A$ ELSE PRINT I;V
230 NEXT I
```

## References
- "memory_read_m-r_syntax" — expands on buffer selection and addressing for M-R
- "three_parameter_memory_read_example" — expands on an example that uses all three M-R parameters to read disk name bytes