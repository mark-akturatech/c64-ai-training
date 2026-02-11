# 1541 FDC / CBM DOS Error Conditions (read/write)

**Summary:** Describes 1541 FDC and CBM DOS error codes for read/write failures (no-sync/read timeout, header/data block not found, header/data checksum errors, disk ID mismatches, DOS version mismatch, write-protect, write-verify) and the C64 zero-page addresses used ($0012, $0013, $0047, $0101). Terms: FDC, GCR, checksum, EOR, track 18 initialization.

## Overview
This node lists FDC/DOS error conditions returned by the 1541 logic, with the exact low-level causes the firmware checks before reporting each error. It preserves all numeric thresholds and addresses used in the decision logic: sync detection (10+ consecutive one bits), read timeout (20 ms), retry limits (90 attempts), GCR byte counts, independent checksum algorithm (EOR of sector, track, ID LO, ID HI), and the zero-page locations the firmware uses for disk ID, data-block identifier, and DOS version.

**[Note: Source may contain an error — conflicting code for "No Sync": the header lists ($03) while the detailed list shows code 21. The body text uses 21 for "NO SYNC CHARACTER".]**

## Read errors

- 21 READ ERROR — NO SYNC CHARACTER (read-timeout)
  - Cause: FDC did not find a sync mark (defined as 10 or more consecutive "on" bits) on the target track within the time limit.
  - Time limit: 20 milliseconds (timeout).
  - Effect: read attempt aborted; firmware reports the no-sync/read-timeout condition.

- 20 READ ERROR — HEADER BLOCK NOT FOUND (method 1)
  - Cause: After seeking to a track the FDC found a sync character and read the first GCR byte following it. That GCR byte was compared against the expected header identifier (GCR for $52, noted as GCR $52 ($08) in the source) and failed.
  - Retry behavior: The FDC waits for the next sync and repeats; 90 attempts are made before reporting error.

- 20 READ ERROR — HEADER BLOCK NOT FOUND (method 2; GCR-image comparison)
  - Cause: The firmware constructs a GCR image of the expected header using sector number, track number, and the master disk IDs from zero page. The FDC attempts to find a header matching that GCR image on the track. 90 attempts are made before reporting error.

- 27 READ ERROR — CHECKSUM ERROR IN HEADER BLOCK
  - Cause: A header block was found and read; its GCR bytes were decoded to binary. The firmware computes an independent checksum by EORing the sector number, track number, ID LO, and ID HI. This independent checksum is EORed with the checksum byte read from the header; a non-zero result indicates mismatch.
  - Result: FDC signalled a header checksum mismatch (the FDC returned $09 to the error handler per source).

- 29 READ ERROR — DISK ID MISMATCH (read)
  - Cause: The IDs recorded in the header block did not match the master disk ID bytes stored in zero page at $0012 and $0013.
  - Notes: $0012/$0013 are normally updated from track 18 during disk initialization; they can also be updated by a seek to a track from the job queue.

- 22 READ ERROR — DATA BLOCK NOT PRESENT
  - Preconditions: The header block for the target track/sector passed previous checks.
  - Cause: The FDC found the data-block sync mark, read the next 325 GCR bytes into RAM, and decoded them into 260 bytes of binary. The first decoded byte was compared against the preset data-block identifier in zero page at $0047 (normally $07); the comparison failed.
  - Effect: firmware reports missing/invalid data block.

- 23 READ ERROR — CHECKSUM ERROR IN DATA BLOCK
  - Cause: An independent checksum was calculated over the 256-byte data payload decoded from the data block. This checksum did not match the checksum byte read from the disk.
  - Effect: data-block checksum error reported.

- 00, OK
  - Meaning: no error.

## Write-side errors

- 73 DOS MISMATCH (write attempt)
  - Cause: Attempt to write to a diskette with an incompatible DOS format; firmware checks the in-memory DOS version byte at $0101 and expects $41 (CBM DOS V2.6 marker for 1541). If $0101 ≠ $41 the write is rejected.
  - Note: $0101 is normally populated during initialization by reading byte 2 from track 18, sector 0.

- 29 READ ERROR — DISK ID MISMATCH (write)
  - Cause: During a write attempt the header IDs on disk conflicted with the master IDs; same condition as read-side 29 but detected on write.
  - Diagnostic: Repeated occurrences on standard disks often indicate a seating or slow-burning alignment problem.

- 26 WRITE PROTECT ON
  - Cause: Attempted write while disk's write-protect is enabled (tab in place).
  - Remedy: Remove write-protect tab (clear the notch).

- 25 WRITE-VERIFY ERROR
  - Cause: Data written to the sector did not match the data in RAM when read back (write+verify failed).
  - Likely cause: Physical flaw on disk surface.
  - Effect: an unclosed file / corrupt BAM; firmware suggests validating the diskette to repair BAM (referenced in source).

- 00, OK (post-write)
  - Meaning: write succeeded and verified.

## Source Code
```text
Error code table (source listing):
21  - READ ERROR (NO SYNC CHARACTER)         - No sync mark found within 20 ms (10+ consecutive '1' bits)
20  - READ ERROR (HEADER BLOCK NOT FOUND)   - After sync, first GCR byte != expected header id (GCR $52); 90 attempts
20  - READ ERROR (HEADER BLOCK NOT FOUND)   - GCR image of expected header (sector/track/master IDs) not found; 90 attempts
27  - READ ERROR (CHECKSUM ERROR IN HEADER) - Independent EOR(sector,track,ID LO,ID HI) != header checksum; FDC returned $09
29  - READ ERROR (DISK ID MISMATCH)         - Header IDs != master IDs at $0012/$0013 (updated from track 18)
22  - READ ERROR (DATA BLOCK NOT PRESENT)   - Data block decoded: first byte != preset id at $0047 (normally $07)
23  - READ ERROR (CHECKSUM ERROR IN DATA)   - Independent checksum over 256 bytes != disk checksum
00  - OK                                    - No error
73  - DOS MISMATCH (write)                  - DOS version at $0101 != $41 (CBM DOS v2.6)
26  - WRITE PROTECT ON                      - Write-protect tab set
25  - WRITE-VERIFY ERROR                    - Written data did not verify; recommend validating disk/BAM
```

## Key Registers
- $0012 - Zero page - Master Disk ID low (updated from track 18 during initialization or by seek)
- $0013 - Zero page - Master Disk ID high (updated from track 18 during initialization or by seek)
- $0047 - Zero page - Preset data-block identifier (first decoded data byte); normally contains $07
- $0101 - RAM - DOS version byte used for write-compatibility checks; expected $41 for CBM DOS v2.6 (1541)

## References
- "dos_error_tables" — expands on error code table mapping to messages
- "interrogate_track_tools" — expands on how utilities use FDC error codes to analyze protection

## Labels
- MASTER_DISK_ID_LO
- MASTER_DISK_ID_HI
- DATA_BLOCK_ID
- DOS_VERSION
