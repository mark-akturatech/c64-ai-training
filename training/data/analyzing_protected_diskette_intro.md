# 7.4 Analyzing a Protected Diskette

**Summary:** Describes bad-sector (deliberately corrupted track/sector) disk protection techniques and loader protections (autostart, illegal 6502 opcodes, encryption). Explains the "Interrogate Formatting ID's" utility that uses 1541 SEEKs, reads sector header bytes in zero page ($0016-$001A), and prints ID HI/ID LO ($0016/$0017) for each track.

## Overview
Bad-sectoring is the core of many disk-protection schemes: specific tracks or sectors are deliberately corrupted so that the authenticity check (a short loader) depends on an FDC or IP error code as a "password." Loaders are commonly made hard to analyze by autostart features, use of unimplemented 6502 opcodes, encryption, or compilation; attacking a loader directly is difficult, so many defenders go after disk-format-level tricks.

The appendix supplies four interrogation utilities that complement one another:
- Interrogate Formatting ID's — returns embedded disk ID per track via SEEK
- Interrogate a Track — scans a single track and verifies sectors
- Shake, Rattle, and Roll — (utility name listed)
- Interrogate a Diskette — higher-level disk scan

## Interrogate Formatting ID's
- Method: Perform a SEEK to each track (1541 FDC). If the FDC deems the seek successful (at least one intact sector found), the sector header is stored in zero page $0016-$001A. The program reads the ID HI ($0016) and ID LO ($0017), converts them to ASCII, and prints them to the CRT.
- Use: Quickly determines whether a protected disk has blown tracks or multiple embedded IDs per track (multiple ID formatting). It does NOT report the integrity of each individual sector — other routines perform that task.
- FDC hang caveat: Occasionally the 1541's FDC can hang on a track during a SEEK (it may attempt to find a sync mark without timing out). Recovery requires powering off the 1541. This can also occur when interrogating unformatted disks; residual bit patterns from manufacturing/duplication can confuse the FDC.
- Fail-safe mechanism (program structure notes from source):
  - Lines 110–140 establish an "active track" array; all tracks are presumed active initially (line 130).
  - Line 240 tests the integrity flag for a track prior to performing a SEEK; if a track's flag equals 0 the track is bypassed and the program continues.
  - To skip a problematic track manually, patch the active-track array entry, e.g. set T(17)=0.
- Practical note from source: A deliberately blown track used as a deception will not be useful to the protected loader either — its function is merely to discourage inspection.

## Source Code
```basic
145 T(track number) = 0
145 T(17) = 0
```

## Key Registers
- $0016-$001A - Zero Page RAM - Sector header bytes placed here by the FDC after a successful SEEK; $0016 = ID HI, $0017 = ID LO (ASCII printable ID fields).

## References
- "interrogate_formatting_ids" — expands on the Interrogate Formatting ID's utility (returns embedded disk ID per track)
- "interrogate_a_track" — expands on scanning a single track and verifying sectors