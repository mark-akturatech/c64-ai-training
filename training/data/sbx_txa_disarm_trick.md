# SBX immediate with TXA — subtract immediate from X while disarming SBX AND (NMOS 6510)

**Summary:** Shows using TXA + SBX #$xx to subtract an immediate from X on NMOS 6510 by making A equal to X (disarming SBX's AND effect). Preserves that A is clobbered, carry handling is unnecessary for this variant, and the sequence costs 4 cycles and 3 bytes.

## Description
SBX (illegal/undocumented 6502/6510 instruction) combines an AND of A with X and a subtraction of an immediate from X. If you make A equal to X first, the AND step does nothing, so SBX behaves as a plain X := X - imm (with A clobbered). The shorter way to make A equal to X is TXA (transfer X to A), so the sequence becomes:

- TXA — sets A = X (clobbers A)
- SBX #$xx — subtract immediate from X while the AND is neutralized

Behavioral notes preserved from source:
- A is clobbered by the sequence (TXA overwrites A).
- Because A == X before SBX, the AND operation has no effect.
- Carry need not be specially handled in this variant (no extra carry setup required).
- Cost: 4 CPU cycles, 3 bytes in memory.

## Source Code
```asm
; Decrement X by immediate with SBX, using TXA to neutralize AND
TXA
SBX #$xx    ; where $xx is the immediate to subtract
; Total: 4 cycles, 3 bytes. A is clobbered (contains former X).
```

## References
- "sbx_decrement_nibbles_example" — expands on uses of SBX in a multi-nibble decrement example; demonstrates similar carry/flag considerations

## Mnemonics
- SBX
- TXA
