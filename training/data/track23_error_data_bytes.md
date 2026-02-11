# FULL TRACK 23 — BASIC DATA (6502 machine-code bytes)

**Summary:** BASIC DATA statements encoding 6502 machine-code bytes for the "Full Track 23" destructive error routine (begins with REM 23 ERROR). These exact decimal byte values are intended to be READ and POKE'd into the Commodore 1541 disk drive's memory by the job-queue and then executed. Searchable terms: DATA statements, BASIC, 6502, POKE, job-queue, drive, Full Track 23.

**Description**

This chunk contains the original BASIC DATA lines that encode the machine-code bytes for the "REM 23 ERROR" routine. The bytes are provided as decimal values suitable for direct POKE (or for READ into a buffer on the drive) to form the 6502 routine the job-queue transmits and invokes on the drive. The listing shown below is a cleaned transcription of the provided source: obvious OCR artifacts were corrected. No attempt is made here to disassemble or interpret the code beyond preserving the exact byte sequence as DATA statements.

The target load address for these bytes in the 1541 drive's memory is $0300 (decimal 768). This address is within the drive's available RAM space, which ranges from $0000 to $07FF (0 to 2047 in decimal). ([bitsavers.org](https://www.bitsavers.org/pdf/commodore/The_Anatomy_of_the_1541_Disk_Drive_Jun84.pdf?utm_source=openai))

## Source Code

```basic
720 REM 23 ERROR

730 DATA 169,4,133,49,165,58,170,232
740 DATA 138,133,58,32,143,247,32,16
750 DATA 245,162,8,80,254,184,202,208
760 DATA 250,169,255,141,3,28,173,12
770 DATA 28,41,31,9,192,141,12,28
780 DATA 169,255,162,5,141,1,28,184
790 DATA 80,254,184,202,208,250,160,187
800 DATA 185,0,1,80,254,184,141,1
810 DATA 28,200,208,244,185,0,4,80
820 DATA 254,184,141,1,28,200,208,244
830 DATA 80,254,32,0,254,169,5,133
840 DATA 49,169,1,133,2,76,117,249
```

Notes:
- Bytes are listed as decimal values exactly as intended to be READ and POKE'd.
- Line numbering preserved from the original BASIC listing.

## References

- "job_queue_basic_handshake_and_retry" — job-queue routine that transmits and invokes these DATA bytes on the drive
- "track23_error_source_listing_assembly" — readable assembly source matching/annotating these DATA bytes
