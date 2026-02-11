# Job-queue core: buffer 0 example (track/sector header + job code polling)

**Summary:** Describes the FDC job-queue mechanism where a subroutine writes track ($0006) and sector ($0007) into the buffer header and writes a job code at $0000, then polls the job byte until the FDC clears bit 7; example uses buffer 0 ($0300-$03FF). Search terms: $0000, $0006, $0007, $0300-$03FF, FDC, job queue, bit 7.

**Mechanism**

- **Buffer mapping (example):** Buffer 0 occupies $0300-$03FF. The example subroutine writes buffer-related control bytes at fixed offsets:
  - $0006 — track (header table entry for this buffer)
  - $0007 — sector (header table entry for this buffer)
  - $0000 — job code (job-queue table entry for this buffer)

- **Job submission:** The subroutine stores the desired track and sector into the header table entries and writes a job code into the job-queue table entry.

- **Job code convention:**
  - Active job codes have bit 7 = 1 (values > 127). This marks the job as “in progress” to the FDC.
  - When the FDC completes the job, it overwrites the job code with an error/result code that has bit 7 = 0 (values < 128).

- **Waiting/polling:** The caller polls the job-byte and loops while bit 7 remains set (1). When bit 7 is cleared (0), the FDC has finished, and the byte now contains the error/result code to inspect.

- **Example references:** The described subroutine is centered in the listing lines referenced (370–470); the wait loop check is noted at the indicated line (460), which waits for bit 7 to clear (and the text references line 410 for the continuation of the wait logic).

## Source Code

```assembly
; Example subroutine to submit a job to the FDC and poll for completion

; Store track and sector in buffer header
LDA #TRACK_NUMBER
STA $0006
LDA #SECTOR_NUMBER
STA $0007

; Write job code to job queue entry
LDA #JOB_CODE
STA $0000

; Poll job byte until bit 7 clears
WAIT_LOOP:
  LDA $0000
  BMI WAIT_LOOP  ; Branch if bit 7 is set
```

## Key Registers

- $0300-$03FF - RAM - Buffer 0 data area (example buffer in this description)
- $0000 - RAM - Buffer 0 job-queue byte (job code written here; bit 7 = 1 while active)
- $0006-$0007 - RAM - Buffer 0 header table entries ($0006 = track, $0007 = sector)

## References

- "basic_job_queue_read_program_listing" — expands where the subroutine writes the track/sector and job code
- "fdc_error_handling_and_job_hierarchy" — expands how to interpret returned FDC error codes after job completion
- "warning_dangers_of_bypassing_parser_and_alignment_requirements" — expands risks when directly manipulating job/header tables and bypassing parser protections