# Compute Header Checksum (EOR *$02FA,X .. *$02FD,X)

**Summary:** Computes a header checksum by XORing four bytes ($02FA–$02FD indexed by X) with EOR and storing the result at $02F9,X; increments header index at $0628 and compares it with stored header index at $0043, looping to the HEADER label if not equal. Uses TXA/PHA to save X (note: clobbers A).

**Description**
This routine accumulates a checksum by EOR'ing four consecutive header bytes addressed using the X index and then stores the resulting checksum byte. After storing, it increments a header counter at $0628 (zero page), loads that counter, compares it with a stored header index at $0043 (zero page), and branches back to the HEADER label if they differ. The sequence ends with TXA / PHA which pushes the X register value onto the stack (TXA transfers X into A, PHA pushes A); this preserves X across later operations but overwrites A.

Behavior notes:
- The EOR sequence assumes the accumulator already contains whatever initial checksum seed is required — the seed or initialization of A is not present in this snippet.
- The store writes the final checksum to the byte at $02F9 indexed by X.
- The compare uses zero-page addresses: $0628 for the current header index/counter and $0043 for the stored header index to determine completion.
- Branch target "HEADER" is referenced but not included here.

**[Note: Source may contain an error — the original comment "Preserves A/X (TXA/PHA)" is misleading: TXA/PHA preserves X by saving it via A onto the stack, but it overwrites A. If A also needs preservation, a separate PHA or other save would be required.]**

## Source Code
```asm
640  EOR  *$02FA,X
650  EOR  *$02FB,X     ; corrected OCR artifact (was "1i02FB,X")
660  EOR  *$02FC,X
670  EOR  *$02FD,X
680  STA  *$02F9,X
690  ; 

700  INC  *$0628
710  LDA  *$0628
720  CMP  *$43
730  BNE  HEADER
740  ;
750  TXA
760  PHA
770  ;
```

## References
- "write_gap_and_header_table" — expands on header bytes that are inputs to this checksum
- "create_data_block_1541_format" — expands on data block creation that uses the validated header