# DOS Read Error Evaluation — section 7.3 (start)

**Summary:** Describes DOS error-message selection for read operations using FDC job request types, FDC error codes, and IP error codes; introduces the READ ERRORS table headers and begins listing SEEK/READ entries. Mentions that checksum and EOR-based checks are evaluated as part of DOS read error handling.

**Error-evaluation overview**

This section details how the DOS determines the appropriate human-readable error message for a disk read operation. The error selection process involves mapping:

- The FDC job/request type (e.g., SEEK, READ),
- The FDC hardware error code reported by the disk controller,
- The IP (internal processor/I/O processor) error code,

into a corresponding DOS error message. DOS evaluates these fields in a specific order (job/request → FDC code → IP code) to select the resulting error string. Checksum and EOR checks are integral to this decision process (refer to referenced chunks for detailed checksum/EOR logic).

The following table outlines the READ ERRORS mapping:

## Source Code

```text
READ ERRORS Table
| FDC Job Request | FDC Error Code | IP Error Code | DOS Error Message                     |
|-----------------|----------------|---------------|---------------------------------------|
| SEEK            | $03 (3)        | 21            | No Sync Character                     |
| SEEK            | $02 (2)        | 20            | Header Block Not Found                |
| SEEK            | $09 (9)        | 27            | Checksum Error in Header Block        |
| SEEK            | $0B (11)       | 29            | Disk ID Mismatch                      |
| READ            | $02 (2)        | 20            | Header Block Not Found                |
| READ            | $04 (4)        | 22            | Data Block Not Present                |
| READ            | $05 (5)        | 23            | Checksum Error in Data Block          |
| READ            | $01 (1)        | 0             | OK                                    |
```

## References

- "header_checksum_example_step_by_step" — expands on Checksums are evaluated as part of DOS read error handling
- "checksums_intro_and_eor_truth_table" — expands on the EOR-based checksum concept used in DOS error detection
