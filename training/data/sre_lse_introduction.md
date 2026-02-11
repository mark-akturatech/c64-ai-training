# NMOS 6510 — SRE (aka LSE) Undocumented Opcode (LSR then EOR)

**Summary:** The SRE (also known as LSE) is an undocumented opcode in the NMOS 6510 processor that performs a logical shift right (LSR) on a memory location, stores the result back to memory, and then performs an exclusive OR (EOR) between the accumulator and the shifted memory value.

**Description**

The SRE instruction combines two operations using the same addressing mode:

1. **LSR (Logical Shift Right):** Shifts the bits of the memory operand one position to the right.
2. **EOR (Exclusive OR):** Performs an exclusive OR between the accumulator and the shifted memory value.

**Function:**

- Memory effect: `{addr} = {addr} / 2`
- Accumulator effect: `A = A EOR {addr}`

**Type:** Combination instruction (Sub-instructions: LSR, EOR)

**Addressing Modes and Opcodes:**

The SRE instruction supports the following addressing modes:

- Zero Page
- Zero Page,X
- (Zero Page,X)
- (Zero Page),Y
- Absolute
- Absolute,X
- Absolute,Y

The corresponding opcodes, sizes (in bytes), and cycle counts are detailed in the table below.

## Source Code

```text
SRE (LSE)
Type: Combination of two operations with the same addressing mode (Sub-instructions: LSR, EOR)

Opcode  Mnemonic        Addressing Mode       Size (Bytes)  Cycles
$47     SRE zp          Zero Page             2             5
$57     SRE zp,X        Zero Page,X           2             6
$43     SRE (zp,X)      (Zero Page,X)         2             8
$53     SRE (zp),Y      (Zero Page),Y         2             8
$4F     SRE abs         Absolute              3             6
$5F     SRE abs,X       Absolute,X            3             7
$5B     SRE abs,Y       Absolute,Y            3             7
```

**Flag Effects:**

- **Carry (C):** Set to the value of the bit shifted out during the LSR operation.
- **Zero (Z):** Set if the result of the EOR operation is zero; cleared otherwise.
- **Negative (N):** Set if the most significant bit of the EOR result is set; cleared otherwise.
- **Overflow (V):** Not affected.

**Example Usage:**

```assembly
SRE $C100,X  ; Opcode: $5F 00 C1
; Equivalent to:
; LSR $C100,X
; EOR $C100,X
```

**Timing Notes:**

The cycle counts listed in the table are typical for each addressing mode. However, when using indexed addressing modes (e.g., Absolute,X or Absolute,Y), if the effective address crosses a page boundary, an additional cycle is required. Therefore, the actual cycle count may be one cycle higher in such cases.

## References

- "NMOS 6510 Unintended Opcodes No More Secrets"
- "C64 Studio"
- "MOS 6502 6510 65xx CPU Processor Opcodes - ElfQrin.com"
- "6502/6510/8500/8502 Opcodes"

## Mnemonics
- SRE
- LSE
