# NMOS 6510 undocumented opcode $6B — ARR (AND #imm then ROR)

**Summary:** ARR ($6B) performs A := A AND #imm, then ROR A through the processor carry; updates N/V/Z and C with a non-standard rule (C taken from bit 6 of the rotated result, V = bit6 XOR bit5). In decimal (BCD) mode ARR performs additional BCD-style fixups similar to ADC, adjusting low/high nibbles and affecting the final carry.

## Description
ARR is a two-step undocumented instruction: it ANDs the accumulator with the immediate operand, then rotates the result right through the carry. Flags are updated from the rotated result and (when Decimal flag set) from subsequent BCD corrections.

Binary-mode semantics (D = 0)
- Perform logical AND with immediate: temp = A & imm
- Rotate right through carry: res = (temp >> 1) | (C_in << 7)
- Store result in A
- Set Z if A == 0
- Set N from bit 7 of A
- Set C from bit 6 of A (i.e., C := (A & 0x40) != 0)
- Set V := bit6 XOR bit5 (i.e., V := (((A >> 6) ^ (A >> 5)) & 1) != 0)

Decimal-mode semantics (D = 1)
- The AND+ROR steps are the same as above (the rotate uses the pre-instruction carry).
- After rotation, an ADC-like BCD correction is applied:
  - If low nibble > 9 then add 6 to A (A += 0x06)
  - If high nibble (after any low-nibble adjust) > 0x90 then add 0x60 to A and set C = 1; otherwise clear or leave C = 0 depending on the adjust
- Z and N are set from the final adjusted A; V is still derived from the rotated (pre-adjust) bits as bit6 XOR bit5 in many documented implementations
- The decimal adjustment mirrors ADC's two-step nibble correction; as with other undocumented behaviors, some emulators/CPUs differ on final carry/overflow handling in edge cases

Caveats and implementation notes
- V calculation: widely-observed behavior is V = (bit6 XOR bit5) of the rotated result (i.e., before decimal nibble adjustments). This differs from typical signed-add overflow semantics and is an implementation artifact used by software that relies on ARR.
- Carry after decimal adjustments: in binary mode C is taken from bit 6 of the rotated result; in decimal mode the final C observed by software is commonly the carry resulting from the high-nibble decimal correction (i.e., the add-0x60 step). Emulators and silicon variations may differ on exact timing and corner cases.
- Because ARR is undocumented and behavior varies between NMOS and CMOS 6502-family chips and across emulators, test on target hardware or reference simulators (Visual6502, real NMOS silicon) is recommended.

## Source Code
```asm
; Pseudocode (algorithmic description — not exact CPU microcode)

; Inputs:
;   A        - accumulator
;   imm      - immediate byte
;   C_in     - processor carry flag before instruction (0 or 1)
;   D_flag   - decimal flag (0 = binary mode, 1 = decimal/BCD mode)

; Step 1: AND
temp = A & imm

; Step 2: ROR through carry
res = (temp >> 1) | (C_in << 7)    ; logical rotation right through carry
A = res

; Flags from rotated result (before decimal adjust)
Z = (A == 0)
N = (A & 0x80) != 0
C_from_res = (A & 0x40) != 0
V = (((A >> 6) ^ (A >> 5)) & 1) != 0   ; bit6 XOR bit5

; Decimal mode corrections (if D_flag set)
if D_flag:
    ; low-nibble correction
    if (A & 0x0F) > 9:
        A = A + 0x06

    ; high-nibble correction and final carry
    if (A & 0xF0) > 0x90:
        A = A + 0x60
        C = 1
    else:
        C = 0   ; in many implementations the decimal-adjusted carry becomes the final C

    ; N and Z reflect adjusted A
    Z = (A == 0)
    N = (A & 0x80) != 0
else:
    C = C_from_res

; Final flags: A, N, V, Z, C (I/B/D unaffected except as noted)
```

```text
; Suggested functional test vectors (exercise core behaviors — run on target CPU/emulator)
; Format: initial A, imm, C_in, D_flag => resulting A, C, V, N, Z
; (these are descriptions — run actual tests to capture exact bits on the hardware/emulator)
; 1) A=$FF, imm=$FF, C_in=1, D=0  => A should remain $FF, C=1, V=0, N=1, Z=0
; 2) A=$01, imm=$FF, C_in=0, D=0  => temp=$01, ROR -> res=$00, C_from_res=0, Z=1
; 3) A=$19, imm=$FF, C_in=0, D=1  => temp=$19, ROR-> res=$0C, low nibble>9? no, result adjusted? verify on hardware
; 4) various patterns to validate V = bit6 XOR bit5 and decimal high/low nibble corrections
```

## Key Registers
(none — this chunk documents an opcode, not memory-mapped registers)

## References
- "adc_instruction_decimal_mode" — expands on ADC's BCD correction rules which ARR reuses
- Visual 6502 / 6502.org opcode notes on undocumented instructions — ARR/$6B behavior and test observations
- NESDev / other community documentation on undocumented 6502 opcodes (search "ARR opcode 6B") 

**[Note: Source behavior for the final carry and V in decimal mode shows small variations across documentation and implementations; if exact corner-case behavior matters, validate on the target NMOS 6510 silicon or a cycle-accurate simulator.]**