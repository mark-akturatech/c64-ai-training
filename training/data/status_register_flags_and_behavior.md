# 6502 Status Register (P / SR) — flags N V - B D I Z C

**Summary:** Explanation of the 6502 status register flags (N, V, -, B, D, I, Z, C), how Z and N are updated by transfers and ALU ops, Carry usage (buffer/borrow) and its role in comparisons and shifts/rotates, arithmetic flag updates (Z, N, C, V), Overflow (V) semantics for signed arithmetic, Decimal (D) BCD mode for ADC/SBC, Interrupt Disable (I), and Break (B) semantics when SR is pushed/pulled (BRK/PHP vs hardware interrupts, PLP/RTI behavior).

## Status register flags and behavior

- Bit layout (mnemonic order, high to low): N V - B D I Z C
  - N — Negative: set when bit 7 (sign bit) of a result/value is 1; cleared when bit 7 is 0.
  - V — Overflow: set when a two-operand signed binary arithmetic operation produces a signed overflow (operands have the same sign but the result has the opposite sign).
  - - — Ignored: no functional flag bit stored or used by the CPU.
  - B — Break: not an actual hardware-resident flag; only appears in the copy of SR that is pushed to the stack (1 when pushed by BRK or PHP, 0 when pushed by hardware interrupt). When SR is pulled (PLP or RTI), the B bit in the pulled byte is ignored.
  - D — Decimal: when set, ADC and SBC perform Binary-Coded Decimal (BCD) arithmetic.
  - I — Interrupt Disable: when set, maskable IRQ interrupts are inhibited.
  - Z — Zero: set when a result/value is all zeros (0x00); cleared otherwise.
  - C — Carry: used as carry-out (for additions) and borrow flag (for subtractions); also used as an input/output buffer for multi-byte arithmetic and as the bit shifted out/in by shift/rotate operations. Comparisons update C to indicate unsigned >= (set) or < (clear).

Behavioral rules:
- Z and N are always updated:
  - Whenever a value is transferred into a CPU register (A, X, or Y), Z and N are updated from that value.
  - As a result of any logical ALU operation (AND, ORA, EOR, etc.), Z and N are updated.
  - Increment (INC) and decrement (DEC) operations acting on memory locations update Z and N.
- Arithmetic operations (ADD, ADC, SUB, SBC, and other arithmetic op sequences) update Z, N, C and V.
- The Carry flag (C):
  - Acts as the carry-out for additions and as the borrow indicator for subtractions.
  - Is updated by comparisons (CMP, CPX, CPY) in addition to Z and N. (CMP sets C if the tested register >= operand unsigned.)
  - Is also affected by shift and rotate instructions (LSR, ASL, ROR, ROL) — the bit shifted out goes into C and ROR/ROL use C as an input.
- The Overflow flag (V):
  - Reflects signed overflow for arithmetic using two's complement signed bytes (-128..+127).
  - Overflow can only occur when the two operands have the same sign; it is set when the result has a different sign than those operands.
  - Equivalently: V = (carry into sign bit) XOR (carry out of sign bit) for addition (common implementation test).
- Decimal flag (D):
  - When set, ADC and SBC perform decimal (BCD) corrections to compute results in packed BCD; behavior is instruction-specific and depends on operand nibbles and carry.
- Interrupt Disable (I):
  - When set, maskable IRQs are blocked; hardware NMI is unaffected.
- Break (B) semantics:
  - B is not stored internally in SR; it is synthesized when SR is copied to the stack.
  - When PHP or BRK pushes SR to the stack, the pushed copy will have B = 1.
  - When the CPU pushes SR to the stack for a hardware interrupt, the pushed copy will have B = 0.
  - When pulling SR back (PLP) or restoring on RTI, the pulled byte's B bit is ignored (no internal B state).
  - Purpose: allows differentiation between software BRK and hardware interrupts via the pushed SR value on the stack.

- Flag set/clear instructions and branches:
  - Dedicated instructions exist to set/clear many flags (e.g., CLC/SEC, CLD/SED, CLI/SEI, CLV). (Source mentions such instructions exist; it does not list all opcodes.)
  - Conditional branch instructions test Z, N, C, or V to conditionally change control flow (e.g., BEQ/BNE test Z; BPL/BMI test N; BCS/BCC test C; BVS/BVC test V). (Source references branches depend on these flags without enumerating opcodes.)

## Processor stack and data sizes

- Stack: hardware stack page $0100–$01FF, top-down LIFO (stack pointer is 8-bit offset into $0100 page).
- Data sizes: 8-bit bytes; 16-bit words stored low-byte then high-byte (little-endian).
- 16-bit address space (0x0000–0xFFFF).

## References
- "pragmatics_of_comparisons_and_bit" — expands on how compares set flags and how BIT manipulates flags
- "interrupts_and_vectors" — expands on how interrupts interact with SR and stack

## Mnemonics
- AND
- ORA
- EOR
- INC
- DEC
- ADC
- SBC
- CMP
- CPX
- CPY
- LSR
- ASL
- ROR
- ROL
- BRK
- PHP
- PLP
- RTI
- CLC
- SEC
- CLD
- SED
- CLI
- SEI
- CLV
- BEQ
- BNE
- BPL
- BMI
- BCS
- BCC
- BVS
- BVC
