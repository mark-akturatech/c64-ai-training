# Clear saved IRQ address high byte ($02A0) and return (RTS)

**Summary:** Clears the saved IRQ return-address high byte at $02A0 and returns (RTS). Used as KERNAL tape-write cleanup after a successful write; contains opcode sequence LDA #$00 / STA $02A0 / RTS.

## Description
This short routine is the final cleanup step executed when a tape write operation completes successfully. It clears the accumulator, stores zero into $02A0 (the saved IRQ return-address high byte in RAM), and returns to the caller with RTS. Clearing $02A0 removes a saved high byte of an IRQ return address used by the tape write/IRQ handling sequence.

Operation, instruction-by-instruction:
- LDA #$00 — load A with zero.
- STA $02A0 — write zero to RAM location $02A0 (saved IRQ address high byte).
- RTS — return from subroutine.

No other side effects are performed here; this routine solely clears the saved IRQ address high byte and returns.

## Source Code
```asm
.,F8DC A9 00    LDA #$00        clear A
.,F8DE 8D A0 02 STA $02A0       clear saved IRQ address high byte
.,F8E1 60       RTS
```

## Key Registers
- $02A0 - RAM - saved IRQ return-address high byte (KERNAL tape write cleanup)

## References
- "tape_write_loop_check_and_irq_reenable" — expands on branch target when tape write done