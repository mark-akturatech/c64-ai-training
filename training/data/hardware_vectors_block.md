# Commodore 64 ROM: 6502 Hardware Vectors ($FFFA-$FFFF)

**Summary:** 6502/Commodore 64 hardware vectors stored in system ROM at $FFFA-$FFFF: NMI vector ($FFFA/$FFFB -> $FE43), RESET vector ($FFFC/$FFFD -> $FCE2), IRQ/BRK vector ($FFFE/$FFFF -> $FF48). Vectors are two-byte little-endian addresses referenced by the CPU on the corresponding events.

## Vector layout and resolved targets
The top-of-memory vector table holds three two-byte little-endian addresses the 6502 uses for interrupts and reset:

- NMI vector (2 bytes at $FFFA-$FFFB): bytes 43 FE -> target address $FE43 (low=#$43, high=#$FE).
- RESET vector (2 bytes at $FFFC-$FFFD): bytes E2 FC -> target address $FCE2 (low=#$E2, high=#$FC).
- IRQ/BRK vector (2 bytes at $FFFE-$FFFF): bytes 48 FF -> target address $FF48 (low=#$48, high=#$FF).

These vectors reside in ROM and are jumped to by the CPU when the corresponding event occurs. The byte order is little-endian (low byte first, high byte second).

**[Note: Source may contain an error — original text states "Bytes stored at $FFFA-$FFFE" but the IRQ vector requires bytes at $FFFE-$FFFF; the correct occupied range is $FFFA-$FFFF.]**

## Source Code
```asm
.; ROM vector bytes (original listing)
.:FFFA 43 FE                    NMI Vektor
.:FFFC E2 FC                    RESET Vektor
.:FFFE 48 FF                    IRQ Vektor

; Resolved addresses (little-endian decoding)
; $FFFA-$FFFB: 43 FE -> $FE43  ; NMI handler entry
; $FFFC-$FFFD: E2 FC -> $FCE2  ; RESET (hardware startup) entry
; $FFFE-$FFFF: 48 FF -> $FF48  ; IRQ/BRK entry
```

## Key Registers
- $FFFA-$FFFF - 6502 Vector Table - NMI/RESET/IRQ vectors (two-byte little-endian addresses)

## References
- "nmi_vector_entry" — expands on NMI vector points to NMI handler
- "reset_hardware_startup" — expands on RESET vector points to hardware reset entry
- "irq_vector_dispatch" — expands on IRQ vector points to IRQ entry routine

## Labels
- NMI
- RESET
- IRQ
