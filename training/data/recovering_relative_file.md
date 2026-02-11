# Recovering a Relative (REL) File — Section 8.4

**Summary:** Recover a REL file by opening it for reading and copying it record-by-record into a sequential file; the recovery program must skip records that trigger errors so it continues and preserves intact records. If you cannot perform record-by-record copying, seek an experienced programmer.

**Recovering a Relative File**

Open the REL file for reading and copy each record individually into a new sequential file. The recovery routine must not abort on read errors; when a record read fails, skip that record and continue with the next. Using this method, only records that are wholly or partially located on the damaged sector(s) will be lost; intact records are preserved.

If you do not know how to implement record-by-record copying (handling failed reads, continuing past errors, and writing successful records to a sequential file), take the diskette to an experienced programmer for assistance.

## References

- "recovering_hard_error" — expands on why REL files require a different approach than the PRG/SEQ hard-error recovery procedure
