# IRQTMP (locations 671–672, $029F–$02A0)

**Summary:** IRQTMP ($029F–$02A0) is a two-byte RAM save area used during cassette (tape) I/O to store the current IRQ vector ($0314–$0315) while cassette read/write routines hook their IRQ handler; keyboard scan, STOP-key check, and clock update are suspended during tape I/O.

## Description
IRQTMP is a two-byte save area (label: IRQTMP) located at decimal 671–672 (hex $029F–$02A0). Cassette read and write operations on the C64 are IRQ-driven: before a cassette routine installs its own IRQ handler, it saves the existing RAM IRQ vector (located at $0314–$0315) into IRQTMP. When tape I/O completes, the original IRQ vector is restored from IRQTMP so normal system IRQ functionality resumes.

Effects/behavior:
- The cassette routines change the RAM IRQ vector at $0314–$0315 to point at the cassette IRQ handler.
- IRQTMP holds the previous IRQ vector so it can be restored after tape I/O.
- While cassette I/O is active, the normal IRQ-driven functions (keyboard scanning, STOP-key monitoring, and the real-time clock update) are suspended.

## Key Registers
- $029F-$02A0 - RAM - IRQTMP: two-byte save area for the IRQ vector during cassette I/O
- $0314-$0315 - RAM - IRQ vector (CINV): system RAM IRQ vector that cassette routines overwrite and whose value is saved in IRQTMP

## References
- "cinv_irq_vector" — expands on IRQ vector (CINV) being changed during cassette I/O and saved here

## Labels
- IRQTMP
- CINV
