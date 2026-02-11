# Disk buffer byte → displayable ASCII (BASIC subroutine, GOSUB 850)

**Summary:** BASIC subroutine to convert a single disk-buffer byte `c$` into a displayable ASCII/PETSCII character using `ASC(c$)`, `MID$(ss$,...)`, and an `ss$` lookup table; maps control codes (<32) to space and maps high PETSCII range (128–159) to 3-character replacements for screen/printer hex dumps.

**Description**
This short routine normalizes a single byte string `c$` for display in hex-dump ASCII columns:

- If `ASC(c$) < 32`, the byte is replaced with a single space (" ") and the subroutine returns.
- If `ASC(c$)` is outside the 128–159 range (i.e., `ASC(c$) < 128` or `ASC(c$) > 159`), the routine returns with `c$` unchanged.
- If `ASC(c$)` is between 128 and 159 inclusive, `c$` is replaced by a 3-character string taken from the lookup string `ss$` via `MID$(ss$,3*(ASC(c$)-127),3)` and the routine returns.

The intended use is to append the resulting `c$` to a display buffer `b$` when building the ASCII column in a hex dump (used by routines such as `read_and_crt_display` and `printer_display_loop_reading_disk_buffer`). This routine is commonly invoked with `GOSUB 850` from the main dump loop.

Note about the lookup indexing: the code uses `start = 3*(ASC(c$)-127)`. For `ASC=128`, this yields `start=3`; for `ASC=159`, `start=96`. That implies `ss$` must be organized in contiguous 3-character entries and be long enough to provide characters starting at those offsets. **[Note: Source may contain an off-by-one indexing quirk — typical 3-byte-per-entry lookup formulas use `start = 3*(code-128)+1`; here the start formula is `3*(code-127)`, which shifts the start by +2 compared with the more common form.]**

## Source Code
```basic
850 rem******************************
860 rem* disk byte to asc display   *
870 rem* character                  *
880 rem******************************
890 if asc(c$)<32 then c$=" ":return
910 if asc(c$)<128 or asc(c$)>159 then return
920 c$=mid$(ss$,3*(asc(c$)-127),3):return
```

## References
- "read_and_crt_display" — expands on building the ASCII column for screen hex dumps
- "printer_display_loop_reading_disk_buffer" — expands on building the ASCII column for printer hex dumps
- "byte_to_hex_subroutine" — expands on the paired hex-formatting routine used to produce full dump lines
