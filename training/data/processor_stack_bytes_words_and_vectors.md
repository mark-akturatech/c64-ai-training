# 6502: Stack, Signed Values, System Vectors, Reset Sequence (LIFO $0100-$01FF; $FFFA-$FFFF vectors)

**Summary:** Describes the 6502 processor stack (LIFO at $0100-$01FF), byte/word formats (8-bit bytes, 16-bit little-endian words), two's‑complement signed values, system vectors ($FFFA-$FFFF) and the reset/start sequence (7-cycle start-up, PC loaded from $FFFC/$FFFD).

## Processor stack and data formats
- Stack region: fixed 256-byte page at $0100–$01FF. The stack is last-in first-out (LIFO) and grows downward as values are pushed.
- Stack pointer behavior:
  - When a byte is pushed, it is stored at the address formed by $0100 + SP (SP = stack pointer), then SP is decremented by 1.
  - When a byte is pulled, SP is incremented by 1, then the byte is read from $0100 + SP.
  - The stack pointer is accessible/transferable via TSX (SP -> X) and TXS (X -> SP).
- Push/pull instructions:
  - PHA — push accumulator (A)
  - PHP — push processor status register (SR) (pushes SR with the Break flag set)
  - PLA — pull accumulator
  - PLP — pull processor status register (SR)
- Words (16-bit) are stored little-endian: low byte at the low address, high byte at the next address (LB, HB). This applies to vectors and stored return addresses.
- Numeric formats:
  - Bytes are 8-bit; words are 16-bit.
  - Signed integers use two's-complement, sign bit = bit 7.
    - Examples: %11111111 = $FF = -1; %10000000 = $80 = -128; %01111111 = $7F = +127
  - The processor supports binary-coded decimal (BCD) arithmetic modes (affects ADC/SBC).

## System vectors (interrupt/reset vectors)
- Vectors are 16-bit addresses stored low-byte then high-byte (LB, HB).
- Standard vectors and addresses:
  - $FFFA-$FFFB — NMI (Non-Maskable Interrupt) vector (LB, HB)
  - $FFFC-$FFFD — RESET vector (LB, HB)
  - $FFFE-$FFFF — IRQ/BRK vector (LB, HB)
- On reset the PC is initialized from the RESET vector at $FFFC/$FFFD.

## Reset / start sequence
- The processor has an active-low RESET input; holding it low keeps the CPU in a known disabled/reset state while hardware initializes.
- As RESET is released (goes high) the 6502 performs a start sequence of 7 cycles. At the end of those 7 cycles the program counter (PC) is loaded from the 16-bit RESET vector at $FFFC (low byte, then high byte). On the eighth cycle the CPU transfers control by performing a JMP to that address.
- The reset vector provides the initial PC; any further register or system initialization must be done by the program fetched from that vector.
- [Note: interrupt and JSR/RTS behavior (pushing/pulling PC and SR) is covered in related reference material.]

## Selected instruction summary (transfer / stack / inc/dec / arithmetic)
- Transfer instructions (inter-register and load/store): LDA, LDX, LDY, STA, STX, STY, TAX, TAY, TSX, TXA, TXS, TYA
- Stack-related: PHA, PHP (push SR with Break set), PLA, PLP
- Increment/decrement: DEC (memory), DEX, DEY, INC (memory), INX, INY
- Arithmetic: ADC (add with carry — prepare with CLC), SBC (subtract with carry — prepare with SEC)
- (This list is a focused subset; full opcode details and addressing modes are available in opcode references.)

## Key Registers
- $0100-$01FF - Stack page - 256-byte LIFO stack (SP offsets $00-$FF; stack grows downward)
- $FFFA-$FFFB - NMI vector - 16-bit address (LB, HB)
- $FFFC-$FFFD - RESET vector - 16-bit address (LB, HB)
- $FFFE-$FFFF - IRQ vector - 16-bit address (LB, HB)

## References
- "start_reset_operations" — expanded details on reset/start timing and behavior
- "jump_vectors_and_stack_operations" — how interrupts, JSR/RTS push/pull PC and SR

## Labels
- NMI
- RESET
- IRQ
- STACK
