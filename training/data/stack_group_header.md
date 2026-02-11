# 6502 Stack Group (TSX, TXS, PHA, PHP, PLA, PLP)

**Summary:** Covers 6502 stack operations and transfer instructions (TSX, TXS, PHA, PHP, PLA, PLP). Includes opcodes, cycles, implied addressing, push/pull order, stack page $0100-$01FF behavior, SP wrap semantics, and flag effects (N, V, Z, C, I, D, B).

## Overview
The 6502 uses a hardware stack located in page $01 (addresses $0100-$01FF). The stack pointer (SP) is an 8-bit CPU register that forms the low byte of the effective stack address; the high byte is always $01. The stack grows downward in memory: pushes write to $0100 + SP then decrement SP; pulls increment SP then read from $0100 + SP. SP is 8-bit and wraps (underflow/overflow) within $00-$FF.

Push semantics (PHA, PHP):
- Effective write address = $0100 + SP
- Perform memory store, then SP := SP - 1 (mod 256)

Pull semantics (PLA, PLP):
- SP := SP + 1 (mod 256)
- Read memory from $0100 + SP, then load destination register

PHP/PLP details:
- PHP pushes a copy of the processor status byte. On NMOS 6502 behavior, the pushed byte has the Break flag (bit 4) set to 1 and the unused bit (bit 5) set to 1. PLP pulls a byte and restores status flags (including I, D, V, N, Z, C). Note: some 6502 variants or documentation describe differences for bit 5; see note below.

TSX/TXS:
- TSX transfers SP to X and sets N,Z.
- TXS transfers X to SP and does not affect flags.

**[Note: Source may contain slight implementation differences between 6502 variants regarding the unused bit 5 in the status byte pushed by PHP/BRK; NMOS 6502 commonly sets bit 5 = 1 in the pushed copy.]**

## Instruction details

- TSX
  - Opcode: $BA
  - Bytes: 1
  - Cycles: 2
  - Addressing: implied
  - Operation: X := SP
  - Flags: N,Z updated from result; V and others unchanged
  - Notes: Loads X with the current 8-bit SP value (0x00–0xFF). Useful to examine stack depth.

- TXS
  - Opcode: $9A
  - Bytes: 1
  - Cycles: 2
  - Addressing: implied
  - Operation: SP := X
  - Flags: none affected
  - Notes: Does not set N or Z (unlike most transfer instructions).

- PHA
  - Opcode: $48
  - Bytes: 1
  - Cycles: 3
  - Addressing: implied
  - Operation: push A (store A to $0100+SP; then SP := SP - 1)
  - Flags: none affected

- PLA
  - Opcode: $68
  - Bytes: 1
  - Cycles: 4
  - Addressing: implied
  - Operation: pull A (SP := SP + 1; A := [ $0100 + SP ])
  - Flags: N,Z set from A

- PHP
  - Opcode: $08
  - Bytes: 1
  - Cycles: 3
  - Addressing: implied
  - Operation: push Processor Status (store status byte to $0100+SP; then SP := SP - 1)
  - Flags: none affected
  - Notes: The pushed copy typically has Break flag (bit 4) = 1 and unused bit 5 = 1 on NMOS 6502.

- PLP
  - Opcode: $28
  - Bytes: 1
  - Cycles: 4
  - Addressing: implied
  - Operation: pull Processor Status (SP := SP + 1; P := [ $0100 + SP ])
  - Flags: All status flags updated from pulled byte (N,V,-,B,D,I,Z,C as in byte)
  - Notes: The B flag in P is not a hardware-resident readable flag outside the pushed copy; PLP restores the full flags byte as pulled.

Additional behavioral details:
- Stack address used by pushes/pulls is always in page $01: effective address = $0100 + SP.
- SP arithmetic is modulo 256 (wraps between $00 and $FF).
- PHA and PHP perform memory writes before decrementing SP; PLA and PLP increment SP before the memory read.
- Interrupts (IRQ/BRK/IRQ/NMI) push PC and processor status to the stack using the same stack semantics; BRK pushes status with B=1 (similar to PHP).

## Key Registers
- $0100-$01FF - CPU - Stack page used by PHA/PHP/PLA/PLP (effective address = $0100 + SP)
- SP (Stack Pointer) - CPU register - 8-bit stack pointer (forms low byte of stack address)

## References
- "stack_instructions" — expands on stack operations (push/pull/transfer)

## Mnemonics
- TSX
- TXS
- PHA
- PLA
- PHP
- PLP
