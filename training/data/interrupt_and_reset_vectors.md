# 6502 Reserved Vectors ($FFFA–$FFFF)

**Summary:** Describes the 6502 CPU reserved vector addresses at the top of the 64K address space: $FFFA/$FFFB (NMI), $FFFC/$FFFD (RESET/power-on), and $FFFE/$FFFF (IRQ/BRK). Notes little-endian storage (low byte then high byte) and purpose of each vector.

## Vector locations and behavior
The 6502 stores three two-byte absolute vectors in the highest page of memory (page $FF) that the CPU uses to transfer control on special events:

- $FFFA/$FFFB — NMI vector (Non-Maskable Interrupt): two-byte little-endian address (low byte at $FFFA, high byte at $FFFB) loaded when an NMI is taken.
- $FFFC/$FFFD — RESET (power-on/reset) vector: two-byte little-endian address loaded into the program counter on reset/power-on.
- $FFFE/$FFFF — IRQ/BRK vector: two-byte little-endian address used for both maskable IRQs and the BRK instruction.

Notes:
- Each vector is stored little-endian: the low-order byte of the 16-bit target address is at the lower address (e.g., target & $FF at $FFFA), the high-order byte at the next address.
- The vectors are located in the final 6 bytes of the 64K address space ($FFFA–$FFFF).
- IRQ and BRK use the same vector ($FFFE/$FFFF). NMI is non-maskable; IRQ is maskable (via the interrupt disable flag).
- The RESET vector is used by the CPU immediately after a reset to set the initial program counter (power-on initialization).

## Source Code
```text
6502 reserved vectors (little-endian low-byte, high-byte):

Address   Purpose
$FFFA     NMI vector low byte
$FFFB     NMI vector high byte
$FFFC     RESET vector low byte (power-on/reset)
$FFFD     RESET vector high byte
$FFFE     IRQ/BRK vector low byte
$FFFF     IRQ/BRK vector high byte
```

## Key Registers
- $FFFA-$FFFF - 6502 - Interrupt vectors (NMI, RESET, IRQ/BRK)

## References
- "addresses_and_address_bus" — expands on address range ($0000–$FFFF) where vectors reside

## Labels
- NMI
- RESET
- IRQ
