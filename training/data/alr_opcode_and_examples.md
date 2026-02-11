# ALR (ASR) — undocumented 6510 immediate combine: AND then LSR ($4B)

**Summary:** Undocumented NMOS 6510 opcode $4B (often called ALR or ASR) performs AND A,#imm followed by LSR A — effective operation A = (A & #imm) >> 1. Size 2, cycles 2; sets C/N/Z according to the LSR result. Useful for mask+shift operations, fetching 2 bits, or moving the LSB into C.

## Description
ALR (opcode $4B) is an undocumented immediate-mode instruction that ANDs the accumulator with the supplied immediate then performs a logical right shift on the accumulator. Semantically equivalent to performing AND #imm followed by LSR A.

- Opcode: $4B
- Mnemonic(s): ALR (also seen as ASR in some docs)
- Size: 2 bytes
- Cycles: 2
- Operation (conceptual): A <- (A AND #imm) >> 1
- Flags:
  - C = bit 0 of (A AND #imm) before the shift (i.e., LSR's shifted-out bit)
  - N = bit 7 of the shifted result
  - Z = set if resulting A == 0
  - Other flags (V, D, I, B) are not affected by this operation beyond the standard behavior of AND then LSR (V unaffected)
- Notes:
  - The AND is applied before the shift, so when pre-shifting bits (e.g., using LSR first) you must adjust the immediate mask accordingly (multiply mask by 2 if you have already shifted right once).
  - This instruction is undocumented — use with caution for cross-CPU compatibility.

**[Note: Source contained a statement that "bit 1 (after the AND) is shifted into the carry". That appears to be an error in the original text — the LSB (bit 0) of the ANDed result is shifted into Carry (standard LSR behaviour).]**

## Use cases / examples (summary)
- Replace two-instruction sequences: AND #imm ; LSR A -> ALR #imm (saves code bytes; same cycles)
- Mask+shift in one instruction (A becomes masked then shifted)
- Fetch two bits (combine LSR + ALR with a mask)
- Move LSB into Carry and clear A, then branch/add based on that bit (useful for conditional offsets depending on even/odd positions)

## Source Code
```asm
; Basic example: AND immediate then LSR
ALR #$FE
; machine code: 4B FE
; Equivalent:
; AND #$FE
; LSR A

; Example: fetch two bits from a byte (mask applied before the ALR shift)
LDA #%10110110
LSR         ; shift down once (bits move into smaller positions)
ALR #$03*2  ; mask bits 2 and 3 of original byte: mask is multiplied by 2 because we already LSR'd once

; Example: use LSB as a conditional offset (move LSB to carry and clear A)
LDA xposl     ; load a value
ALR #$01      ; move LSB to carry and clear A (A becomes (xposl & 1) >> 1 == 0)
BCC +         ; branch if carry clear (LSB was 0)
LDA #$3f      ; carry was set -> load $3F into A
ADC #stuff    ; add with carry as offset
+
; alternative sequence (slower/faster tradeoffs discussed in source)
LDA xposl
ALR #$01
ROR
LSR
ADC #stuff

; Test / reference file mentioned in original source:
; Lorenz-2.15/alrb.prg
```

## References
- "Lorenz-2.15/alrb.prg" — test program for ALR
- "anc_opcode_and_behavior" — related undocumented AND+shift/rotate opcodes and flag behaviors

## Mnemonics
- ALR
- ASR
