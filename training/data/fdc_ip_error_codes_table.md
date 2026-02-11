# FDC → IP Error Codes and Job Queue / Buffer Layout

**Summary:** This document details the mapping of FDC error codes to IP error numbers and corresponding English messages, along with the memory layout for the job queue, header table (track/sector), and data buffers in the Commodore 1541 disk drive.

**Overview**

Commands sent from the Commodore 64 (C64) are parsed by the Integrated Processor (IP) into three fields: job code, track, and sector. If the syntax is valid, the IP places the job code into the job-queue table and the track/sector into the header table. Each buffer area has a fixed job-queue and header-table slot pair. The Floppy Disk Controller (FDC) polls the job-queue/header-table locations to find pending jobs, then seeks and reads/writes the specified track/sector into the buffer.

On success, the FDC writes a success code into the job-queue byte (example: $01). On failure, the FDC writes an FDC error code to the job-queue byte; interrogation of the error channel transfers the IP counterpart (an IP error number), the English message, and additional status information, including the track and sector where the error occurred.

Example:

- A block-read request for track 18, sector 0 into buffer #0 ($0300–$03FF):
  - The IP places the job code into job-queue slot $0000, track 18 ($12) into header-table slot $0006, and sector 0 into header-table slot $0007.
  - The FDC reads those slots, services the request, transfers the 256-byte sector into $0300–$03FF on success, and writes $01 at $0000. If the job fails, the FDC writes an error code at $0000.

## Source Code

```text
FDC → IP Error Code Mappings

FDC $01  => IP 0    OK
FDC $02  => IP 20   READ ERROR (block header not found)
FDC $03  => IP 21   READ ERROR (no sync character)
FDC $04  => IP 22   READ ERROR (data block not present)
FDC $05  => IP 23   READ ERROR (checksum error in data block)
FDC $06  => IP 24   READ ERROR (byte decoding error)
FDC $07  => IP 25   WRITE ERROR (write-verify error)
FDC $08  => IP 26   WRITE PROTECT ON
FDC $09  => IP 27   READ ERROR (checksum error in header)
FDC $0A  => IP 28   WRITE ERROR (long data block)
FDC $0B  => IP 29   DISK ID MISMATCH
FDC $0C  => IP 30   SYNTAX ERROR (general syntax)
FDC $0D  => IP 31   SYNTAX ERROR (invalid command)
FDC $0E  => IP 32   SYNTAX ERROR (long line)
FDC $0F  => IP 33   SYNTAX ERROR (invalid file name)
FDC $10  => IP 34   SYNTAX ERROR (no file given)
FDC $11  => IP 39   SYNTAX ERROR (invalid command)
FDC $12  => IP 50   RECORD NOT PRESENT
FDC $13  => IP 51   OVERFLOW IN RECORD
FDC $14  => IP 52   FILE TOO LARGE
FDC $15  => IP 60   FILE OPEN
FDC $16  => IP 61   FILE NOT OPEN
FDC $17  => IP 62   FILE NOT FOUND
FDC $18  => IP 63   FILE EXISTS
FDC $19  => IP 64   FILE TYPE MISMATCH
FDC $1A  => IP 65   NO BLOCK
FDC $1B  => IP 66   ILLEGAL TRACK OR SECTOR
FDC $1C  => IP 67   ILLEGAL SYSTEM T OR S
FDC $1D  => IP 70   NO CHANNEL
FDC $1E  => IP 71   DIRECTORY ERROR
FDC $1F  => IP 72   DISK FULL
FDC $20  => IP 73   DOS MISMATCH
FDC $21  => IP 74   DRIVE NOT READY
```

```text
Buffer / Job-Queue / Header-Table Address Mapping

Buffer Address Range     Job-Queue Addr   Header: Track   Header: Sector   Notes
$0000 - $00FF            -                -               -               Not available (ZERO PAGE)
$0100 - $01FF            -                -               -               Not available (STACK)
$0200 - $02FF            -                -               -               Not available (COMMAND BUFFER)
#0  $0300 - $03FF        $0000            $0006           $0007
#1  $0400 - $04FF        $0001            $0008           $0009
#2  $0500 - $05FF        $0002            $000A           $000B
#3  $0600 - $06FF        $0003            $000C           $000D
$0700 - $07FF            -                -               -               Not available (BAM)
```

## References

- "job_codes_table" — expands on which jobs produce which FDC codes and how they map to IP errors
- "job_queue_read_example" — expands the example of reading a sector and checking the job result via the error channel

**Note:** The FDC error codes and their corresponding IP error numbers and messages are derived from the Commodore 1541 disk drive error messages. For a comprehensive list and detailed descriptions, refer to the Commodore 1541 User's Guide, Appendix B.
