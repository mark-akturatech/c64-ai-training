# NMOS 6510 — TAS / SHS (undocumented opcode $9B)

**Summary:** Undocumented NMOS 6510 opcode $9B, commonly referred to as TAS or SHS, utilizes the absolute,Y addressing mode. It stores the result of (A & X) into memory and sets the stack pointer (S) to the high byte of the effective address plus one. This instruction is part of the set of undocumented opcodes in the 6510 processor.

**Description**

The NMOS 6510 processor includes an undocumented instruction with the opcode $9B, known as TAS (also referred to as SHS in some assemblers). This instruction operates in the absolute,Y addressing mode and performs the following operations:

- **Addressing Mode:** Absolute,Y
- **Opcode Byte:** $9B, followed by a 16-bit little-endian address (low byte, high byte) and indexed by the Y register.
- **Operation:**
  - S := A & X
  - Memory[effective_address] := S & (high_byte(effective_address) + 1)
- **Side Effects:**
  - Stores the result of (A & X) into the memory location specified by the effective address.
  - Sets the stack pointer (S) to the result of (A & X).
  - Does not modify the A, X, or Y registers.
  - **Flag Effects:** This instruction does not affect any processor flags.

**Timing Details:**

- **Cycle Count:** 5 cycles
- **Page-Crossing Penalty:** If the addition of the Y register to the base address causes a page boundary to be crossed, the high byte of the effective address is incremented as expected. However, this incremented high byte is then ANDed with the value stored, which can lead to unintended behavior. To avoid this, ensure that the index does not cause a page boundary crossing. ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.95%20%282020-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))

**Usage Notes:**

- As an undocumented opcode, TAS/SHS is not officially supported and may exhibit unstable behavior under certain conditions.
- The instruction's behavior can be influenced by DMA operations. If a DMA event occurs during the execution of this instruction, the value stored in memory may not be ANDed with the high byte of the effective address plus one, effectively turning the operation into a standard STA instruction. To ensure consistent behavior, avoid executing this instruction during DMA operations. ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.95%20%282020-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))
- Due to its undocumented nature and potential instability, use this instruction with caution and test thoroughly on the target hardware.

## Source Code

```asm
; Example usage of TAS / SHS instruction
        LDA #$12        ; Load A with $12
        LDX #$F0        ; Load X with $F0
        LDY #$10        ; Load Y with $10
        TAS $0300,Y     ; Execute TAS at address $0300 + Y
; After execution:
;  - Memory at $0310 (i.e., $0300 + $10) contains $10 (A & X)
;  - Stack pointer S is set to $F0 (A & X)
```

## References

- ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.95%20%282020-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))
- ([elfqrin.com](https://elfqrin.com/docs/hakref/6502_opcodes.php?utm_source=openai))
- ([masswerk.at](https://masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))

## Mnemonics
- TAS
- SHS
