# Block-read example: OPEN#15 (command), INIT, OPEN#2 (data), U1 read, GET#, CHR$(0)/ASC(), BAM handling

**Summary:** Line-by-line notes for a C64 BASIC block-read example using the 1541 command channel (device 8, secondary 15), opening a data channel (secondary 2), issuing a U1 block-read into the drive-assigned buffer, reading 256 bytes with GET#, converting NULs to CHR$(0) and using ASC(), printing values, closing channels, DOS BAM update on close, and suppressing the error light by reading the error channel.

**Explanation / Steps and technique notes**

- **OPEN command channel (logical file 15) to device 8, secondary 15**: This is the 1541 command channel used to send DOS commands (e.g., INIT, U1).

- **INIT (drive initialize) is issued before opening a direct-access data channel**: Initializing the drive resets the 1541 side and automatically shuts down any direct-access data channels (2–14) that are open on the drive; the command channel (15) remains open.

- **After INIT, C64-side logical files still appear open**: Attempting to access a data channel that was shut down on the drive side produces a 70 NO CHANNEL error on access.

- **Open a data channel (logical file 2) to device 8 with secondary address 2 and let the 1541 assign the buffer area**: Opening with secondary 2 selects a direct-access data channel.

- **Issue the U1 block-read command (via the command channel) to read the desired track and sector into the buffer assigned by the drive for channel 2**: The U1 command syntax is `U1 channel, drive, track, sector`. For example, `PRINT#15,"U1 2 0 18 0"` reads track 18, sector 0 into the buffer for channel 2. ([bitsavers.trailing-edge.com](https://bitsavers.trailing-edge.com/pdf/commodore/The_Anatomy_of_the_1541_Disk_Drive_Jun84.pdf?utm_source=openai))

- **Read the drive error channel (query) after commands where appropriate to collect the error number, error message text, track and sector returned by the drive**: This both checks for errors and is needed later to suppress the error light.

- **Loop 256 bytes (0–255)**:
  - **Use GET# with the logical file number that refers to the data channel**: GET# uses the logical file, not the channel number, to transfer one byte from the drive buffer into a BASIC string B$ (one-character).
  - **Detect the zero-length string ("") returned by GET# (end-of-data / NUL handling) and treat it as CHR$(0)**: An alternate single-expression technique is: `A = ASC(B$ + CHR$(0))` — concatenating CHR$(0) ensures B$ is never empty, then ASC() yields 0 for true NUL.
  - **Convert the byte to its ASCII code with ASC()**.
  - **Print status (ST), loop index, and ASCII value**: Optionally print the character if it is within a normal printable ASCII range.
  - **Increment loop counter(s) as used for display or bookkeeping**.

- **Close the data channel (CLOSE 2)**: On close, DOS attempts to rewrite the BAM (block availability map) to disk. If the disk is write-protected or DOS prevents rewriting the BAM, the error light on the drive will remain on.

- **To suppress the persistent error light after a failed BAM rewrite, read the drive error channel (INPUT# / GET# to the command channel) to retrieve the error number, message, track and sector**: This clears the error light indicator on the 1541 front panel.

- **Close the command channel (CLOSE 15) and END the program**.

**Programming technique emphasis**:

- **Perform INIT before opening direct-access data channels to ensure the drive is in a known state**: Remember INIT affects the drive side only; C64 logical files are not automatically closed.

- **Always query the error channel after DOS operations that can produce errors**: Use the results to both detect failure and to clear the drive error indicator.

- **Handle empty-string returns from GET# ("") explicitly**: Using `B$+CHR$(0)` with ASC() is a concise idiom to fold the test into one expression.

## Source Code

```basic
110 OPEN 15,8,15
120 PRINT#15,"I0"              :rem initialize drive 0
130 INPUT#15,E$,EM$,ET,ES     :rem query error channel (error number, message, track, sector)
140 REM (optional display of E$,EM$)
150 OPEN 2,8,2,""              :rem open data channel 2, let 1541 assign buffer area
160 PRINT#15,"U1 2 0 18 0"     :rem request drive 0 to read track 18 sector 0 into channel-2 buffer
170 INPUT#15,E$,EM$,ET,ES     :rem query error channel after U1
180 REM (optional display of E$,EM$)
190 ST=0
200 FOR I=0 TO 255
210   GET#2,B$                 :rem transfer one byte from channel 2 buffer area
220   IF B$="" THEN B$=CHR$(0) :rem convert empty string to NUL
230   A=ASC(B$)                :rem ASCII code of byte
240   PRINT ST,I,A; 
250   IF A>=32 AND A<=126 THEN PRINT B$; :rem printable-range character
260   PRINT ","                :rem terminate comma/tabulation
270   ST=ST+1
280 NEXT I
290 CLOSE 2
300 INPUT#15,E$,EM$,ET,ES     :rem read error channel to suppress/clear error light
310 CLOSE 15
320 END
```

**Notes**:

- The listing above is a canonical reconstruction mapped to the line-by-line descriptions; exact original BASIC syntax and U1 parameter ordering/format may vary between sources.

- The single-expression alternative for null handling mentioned in the notes:
  - `A = ASC(B$ + CHR$(0))`  :rem safe ASC() even if B$ is "" — returns 0 for NUL

## References

- "block_read_example_program" — expands on the BASIC listing the explanations map to
- "buffer_pointer_b-p_syntax" — expands on B-P usage after U1 to set buffer pointer to a specific byte