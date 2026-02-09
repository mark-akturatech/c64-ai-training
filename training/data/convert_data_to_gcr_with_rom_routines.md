# Convert assembled data block to GCR (calls ROM routines)

**Summary:** Converts an assembled data block into GCR (Group Code Recording) by initializing a zero-page pointer ($0030/$0031), calling ROM/KERNAL routines ($FE30, $FDE5, $FDF5, $F5E9, $F78F), restoring registers via PLA/TAY/DEY, and storing the conversion result into zero page $003A.

**Description**
This routine prepares a pointer in zero page ($30/$31), invokes ROM routines to perform a GCR conversion of a previously assembled data block (1541-format data), and saves the result in zero page for later use. Sequence:

- Clear A and store $00 into $30 (zero-page low byte).
- Load a pointer operand (ambiguous token in source) and store into $31 (zero-page high byte) to form a 16-bit pointer at $0030/$0031.
- JSR $FE30 — first ROM entry for conversion (called with pointer in $30/$31).
- Pull a value from the stack into A, transfer A→Y, decrement Y (PLA / TAY / DEY) — restores/adjusts Y from saved state.
- JSR $FDE5 and JSR $FDF5 — additional ROM routines in the conversion sequence.
- Load another pointer operand (ambiguous token) and store into $31, then JSR $F5E9.
- STA $003A — store conversion result/status into zero page $003A.
- JSR $F78F — final ROM routine call referenced by the sequence.

This chunk is the GCR conversion step; subsequent chunks assemble a jump/loader into a buffer after conversion.

## Source Code
```asm
880  ;*  CONVERT  TO  GCR  * 
890  ; 

900  LDA  #$00
910  STA  $30
920  LDA  4**03
930  STA  $31
940  JSR  $FE30
950  PLA
960  TAY
970  DEY
980  JSR  $FDE5
990  JSR  $FDF5
1000 LDA  4**05
1010 STA  $31
1020 JSR  $F5E9
1030 STA  $3A
1040 JSR  $F78F
1050 ;
```

## Key Registers
- $0030-$0031 - Zero Page - pointer to data block to convert (low/high)
- $003A - Zero Page - stored conversion result/status
- $FE30 - ROM/KERNAL - ROM routine called early in conversion sequence (JSR)
- $FDE5 - ROM/KERNAL - ROM routine called during conversion
- $FDF5 - ROM/KERNAL - ROM routine called during conversion
- $F5E9 - ROM/KERNAL - ROM routine called after pointer update
- $F78F - ROM/KERNAL - final ROM routine called

## Incomplete
- Missing/Unreadable: Operand tokens "4**03" and "4**05" are ambiguous (OCR/corruption) — original 16-bit pointer sources are unclear.
- Missing: Context showing what was pushed to the stack prior to PLA (required to know what PLA/TAY/DEY restores).
- Missing: Any comments or labels identifying the ROM routine purposes (the source only lists addresses).

## References
- "create_data_block_1541_format" — what data is converted to GCR
- "build_jump_loader_code_in_buffer" — assembling a jump/loader sequence after GCR conversion