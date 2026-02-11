# KERNAL: Find file / Find file A (F30F–F31E)

**Summary:** KERNAL file-lookup routines that clear the serial status byte ($0090), prepare the logical file number (TXA), and scan the logical file table at $0259,X using the open-file count ($0098) as an index; returns with A indicating match/no-match.

## Description
Two small KERNAL entry points:

- find a file (entry $F30F)
  - Clears A and the serial status byte ($0090), then copies the logical file number into A (TXA) to prepare for the table search.

- find file A (entry $F314)
  - Uses the open-file count at $0098 to generate an index (LDX $0098 then DEX) and scans the logical file table at $0259,X.
  - If the open-file count is zero (DEX sets negative), it returns immediately (BMI) with A containing the logical file number prepared earlier.
  - Otherwise it compares A with the table entry (CMP $0259,X). If not equal, it decrements the index and repeats until a match is found or the entries are exhausted.
  - On match, RTS returns with A unchanged (the logical file number), allowing the caller to detect a found/not-found condition.

Behavioral notes preserved from listing:
- Serial status byte ($0090) is explicitly cleared before searching.
- Open-file count ($0098) is used as a count; DEX produces the zero-based index for table lookup.
- Logical file table base is $0259; entries are single-byte logical file numbers compared via CMP $0259,X.
- Control flow: loop via BNE back to DEX/CMP; exit via RTS.

## Source Code
```asm
.,F30F A9 00    LDA #$00        clear A
.,F311 85 90    STA $90         clear the serial status byte
.,F313 8A       TXA             copy the logical file number to A

                                *** find file A
.,F314 A6 98    LDX $98         get the open file count
.,F316 CA       DEX             decrememnt the count to give the index
.,F317 30 15    BMI $F32E       if no files just exit
.,F319 DD 59 02 CMP $0259,X     compare the logical file number with the table logical
                                file number
.,F31C D0 F8    BNE $F316       if no match go try again
.,F31E 60       RTS
```

## Key Registers
- $0090 - KERNAL/Zero Page - serial status byte (cleared by find routine)
- $0098 - KERNAL/Zero Page - open-file count (used as index/count)
- $0259 - KERNAL RAM - logical file table base (entries compared to logical file number via $0259,X)

## References
- "set_file_details_from_table" — expands on loading file/device details after a successful find
- "open_channel_for_input" — expands on caller used by input open to validate/open the logical file
- "open_channel_for_output_and_serial_bus_handling" — expands on caller used by output open to validate/open the logical file

## Labels
- FIND_FILE
- FIND_FILE_A
