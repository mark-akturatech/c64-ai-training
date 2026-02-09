# KERNAL helper: LDY $B3 / CPY #$02 / RTS (F7D2–F7D6)

**Summary:** KERNAL tiny helper at $F7D2 that loads zero-page $B3 into Y, compares Y with immediate #$02 using CPY (sets Zero/Carry/Negative flags), then RTS; used as a simple flag/selector check.

## Description
This three-instruction routine performs a single comparison and returns to the caller without branching. Sequence:
- LDY $B3 — loads the zero-page byte at $B3 into Y (overwrites Y).
- CPY #$02 — compares Y with #$02 and updates processor status flags (Zero set if Y == #$02; Carry set if Y >= #$02; Negative set from bit 7).
- RTS — returns to caller, leaving the flags for the caller to branch on.

Typical use: the caller executes this routine and then tests the CPU flags (BEQ/BNE for zero, BCS/BCS/BCS for carry, BMI/BPL for negative) to decide control flow. The routine does not preserve Y or other registers and performs no stack changes.

## Source Code
```asm
.,F7D2 A4 B3    LDY $B3
.,F7D4 C0 02    CPY #$02
.,F7D6 60       RTS
```

## Key Registers
- $00B3 - Zero Page - flag/selector byte (loaded into Y and compared to #$02)

## References
- "prepare_channel_registers" — expands on caller that often uses this check