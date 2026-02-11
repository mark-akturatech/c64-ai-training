# NMI vector entry at $FE43 (SEI; JMP ($0318))

**Summary:** ROM NMI entry at $FE43 disables IRQs with SEI then performs an indirect JMP through the RAM vector at $0318/$0319 (JMP ($0318)), handing control to the actual NMI handler. Searchable terms: $FE43, SEI, JMP ($0318), NMI, $0318.

## Description
This ROM sequence is the fixed NMI entry point invoked by the CPU when a non-maskable interrupt occurs (hardware vectors point to this ROM address). It performs two actions:

- SEI (opcode $78) — set the interrupt-disable flag to prevent IRQs from interfering while the NMI handler runs.
- JMP ($0318) (opcodes $6C $18 $03) — absolute indirect jump that reads a 16-bit target address from memory locations $0318 (low byte) and $0319 (high byte) and transfers execution there.

No local stack/frame or state-saving is performed in this entry; it immediately transfers to the handler pointed to by the RAM vector. The indirect vector at $0318/$0319 is writable RAM, allowing runtime replacement of the NMI handler by changing those two bytes. (6502 indirect-JMP page-boundary bug is not relevant here because the vector is read from $0318/$0319.)

## Source Code
```asm
.; ROM: NMI vector entry
.,FE43 78        SEI             ; disable interrupts
.,FE44 6C 18 03  JMP ($0318)     ; jump to handler address stored at $0318/$0319
```

## Key Registers
- $FE43 - ROM - NMI entry code (SEI; JMP ($0318))
- $0318-$0319 - RAM - NMI handler vector (16-bit pointer to NMI handler)

## References
- "nmi_handler" — actual NMI handler executed via vector

## Labels
- NMI
- NMI_VECTOR
