# Tape loader — Read Header bytes and patch branch

**Summary:** Reads tape header bytes into zero page $07..$0A (one unused, two-byte load address LSB/MSB, two-byte end address+1 LSB/MSB), updates a header-byte counter at $03A1, checks for expected header length via CMP #$0B, and patches byte at $036D to change control flow into the data-reading state. Search terms: $07..$0A, $03A0-$03B1, $036D, INC/LDA/STA, CMP #$0B.

## Description
This code sequence processes incoming header bytes from the tape loader:

- Header layout stored at $07..$0A:
  - $07: unused header byte
  - $08-$09: 2-byte load address (LSB then MSB)
  - $0A-$0B: 2-byte end address+1 (LSB then MSB)
- Execution flow:
  - STA $07 stores the current accumulator value into $07 (record a header byte).
  - INC $03A1 increments memory at $03A1 (used here as a header-byte counter).
  - LDA $03A1 reloads that counter for validation.
  - CMP #$0B compares the counter to expected value $0B (sanity check for header length).
  - If the count is not $0B, BNE branches to $0379 (abort/retry path).
  - If the check passes, A is loaded with #$45 and STA $036D writes that byte into $036D, patching the runtime branch so execution will proceed into the data-reading routine (comment: "Change the branch at $036C, to jump to $03B3").
  - A subsequent BNE $0379 exists at $03B1 (part of prior flow).
- Notes:
  - $03A1 functions as the incremented counter checked against $0B (short parenthetical: counter byte).
  - The code fragment modifies code at $036D at runtime to redirect control flow into the data-reading state.

## Source Code
```asm
; ********************************************
; * Read Header bytes                        *
; ********************************************
03A0  85 07          STA $07        ; Load header at $07..$0A:
03A2  EE A1 03       INC $03A1      ;  2 bytes: Load address
03A5  AD A1 03       LDA $03A1      ;  2 bytes: End address+1
03A8  C9 0B          CMP #$0B
03AA  D0 CD          BNE $0379
03AC  A9 45          LDA #$45
03AE  8D 6D 03       STA $036D      ; Change the branch at $036C, to jump to $03B3
03B1  D0 C6          BNE $0379      ; (6)
; ********************************************
; * Read Header bytes.END                    *
; ********************************************
```

## References
- "read_data_bytes" — expands on Header provides load and end addresses used by the data reader
