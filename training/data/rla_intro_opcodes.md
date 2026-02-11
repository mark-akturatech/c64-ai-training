# NMOS 6510 — RLA (RLN) undocumented opcode (ROL then AND)

**Summary:** The RLA (also known as RLN) is an undocumented opcode in the NMOS 6510 processor. It performs a left rotate (ROL) on a memory location and then ANDs the result with the accumulator.

**Description**

RLA is a combined operation that first rotates the bits of a memory location one position to the left (ROL), updating the carry flag accordingly. The rotated value is then ANDed with the accumulator, affecting the negative and zero flags based on the result.

The operation can be broken down as follows:

1. `ROL {addr}` — Rotate the bits of the memory location at `{addr}` one position to the left.
2. `A := A AND {addr}` — Perform a bitwise AND between the accumulator and the rotated value.

This opcode supports multiple addressing modes, each with its own opcode, size, and cycle count.

## Source Code

```text
RLA (RLN)
Type: Combination of two operations with the same addressing mode (Sub-instructions: ROL, AND)

Opc.  | Mnemonic     | Addressing Mode        | Size | Cycles
-----------------------------------------------------------
$27   | RLA zp       | Zero Page              | 2    | 5
$37   | RLA zp,X     | Zero Page,X            | 2    | 6
$2F   | RLA abs      | Absolute               | 3    | 6
$3F   | RLA abs,X    | Absolute,X             | 3    | 7
$3B   | RLA abs,Y    | Absolute,Y             | 3    | 7
$23   | RLA (zp,X)   | Indexed Indirect (X)   | 2    | 8
$33   | RLA (zp),Y   | Indirect Indexed (Y)   | 2    | 8

Function:
{addr} = ROL {addr}
A = A AND {addr}

Flags Affected:
- Negative (N): Set if the result of the AND operation is negative (bit 7 is set).
- Zero (Z): Set if the result of the AND operation is zero.
- Carry (C): Set according to the result of the ROL operation.
```

**Example Usage**


**Edge Cases and Ordering**

The RLA instruction performs the ROL operation first, which updates the carry flag based on the original value's bit 7. The subsequent AND operation does not affect the carry flag but updates the negative and zero flags based on the result. This ordering ensures that the carry flag reflects the result of the rotation, while the negative and zero flags reflect the result of the AND operation.

## Source Code

```assembly
; Example: Rotate the value at memory location $44 left and AND with accumulator
LDA #$FF        ; Load accumulator with $FF
STA $44         ; Store $FF at memory location $44
RLA $44         ; Rotate left the value at $44 and AND with accumulator
; After execution:
; - Memory at $44 contains $FE (original value $FF rotated left)
; - Accumulator contains $FE (result of $FF AND $FE)
; - Negative flag set (bit 7 of accumulator is 1)
; - Zero flag cleared (accumulator is not zero)
; - Carry flag set (bit 7 of original value was 1)
```


## References

- ([c64-wiki.com](https://www.c64-wiki.com/wiki/RLA?utm_source=openai))
- ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.93%20%282018-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))
- ([7800.8bitdev.org](https://7800.8bitdev.org/index.php/6502_opcodes_for_hackers?utm_source=openai))

## Mnemonics
- RLA
- RLN
