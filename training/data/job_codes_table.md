# FDC Job Codes and IP Error-Code Mapping

**Summary:** This document details the Floppy Disk Controller (FDC) job opcodes used in the Commodore 1541 disk drive, their corresponding completion codes, and the mapping to Interface Processor (IP) error codes and error-channel messages.

**Job Codes and Behavior**

- **FDC Job Opcodes (Hexadecimal / Decimal):**
  - READ — $80 (128)
  - WRITE — $90 (144)
  - VERIFY — $A0 (160)
  - SEEK — $B0 (176)
  - BUMP — $C0 (192)
  - JUMP — $D0 (208)
  - EXECUTE — $E0 (224)

- **Completion Behavior:**
  - Upon completing a job, the FDC replaces the job opcode in the job queue with a completion code (status/error code).
  - The FDC completion code is translated by the IP into an error code, which is then returned on the error channel as a human-readable message.
  - The table below illustrates the mapping from FDC Code to IP Code and the corresponding Error Message.

## Source Code

```text
FDC Code    IP Code    Error Message
$01 (1)     0          OK
$02 (2)     20         READ ERROR (block header not found)
$03 (3)     21         READ ERROR (no sync character)
$04 (4)     22         READ ERROR (data block not present)
$05 (5)     23         READ ERROR (checksum error in data block)
$07 (7)     25         WRITE ERROR (write-verify error)
$08 (8)     26         WRITE PROTECT ON
$09 (9)     27         READ ERROR (checksum error in header)
$0B (11)    29         DISK ID MISMATCH
```

## Key Registers

- **FDC Job Queue Address:** $0000–$0004
- **FDC Completion Code Address:** $0000 (overwrites job opcode upon completion)

## References

- Commodore 1541 User's Guide, Appendix B: Summary of CBM Floppy Error Messages
- "Inside Commodore DOS" by Immers and Neufeld, Chapter 6: Intermediate Direct-Access Programming
- Commodore 1541 Service Manual, Section 1.7: Outline of Functions