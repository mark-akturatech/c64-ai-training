# Job-queue example: SEEK / READ / WRITE / EXECUTE and error handler (1541 FDC)

**Summary:** This document details the 1541 disk drive's job-queue operations and error handling for SEEK, READ, WRITE, and EXECUTE commands, including error-code conversion and specific job-code semantics.

**Job-queue sequence (example)**

The following example demonstrates a sequence of job-queue operations and their corresponding error handler on the 1541 FDC:

- **SEEK (lines 290–320):** Positions the read/write head to track 18.
- **READ (lines 340–350):** Reads sector 0 of track 18 into buffer number 2 ($0500–$05FF).
- **WRITE (lines 550–560):** Writes the contents of buffer number 2 back to track 18, sector 0.
- **Error handler (lines 770–890):** Converts FDC error codes into IP error codes and manages out-of-range conditions.

**Buffer and sector details:**

- Buffer number 2 corresponds to memory addresses $0500–$05FF.
- Track used in this example: 18; sector: 0.

*Note: Lines 100–530 are referenced as background/setup for the job queue and are described as self-explanatory in the source.*

**Error-code conversion and special cases**

- **Conversion rule:** The error handler adds 18 (decimal) to the FDC error code to derive the IP error code: `IP_error = FDC_error + 18`. This maps FDC errors into the 20–29 range.
- **Out-of-range FDC codes:** FDC error codes of 0 or greater than 11 are treated as TIME OUT errors, reported as `?TIME OUT` in line 820. These indicate severe failures where the job likely did not complete.
- **Automatic VERIFY after WRITE:** A WRITE job code ($90) is automatically followed by an FDC VERIFY ($A0). If the buffer contents and the written sector differ, the FDC reports error code 7, which the handler converts to IP error 25 (WRITE ERROR) as seen around line 840.

**Job codes: BUMP, JUMP, EXECUTE**

- **BUMP ($C0):** Moves the head to track 1; seldom used.
- **JUMP ($D0):** Executes a machine-language routine stored in RAM once and returns; seldom used, with occasional practical applications (e.g., head-mover routines).
- **EXECUTE ($E0):** Executes a machine-language routine with specific preconditions:
  - Ensures the drive is up to speed, the head is on the requested track, and has settled before execution.
  - Non-interruptible; control is not returned to the IP until the routine completes.
  - The routine must change the job-code byte in the job-queue table from $E0 to $01 upon completion to signal the end of execution.

**Job-queue and header-table memory layout**

The 1541 disk drive uses specific memory locations for the job queue and header table:

- **Job Queue:** Located at addresses $0000–$0005. Each byte corresponds to a job code for a specific buffer.
- **Header Table:** Located at addresses $0006–$000F. Each pair of bytes represents the track and sector information for the corresponding buffer.

For example, to set up a READ operation for buffer 2 to read track 18, sector 0:

- Store the track number (18) at $000A.
- Store the sector number (0) at $000B.
- Place the READ job code ($80) at $0002.

This setup instructs the FDC to read the specified track and sector into buffer 2.

**Error handler code (lines 770–890)**

The error handler routine processes the completion status of jobs by examining the job queue and converting FDC error codes to IP error codes.

*Note: The detailed assembly code for lines 770–890 is not included in this document. For comprehensive code listings, refer to the original source or the "Inside Commodore DOS" reference.*

## References

- "Inside Commodore DOS" — provides in-depth information on the 1541's job queue and error handling mechanisms.
