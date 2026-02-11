# Scan STOP key routine (C64 ROM)

**Summary:** Reads zero-page stop-key column ($0091), compares to STOP pressed value (#$7F), and if equal saves processor flags (PHP), calls KERNAL JSR $FFCC to close I/O channels, stores the keyboard buffer index into $00C6, restores flags (PLP), and returns (RTS). Returns Z = 1 when STOP is detected.

## Description
This ROM routine checks whether the STOP key was the only key pressed in the saved keyboard column. Sequence:

- LDA $0091 — load the saved stop-key column (zero page $91).
- CMP #$7F — compare with the STOP-down pattern; sets Z if equal (STOP only).
- BNE skip — if not equal, branch to RTS (no STOP).
- If equal:
  - PHP — push processor status to stack to preserve flags.
  - JSR $FFCC — call KERNAL routine (close input/output channels as used by the C64 ROM).
  - STA $00C6 — store the current keyboard buffer index into zero page $C6.
  - PLP — restore processor status from stack.
- RTS — return to caller with Z set if STOP matched.

Behavioral notes preserved from source: the routine only acts when the saved column equals #$7F (indicating STOP alone), and it preserves processor flags across the KERNAL call by pushing and pulling the status register.

## Source Code
```asm
                                *** scan the stop key, return Zb = 1 = [STOP]
.,F6ED A5 91    LDA $91         read the stop key column
.,F6EF C9 7F    CMP #$7F        compare with [STP] down
.,F6F1 D0 07    BNE $F6FA       if not [STP] or not just [STP] exit
                                just [STP] was pressed
.,F6F3 08       PHP             save status
.,F6F4 20 CC FF JSR $FFCC       close input and output channels
.,F6F7 85 C6    STA $C6         save the keyboard buffer index
.,F6F9 28       PLP             restore status
.,F6FA 60       RTS             
```

## Key Registers
- $0091 - Zero Page - saved stop-key column (keyboard matrix column previously sampled)
- $00C6 - Zero Page - keyboard buffer index (stored here when STOP detected)
- $FFCC - KERNAL ROM - JSR target used to close input/output channels (called by this routine)

## References
- "increment_jiffy_clock_and_keyboard_sampling" — expands on reliance on the stored stop-key column determined earlier
- "file_error_messages" — explains how closing I/O channels during STOP interacts with error/IO reporting paths