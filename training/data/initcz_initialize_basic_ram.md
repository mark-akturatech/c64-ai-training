# INITCZ — Initialize BASIC RAM (KERNAL)

**Summary:** Initializes BASIC runtime structures and zero-page vectors: writes a JMP opcode into JMPER ($54) and USR JMP ($0310-$0312), sets ADRAY1/2 ($03-$06), copies the CHRGET routine and RNDSED data into RAM at $73-$8F, initializes runtime variables (FOUR6 $53, BITS $68, flags $13/$18, TEMPPT $16), sets stack pointers ($01FC-$01FD), queries MEMBOT/MEMTOP via KERNAL ($FF9C/$FF99) and stores TXTTAB/MEMSIZ/FRETOP ($2B/$2C, $37/$38, $33/$34), writes a zero to the start of BASIC and increments TXTTAB.

## Description
This KERNAL routine (INITCZ) performs BASIC startup RAM initialization:

- Writes opcode #$4C (JMP) into JMPER ($54) and assembles the USR JMP instruction into $0310-$0312 so USR vectors point to the ?ILLEGAL QUANTITY handler.
- Stores ADRAY1 and ADRAY2 zero-page pointers ($03/$04 and $05/$06) used by tokenizer/array handling.
- Copies 29 bytes (LDX #$1C loop) from ROM $E3A2.. downward into RAM at $0073..$008F — this contains the CHRGET routine plus RNDSED data placed in RAM for zeropage access.
- Initializes runtime variables:
  - FOUR6 ($53) = #$03 (garbage-collection related)
  - BITS ($68) = #$00
  - input prompt flag ($13) = #$00
  - LASTPT ($18) = #$00
  - TEMPPT ($16) = #$19 (pointer to descriptor stack)
- Sets stack pointer bytes at $01FD/$01FC to #$01 (stack initialization).
- Uses KERNAL calls JSR $FF9C (with SEC set) to read MEMBOT and JSR $FF99 to read MEMTOP. Stores MEMBOT into TXTTAB ($2B/$2C), MEMTOP into MEMSIZ ($37/$38), and copies MEMTOP into FRETOP ($33/$34).
- Writes a zero byte at the address pointed to by TXTTAB (indirect STA ($2B),Y) to mark the start of BASIC text, increments TXTTAB (with carry into $2C) and returns.

The assembly listing below is the canonical reference for exact opcodes, addresses, and register usage.

## Source Code
```asm
.,E3BF A9 4C    LDA #$4C        ; opcode for JMP
.,E3C1 85 54    STA $54         ; store in JMPER
.,E3C3 8D 10 03 STA $0310       ; USRPOK, set USR JMP instruction
.,E3C6 A9 48    LDA #$48
.,E3C8 A0 B2    LDY #$B2        ; vector to $b248, ?ILLEGAL QUANTITY
.,E3CA 8D 11 03 STA $0311
.,E3CD 8C 12 03 STY $0312       ; store in USRADD
.,E3D0 A9 91    LDA #$91
.,E3D2 A0 B3    LDY #$B3        ; vector to $b391
.,E3D4 85 05    STA $05
.,E3D6 84 06    STY $06         ; store in ADRAY2
.,E3D8 A9 AA    LDA #$AA
.,E3DA A0 B1    LDY #$B1        ; vector to $b1aa
.,E3DC 85 03    STA $03
.,E3DE 84 04    STY $04         ; store in ADRAY1
.,E3E0 A2 1C    LDX #$1C        ; copy the CHRGET routine and RNDSED to RAM
.,E3E2 BD A2 E3 LDA $E3A2,X     ; source address
.,E3E5 95 73    STA $73,X       ; destination address
.,E3E7 CA       DEX             ; next byte
.,E3E8 10 F8    BPL $E3E2       ; till ready
.,E3EA A9 03    LDA #$03
.,E3EC 85 53    STA $53         ; store #3 in FOUR6, garbage collection
.,E3EE A9 00    LDA #$00
.,E3F0 85 68    STA $68         ; init BITS, fac#1 overflow
.,E3F2 85 13    STA $13         ; init input prompt flag
.,E3F4 85 18    STA $18         ; init LASTPT
.,E3F6 A2 01    LDX #$01
.,E3F8 8E FD 01 STX $01FD
.,E3FB 8E FC 01 STX $01FC
.,E3FE A2 19    LDX #$19
.,E400 86 16    STX $16         ; TEMPPT, pointer to descriptor stack
.,E402 38       SEC             ; set carry to indicate read mode
.,E403 20 9C FF JSR $FF9C       ; read MEMBOT
.,E406 86 2B    STX $2B         ; set TXTTAB, bottom of RAM
.,E408 84 2C    STY $2C
.,E40A 38       SEC             ; set carry to indicate read mode
.,E40B 20 99 FF JSR $FF99       ; read MEMTOP
.,E40E 86 37    STX $37         ; set MEMSIZ, top of RAM
.,E410 84 38    STY $38
.,E412 86 33    STX $33         ; set FRETOP = MEMTOP
.,E414 84 34    STY $34
.,E416 A0 00    LDY #$00
.,E418 98       TYA
.,E419 91 2B    STA ($2B),Y     ; store zero at start of BASIC
.,E41B E6 2B    INC $2B         ; increment TXTTAB to next memory position
.,E41D D0 02    BNE $E421       ; skip msb
.,E41F E6 2C    INC $2C
.,E421 60       RTS             ; return
```

## Key Registers
- $0053 - RAM (BASIC) - FOUR6 (initialized to #$03, GC related)
- $0068 - RAM (BASIC) - BITS (initialized to #$00)
- $0013 - RAM (zero page) - input prompt flag (initialized to #$00)
- $0018 - RAM (zero page) - LASTPT (initialized to #$00)
- $0016 - RAM (zero page) - TEMPPT (pointer to descriptor stack, set to #$19)
- $0073-$008F - RAM - CHRGET routine + RNDSED copied from ROM ($E3A2..)
- $0054 - RAM (zero page) - JMPER (stores opcode #$4C)
- $0003-$0006 - RAM (zero page) - ADRAY1/ADray2 vectors ($03/$04 and $05/$06)
- $0310-$0312 - RAM (system vectors) - USRPOK/USRADD (USR JMP instruction set to ?ILLEGAL QUANTITY)
- $01FC-$01FD - RAM - Stack pointer bytes (both set to #$01)
- $002B-$002C - RAM - TXTTAB (pointer to start/bottom of BASIC text, set from MEMBOT)
- $0033-$0034 - RAM - FRETOP (set = MEMTOP)
- $0037-$0038 - RAM - MEMSIZ (MEMTOP stored here)

## References
- "initat_chrget_for_zeropage" — CHRGET routine copied into zero page/RAM
- "rndsed_random_seed" — RNDSED random-seed data copied into RAM during init
- "initms_output_powerup_message" — startup message and BASIC bytes-free calculation using TXTTAB/MEMSIZ set here

## Labels
- TXTTAB
- MEMSIZ
- FRETOP
- JMPER
- ADRAY1
- ADRAY2
- FOUR6
- BITS
