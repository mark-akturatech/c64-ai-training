# Buffer-Pointer command (B-P)

**Summary:** The DOS Buffer-Pointer command (B-P) sets the pointer to any byte (0–255) in a DOS buffer for subsequent GET# reads or PRINT# writes. Uses PRINT# (or PRINT*) with the "B-P" (or "B-P:") token and the DOS channel (secondary address) plus byte position.

## Description
The buffer-pointer command lets a program position the DOS buffer pointer to any individual byte within a DOS I/O buffer (byte positions 0 through 255). After issuing B-P, subsequent GET# (read) or PRINT# (write) operations on that open channel access data starting at the selected buffer byte.

The command is issued over the logical file number (the command channel) that was used to open the device. The channel parameter is the secondary address (the DOS channel assigned by the OPEN statement) identifying which buffer to operate on.

## Syntax and parameters
- file# — logical file number of the command channel (the PRINT#/PRINT* target).
- channel — secondary address of the associated OPEN (DOS channel).
- byte position — byte offset within the buffer, valid range 0 to 255.

Accepted syntactic forms (paraphrased):
- PRINT# file#, "B-P"; channel; byte_position
- PRINT* file#, "B-P:" channel; byte_position
- PRINT* file#, "B-P:   channel,   byte_position"  (spacing variants accepted)

Effect: sets the internal buffer pointer for the specified DOS channel so subsequent GET#/PRINT# operations access the buffer starting at that byte position.

## Source Code
```basic
REM Syntax forms and example (BASIC)
PRINT# file#, "B-P"; channel; byte_position
PRINT* file#, "B-P:" channel; byte_position
PRINT* file#, "B-P:   " ; channel; byte_position

REM Example: set buffer pointer to byte 144 on channel 2 using command channel 15
PRINT#15, "B-P";2;144
```

## References
- "block_read_u1_syntax" — expands on reading a block into a buffer with U1 before using B-P
- "buffer_pointer_example_program" — example program that reads disk name bytes (positions 144–159) using B-P