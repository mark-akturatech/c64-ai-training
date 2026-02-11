# NMOS 6510 — ISC increment idioms (INC substitutes & addressing modes)

**Summary:** Practical ISC (illegal opcode) idioms for NMOS 6510 that replace INC+LDA+CMP or INC+LDA sequences to save cycles/bytes and to provide INC-like behavior for addressing modes INC lacks; requires A = 0 and C = 0 in the caller, and watch decimal-mode caveats (BCD).

**Technique**
ISC is an undocumented/illegal 6502 opcode that can behave like INC (memory increment) plus additional side effects. When conditions are controlled (A known zero, carry cleared), ISC can be used to:
- Replace an INC followed by LDA+CMP pattern to save cycles and a load.
- Replace INC+LDA for indexed loads, saving code size and sometimes cycles.
- Emulate INC with addressing modes that the official INC instruction does not support (abs,Y, (zp),Y, (zp,X)), provided calling code ensures the required A/C state.

Conditions required for correct substitution:
- A must be 0 before the ISC instruction when relying on ISC to load the incremented byte into A in a predictable way.
- The carry flag C must be cleared when the idiom depends on ISC producing INC semantics.
- Be aware of decimal (BCD) mode interactions — decimal-mode behavior may change results; see referenced material for SBC/decimal caveats.

**Examples**

- Incrementing loop counter (saves a cycle when counter is in zero page)

Original (INC + LDA + CMP + branch):

Replacement using ISC (saves a cycle; A ends up zero after sequence):

Notes: SEC sets carry for the ISC sequence. This combines increment and compare with the loaded immediate.

- Increment indexed and load value (A is zero and C=0 before reaching here; saves a byte and can be faster)


- Simulate extra addressing modes for INC (only if A=0 and C=0 before ISC)

Caveat: These emulations rely on ISC's particular opcode variants — consult opcode/encoding references for which ISC encodings support which addressing modes.

## Source Code

```asm
; Original
INC counter
LDA counter
CMP #ENDVALUE
BNE nooverflow
```

```asm
; Replacement using ISC (zero page counter is faster)
LDA #ENDVALUE
SEC
ISC counter
BNE nooverflow
STA counter
; Bonus: A is always 0 here
```

```asm
; Original (requires A to be zero beforehand)
INC buffer, x
LDA buffer, x
```

```asm
; Replacement using ISC (saves a byte if buffer is in non-zero-page memory)
; A is zero and C=0 before reaching here
ISC buffer, x
EOR #$ff
```

```asm
; A is zero and C=0 before reaching here
ISC abs, y     ; behaves like INC abs,Y
ISC (zp), y    ; behaves like INC (ZP),Y
ISC (zp, x)    ; behaves like INC (ZP,X)
```

```asm
; Example: incrementing loop counter
; Instead of:
; INC counter
; LDA counter
; CMP #ENDVALUE
; BNE nooverflow

; Replacement:
LDA #ENDVALUE
SEC
ISC counter
BNE nooverflow
STA counter
; Bonus: A is always 0 here

; Example: increment indexed and load value
; Instead of:
; INC buffer, x
; LDA buffer, x

; Replacement:
; A is zero and C=0 before reaching here
ISC buffer, x
EOR #$ff

; Example: simulate extra addressing modes for INC
; If you can make sure that A is 0 and C is cleared, ISC turns into INC and makes addressing
; modes available that do not exist for regular INC:
; A is zero and C=0 before reaching here
ISC abs, y
; like INC abs, y
ISC (zp), y
; like INC (zp), y
ISC (zp, x)
; like INC (zp, x)
```

## Key Registers
- **A (Accumulator):** Must be 0 before executing ISC for predictable behavior.
- **C (Carry Flag):** Must be cleared before executing ISC to emulate INC behavior.

## References
- "isc_opcode_variants_and_addressing_modes" — expands which ISC addressing modes/opcodes allow the described examples
- "isc_operation_equivalents_and_tests" — expands on semantics (INC then SBC) and decimal-mode caveats to be aware of when using the examples

## Mnemonics
- ISC
