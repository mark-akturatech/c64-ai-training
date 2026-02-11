# WARNING: DANGERS of Bypassing the 1541 Drive Parser and Working the Job Queue Directly

**Summary:** Bypassing the 1541 drive parser and writing jobs directly to the job queue removes built‑in protection and can cause the FDC/stepper motor to seek invalid tracks (track <1 or >35) or report FDC error 2 (IP 20) for out‑of‑range sectors; keep header‑table, job‑queue, and buffer number alignments exact.

## Drive parser bypass — what can go wrong
- Bypassing the parser hands raw job control to the FDC; the drive will execute exactly the commands it is given with no validity checks.
- Invalid track numbers:
  - If you request a read on an invalid track (example given: track 99), the FDC will attempt to seek that track.
  - The stepper motor can force the read/write head beyond its normal boundaries (less than track 1 or greater than track 35).
  - If the power‑on sequence does not re‑center the head, manual disassembly and repositioning of the head will be required to regain normal operation.
  - The source states: "No damage is done to the 1541 itself," but manual repositioning may still be necessary.
- Invalid sector numbers:
  - Exceeding the sector range for a track will cause the drive to fail to find the sector and report an FDC error 2 (IP 20). This is handled as an FDC error rather than physical stepper movement.
- Job/header table alignment:
  - Header table locations and job queue table locations must be kept consistent with the buffer number being used.
  - A mismatch can cause the FDC to attempt to execute a nonexistent job code or to seek a track/sector out of bounds.
  - Consequences include the drive entering an uncontrolled state; at minimum, you will likely need to power off the drive to regain control.
- Operational reminder: the FDC will do exactly what you tell it; working the job queue directly places you "at the helm" and removes automatic safeguards.

## References
- "job_queue_mechanism_and_job_code_bit7" — expands on why precise header/job table addresses and bit‑handling matter  
- "fdc_error_handling_and_job_hierarchy" — expands on consequences for error handling and the importance of proper job ordering
