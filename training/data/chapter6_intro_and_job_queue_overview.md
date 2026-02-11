# FDC Job Queue and Job Codes (Chapter 6)

**Summary:** Describes the Commodore 64 Floppy Disk Controller (FDC) job queue: the IP parses C64 commands into job entries that are poked into the job queue and scanned by the FDC every 10 ms; lists high-level FDC jobs (READ, WRITE, VERIFY, SEEK, BUMP, JUMP, EXECUTE) and the job codes (hex and decimal) the FDC sees.

**Job queue overview**
The IP (interface program) parses C64-level commands into job records which are poked into the FDC job queue. The FDC scans the job queue every 10 ms; when it finds a job code it attempts to perform that job. When a job completes or is aborted, the FDC replaces the job code in the queue with an error code indicating success or the failure condition.

High-level job types the FDC supports:
- READ — read a sector
- WRITE — write a sector
- VERIFY — verify a sector
- SEEK — move head to track
- BUMP — bump head (step)
- JUMP — jump to a routine (change job pointer)
- EXECUTE — execute a routine (run code on drive)

Each job type is represented by a specific job code byte the FDC reads from the queue; the table of hex and decimal equivalents follows.

## Source Code
