# 6510 CPU I/O Port (Memory Configuration)

**Summary:** Location $0001 (port) and $0000 (data direction register) control LORAM, HIRAM, CHAREN and cassette lines on the 6510 CPU; recommended DDR = %00101111 (bits 5..0 = 1 0 1 1 1 1 = decimal 47). These bits bank BASIC ($A000-$BFFF), KERNAL ($E000-$FFFF), and character ROM vs I/O ($D000-$DFFF); writes to ROM addresses store into the underlying RAM.

## Port location and data-direction register
- The 6510 CPU I/O port is at address $0001. Its data-direction register (DDR) is at address $0000.
- The DDR ($0000) controls whether each corresponding bit of $0001 is an input (0) or an output (1). The CPU uses the port ($0001) to select memory banks and to control the Datassette lines.

## Bit-by-bit definitions
Bits of the 6510 port (at $0001), with DDR directions defined for the recommended configuration:

- Bit 0 — LORAM (output): selects RAM/ROM at $A000-$BFFF. Normally HIGH (1) for BASIC ROM visible; LOW (0) makes RAM appear at $A000-$BFFF.
- Bit 1 — HIRAM (output): selects RAM/ROM at $E000-$FFFF. Normally HIGH (1) for KERNAL ROM visible; LOW (0) makes RAM appear at $E000-$FFFF.
- Bit 2 — CHAREN (output): selects I/O or character ROM at $D000-$DFFF. When CHAREN=1 (normal), I/O devices appear at $D000-$DFFF and character ROM is not accessible; when CHAREN=0 the character ROM appears at $D000-$DFFF and I/O devices are not accessible. If the overall configuration contains no I/O, CHAREN has no effect and RAM appears at $D000-$DFFF.
- Bit 3 — cassette write (output).
- Bit 4 — cassette switch sense (input). 0 = play button depressed.
- Bit 5 — cassette motor control (output). 0 = motor spins.
- Bits 6–7 — not defined here (no function described in the source).

Recommended DDR setting:
- Bits 5..0 = 1 0 1 1 1 1 (bit5=1, bit4=0, bit3=1, bit2=1, bit1=1, bit0=1)
- Full byte: %00101111 = $2F = 47 decimal (bits 7..0 = 0 0 1 0 1 1 1 1).
- The C64 automatically initializes the DDR to this value.

## Memory mapping effects (how LORAM / HIRAM / CHAREN bank regions)
- LORAM (bit0): banks the 8K BASIC ROM into $A000-$BFFF when HIGH. When LOW, the same address range contains underlying RAM.
- HIRAM (bit1): banks the 8K KERNAL ROM into $E000-$FFFF when HIGH. When LOW, the same address range contains underlying RAM.
- CHAREN (bit2): selects between the 4K character generator ROM and I/O devices at $D000-$DFFF. CHAREN=1 => I/O visible; CHAREN=0 => character ROM visible. CHAREN can be overridden by combinations of the other control lines in specific memory configurations; if I/O is not present in the configuration, RAM appears at $D000-$DFFF regardless of CHAREN.
- Writes (POKE/STA) to an address currently occupied by ROM do not alter ROM contents; they are written into the RAM that lies "under" the ROM (the hidden RAM bank). Reads from that address return ROM data. This allows, for example, a hi-resolution screen in RAM to be updated while ROM is mapped in, because writes go to the hidden RAM.

## Source Code
```text
6510 port and DDR addresses:
  $0000 - Data Direction Register (DDR) for 6510 I/O port
  $0001 - 6510 I/O port (LORAM, HIRAM, CHAREN, cassette lines)

Bit layout (recommended DDR and meanings):
  Bit 7  Bit 6  Bit 5  Bit 4  Bit 3  Bit 2  Bit 1  Bit 0
   -      -      M      S      W     CH    HI     LO
                    (motor)(sense)(write)(char)(hiram)(loram)
                    1=output 0=input  (recommended DDR shown below)

Recommended DDR (bits 5..0 = 1 0 1 1 1 1):
  Binary: %00101111
  Hex: $2F
  Decimal: 47
```

```basic
10 REM Set DDR to recommended value (47) and enable BASIC/KERNAL/IO
20 POKE 0,47      : REM $0000 = DDR
30 POKE 1,7       : REM $0001 = %00000111 -> LORAM=1,HIRAM=1,CHAREN=1 (BASIC/KERNAL/IO)
```

```asm
; Assembly example: set DDR and set port for normal BASIC/KERNAL/IO
        LDA #$2F     ; %00101111 = 47 -> DDR ($0000)
        STA $0000
        LDA #$07     ; %00000111 -> LORAM=1, HIRAM=1, CHAREN=1
        STA $0001
```

## Key Registers
- $0000 - 6510 - Data Direction Register for 6510 CPU port (bits control input/output for $0001)
- $0001 - 6510 - 6510 CPU I/O port (LORAM, HIRAM, CHAREN, cassette write/sense/motor)

## References
- "fundamental_memory_map_io_breakdown_and_cartridge_autostart_and_memory_maps_intro" — expands physical memory regions and the I/O area controlled by the 6510 port