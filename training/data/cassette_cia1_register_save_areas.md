# Cassette I/O: CIA #1 Save Areas ($02A2-$02A4)

**Summary:** Zero-page save areas $02A2-$02A4 store CIA #1 register state (Control Register B activity indicator, Interrupt Control Register, Control Register A) during cassette I/O so the original CIA settings can be restored after tape operations.

## Descriptions
- $02A2 — Indicator of CIA #1 Control Register B activity during cassette I/O. Used to record whether Control Register B (CIA #1) was active/modified while cassette routines run so it can be restored.
- $02A3 — Save area for CIA #1 Interrupt Control Register (ICR) during cassette read. Holds the ICR value while cassette input processing may change interrupt enables/flags.
- $02A4 — Save area for CIA #1 Control Register A (CRA) during cassette read. Stores CRA so cassette routines can alter CRA and later restore the original state.

These bytes are used together when cassette routines temporarily alter CIA #1 registers (for example, when hooking cassette handling into IRQs) and must preserve/restore the system's CIA configuration after tape I/O completes.

## Key Registers
- $02A2-$02A4 - Zero Page (RAM) - Save areas for CIA #1 registers used during cassette I/O (Control B indicator, Interrupt Control Register, Control A)

## References
- "irqtmp_save_area_for_cassette_io" — expands on used together when hooking cassette routines into IRQs