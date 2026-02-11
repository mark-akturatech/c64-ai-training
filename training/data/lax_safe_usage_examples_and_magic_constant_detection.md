# NMOS 6510 — LAX immediate (undocumented) examples and reading the "magic constant"

**Summary:** Examples for the undocumented LAX immediate opcode (opcode $AB) on NMOS 6510 / 6502: safe-use patterns LAX #$00 and LAX #<value> when A=$FF, and a short sequence to read the chip-dependent "magic constant" into A and X. Warns that the constant is unstable across chips, temperature, and supply voltage.

**Behavior and safety**
- LAX immediate (opcode $AB) is an undocumented/illegal 6502/6510 opcode. Its behavior can include an undocumented "magic constant" affecting the result on some chips/emulators.
- Two safe patterns avoid the magic-constant corruption:
  - LAX #$00 (AB 00) reliably clears A and X — equivalent to LDA #$00 ; TAX — because using 0 as the immediate value removes the effect of the magic constant.
  - LAX #<value> is safe when the accumulator A already contains $FF: with A=$FF beforehand, LAX #<value> behaves like LDA #<value> ; TAX — A=$FF neutralizes the magic constant.
- The immediate opcode byte is $AB for LAX immediate. Do not depend on the undocumented behavior for production code: it varies by chip revision, temperature, and supply voltage (i.e., unstable), and emulator behavior may differ.

**Reading the machine's magic constant**
- To experiment and see the magic constant in effect on a particular machine:
  1. LDA #$00
  2. LAX #$FF
- After those two instructions, A and X will contain the machine-specific magic constant. This is intended for experimentation only; the value can change with chip, temperature, supply, and over time, so do not rely on it.

## Source Code
```asm
; Example: clear A and X (safe)
        LAX #$00       ; opcode: AB 00
; equivalent to:
;       LDA #$00
;       TAX

; Example: load A and X with same value (safe when A was $FF beforehand)
        ; (assumes A == $FF)
        LAX #<value>   ; opcode: AB <value>
; equivalent to:
;       LDA #<value>
;       TAX

; Example: read the 'magic constant' into A and X (for experimentation)
        LDA #$00
        LAX #$FF       ; opcode: AB FF
; After this A and X contain the machine's magic constant (unstable)
```

```text
Machine code bytes shown:
AB 00    ; LAX #$00
AB xx    ; LAX #<value>
AB FF    ; LAX #$FF (used after LDA #$00 to read constant)
```

**Internal Mechanism of the Magic Constant**
- The LAX immediate instruction (opcode $AB) is a combination of LDA and LDX operations. During its execution, both the accumulator (A) and the X register are loaded with the immediate value. However, due to the simultaneous enabling of the 'output accumulator' signal and the 'feed output bus to input bus' signal, a race condition occurs. This race condition can cause the immediate value to be merged with the current contents of the accumulator, resulting in the "magic constant." Factors such as chip revision, temperature, and supply voltage can influence this behavior, making it unpredictable. ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))

**Timing and Cycle Counts**
- The LAX immediate instruction (opcode $AB) operates similarly to the LDA immediate instruction in terms of timing. It is a 2-byte instruction and typically executes in 2 clock cycles. However, due to its undocumented nature and potential instability, exact cycle counts can vary depending on the specific NMOS 6510 revision and operating conditions. ([elfqrin.com](https://elfqrin.com/docs/hakref/6502_opcodes.php?utm_source=openai))

## References
- "lax_opcode_example_lax_ff" — expands on raw example where the magic constant manifests (shows why using $00 or $FF is safe)
- "lax_wizball_emulator_recommendation" — empirical emulator guidance and problematic magic-constant values
- "NMOS 6510 Unintended Opcodes - No More Secrets" — detailed analysis of undocumented opcodes and their behaviors ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))
- "MOS 6502 6510 65xx CPU processor opcodes" — comprehensive list of opcodes and their cycle counts ([elfqrin.com](https://elfqrin.com/docs/hakref/6502_opcodes.php?utm_source=openai))

## Mnemonics
- LAX
