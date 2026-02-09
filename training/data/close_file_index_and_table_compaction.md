# Close file index (ROM $F2F2–$F30E)

**Summary:** KERNAL routine at $F2F2–$F30E closes a logical file indexed in X (index copied from A), decrements the open-file count ($0098), and if the closed entry is not the last, copies the last table entry (logical file number, device number, secondary address) down over the closed slot (tables at $0259, $0263, $026D). Clears carry to signal OK and returns (CLC / RTS).

## Description
This routine finalizes the logical-file tables when a file is closed:

- TAX (AA) — copy file index from A into X (X becomes the index of the file being closed).
- DEC $0098 — decrement the KERNAL open-file count stored at $0098.
- CPX $0098 / BEQ $F30D — if the index of the file being closed equals the new open-file count, the closing file was the last entry; nothing needs moving, exit.
- Otherwise, LDY $0098 to use the new count as an index to the last valid table entry, then copy three one-byte fields from slot at Y (the last entry) into the slot at X:
  - logical file number table at $0259
  - device number table at $0263
  - secondary address table at $026D
- CLC — clear carry to indicate success (OK).
- RTS — return to caller.

Registers and side effects:
- X is set to the index of the file being closed (from A via TAX).
- Y is used as an index to the last table slot (loaded from $0098 after decrement).
- A is used as temporary for loads/stores.
- Memory modified: $0098 (decremented) and the three table bytes at $0259+$X, $0263+$X, $026D+$X (possibly overwritten with values from $0259+$Y, $0263+$Y, $026D+$Y).
- Processor flags: CLC clears carry (Carry=0) to signal OK; DEC and CPX also affect N/Z flags as per normal 6502 semantics.

**[Note: Source comment that reads "last+1" appears misleading — the code indexes the last valid entry after decrement (index = $0098), so it copies the current last entry, not a “last+1” slot.]**

## Source Code
```asm
.,F2F2 AA       TAX             copy index to file to close
.,F2F3 C6 98    DEC $0098       decrement the open file count
.,F2F5 E4 98    CPX $0098       compare the index with the open file count
.,F2F7 F0 14    BEQ $F30D       exit if equal, last entry was closing file
                                else entry was not last in list so copy last table entry
                                file details over the details of the closing one
.,F2F9 A4 98    LDY $0098       get the open file count as index
.,F2FB B9 59 02 LDA $0259,Y     get logical file number from logical file table (last entry)
.,F2FE 9D 59 02 STA $0259,X     save logical file number over closed file
.,F301 B9 63 02 LDA $0263,Y     get device number from device number table (last entry)
.,F304 9D 63 02 STA $0263,X     save device number over closed file
.,F307 B9 6D 02 LDA $026D,Y     get secondary address from secondary address table (last entry)
.,F30A 9D 6D 02 STA $026D,X     save secondary address over closed file
.,F30D 18       CLC             flag ok (clear carry)
.,F30E 60       RTS
```

## Key Registers
- $0098 - RAM - KERNAL open-file count (decremented when closing a file)
- $0259 - RAM - logical file number table (per-open-file entries; indexed by X/Y)
- $0263 - RAM - device number table (per-open-file entries; indexed by X/Y)
- $026D - RAM - secondary address table (per-open-file entries; indexed by X/Y)

## References
- "close_specified_logical_file" — expands on device-specific close operations called before this finalization
- "find_file_and_find_file_A" — expands on routines that obtain the open-file count / index used here