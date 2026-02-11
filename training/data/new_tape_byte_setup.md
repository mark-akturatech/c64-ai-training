# Initialise new tape byte (ROM $FB97)

**Summary:** Routine at $FB97 that prepares zero-page tape state for a new byte: sets bit count ($A3), clears tape bit cycle phase ($A4), clears start-bit flags ($A8, $A9) and byte parity ($9B). Uses LDA/STA and returns with RTS.

## Description
This small ROM routine initializes the C64 tape I/O state on the zero page before receiving or sending a new tape byte. It sets the bit counter to 8 and clears the per-byte and per-bit flags used by the tape IRQ/service code:

- $A3 := 8 — number of data bits to process for the upcoming byte.
- $A4 := 0 — tape bit cycle phase (cleared to start a fresh bit timing).
- $A8 := 0 — start-bit first-cycle-done flag (cleared).
- $9B := 0 — byte parity accumulator/flag (cleared).
- $A9 := 0 — start-bit check flag (cleared; indicates no start bit detected yet).

The routine is a leaf helper (JSR target) used when the system prepares to receive/store a new character (see "store_character") and when transmitting bytes to tape (see "tape_write_irq_routine"). It ends with RTS.

## Source Code
```asm
; *** new tape byte setup
.,FB97 A9 08    LDA #$08        ; eight bits to do
.,FB99 85 A3    STA $A3         ; set bit count
.,FB9B A9 00    LDA #$00        ; clear A
.,FB9D 85 A4    STA $A4         ; clear tape bit cycle phase
.,FB9F 85 A8    STA $A8         ; clear start bit first cycle done flag
.,FBA1 85 9B    STA $9B         ; clear byte parity
.,FBA3 85 A9    STA $A9         ; clear start bit check flag, set no start bit yet
.,FBA5 60       RTS              ; return
```

## Key Registers
- $A3 - Zero page (RAM) - bit count for tape byte (initialised to $08)
- $A4 - Zero page (RAM) - tape bit cycle phase (cleared)
- $A8 - Zero page (RAM) - start-bit first-cycle-done flag (cleared)
- $9B - Zero page (RAM) - byte parity accumulator/flag (cleared)
- $A9 - Zero page (RAM) - start-bit check flag (cleared; "no start bit yet")

## References
- "store_character" — expands on calls to JSR $FB97 when preparing to receive/store a new byte
- "tape_write_irq_routine" — expands on use when sending bytes to tape (new byte setup)

## Labels
- $A3
- $A4
- $A8
- $9B
- $A9
