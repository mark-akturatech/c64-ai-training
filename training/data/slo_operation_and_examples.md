# SLO (undocumented) — NMOS 6510: shift memory left then ORA A

**Summary:** SLO (undocumented NMOS 6510) shifts a memory operand left one bit (high bit -> carry), writes the shifted result back to memory, then performs ORA with the accumulator using that memory; affects Carry from the shift and sets N/Z after the ORA. Useful as a combined ASL+ORA replacement and for providing ASL-like addressing modes when clobbering A/flags is acceptable.

## Operation and flags
- Semantics: memory <- memory << 1 (bit7 -> C); A <- A OR memory (new memory value).
- Carry: receives the bit shifted out (original bit7 of memory).
- N and Z: set according to the ORA result (A after OR). They do NOT reflect the shifted memory value directly.
- A is modified by the ORA (so the accumulator is clobbered).
- Memory is modified (the shifted value is written back).
- Use-case constraints: because A and flags are changed by the ORA, SLO is appropriate where clobbering A/flags is acceptable or where A is pre-initialized to a known value (e.g., 0) to obtain specific effects.

## Equivalence
- Effectively equivalent to:
  ASL mem
  ORA mem
  (but ASL sets N/Z from the shifted memory; SLO sets N/Z from the ORA result — a behavioral difference to be aware of)

## Examples and idioms

1) Single-instruction example:
- Assembly: SLO $C010
- Bytes: 0F 10 C0 (opcode + little-endian address)

2) Multibyte arithmetic left-shift and load lowest byte (shorter/faster if A can be zeroed)
- Original (explicit shift chain then load low byte):
  ASL data+0    ; (6)
  ROL data+1    ; (6)
  ROL data+2    ; (6)
  LDA data+0    ; (4)
- Shorter SLO-based sequence (requires A = 0 beforehand):
  LDA #$00      ; (2)   ; A must be zero before SLO
  SLO data+0    ; (6)   ; shifts low byte and ORA (A stays zero OR shifted byte -> loads byte)
  ROL data+1    ; (6)
  ROL data+2    ; (6)
- Notes: This saves bytes/instructions and can be faster; the initial LDA #$00 makes the ORA behave like an LDA of the shifted byte (since A starts 0).

3) Simulating ASL addressing modes that the official ASL instruction lacks
- If clobbering A and flags is acceptable, SLO provides ASL-like effects for addressing modes not present for ASL:
  SLO abs,Y     ; behaves like ASL abs,Y (memory shifted)
  SLO (zp),Y    ; behaves like ASL (zp),Y
  SLO (zp,X)    ; behaves like ASL (zp,X)
- Behavior note: A is changed by the ORA and N/Z reflect the ORA result (not the shifted memory).

## Source Code
```asm
; single-instruction example (absolute)
SLO $C010       ; bytes: 0F 10 C0

; Equivalent expanded form
ASL $C010
ORA $C010

; Multibyte shift - original (longer)
ASL data+0      ; (6) lo byte
ROL data+1      ; (6)
ROL data+2      ; (6) hi byte
LDA data+0      ; (4)

; Multibyte shift - SLO variant (shorter, requires A=0)
LDA #$00        ; (2)  ; A must be zero before reaching here
SLO data+0      ; (6)  ; lo byte shifted and ORA A
ROL data+1      ; (6)
ROL data+2      ; (6)  ; hi byte

; Simulate ASL addressing modes (clobbers A/flags)
SLO abs,Y       ; like ASL abs,Y
SLO (zp),Y      ; like ASL (zp),Y
SLO (zp,X)      ; like ASL (zp,X)
```

Test files / testcases mentioned:
```text
Lorenz-2.15/asoa.prg
Lorenz-2.15/asoax.prg
Lorenz-2.15/asoay.prg
Lorenz-2.15/asoix.prg
Lorenz-2.15/asoiy.prg
Lorenz-2.15/asoz.prg
Lorenz-2.15/asozx.prg
```

## References
- "slo_opcodes_and_flags" — opcode encodings and cycle counts for SLO addressing modes
- "rla_intro_opcodes" — other undocumented combined instructions and patterns (e.g., shift+logic combos)

## Mnemonics
- SLO
- ASO
