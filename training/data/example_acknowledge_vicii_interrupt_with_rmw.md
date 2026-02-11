# NMOS 6510 — acknowledge VIC-II interrupt using a R-M-W instruction (INC $D019 example)

**Summary:** Demonstrates that NMOS 6510 read-modify-write (R-M-W) instructions perform a read followed by a write to the same address. Using an R-M-W instruction such as `INC $D019` issues the write cycle required to acknowledge a VIC-II interrupt (VIC-II interrupt register $D019).

**Description**

On NMOS 6502/6510 CPUs, R-M-W instructions (INC, DEC, ASL, LSR, ROL, ROR) execute by reading the target address, performing the arithmetic or shift operation internally, and then writing the result back to the same address. This write cycle can be utilized to acknowledge or clear bits in memory-mapped I/O registers that require a write operation for such actions.

The VIC-II interrupt register at $D019 is acknowledged by writing a '1' to the appropriate bit(s) that should be cleared. Executing `INC $D019` performs the read-modify-write sequence: it reads the current value at $D019, increments it, and writes the incremented value back. This write operation serves to acknowledge the interrupt.

Sequence (conceptual):

- CPU reads from $D019 (fetches current bits).
- CPU increments the value internally.
- CPU writes the incremented value back to $D019.

Since the write occurs to $D019, the VIC-II recognizes the write and clears interrupt flags according to its write semantics.

## Source Code

```asm
; Example that performs R-M-W on VIC-II interrupt register
    INC $D019    ; perform read-modify-write; the write will acknowledge VIC-II interrupts
```

## Key Registers

- $D000-$D02E - VIC-II - VIC-II register block (includes $D019)
- $D019 - VIC-II - Interrupt status/acknowledge register (write cycles are used to acknowledge/clear interrupts)

## References

- "read_modify_write_dummy_write_behavior" — expands on R-M-W dummy write effect used to acknowledge I/O

## Mnemonics
- INC
- DEC
- ASL
- LSR
- ROL
- ROR
