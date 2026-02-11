# C64 Interrupt Vectors: $FFFA / $FFFC / $FFFE

**Summary:** Describes the three CPU hardware vectors at $FFFA–$FFFF (NMI, RESET/RES, IRQ/BRK), their default target routine addresses ($FE43, $FCE2, $FF48), and their roles in handling NMI/RES/IRQ on the Commodore 64.

**Description**

The Commodore 64 stores the CPU interrupt vectors in the top of the memory map as two-byte little-endian pointers (low byte at the lower address). The relevant vectors and their purposes:

- **$FFFA/$FFFB — Non-Maskable Interrupt (NMI) vector:** Points to the ROM NMI entry at $FE43 (decimal 65091). NMIs are high-priority hardware events that cannot be masked.

- **$FFFC/$FFFD — System Reset (RES) vector:** Points to the power-on/reset entry at $FCE2 (decimal 64738). This is the CPU entry point after power-on or hardware reset.

- **$FFFE/$FFFF — IRQ/BRK vector:** Points to the main IRQ/BRK handler at $FF48 (decimal 65352). IRQs are maskable interrupts from sources like the CIA or raster interrupts; the BRK instruction also uses this vector.

These vectors reside in the KERNAL ROM and are immutable during normal operation. However, the routines they point to in ROM can be redirected at runtime by modifying the corresponding RAM vectors:

- **$0314/$0315 — IRQ vector:** By default, points to $EA31, the KERNAL's IRQ service routine.

- **$0316/$0317 — BRK vector:** By default, points to $FE66, the KERNAL's BRK service routine.

- **$0318/$0319 — NMI vector:** By default, points to $FE47, the KERNAL's NMI service routine.

Modifying these RAM vectors allows custom interrupt service routines to be implemented without altering the ROM.

## Source Code

```text
Vector map (two-byte little-endian pointers; low byte at the lower address)

Address  Decimal   Vector name            Target address  Target (hex)  Target (dec)
$FFFA    65530     NMI vector (low byte)  -> $FE43        $FE43         65091
$FFFB    65531     NMI vector (high byte) -> (paired with $FFFA)
$FFFC    65532     RESET vector (low)     -> $FCE2        $FCE2         64738
$FFFD    65533     RESET vector (high)    -> (paired with $FFFC)
$FFFE    65534     IRQ/BRK vector (low)   -> $FF48        $FF48         65352
$FFFF    65535     IRQ/BRK vector (high)  -> (paired with $FFFE)

Notes:
- Vectors are little-endian two-byte addresses (low byte at the even vector address, high byte at the next address).
- The listed "target" addresses are the routine entry points in the KERNAL ROM: NMI -> $FE43, RESET -> $FCE2, IRQ -> $FF48.
- Examples of redirecting vectors are covered in external disassemblies (see References).
```

## Key Registers

- **$FFFA–$FFFF**: CPU vectors for NMI, RESET, and IRQ/BRK (two-byte little-endian pointers).

## References

- "irq_loader_setup_part1_disassembly" — example of writing to $FFFE/$FFFF to redirect IRQ to a loader ISR

- "irq_loader_setup_part2_disassembly" — example of writing to $FFFA/$FFFB to redirect NMI to a loader entry

## Labels
- NMI
- RESET
- IRQ
- BRK
