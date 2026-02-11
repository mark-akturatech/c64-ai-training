# 6510 Hardware Vectors ($FFFA-$FFFF)

**Summary:** Describes the 6510 CPU vectors at $FFFA-$FFFF (NMI, RESET, IRQ/BRK). These last six memory locations hold the two-byte (little-endian) start addresses the CPU loads when NMI, RESET or IRQ/BRK events occur.

## Description
The 6510 reserves the final six bytes of the 64K address space for three fixed interrupt/reset vectors. Each vector is a two-byte little-endian address (low byte at the lower address, high byte at the next) pointing to the entry point the CPU should begin executing when the corresponding event occurs.

Vector layout:
- $FFFA/$FFFB — NMI vector (address to jump to on Non-Maskable Interrupt)
- $FFFC/$FFFD — RESET vector (address the CPU loads on power-up / reset)
- $FFFE/$FFFF — IRQ/BRK vector (address used for IRQ interrupts and BRK instruction)

On the corresponding event the 6510 loads the two bytes from the vector (low then high) into the program counter and continues execution from that address.

## Source Code
```text
Location Range: 65530-65535 ($FFFA-$FFFF)
6510 Hardware Vectors

Address   Name        Contains (little-endian)
$FFFA     NMI low     Low byte of NMI handler address
$FFFB     NMI high    High byte of NMI handler address
$FFFC     RESET low   Low byte of RESET/start address
$FFFD     RESET high  High byte of RESET/start address
$FFFE     IRQ low     Low byte of IRQ/BRK handler address
$FFFF     IRQ high    High byte of IRQ/BRK handler address
```

## Key Registers
- $FFFA-$FFFF - 6510 - NMI / RESET / IRQ-BRK vectors (two-byte little-endian addresses)

## References
- "hardware_vectors_details" — expands on addresses and default routines pointed to by these vectors

## Labels
- NMI
- RESET
- IRQ
