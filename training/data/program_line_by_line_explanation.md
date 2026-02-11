# BASIC job-queue READ (annotated line-range explanation)

**Summary:** Line-by-line explanation of a C64 BASIC program that opens the command channel (channel 15), initializes the 1541 drive, issues SEEK and READ jobs via the drive job-queue into buffer 0 ($0300-$03FF), polls for completion, and reads the FDC error code (ST). Covers header/job-table writes ($0006-$0007, $0000), the 256-byte transfer loop, ASCII conversion/printing, and the subroutine TRY counter and polling loop.

**Line-by-line explanation**

**Main Program**

- **110** — Open the command channel.
  - Opens the C64's command channel (logical device #15) to send drive commands and to use `GET#` for transferring bytes from the drive buffer into C64 memory or variables.
- **120–140** — Initialize drive.
  - Drive initialization steps sent via the command channel (device initialization sequence before issuing SEEK/READ jobs).
- **160** — Initialize track to 18.
  - Set the track number variable/field that will be placed into buffer-0 header for the job (target track 18).
- **170** — Initialize sector to 0.
  - Set the sector number variable/field that will be placed into buffer-0 header (target sector 0).
- **180–190** — SEEK track 18.
  - Submit a SEEK job to the drive (move head to track 18) via the job queue mechanism.
- **200** — Query FDC error code.
  - Read the drive's FDC error/status (returned into the program variable ST) after the SEEK job completes.
- **220–230** — READ sector 0 on track 18 into buffer number 0 ($0300-$03FF).
  - Prepare and submit a READ job that directs the 1541 to read the specified sector into buffer 0 (C64 memory $0300–$03FF).
- **240** — Query FDC error code.
  - Read the FDC error/status (ST) after the READ job completes.
- **250** — Begin loop to read 256 bytes ($0300-$03FF).
  - Enter a loop over 256 byte positions in buffer 0 to transfer each byte into the C64 program via the command channel.
- **260** — Two-parameter memory-read.
  - Use the `GET#` statement with two parameters to fetch a byte from buffer 0 into a string variable.
- **270** — Transfer a byte from buffer number 0 to C64 memory by way of the command channel (`GET#15`).
  - Actual per-byte transfer from drive buffer ($0300 + index) into a BASIC string variable using the open command channel.
- **280** — Test for equality with the null string `""`.
  - Check whether the transferred byte/string equals the null/empty string (end-of-transfer detection or zero-value test depending on `GET#` usage).
- **290** — ASCII conversion of a byte.
  - Convert the transferred byte value (likely numeric) into an ASCII representation for printing.
- **300** — Print the status variable (ST), our loop counter, and the ASCII value of the byte.
  - Output the current FDC status (ST), the byte index/counter, and the converted ASCII code or value.
- **310** — Print the byte if it's within printable ASCII range.
  - Conditional printing of the character itself when the byte falls into a printable ASCII range.
- **320** — Terminate comma tabulation.
  - Use a terminating print/formatting statement (comma) to control spacing/column layout.
- **330** — Increment loop counter.
  - Advance the index and repeat until all 256 bytes have been processed.
- **340** — Close the command channel.
  - Close the open device/command channel (channel 15) when done reading/printing.
- **350** — End.
  - Program end/return to READY.

**Subroutine (job submission and polling)**

- **370** — Initialize try counter.
  - Set a TRY counter used by the subroutine to limit retries or timeouts while waiting for job completion.
- **380** — Stuff the track and sector numbers into buffer number 0's header table ($0006-$0007).
  - Place the target track and sector bytes into buffer-0 header locations at $0006 (track) and $0007 (sector) so the drive FDC will use them for the job.
- **390** — Stuff job code number into buffer number 0's job queue table ($0000).
  - Write the job code (job type identifier/command code for READ, SEEK, etc.) into buffer-0 job queue entry at $0000 to enqueue the job for the drive.
- **400–460** — Wait for FDC to complete the job.
  - Poll the drive/job-queue status repeatedly (using the TRY counter for limited retries) until the job-completion bit indicates the job is done.
- **470** — Return with FDC error code in hand.
  - On exit, the subroutine returns control to the caller with the drive's FDC error/status (copied into the program variable ST) for inspection.

## Source Code

```text
110 OPEN 15,8,15
120 PRINT#15,"I0"
130 PRINT#15,"U1"
140 PRINT#15,"U2"
160 T=18
170 S=0
180 GOSUB 370
190 PRINT#15,"B-P 0 0"
200 INPUT#15,ST
220 GOSUB 370
230 PRINT#15,"B-R 0 0"
240 INPUT#15,ST
250 FOR I=0 TO 255
260 GET#15,A$
270 A=ASC(A$)
280 IF A$="" THEN A=0
290 B$=CHR$(A)
300 PRINT ST,I,A;
310 IF A>=32 AND A<=126 THEN PRINT B$;
320 PRINT ", ";
330 NEXT I
340 CLOSE 15
350 END
370 TRY=10
380 PRINT#15,"B-W 0 6";CHR$(T);CHR$(S)
390 PRINT#15,"B-W 0 0";CHR$(128)
400 FOR J=1 TO TRY
410 PRINT#15,"B-R 0 0"
420 INPUT#15,ST
430 IF ST=0 THEN RETURN
440 NEXT J
450 PRINT "JOB TIMEOUT"
460 RETURN
470 RETURN
```

## Key Registers

- **$0000** - RAM - Buffer 0 job-queue entry (job code written here to submit a job)
- **$0006-$0007** - RAM - Buffer 0 header table: $0006 = track, $0007 = sector
- **$0300-$03FF** - RAM - Buffer 0 data area (256 bytes) used as the target for READ into buffer 0

## References

- "basic_job_queue_read_program_listing" — actual BASIC code lines corresponding to these descriptions
- "job_queue_mechanism_and_job_code_bit7" — details on buffer/header/job addresses and job-completion bit semantics