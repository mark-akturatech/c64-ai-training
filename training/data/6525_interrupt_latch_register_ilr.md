# MACHINE — Interrupt Latch Register (ILR) layout and clearing behavior

**Summary:** ILR (Interrupt Latch Register) is a 5-bit latch (I4..I0) that records pending interrupts; reading the Active Interrupt Register (AIR) updates ILR using the bitwise operation ILR <- ILR xor AIR, toggling ILR bits where AIR has ones.

## Layout
ILR is a 5-bit register with bit fields labeled I4..I0 (MSB to LSB). The register holds latched interrupt flags; each bit is an interrupt latch for a corresponding source.

## Clearing behavior
- ILR is modified when AIR is read.
- The update uses the exclusive-OR equation:
  ILR <- ILR xor AIR
- Effect: any ILR bit corresponding to a '1' in AIR is toggled. In particular, bits where both ILR and AIR are 1 become 0 after the read (they are cleared); bits where ILR=0 and AIR=1 become 1 (latched).

## Source Code
```text
                          Interrupt Latch Register
                          ------------------------
            +----+----+----+----+----+  Clears on Read of AIR Using12345678901234567890
            | I4 | I3 | I2 | I1 | I0 |  Following Equation
            +----+----+----+----+----+  
                                        ILR <- ILR xor AIR
```

## References
- "6525_active_interrupt_register_AIR" — expands on how ILR interacts with AIR when servicing interrupts
- "6525_interrupt_stack_note" — expands on how reads of AIR affect the interrupt stack

## Labels
- ILR
- I4
- I3
- I2
- I1
- I0
