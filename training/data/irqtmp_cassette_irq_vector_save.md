# $029F-$02A0 IRQTMP: Save Area for IRQ Vector During Cassette I/O

**Summary:** $029F-$02A0 (label IRQTMP) is a two-byte RAM save area used by the cassette (tape) routines to store the original IRQ vector before hooking a tape-driven IRQ handler; the system IRQ vector resides at $0314-$0315 (decimal 788-789).

## Description
The cassette read/write routines are driven by an IRQ. To install the cassette IRQ handler, the two-byte IRQ vector at $0314-$0315 must be overwritten to point at the cassette routine start address. The original IRQ vector is copied into $029F-$02A0 (IRQTMP) before changing $0314-$0315 so it can be restored when tape I/O completes.

- IRQTMP holds the two bytes of the original IRQ vector (conventionally low byte then high byte).
- While the cassette IRQ handler is active, normal IRQ-driven tasks are suspended: keyboard scanning, STOP-key detection, cursor blinking, and clock updating.
- After tape I/O finishes, the IRQ handler restores $0314-$0315 from the two bytes saved at $029F-$02A0 to resume normal system interrupts.

## Key Registers
- $029F-$02A0 - RAM - Two-byte save area for original IRQ vector used by cassette I/O (IRQTMP)
- $0314-$0315 - RAM - System IRQ vector (target overwritten by cassette IRQ handler while IRQTMP is in use)

## References
- "tbuffr_cassette_buffer" — cassette buffer used by tape routines
- "cinv_irq_vector" — IRQ vector usage and precautions

## Labels
- IRQTMP
