# LDTND ($0098) — Number of Open I/O Files / Index to End-of-File Tables

**Summary:** LDTND at $0098 is a Kernal zero-page variable holding the number of currently open I/O files (max 10) and acting as the index into the end-of-file tables that store file numbers, device numbers, and secondary addresses (tables located at 601-631 / $259-$277). OPEN increments it, CLOSE decrements it, and the Kernal CLALL sets it to 0.

## Description
LDTND contains the count of open I/O files and is used as the index into the "end-of-file" tables (file number, device number, secondary address). The stored value ranges from 0 up to a maximum of 10; this value selects the end (next free entry) of the tables found at decimal addresses 601–631 (hex $259–$277).

Behavior:
- OPEN: increments LDTND and appends the file/device/secondary info to the end of the EOF tables.
- CLOSE: decrements LDTND and removes the associated entries from the EOF tables.
- CLALL (Kernal routine): closes all files by setting LDTND to 0, effectively emptying the EOF tables.

Location label from source: "152   $98   LDTND" (zero-page listing index).

## Key Registers
- $0098 - Kernal zero page - Number of open I/O files (0–10) / index into EOF tables (locations 601–631 / $259–$277)

## References
- "ptr1_tape_pass1_error_log_index_0x9e" — expands on other zero-page Kernal control variables
- "kernal_zero_page_overview_0x90_0xff" — overview of the Kernal zero-page area

## Labels
- LDTND
