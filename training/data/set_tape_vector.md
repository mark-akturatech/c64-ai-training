# Set tape IRQ vector (ROM): LDA $FD93,X -> STA $0314 / LDA $FD94,X -> STA $0315

**Summary:** Small KERNAL ROM routine that sets the tape IRQ vector by loading two bytes from table at $FD93/$FD94 indexed by X and storing them into $0314/$0315 (IRQ vector low/high). Uses LDA/STA and returns with RTS.

## Description
This 6-byte routine installs a tape-specific IRQ vector pointer in RAM. It:

- Loads the low byte of the vector from $FD93,X and stores it to $0314 (vector low).
- Loads the high byte from $FD94,X and stores it to $0315 (vector high).
- Exits with RTS.

The code expects the X register to hold the index into the table at $FD93/$FD94; the two table bytes form a 16-bit address written to $0314/$0315 so that IRQs branch to the selected tape IRQ handler.

## Source Code
```asm
.,FCBD BD 93 FD  LDA $FD93,X     ; get tape IRQ vector low byte
.,FCC0 8D 14 03  STA $0314       ; set IRQ vector low byte
.,FCC3 BD 94 FD  LDA $FD94,X     ; get tape IRQ vector high byte
.,FCC6 8D 15 03  STA $0315       ; set IRQ vector high byte
.,FCC9 60        RTS             ; return
```

## Key Registers
- $FD93-$FD94 - KERNAL ROM - table bytes for tape IRQ vectors (low/high) indexed by X
- $0314-$0315 - RAM (KERNAL vector area) - IRQ vector low/high used for tape IRQ routing

## References
- "write_tape_leader_irq_routine" — expands on calls that set tape IRQ vector
- "tape_write_irq_routine" — expands on vectors used when writing tape leader/data