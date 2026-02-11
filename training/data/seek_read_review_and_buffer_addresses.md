# SEEK/READ example (Buffer #1) — initialize track 18 / sector 0, SEEK then READ into $0400-$04FF

**Summary:** Example FDC job sequence showing initialization of track ($0008) and sector ($0009) for buffer #1, issuing SEEK then READ jobs, checking FDC error codes, performing a three-parameter memory-read ($0490-$049F), concatenating disk-name bytes into printable ASCII, initializing a try counter, stuffing header and job-code bytes into job-queue slots ($0008/$0009 and $0001), and returning with the FDC error code.

## Procedure and important steps
- Initialize track number to 18 and sector number to 0.
- Issue SEEK for track 18.
- Query FDC error code after SEEK.
- Issue READ of sector 0 on track 18 into working buffer #1 at $0400-$04FF.
- Query FDC error code after READ.
- Perform a three-parameter memory-read of the directory area at $0490-$049F.
- Build (concatenate) the disk name one byte at a time by forcing each byte into the printable-ASCII range ("jamming" bytes into printable ASCII).
- Initialize a try counter before attempting retries.
- Store (poke) the track and sector bytes into buffer #1's header table locations ($0008 for track, $0009 for sector).
- Store (poke) the job code number for buffer #1 into the job-queue table location $0001.
- Wait for the FDC to complete the job (poll/wait loop).
- Return to caller with the FDC error code in hand.

Notes preserved from source:
- Job ordering: always SEEK a track first, then READ a sector.
- After the READ completes, the program reads directory bytes via a three-parameter memory-read at $0490-$049F.
- Disk-name bytes are converted into printable ASCII by per-byte manipulation (described as "jamming" into printable range).
- A try counter is initialized to allow retries; the program waits for FDC completion before returning the error code.

## Key Registers
- $0400-$04FF - RAM - Working buffer #1 (sector buffer)
- $0500-$05FF - RAM - Working buffer #2 (used by next program)
- $0008-$0009 - RAM - Buffer #1 header table: $0008 = track number, $0009 = sector number
- $000A-$000B - RAM - Buffer #2 header table: $000A = track number, $000B = sector number
- $0001-$0002 - RAM - Job-queue table: $0001 = job code for buffer #1, $0002 = job code for buffer #2

## References
- "basic_ui_and_device_open_error_check" — expands on BASIC program start: UI, opening device, and initial error check  
- "job_queue_subroutine_and_error_handler" — expands on job-queue mechanics and error handling used by the examples
