# NMOS 6510 — ANE ($8B) and TAS → SAX / SP behaviour

**Summary:** Details for ANE opcode $8B (A = (A | CONST) & X & #imm), its instability modes (chip/temperature, RDY effects, weak bits), and a noted NMOS 6510 TAS behaviour: when used with addresses where (H+1) = $FF, TAS reduces to SAX and also sets SP = A & X (useful for loading A&X into SP); not reproducible in visual6502.

**ANE ($8B) — description and instability**
Opcode: $8B  
Mnemonic: ANE #imm  
Function (effective): A = (A | {CONST}) & X & #{imm}  
Size: 2 bytes  
Cycles: 2

Behaviour:
- The opcode ORs the accumulator A with an undocumented internal CONST, ANDs that result with X, then ANDs with the immediate value and stores the final result in A.
- The undocumented CONST is chip- and/or temperature-dependent. Common observed CONST values include $EE, $00, $FF (varies by die and conditions).
- There is some dependency on the RDY line; bit timing can change when RDY is sampled.
- Bits 0 and 4 are observed to be “weaker” than other bits and can drop to 0 in the first cycle of DMA when RDY goes low.
- Practical caveat: Do not rely on ANE with immediate values other than 0, or when A = $FF (both situations can remove the effect of the magic CONST). It is only safe if any bit that could be cleared in A is also 0 in either the immediate or X (or both).

Equivalent sequence (conceptual):
- ORA #{CONST}
- AND #{IMM}
- STX $02    ; hack because there's no single official "AND with X" instruction

**[Note: Source may contain an error — cycle flag/status line in original text appears garbled.]**

**TAS → SAX and SP trick (NMOS behaviour)**
Observed behaviour:
- On some NMOS 6510 implementations, using the TAS opcode with addresses where the high-byte + 1 (H+1) equals $FF (page boundary condition) causes TAS to reduce effectively to SAX (store A & X to memory) and additionally sets the stack pointer (SP) to A & X.
- This can be exploited to load SP with the value A & X for repeated use without further A/X ops. Typical usage pattern: compute A & X once, use TAS at an address meeting the (H+1) = $FF condition to both store SAX and place A&X into SP, then use the updated SP.
- Because TAS and related undocumented behaviours are unstable across chips and conditions, save and restore the original SP when appropriate (e.g., for interrupts, JSR/RTS usage, returning to OS code).
- This TAS -> SAX + SP effect is not reproducible in visual6502; that implies the effect is analog or silicon-dependent and outside digital-cycle-level simulation.

Notes on instability and testing:
- The behaviour is chip- and condition-dependent and may show page-boundary sensitivities.
- Multiple test programs and hardware trials are referenced in the source (not included here); expect instabilities and differences between chips and temperatures.

## Source Code
```asm
; ANE usage example (from source)
ANE #{IMM}
; opcode 8B {IMM}

; Conceptual equivalent steps (not a single real instruction)
; ORA #{CONST}
; AND #{IMM}
; STX $02   ; hack because there is no 'AND WITH X'
```

```asm
; TAS test code demonstrating instabilities and page-boundary behaviours

; Initialize registers
LDA #$AA
LDX #$55

; Set up memory location with high-byte + 1 = $FF
LDY #$FF
STY $01FF

; Execute TAS instruction
TAS $01FF

; Check results
; A & X should be stored at $01FF
; Stack Pointer should be set to A & X
```

## References
- "tas_opcode" — expands on TAS semantics and instability details
- "6502 Instruction Set" — provides detailed information on undocumented opcodes
- "64tass v1.60 r3243 reference manual" — includes information on 6502 illegal opcodes
- "6502 Instruction Tables" — offers opcode tables for standard and undocumented instructions

## Mnemonics
- ANE
- XAA
- TAS
- SHS
