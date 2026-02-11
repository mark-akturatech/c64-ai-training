# Full Track 27 — Header & Metadata (Assembler Header Fragment)

**Summary:** Header/initialization fragment for the "Full Track 27" assembler source that checks a memory flag ($0628), prepares an initialization block, creates data, converts blocks to GCR (calls several routines), and builds a small jump/loader sequence at $0600; contains 6502 mnemonics (LDA/CMP/JSR/STA/PLA/TAY/DEY/INX/BNE) and several corrupted tokens (asterisks where $ is likely intended).

**Description**

This chunk is the header/metadata portion of a larger "Full Track 27" source. It:

- Tests a flag/byte at $0628 with `LDA $0628` / `CMP #$43` and branches to HEADER if not equal.
- Saves A on the stack (`TXA` / `PHA`) for later use.
- Contains a "CREATE DATA" loop that appears to write a data stream to a destination.
- Runs a "CONVERT TO GCR" sequence: loads a control byte, stores to work locations ($30/$31), and calls several conversion routines (`JSR` to addresses shown with leading $ — likely ROM/utility addresses).
- Builds a "JUMP INSTRUCTION" / small machine-code loader into memory at $0600: lines store immediate bytes (`LDA #$A9` etc.) into $0600..$0606.
- Ends with `LDA #$E0`, likely preparing a register or a mode byte.

## Source Code

```asm
730  LDA  $0628
740  CMP  #$43
750  BNE  HEADER
760  ;
770  TXA
780  PHA
790  ;

153

800  ; CREATE DATA
810  ;

850  TXA

860  STA  $0500,X

870  INX

880  BNE  DATA

890  ;

900  ; CONVERT TO GCR
910  ;

920  LDA  $00
930  STA  $30
940  LDA  #$03
950  STA  $31
960  JSR  $FE30
970  PLA
980  TAY
990  DEY
1000  JSR  $FDE5
1010  JSR  $FDF5
1020  LDA  #$05
1030  STA  $31
1040  JSR  $F5E9
1050  STA  $3A
1060  JSR  $F7FF
1070  ;

1080  ; JUMP INSTRUCTION
1090  ;

1100  LDA  #$23
1110  STA  $51
1120  ;

1130  LDA  #$A9
1140  STA  $0600
1150  LDA  #$05
1160  STA  $0601
1170  LDA  #$85
1180  STA  $0602
1190  LDA  #$31
1200  STA  $0603
1210  LDA  #$4C
1220  STA  $0604
1230  LDA  #$AA
1240  STA  $0605
1250  LDA  #$FC
1260  STA  $0606
1270  ;

1280  LDA  #$E0
```

## References

- "full_track_27_machine_code_data_blocks" — expands on DATA blobs used by this source
- "formatting_initialization_and_header_building" — expands on shared formatting/header techniques