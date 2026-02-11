# 6520 Peripheral B control lines (CB1, CB2)

**Summary:** CB1 and CB2 behavior for the 6520 Peripheral Interface Adapter (PIA): CB1 is an interrupt input that sets CRB bit 7 on the selected transition (CRB bit 0 selects the active transition). CB2 input modes mirror CA2; CB2 output modes (CRB bit 5 = 1) differ from CA2 — pulse output occurs on writes to the Peripheral B Output Register and handshaking is driven for CPU→peripheral transfers.

## Peripheral B control lines (CB1, CB2)
- CB1: functions only as an interrupt input, identical in operation to CA1. The interrupt flag is CRB bit 7; that bit is set by the active transition chosen by CRB bit 0.
- CB2 (input): operates the same as CA2 input modes (use the same CA2-mode semantics for CB2 when configured as input).
- CB2 (output): when CRB bit 5 = 1, CB2 output modes differ from CA2 output modes:
  - A pulse output on CB2 is generated when the processor writes data into the Peripheral B Output Register.
  - Handshaking for CB2 (when in these output modes) is driven on data transfers from the CPU into the peripheral device (CPU → peripheral).

## References
- "control_of_irqb" — expands on CRB bit usage for CB interrupts

## Labels
- CRB
- CB1
- CB2
