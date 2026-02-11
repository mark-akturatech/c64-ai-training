# Block-read (U1) alternate formats, GET# null workaround, BAM rewrite & error-light behavior

**Summary:** Notes on Commodore block-read command formats (U1), alternate colon/comma/spacing forms for U1/U2, the GET# null-handling workaround, and DOS behavior when closing direct-access channels (BAM rewrite and error-light suppression via reading the error channel). Searchable terms: PRINT#15, U1, U2, GET#, BAM, error light, direct-access channel, memory-read/write, B-P.

**Alternate U1 (block-read) formats**
The block-read command (U1) on the IEC/1541 interface can be sent in multiple syntactic forms differing only in punctuation and spacing; all transmit the same command bytes to the drive. The source lists three basic flavors (semicolons, commas, and spacing variants); the chapter's examples use a single preferred format for consistency.

- Colon vs comma: the drive command token may appear with or without a space after the colon.
- Parameter separators: commas and semicolons are both used in examples (they are syntactic variants inside the quoted command string sent via PRINT#).
- U1/U2: the same colon/comma alternate formatting applies to U1 and U2 command forms.

Practical note from the source: memory-read/write methods may be used instead of the B-P variant for some tasks (B-P unspecified in this excerpt).

**GET# null-handling and combining BASIC lines**
GET# in Commodore BASIC does not interpret null (CHR$(0)) characters correctly, so the source uses a small multi-line sequence (lines 210–220) to handle bytes that may be zero. For efficiency, those lines are often combined into a single BASIC statement; the chapter mentions such a combined form is commonly used.

**DOS behavior: BAM rewrite and error-light suppression**
- When a direct-access channel is closed, the disk DOS attempts to rewrite the BAM (block availability map) to the disk. This means closing direct-access channels can cause the drive to perform a BAM write.
- If a disk is write-protected or protected by DOS, the drive will set the error light. That error light remains lit until the error condition is cleared — the chapter states the error light is suppressed (cleared) by reading the error channel (the drive's error reporting channel).

## Source Code
```basic
PRINT#15,"U1:2;0;18;0"
PRINT#15,"U1:2,0,18,0"
PRINT#15,"U1: 2,0,18,0"
```

```text
--- (original garbled line from source; included verbatim for reference)
A=ASC (B*+CHR* (0> )
```

## References
- "block_read_program_explanation" — expands on suppression of the error light and BAM rewrite behavior
