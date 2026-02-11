# Sync marks, $FF and 1541 sync-mode behavior

**Summary:** Defines a sync mark as 10 or more consecutive '1' bits and explains why normal GCR-encoded data cannot accidentally form one; documents the 1541's special-case behavior in sync mode where writing $FF bypasses GCR and the DOS writes five consecutive $FF bytes (40 '1' bits) to guarantee a detectable sync mark.

## What a sync mark is
A sync mark is a run of 10 or more consecutive "on" bits (logical 1s) recorded on disk. The disk controller/disk drive relies on detecting such extended runs of 1s as a synchronization delimiter between data fields; anything shorter than 10 consecutive 1s is not considered a sync mark.

## Why normal data cannot form a sync mark
Commodore's GCR mapping and packing rules were chosen to prevent ordinary (non-sync) encoded data from producing runs of 10 or more 1 bits. Even the single normal data byte with the maximum raw 1-bits, $FF (%11111111), does not create a 10-bit run when written in normal write mode because the byte is first converted/packed into GCR codes (the standard 4->5 packing), which breaks up long runs of 1s. Thus normal GCR-encoded bytes cannot accidentally be interpreted as a sync mark.

## 1541 sync-mode special-case for $FF
In sync write mode the 1541 behaves differently: when instructed to write $FF it does not perform binary-to-GCR conversion. A single raw $FF is only eight consecutive 1 bits and still would not reach the 10-bit threshold, so Commodore's DOS writes five consecutive 8-bit $FF bytes in sync mode. That produces 40 consecutive 1 bits on the medium (an intentional overkill) to guarantee detection of the sync mark on subsequent reads/writes.

## Source Code
```text
# Examples / reference bit patterns (not embedded for search)

Raw $FF byte (binary):
$FF = %11111111   ; eight consecutive 1 bits

Example GCR result for $FF in normal write mode (as given in source):
$FF -> 1010110101   ; GCR form (breaks long runs of 1s)

1541 sync-mode write of $FF:
Writes five consecutive raw $FF bytes:
$FF $FF $FF $FF $FF  => 11111111 11111111 11111111 11111111 11111111
                                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                         40 consecutive '1' bits (guaranteed sync mark)
```

## References
- "gcr_design_constraints_no_sync_confusion_and_max_zero_runs" — explains the purpose of the GCR mapping constraints relative to sync detection
- "gcr_packing_four_bytes_into_five_gcr_bytes_example" — shows how bytes are converted/packed during normal (non-sync) writing
