# Build a small jump/loader sequence by poking opcode bytes into zero page and $0600

**Summary:** This sequence writes immediate byte values into zero page and the $0600 memory buffer to assemble a runtime jump/loader. The bytes placed at $0600–$0606 and zero page $51/$03 form a small routine that loads a value into the accumulator, stores it in a memory location, and jumps to a specified address. Searchable terms: $0600, zero page, A9, 4C, STA, LDA, opcode bytes.

**Description**

This routine constructs a small runtime loader/jump by writing opcode and parameter bytes into memory. It uses `LDA #<immediate>` followed by `STA <address>` to place bytes such as $A9, $05, $85, $31, $4C, $AA, $FC into locations beginning at $0600 and into zero page locations (notably $51 and $03).

Intended effect:
- Store $23 into zero page location $51.
- Write a sequence of opcode/operand bytes beginning at $0600 so the code at $0600 forms a small runtime stub (starts with opcode $A9 = LDA #imm).
- Store additional parameter bytes at $0603–$0606 and zero page $03, which are used by the loader/jump to transfer control to a target routine or ROM entry.

The transcription below preserves each `LDA`/`STA` pair and the exact immediate values.

## Source Code

```asm
; Transcribed LDA/STA sequence (immediates shown in hex)
LDA #$23
STA $0051

LDA #$A9
STA $0600

LDA #$05
STA $0601

LDA #$85
STA $0602

LDA #$31
STA $0603

LDA #$4C
STA $0604

LDA #$AA
STA $0605

LDA #$FC
STA $0606

LDA #$E0
STA $0003     ; source shows "STA *03" — interpreted as zero page $03
```

```basic
REM Equivalent BASIC POKE sequence (addresses and values)
POKE 81, 35        : REM POKE $0051 = 0x23 (81 decimal = $51)
POKE 1536, 169     : REM POKE $0600 = 0xA9
POKE 1537, 5       : REM POKE $0601 = 0x05
POKE 1538, 133     : REM POKE $0602 = 0x85
POKE 1539, 49      : REM POKE $0603 = 0x31
POKE 1540, 76      : REM POKE $0604 = 0x4C
POKE 1541, 170     : REM POKE $0605 = 0xAA
POKE 1542, 252     : REM POKE $0606 = 0xFC
POKE 3, 224        : REM POKE $0003 = 0xE0
```

Notes:
- The bytes written at $0600–$0606 form the raw byte sequence:
  ```
  $0600: $A9 $05 $85 $31 $4C $AA $FC
  ```
  This corresponds to the following assembly instructions:
  ```asm
  $0600  A9 05     LDA #$05
  $0602  85 31     STA $31
  $0604  4C AA FC  JMP $FCAA
  ```
  This sequence loads the accumulator with the value $05, stores it in memory location $31, and then jumps to address $FCAA.
- The intent appears to be building both a zero-page value ($51) and the runtime bytes needed for a jump/loader. How those bytes are executed or chained is not included in this chunk.

## References

- "convert_data_to_gcr_with_rom_routines" — expands on conversion done before building the jump/loader
- "wait_loop_and_jump_to_rom" — expands on final synchronization and jump to ROM after the loader is in place
