# SHX (undocumented NMOS 6510 opcode entries)

**Summary:** The SHX instruction is an undocumented opcode on the NMOS 6510/6502 processors. It performs a bitwise AND operation between the X register and the high byte of the target address plus one, storing the result in memory. This instruction is known to exhibit unstable behavior under certain conditions.

**Overview**

The SHX instruction is associated with opcode $9E and utilizes the Absolute,Y addressing mode. Its operation involves:

- **Operation:** `Memory[Address] = X & (HighByte(Address) + 1)`

**Instabilities:**

- **RDY Line Behavior:** If the RDY line goes low during the fourth cycle, the value written may not be ANDed with `(HighByte(Address) + 1)`.
- **Page Boundary Crossing:** When adding Y to the target address results in a page boundary crossing, the high byte of the target address is incremented by one and then ANDed with X.

## Source Code

```text
SHX (A11, SXA, XAS, TEX)

Opcode: $9E
Addressing Mode: Absolute,Y
Bytes: 3
Cycles: 5

Operation:
Memory[Address] = X & (HighByte(Address) + 1)

Instabilities:
- RDY Line Behavior: If the RDY line goes low during the fourth cycle, the value written may not be ANDed with (HighByte(Address) + 1).
- Page Boundary Crossing: When adding Y to the target address results in a page boundary crossing, the high byte of the target address is incremented by one and then ANDed with X.

Example:
SHX $6430,Y
; Opcode: 9E 30 64

Equivalent Instructions:
PHP
; Save flags and accumulator
PHA
TXA
AND #$65
; High byte of Address + 1
STA $6430,Y
PLA
; Restore flags and accumulator
PLP
```

## References

- "shy_shy_mnemonic" — expands on related SHY undocumented mnemonic group
- "tas_shs_mnemonics" — expands on adjacent TAS / SHS undocumented mnemonics group
- "NMOS 6510 Unintended Opcodes - No More Secrets" by Groepaz, v0.99, December 24, 2024.

## Mnemonics
- SHX
