# NMOS 6510 — Undocumented RRA (aka RRD) Opcodes

**Summary:** Complete listing of the undocumented RRA (sometimes called RRD) opcodes for the NMOS 6510/6502: opcode bytes, instruction lengths, cycle counts, addressing modes, and operation semantics (ROR memory then ADC A, {addr} + C). Notes on how ROR shifts bits, which flags ADC sets (N, V, Z, C), and that RRA inherits ADC's decimal (BCD) behavior.

**Operation**

RRA performs a memory ROR (rotate right) followed by ADC of that memory into the accumulator, affecting the same flags that ADC does.

- **Semantics:** Rotate one bit right in memory, then add the rotated memory byte to A with the carry.
- **ROR behavior:** The memory's least-significant bit (bit 0) is shifted into the processor Carry flag; the previous Carry flag is shifted into memory bit 7.
- **ADC behavior:** The ADC phase uses the rotated memory value and the current Carry flag to compute A ← A + M + C; ADC sets the N (negative), V (overflow), Z (zero), and C (carry) flags based on the addition result.
- **Decimal mode:** RRA inherits ADC's dependency on the Decimal (D) flag — in D=1, the add operates in (undocumented/unintended) decimal (BCD) mode.

Equivalent sequence (behaviorally):

- ROR addr
- ADC addr

Caveat: RRA is an undocumented/illegal opcode — behavior is implementation-dependent in detail, but the described sequence matches NMOS 6502 behavior used in widely circulated test suites.

## Source Code

```text
Opcode summary (addressing mode | instruction length bytes | cycles | opcode)

RRA zp        | 2 bytes | 5 cycles | $67
RRA zp,X      | 2 bytes | 6 cycles | $77
RRA (zp,X)    | 2 bytes | 8 cycles | $63
RRA (zp),Y    | 2 bytes | 8 cycles | $73
RRA abs       | 3 bytes | 6 cycles | $6F
RRA abs,X     | 3 bytes | 7 cycles | $7F
RRA abs,Y     | 3 bytes | 7 cycles | $7B
```

```asm
; Example: rotate memory at $030C right, then add it into A
    RRA $030C         ; bytes: 6F 0C 03

; Equivalent (explicit) sequence:
    ROR $030C
    ADC $030C
```

Test programs/references:

- Lorenz-2.15/rraa.prg
- Lorenz-2.15/rraax.prg
- Lorenz-2.15/rraay.prg
- Lorenz-2.15/rraix.prg
- Lorenz-2.15/rraiy.prg
- Lorenz-2.15/rraz.prg
- Lorenz-2.15/rrazx.prg
- 64doc/droradc.prg

## Mnemonics
- RRA
- RRD
