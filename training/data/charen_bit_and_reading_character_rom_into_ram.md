# CHAREN (Port $0001 bit 2) — switch character ROM vs I/O

**Summary:** CHAREN is bit 2 (mask $04) of the 6510 processor port at $0001; CHAREN=0 maps the 4KB character generator ROM into $D000-$DFFF (CPU-visible) and disables the I/O devices in that address range, while CHAREN=1 leaves I/O active and prevents the CPU from PEEKing the character ROM (VIC‑II still uses the ROM for display). Example BASIC routine to copy the 2K character ROM into RAM is provided.

## CHAREN behaviour and consequences
- Bit: bit 2 of processor port at $0001 (mask $04).
- CHAREN = 1 (default): the CPU sees I/O devices at $D000-$DFFF (SID, VIC‑II, CIAs). The VIC‑II chip retains access to the character ROM for screen generation, but the CPU cannot PEEK the ROM.
- CHAREN = 0: the character generator ROM is switched into the CPU address space at $D000-$DFFF and the I/O devices in that region are effectively disabled (reads from $D000-$DFFF return ROM data).
- Because the CPU’s I/O access is disabled while the character ROM is mapped in, any interrupts that depend on those I/O devices must be turned off before switching in the ROM (otherwise the interrupt handler may try to access disabled devices).

## Reading the character ROM into RAM
- Purpose: duplicate the character ROM in RAM so you can modify only selected characters and leave the rest intact.
- Procedure overview:
  1. Disable interrupts that use the CIAs (so handlers don’t touch I/O while it’s disabled).
  2. Clear CHAREN (set bit 2 = 0) in $0001 to map the character ROM into $D000-$DFFF.
  3. Loop to read the ROM bytes from $D000 (53248) upward and write them into a RAM block starting at BASE.
  4. Restore CHAREN (set bit 2 = 1) and re-enable interrupts.
- BASE must start on an even 2K boundary (address divisible by 2048) inside the memory bank currently accessible to the VIC‑II (so the VIC will be able to use the user-defined character set there). See VIC‑II memory bank / $D018 for details.

## Source Code
```basic
10 POKE 56333,127:POKE 1,PEEK(1) AND 251:FOR I=0 TO 2048
20 POKE BASE+I,PEEK(53248+I):NEXT:POKE 1,PEEK(1) OR 4:POKE 56333,129
```
Notes on the listing:
- POKE 56333,127 disables the system timer interrupt (56333 = $DC0D, CIA1 Interrupt Control Register).
- POKE 1,PEEK(1) AND 251 clears bit 2 (CHAREN) of $0001 (251 = 0xFB = all bits set except bit 2).
- The loop copies 2049 bytes (0..2048) from $D000 (53248) into RAM at BASE.
- POKE 1,PEEK(1) OR 4 restores CHAREN (sets bit 2).
- POKE 56333,129 restores the CIA1 interrupt control (value used in original example).

## Key Registers
- $0001 - 6510 (CPU port) - CHAREN is bit 2 (mask $04): 0 = character ROM mapped into $D000-$DFFF (I/O disabled); 1 = I/O devices mapped (character ROM not CPU-visible).
- $DC0D - CIA1 - Interrupt Control Register (used here to disable/restore system timer interrupt via POKE 56333).
- $D018 - VIC‑II - memory/character-bank control (determine which 16KB bank the VIC accesses; affects where to place BASE for user-defined character sets).

## References
- "r6510_internal_io_port_overview" — definition of CHAREN and conflict with I/O device addressing
- "loram_hiram_and_moving_rom_to_ram_examples" — copying ROM into RAM for BASIC & KERNAL use

## Labels
- CHAREN
