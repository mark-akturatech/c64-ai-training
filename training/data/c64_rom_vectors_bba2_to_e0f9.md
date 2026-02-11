# MACHINE — Further ROM routines (BBA2–E0F9)

**Summary:** ROM entry points and brief purposes for BASIC floating-point (FAC) memory routines, floating/integer conversions, advanced math and transcendental functions (LOG, SQR, EXP, RND), compare/series evaluation helpers, and Kernal I/O wrappers at addresses $BBA2 through $E0F9. Includes FAC#1/FAC#2 references (5-byte BASIC floating format).

**Overview**
This chunk lists ROM routine entry addresses (hex) and their one-line purposes as found in the C64 BASIC/MACHINE ROM area. Routines operate on BASIC's floating accumulators (FAC#1 and FAC#2 — the two 5-byte BASIC floating registers), evaluate unary/binary operators, perform string/ASCII conversions, run series expansions for transcendental functions, and wrap Kernal calls with error checking (OPEN, CLOSE, LOAD, SAVE, etc.). Use these entries as an index to the ROM: each address is an entry point to a small, self-contained routine used by BASIC and the interpreter.

**Routine map and brief descriptions**
- $BBA2 — Memory to FAC#1: load a floating value from memory into FAC#1.
- $BBC7 — FAC#1 to memory: store FAC#1 to memory.
- $BBFC — FAC#2 to FAC#1: copy FAC#2 -> FAC#1.
- $BC0C — FAC#1 to FAC#2: copy FAC#1 -> FAC#2.
- $BC1B — Round FAC#1: apply BASIC rounding to FAC#1.
- $BC2B — Get sign: retrieve sign of FAC (used by SGN).
- $BC39 — Evaluate SGN: compute sign function.
- $BC58 — Evaluate ABS: compute absolute value.
- $BC5B — Compare FAC#1 to memory: compare FAC#1 with a floating value in memory (used by relational operators).
- $BC9B — Float-fixed: convert between floating and integer/fixed formats.
- $BCCC — Evaluate INT: compute integer part (BASIC INT function).
- $BCF3 — String to FAC: parse numeric ASCII string into FAC (string→float).
- $BD7E — Get ASCII digit: parse next ASCII digit (helper for numeric parsing).
- $BDC2 — Print "IN..": print part of an error message ("IN..." or similar).
- $BDCD — Print line number: print a BASIC line number (used in error messages).
- $BDDD — Float to ASCII: convert FAC to ASCII representation (numeric output formatting).
- $BF16 — Decimal constants: load or handle decimal constant data (BASIC constants table).
- $BF3A — TI constants: load or handle token/constant table for BASIC (tokenized constants).
- $BF71 — Evaluate SQR: compute square root (SQR function).
- $BF7B — Evaluate ^ (raise to power): power operator implementation (both integer/exponent and general).
- $BFB4 — Evaluate - (negative): unary negation handler.
- $BFED — Evaluate EXP: compute exponential (EXP function).
- $E043 — Series evaluation 1: first helper for series expansions (used by LOG/EXP/SIN/COS/ATN).
- $E059 — Series evaluation 2: second helper for series expansions (continuation/loop).
- $E097 — Evaluate RND: random number generator / RND function handler.
- $E0F9 — Kernal calls with error checking: wrapper used to invoke Kernal routines and handle BASIC error reporting.
- $E12A — Perform SYS: call a machine-language routine at an address (BASIC SYS).
- $E156 — Perform SAVE: BASIC SAVE wrapper (saves program to device).
- $E165 — Perform VERIFY: BASIC VERIFY wrapper (verifies program on device).
- $E168 — Perform LOAD: BASIC LOAD wrapper.
- $E1BE — Perform OPEN: BASIC OPEN wrapper (file/channel open).
- $E1C7 — Perform CLOSE: BASIC CLOSE wrapper.
- $E1D4 — Parameters for LOAD/SAVE: parse and check parameters for LOAD/SAVE.
- $E206 — Check default parameters: ensure default device/filename params are set.
- $E20E — Check for comma: helper that parses a comma in parameter lists.
- $E219 — Parameters for open/close: parse/RAM-check parameters for OPEN/CLOSE calls.
- $E264 — Evaluate COS: compute cosine (COS function).
- $E26B — Evaluate SIN: compute sine (SIN function).
- $E2B4 — Evaluate TAN: compute tangent (TAN function).
- $E30E — Evaluate ATN: compute arctangent (ATN function).
- $E37B — Warm restart: BASIC warm start routine.
- $E394 — Initialize: BASIC/MACHINE initialization routine.
- $E3A2 — CHRGET for zero page: CHRGET helper that uses zero page workspace.

**How to use this index**
- Use the listed addresses as ROM entry points when disassembling or calling into the BASIC/MACHINE ROM from machine code (careful: calling convention and preserved registers must be observed).
- FAC routines operate on BASIC's FAC#1 and FAC#2 (the two 5-byte floating accumulators). The series evaluation helpers ($E043/$E059) are invoked by transcendental functions to compute power-series terms.
- Kernal wrappers (starting at $E0F9 and continuations) perform parameter parsing and error checking before invoking the underlying Kernal vectors.

## Source Code
```text
; Disassembly of routine at $BBA2: Memory to FAC#1
BBA2:  STA $22
BBA4:  STY $23
BBA6:  LDY #$04
BBA8:  LDA ($22),Y
BBAA:  STA $65
BBAC:  DEY
BBAD:  LDA ($22),Y
BBAF:  STA $64
BBB1:  DEY
BBB2:  LDA ($22),Y
BBB4:  STA $63
BBB6:  DEY
BBB7:  LDA ($22),Y
BBB9:  STA $66
BBBB:  ORA #$80
BBBD:  STA $62
BBBF:  DEY
BBC0:  LDA ($22),Y
BBC2:  STA $61
BBC4:  STY $70
BBC6:  RTS
```

```text
; Disassembly of routine at $BBC7: FAC#1 to memory
BBC7:  LDX #$5C
BBC9:  .BY $2C
BBCA:  LDX #$57
BBCC:  LDY #$00
BBCE:  BEQ $BBD4
BBD0:  LDX $49
BBD2:  LDY $4A
BBD4:  JSR $BC1B
BBD7:  STX $22
BBD9:  STY $23
BBDB:  LDY #$04
BBDD:  LDA $65
BBDF:  STA ($22),Y
BBE1:  DEY
BBE2:  LDA $64
BBE4:  STA ($22),Y
BBE6:  DEY
BBE7:  LDA $63
BBE9:  STA ($22),Y
BBEB:  DEY
BBEC:  LDA $66
BBEE:  ORA #$7F
BBF0:  AND $62
BBF2:  STA ($22),Y
BBF4:  DEY
BBF5:  LDA $61
BBF7:  STA ($22),Y
BBF9:  STY $70
BBFB:  RTS
```

```text
; Disassembly of routine at $BBFC: FAC#2 to FAC#1
BBFC:  LDA $6E
BBFE:  STA $66
BC00:  LDX #$05
BC02:  LDA $68,X
BC04:  STA $60,X
BC06:  DEX
BC07:  BNE $BC02
BC09:  STX $70
BC0B:  RTS
```

```text
; Disassembly of routine at $BC0C: FAC#1 to FAC#2
BC0C:  JSR $BC1B
BC0F:  LDX #$06
BC11:  LDA $60,X
BC13:  STA $68,X
BC15:  DEX
BC16:  BNE $BC11
BC18:  STX $70
BC1A:  RTS
```

```text
; Disassembly of routine at $BC1B: Round FAC#1
BC1B:  LDA $70
BC1D:  BEQ $BC2A
BC1F:  LDA #$00
BC21:  STA $70
BC23:  LDX #$04
BC25:  LDA $65,X
BC27:  ADC #$00
BC29:  STA $65,X
BC2A:  RTS
```

```text
; Disassembly of routine at $BC2B: Get sign
BC2B:  LDA $66
BC2D:  AND #$80
BC2F:  BEQ $BC35
BC31:  LDA #$FF
BC33:  BNE $BC37
BC35:  LDA #$00
BC37:  STA $6F
BC39:  RTS
```

```text
; Disassembly of routine at $BC39: Evaluate SGN
BC39:  JSR $BC2B
BC3C:  LDA $6F
BC3E:  BEQ $BC44
BC40:  LDA #$01
BC42:  STA $6F
BC44:  LDA $6F
BC46:  STA $61
BC48:  LDA #$00
BC4A:  STA $62
BC4C:  STA $63
BC4E:  STA $64
BC50:  STA $65
BC52:  LDA #$81
BC54:  STA $61
BC56:  RTS
```

## Labels
- CHRGET
