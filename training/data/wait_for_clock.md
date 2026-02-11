# WAIT FOR CLOCK ($EDCC)

**Summary:** KERNAL routine at $EDCC that disables interrupts (SEI), drives the IEC serial bus lines (data=0, ATN=1, CLK=1 via JSRs $EEA0/$EDBE/$EE85), polls the serial bus input (JSR $EEA9) and loops (BMI) until CLK is read low (tests bit6), then restores interrupts (CLI) and RTS.

## Description
This routine is a synchronous wait used to synchronize with a remote device's clock transition on the IEC serial bus. Sequence:

- SEI — disable interrupts to make the wait atomic.
- JSR $EEA0 — set DATA = 0 (drive the serial data line low).
- JSR $EDBE — set ATN = 1 (assert attention).
- JSR $EE85 — set CLK = 1 (drive the clock line high).
- Loop:
  - JSR $EEA9 — read serial bus I/O port (returns port byte in A).
  - BMI $EDD6 — branch back if the tested bit indicates CLK still high (source text: tests bit6).
- CLI — re-enable interrupts.
- RTS — return to caller.

Used to wait for a remote device to pull CLK low after the CPU has driven CLK high (common after sending TALK secondary address). See referenced routines for fuller serial I/O and TALK handling.

**[Note: Source may contain an error — BMI branches on the Negative flag (N, bit7 of A), whereas the comment says "test bit6". Verify the bit tested by JSR $EEA9 or calling convention of that routine before relying on bit numbering.]**

## Source Code
```asm
                                *** WAIT FOR CLOCK
                                This routine sets data = 0, ATN = 1 and CLK = 1. It then
                                waits to receive CLK = 0 from the serial bus.
.,EDCC 78       SEI             disable interrupts
.,EDCD 20 A0 EE JSR $EEA0       set data 0
.,EDD0 20 BE ED JSR $EDBE       set ATN 1
.,EDD3 20 85 EE JSR $EE85       set CLK 1
.,EDD6 20 A9 EE JSR $EEA9       read serial bus I/O port
.,EDD9 30 FB    BMI $EDD6       test bit6, and wait for CLK = 0
.,EDDB 58       CLI             enable interrupt
.,EDDC 60       RTS
```

## References
- "tksa_send_talk_sa" — expands on usage after sending TALK secondary address (when WAIT FOR CLOCK is called).
- "acptr_receive_from_serial_bus" — expands on CLK/data handling and serial I/O primitives (JSR $EEA9 and related routines).

## Labels
- WAIT_FOR_CLOCK
