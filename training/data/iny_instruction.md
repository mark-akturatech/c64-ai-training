# INY — Increment Y register (6502)

**Summary:** INY increments the Y register (implied addressing), opcode $C8, 1 byte, 2 CPU cycles; affects Negative (N) and Zero (Z) flags.

## Description
INY performs an 8-bit increment on the processor Y register: Y := (Y + 1) & $FF. The instruction uses implied addressing and does not access memory.

Flags and effects:
- Zero (Z): Set if result == $00, cleared otherwise.
- Negative (N): Set according to bit 7 of the result (set if result >= $80), cleared otherwise.
- Carry (C): Not affected.
- Overflow (V): Not affected.
- Decimal (D): Not affected (the instruction increments in binary; decimal mode flag is ignored for INY).

Behavior notes:
- The Y register wraps from $FF to $00 (i.e., increment with 8-bit overflow).
- Typical timing on NMOS 6502: 2 CPU cycles.
- Size: 1 byte (opcode only).

## Source Code
```text
Mnemonic  Description                 AddrMode  Opcode  Bytes  Cycles  Flags
INY       Increment the Y register   Implied   $C8      1      2      N,Z
```

```asm
; Example usage (assembly) and machine code bytes
        INY         ; opcode $C8
; Machine code: C8
; Example sequence:
        LDX #$02
        LDY #$FF
        INY         ; Y becomes $00, Z=1, N=0
```

## References
- "inx_instruction" — increment X register (similar behavior)

## Mnemonics
- INY
