# Memory Vectors / Resources $030C-$0319

**Summary:** Map of runtime vectors at $030C-$0319: default SYS return registers ($030C-$030F), USR function jump ($0310-$0312), and IRQ/BRK/NMI handler addresses ($0314-$0319). Values are stored as 16-bit little-endian addresses (low byte first).

## Description
This block lists the Commodore 64 memory locations used as runtime vectors and default return registers for BASIC/SYS/USR and the default handler addresses for IRQ, BRK and NMI as found at $030C–$0319.

- $030C–$030F contain default/return values for the 6502 CPU registers used by a BASIC SYS call: A, X, Y, and the processor status (P). These are single-byte registers (status is the full P byte).
- $0310–$0312 hold the USR() function jump vector. This is a 16-bit address stored little-endian (low byte at $0310, high byte at $0311); $0312 is listed in the source as part of the USR function region (three bytes reserved).
- $0313 is unused/reserved.
- $0314–$0319 contain the 16-bit handler addresses for IRQ, BRK, and NMI (each stored low byte first, then high byte):
  - IRQ vector at $0314-$0315 (default $EA31)
  - BRK vector at $0316-$0317 (default $FE66)
  - NMI vector at $0318-$0319 (default $FE47)

These are separate from the hardware vectors at $FFFA–$FFFF (see references). Software (BASIC/KERNAL) may copy or use these low-page vectors at runtime; their format is standard 6502 little-endian address storage.

## Source Code
```text
$030C   SYS Register A          Default/return value for register A
$030D   SYS Register X          Default/return value for register X
$030E   SYS Register Y          Default/return value for register Y
$030F   SYS Status Reg          Default/return processor status register

$0310-$0312  USR Function       Jump to USR() function (16-bit address, little-endian; $0312 reserved)

$0313   Unused

$0314-$0315  IRQ Handler        Interrupt routine address (default: $EA31)  ; low=$0314, high=$0315
$0316-$0317  BRK Handler        BRK instruction handler (default: $FE66)       ; low=$0316, high=$0317
$0318-$0319  NMI Handler        Non-maskable interrupt handler (default: $FE47) ; low=$0318, high=$0319
```

## Key Registers
- $030C-$030F - System RAM - SYS default/return values: A, X, Y, Status
- $0310-$0312 - System RAM - USR() function jump vector (16-bit, little-endian)
- $0313 - System RAM - Unused / reserved
- $0314-$0315 - System RAM - IRQ handler address (default $EA31)
- $0316-$0317 - System RAM - BRK handler address (default $FE66)
- $0318-$0319 - System RAM - NMI handler address (default $FE47)

## References
- "hardware_vectors" — expands on hardware vectors at $FFFA-$FFFF (reset/IRQ/NMI hardware vectors)