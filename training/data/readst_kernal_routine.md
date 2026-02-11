# READST ($FFB7 / 65463) — KERNAL: Read status word

**Summary:** READST is a KERNAL routine at $FFB7 (decimal 65463) that returns the I/O status word in the accumulator (A). Use after device I/O (serial, cassette/tape) to detect timeouts, EOF/End-of-Tape, checksum and block errors (bit masks 1,2,4,8,16,32,64,128).

## Description
Purpose: Read status word of I/O devices and return it in A. Call this routine after communication with an I/O device to test for errors or special conditions reported by the device drivers (serial bus, cassette/tape).

Call address: $FFB7 (decimal 65463)  
Communication registers: A (accumulator contains the returned status byte)  
Preparatory routines: None  
Error returns: None (status is returned in A)  
Stack requirements: 2 bytes  
Registers affected: A

Returned status is a bit-field (bits 0–7) describing device conditions or errors. Typical uses: detect serial timeouts (listen/talk), cassette read/write/EOF/end-of-tape conditions, tape verify/load errors, block length errors, checksum errors. Decode A with logical AND against the bit masks (see table in Source Code).

How to use:
1) JSR $FFB7 (or JSR READST if symbol present)  
2) Test bits in A with AND and branch accordingly (example below).

## Source Code
```text
Status bit table (ST Bit position, numeric value and meanings):

+---------+------------+---------------+------------+-------------------+
|  ST Bit | ST Numeric |    Cassette   |   Serial   |    Tape Verify    |
| Position|    Value   |      Read     |  Bus R/W   |      + Load       |
+---------+------------+---------------+------------+-------------------+
|    0    |      1     |               |  time out  |                   |
|         |            |               |  write     |                   |
+---------+------------+---------------+------------+-------------------+
|    1    |      2     |               |  time out  |                   |
|         |            |               |    read    |                   |
+---------+------------+---------------+------------+-------------------+
|    2    |      4     |  short block  |            |    short block    |
+---------+------------+---------------+------------+-------------------+
|    3    |      8     |   long block  |            |    long block     |
+---------+------------+---------------+------------+-------------------+
|    4    |     16     | unrecoverable |            |   any mismatch    |
|         |            |   read error  |            |                   |
+---------+------------+---------------+------------+-------------------+
|    5    |     32     |    checksum   |            |     checksum      |
|         |            |     error     |            |       error       |
+---------+------------+---------------+------------+-------------------+
|    6    |     64     |  end of file  |  EOI line  |                   |
+---------+------------+---------------+------------+-------------------+
|    7    |   128      |  end of tape  | device not |    end of tape    |
|         |            |               |   present  |                   |
+---------+------------+---------------+------------+-------------------+

Numeric bit masks: %xxxx xxxx (bit7..bit0) = decimal values 128,64,32,16,8,4,2,1.
```

```asm
; EXAMPLE: CHECK FOR END OF FILE DURING READ
    JSR $FFB7        ; READST
    AND #$40         ; CHECK EOF BIT (bit 6 = 64 = $40)
    BNE EOF          ; BRANCH ON EOF
```

## Key Registers
- $FFB7 - KERNAL - READST (Read status word of I/O devices; returns status byte in A)

## References
- "listen_kernal_routine" — expands on LISTEN uses and READST for error returns
- "talk_kernal_routine" — expands on TALK uses and READST for error returns

## Labels
- READST
