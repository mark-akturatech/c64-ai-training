# Three-parameter memory-read example — buffer #1, block read $0490–$049F

**Summary:** Example demonstrating how to open a DOS command channel to device 8 with secondary address 2 to select DOS buffer #1 ($0400–$04FF), perform a block read into that buffer, issue a three-parameter memory-read (M-R) for address range $0490–$049F (low/high/length bytes: 144, 4, 16), and use a GET# loop to fetch 16 characters. This technique allows sending a single M-R command so the program can loop with GET# to read multiple bytes without issuing a separate M-R per byte.

**Explanation**

- **Setup:** A DOS command channel is opened on logical file number 2 to device 8 with secondary address 2. The secondary address 2 selects DOS buffer number 1 as the workspace; buffer #1 occupies $0400–$04FF in drive RAM.

- **Block read:** The drive’s block (given in the example as track 18, sector 0) is read into the drive’s buffer area corresponding to channel 2 (the selected buffer #1). After this block read, the bytes to be fetched by the C64 reside in the drive buffer mapped at $0400–$04FF.

- **Three-parameter M-R (memory-read):** A single memory-read command is sent over the command channel to request a contiguous range from the drive buffer:
  - **Command format:** Send M-R command byte, then low byte of start address, then high byte of start address, then length (number of bytes).
  - **Example numeric values for range $0490–$049F:**
    - Start low byte = $90 = 144 decimal
    - Start high byte = $04 = 4 decimal
    - Length = 16
  - This single M-R establishes the transfer window so subsequent GET# requests will return bytes from that range without re-issuing M-R for each byte.

- **GET# loop:** After the M-R, the program executes a loop of 16 GET# operations on the same command channel to read one byte per GET#, transferring each byte from the drive buffer into C64 memory. Because the length was supplied in the M-R, each GET# pulls the next byte from the already-declared range.

- **Benefit:** Including the third parameter (length) avoids sending a separate M-R for each fetched byte, reducing command-channel transactions and improving throughput.

## Source Code

```basic
150 OPEN 2,8,2
160 PRINT#2, "U1 2 0 18 0"
190 PRINT#2, "M-R" + CHR$(144) + CHR$(4) + CHR$(16)
200 FOR I = 1 TO 16
210 GET#2, A$
220 PRINT A$;
230 NEXT I
240 CLOSE 2
```

## References

- "three_parameter_memory_read_example" — expands on example implementation and behavior
- "selecting_dos_buffer_open_syntax_and_buffer_table" — expands on buffer #1 address range $0400-$04FF referenced