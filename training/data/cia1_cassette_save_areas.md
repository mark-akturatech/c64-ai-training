# C64 RAM Map: $02A2-$02A4 — CIA #1 Cassette I/O Indicators and Save Areas

**Summary:** Zero-page system variables $02A2–$02A4 are utilized by the KERNAL cassette I/O routines to monitor and preserve the state of CIA #1 (6526) registers during cassette operations.

**Description**

These zero-page locations serve as temporary storage during cassette read/write operations, ensuring that the original state of CIA #1 registers is restored after the operation:

- **$02A2** — Stores the original value of CIA #1 Control Register B (CRB) during cassette I/O. This allows the system to restore CRB to its prior state after modifying it for cassette operations.

- **$02A3** — Holds the original value of CIA #1 Interrupt Control Register (ICR) during cassette read operations. The cassette read routine saves the current ICR here before altering interrupt masks or acknowledging interrupts, then restores it upon completion.

- **$02A4** — Contains the original value of CIA #1 Control Register A (CRA) during cassette read operations. This ensures that any temporary changes made to CRA for cassette I/O are reverted after the operation.

These variables are integral to the KERNAL's cassette I/O routines, facilitating the temporary modification and subsequent restoration of CIA #1 registers to maintain system stability.

## Source Code

The following assembly code snippet demonstrates how the KERNAL cassette read routine saves and restores the CIA #1 registers using these zero-page locations:

```assembly
; Save original CIA #1 registers
LDA $DC0D        ; Load CIA #1 ICR
STA $02A3        ; Save to $02A3
LDA $DC0E        ; Load CIA #1 CRA
STA $02A4        ; Save to $02A4
LDA $DC0F        ; Load CIA #1 CRB
STA $02A2        ; Save to $02A2

; [Cassette I/O operations modifying CIA #1 registers]

; Restore original CIA #1 registers
LDA $02A3        ; Load saved ICR
STA $DC0D        ; Restore to CIA #1 ICR
LDA $02A4        ; Load saved CRA
STA $DC0E        ; Restore to CIA #1 CRA
LDA $02A2        ; Load saved CRB
STA $DC0F        ; Restore to CIA #1 CRB
```

This code ensures that any changes made to the CIA #1 registers during cassette operations are temporary and that the original state is reinstated afterward.

## Key Registers

- **$02A2** — Zero Page — Stores original CIA #1 Control Register B (CRB) during cassette I/O
- **$02A3** — Zero Page — Stores original CIA #1 Interrupt Control Register (ICR) during cassette read
- **$02A4** — Zero Page — Stores original CIA #1 Control Register A (CRA) during cassette read

## References

- "irqtmp_cassette_irq_vector_save" — Details on saving/restoring the IRQ vector during cassette I/O