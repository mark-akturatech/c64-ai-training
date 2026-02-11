# Start CIA Timer B Single-Shot, Save CRB and ICR Shadow (ROM F943–F951)

**Summary:** This routine initializes CIA 1 Timer B in single-shot mode by writing $19 to the control register at $DC0F, saves the current Interrupt Control Register (ICR) state from $DC0D to RAM address $02A3, and prepares timing constants in $B1. It is part of the cassette read interrupt service routine, handling tape data timing.

**Description**

This code fragment performs the following operations:

- `LDA #$19` / `STA $DC0F` — Configures and starts CIA 1 Timer B in single-shot mode by writing $19 to the Control Register B (CRB) at $DC0F.
- `LDA $DC0D` / `STA $02A3` — Reads the Interrupt Control Register (ICR) at $DC0D and stores a shadow copy at RAM address $02A3.
- `TYA` / `SBC $B1` — Transfers the value of Y (expected to be $FF) into A, then subtracts the value at $B1 (tape timing constant high byte), effectively computing $FF - T2C_h.
- `STX $B1` — Stores the value of X into $B1. (X must have been prepared earlier to hold the low-byte complement used by STX $B1.)

This routine is part of the cassette read interrupt service routine, which handles the timing of data pulses from the tape. The values in $B1 are used to compute the duration of these pulses.

## Source Code

```assembly
.,F943 A9 19    LDA #$19        ; Load Timer B control value: single-shot mode, start Timer B
.,F945 8D 0F DC STA $DC0F       ; Store to CIA 1 Control Register B (CRB)
.,F948 AD 0D DC LDA $DC0D       ; Read CIA 1 Interrupt Control Register (ICR)
.,F94B 8D A3 02 STA $02A3       ; Store ICR shadow copy at $02A3
.,F94E 98       TYA             ; Transfer Y to A (Y is expected to be $FF)
.,F94F E5 B1    SBC $B1         ; Subtract tape timing constant high byte
                                ; A = $FF - T2C_h
.,F951 86 B1    STX $B1         ; Store X to $B1
                                ; $B1 = $FF - T2C_l
```

## Key Registers

- **$DC0F (CRB)**: Control Register B for CIA 1 Timer B. Writing $19 configures Timer B for single-shot mode and starts it.
- **$DC0D (ICR)**: Interrupt Control Register for CIA 1. Reading this register provides the current interrupt status.
- **$02A3**: RAM location used to store a shadow copy of the ICR.
- **$B1**: RAM location used to store the computed tape timing constant low byte.

## References

- "irq_routine_read_t2c_and_compute_difference" — Continuation: computes $FFFF - T2C after the high/low adjustments.
- "compute_shifted_timing_and_threshold_compare" — Continuation: shifts measured interval and performs threshold comparison.

This routine is part of the cassette read interrupt service routine, which handles the timing of data pulses from the tape. The values in $B1 are used to compute the duration of these pulses.

## Labels
- CRB
- ICR
- B1
