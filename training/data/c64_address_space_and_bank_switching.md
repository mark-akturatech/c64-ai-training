# COMMODORE 64 ADDRESS SPACE

**Summary:** Overview of the C64 16-bit address space, bank switching (BASIC/KERNAL ROM and I/O at $D000), and memory control via hardware port $0001; warns to disable interrupts before switching out the KERNAL because the interrupt vectors at $FFFA-$FFFF reside in KERNAL ROM.

**Memory map overview**
The 6510 CPU has a 16-bit address bus (0x0000–0xFFFF = 65,536 bytes). The C64 uses bank switching to place different physical devices (RAM, ROM, I/O) into that 64K logical window so software can access ROM routines or free extra RAM as needed.

Commonly switched regions (typical default C64 layout):
- $A000-$BFFF (8 KB) — BASIC ROM (switchable out to expose 8 KB of RAM).
- $D000-$DFFF (4 KB) — I/O area (VIC-II, SID, CIAs, etc.). This 4 KB can be swapped with RAM; while swapped out, the hardware registers in that range are inaccessible.
- $E000-$FFFF (8 KB) — KERNAL ROM (switchable out to expose 8 KB of RAM).
- $0000-$00FF, $0100-$01FF etc. — zero page / stack / RAM remain standard unless explicitly banked (control via $0001).

Bank switching is controlled by the memory-control port at $0001 (the 6510 I/O port). Different combinations of bits select whether ROMs or I/O are visible in the 64K logical address space.

**Bank switching behaviors and cautions**
- Switching BASIC ROM out (if you do not need BASIC routines) gives you 8 KB of extra RAM in $A000-$BFFF.
- Switching the 4 KB I/O space at $D000 with RAM removes access to all hardware registers in that range; to access a VIC-II register or the SID, you must switch the I/O map back in. Because hardware access is usually frequently needed, swapping out $D000 is often not worth the hassle unless you strictly need the extra RAM and can schedule brief windows to access hardware.
- Switching out the 8 KB KERNAL ROM (to use $E000-$FFFF as RAM) is possible, but you must take special care:
  - All interrupts should be disabled before removing the KERNAL ROM. The interrupt vectors for NMI/RESET/IRQ are stored at $FFFA-$FFFF in the KERNAL. If an interrupt fires while those vectors are unreachable, the CPU will fetch invalid vectors.
  - After the KERNAL ROM is removed, you must provide new interrupt vectors in RAM (i.e., store appropriate addresses into $FFFA-$FFFF) if interrupts will be used while KERNAL is not present.
  - Re-enabling interrupts without restoring proper vectors will crash or branch to unintended addresses.

Do not assume routines in switched-out ROMs are available; any code that calls into KERNAL/BASIC must ensure the ROM is mapped in at call time or must relocate/copy needed code into RAM.

## Source Code
```text
Bit-level map of the 6510 I/O port at $0001:

Bit  | Name   | Description
-----|--------|--------------------------------------------------------------
0    | LORAM  | Selects ROM or RAM at $A000-$BFFF. 1 = BASIC ROM, 0 = RAM.
1    | HIRAM  | Selects ROM or RAM at $E000-$FFFF. 1 = KERNAL ROM, 0 = RAM.
2    | CHAREN | Selects character ROM or I/O devices at $D000-$DFFF.
              | 1 = I/O devices, 0 = Character ROM.
3    | CASS   | Cassette data output line.
4    | CASSET | Cassette switch sense. Reads 0 if a button is pressed, 1 if not.
5    | MOTOR  | Cassette motor control. 1 = Motor off, 0 = Motor on.
6-7  |        | Not connected; no function defined.
```
([pagetable.com](https://www.pagetable.com/c64ref/c64mem/?utm_source=openai))
The default value of this register is $37 (%00110111), which enables BASIC and KERNAL ROMs, I/O devices, and turns the cassette motor off.

## Key Registers
- $0001 - 6510 I/O port - memory-control port (selects ROM/I/O/RAM mapping)
- $A000-$BFFF - BASIC ROM (8 KB) - switchable to RAM
- $D000-$DFFF - I/O space (4 KB) - VIC-II, SID, CIAs, and other hardware registers (switchable)
- $E000-$FFFF - KERNAL ROM (8 KB) - switchable to RAM
- $FFFA-$FFFF - System vectors (NMI/RESET/IRQ) - reside in KERNAL ROM by default; must be in RAM if KERNAL is removed

## References
- "memory_control_and_mapping" — expands on control lines and detailed $0001 bit definitions used to select memory maps
- "using_an_assembler_pseudo_opcodes" — discusses loader/relocation options for placing code at different target addresses

## Labels
- NMI
- RESET
- IRQ
