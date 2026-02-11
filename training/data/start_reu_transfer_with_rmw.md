# NMOS 6510 — Starting an REU transfer by writing to $FF00 (R-M-W dummy write trick)

**Summary:** Demonstrates using a 6502/6510 Read-Modify-Write (R-M-W) dummy write (e.g., `INC $FF00`) to start a Commodore REU transfer when writing to $FF00; contrasts with a normal LDA/STA sequence and notes it saves three cycles. Searchable terms: $FF00, REU, R-M-W, dummy write, INC, LDA/STA, Indexed Read-Modify-Write.

**Behavior and technique**

Indexed and other read-modify-write (R-M-W) instructions perform a read cycle, then a dummy write of the unmodified value back to the effective address, followed by the actual modified write. That dummy write is a real bus write and can be observed by external hardware (for example, an REU cartridge) as a write to memory.

On a system where an REU (RAM Expansion Unit) monitors writes to a mapped control register at $FF00 (example address used here), using an R-M-W instruction such as `INC $FF00` causes the dummy write portion of the instruction to occur first; the REU will seize the bus on that dummy write and begin its transfer. Because the REU takes the bus at that moment, the subsequent "real" write of the instruction (the post-modify write) never reaches main RAM. This behavior can be exploited to start an REU transfer with fewer CPU cycles than performing an explicit LDA/STA sequence.

Notes from source:

- Indexed Read-Modify-Write instructions do a dummy read and write back the unmodified value before writing the modified value. (The unmodified original data is written back during the dummy write.)
- Using `INC $FF00` instead of `LDA/STA $FF00` causes the REU to seize the bus during the dummy write; the second write of the R-M-W does not reach RAM.
- The trick saves three cycles compared to the LDA/STA approach (as reported in the source).

Caveats:

- This description assumes the REU or other cartridge hardware monitors writes to the example address $FF00; the exact mapped address and REU behavior depend on hardware and mapping.
- Because the "real" write is preempted by the REU, the memory location will not be updated as a normal INC would — the intention is to trigger hardware behavior, not to modify RAM reliably.

## Source Code

```asm
; Baseline: explicit write (example)
; (source text referenced "LDA/STA $FF00")
LDA #$01
STA $FF00

; R-M-W trick: single instruction triggers dummy write
; (source text referenced "INC $FF00" as alternative)
INC $FF00    ; dummy write occurs and can trigger REU; second write never reaches RAM
```

## Key Registers

- $FF00 - Example REU-mapped register/address — write here (dummy write from an R-M-W) is used to start an REU transfer in this example

## References

- "read_modify_write_dummy_write_behavior" — expands on R-M-W dummy write interaction with REU
- "Indexed Read-Modify-Write" — notes that the unmodified original data is written back during the dummy write

## Mnemonics
- INC
