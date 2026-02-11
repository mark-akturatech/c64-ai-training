# 52K RAM Memory Map (Fig. 7-3)

**Summary:** This memory map illustrates an alternate Commodore 64 configuration providing 52K of accessible RAM, with the KERNAL ROM occupying $E000-$FFFF, I/O devices at $D000-$DFFF, and RAM filling the remaining addressable space. Memory bank selection is managed via the LORAM and HIRAM bits in the CPU port at address $0001.

**Memory Layout (Alternate Configuration)**

In this configuration, the memory is organized as follows:

- **$0000-$7FFF**: 32K RAM
- **$8000-$BFFF**: 16K RAM
- **$C000-$CFFF**: 4K RAM
- **$D000-$DFFF**: 4K I/O area (VIC-II, SID, CIAs, and other I/O devices)
- **$E000-$FFFF**: 8K KERNAL ROM

The LORAM and HIRAM bits in the CPU port ($0001) control the visibility of these memory regions. This setup allows for 52K of contiguous RAM, suitable for applications requiring extensive memory, while still providing access to essential ROM and I/O functionalities.

## Source Code

```text
FFFF ────────────────────────────────────────────
      |                                         |
      |            8K KERNAL ROM                 |
E000 ────────────────────────────────────────────
      |                                         |
      |              4K I/O                     |
D000 ────────────────────────────────────────────
      |                                         |
      |              4K RAM                     |
C000 ────────────────────────────────────────────
      |                                         |
      |             16K RAM                     |
8000 ────────────────────────────────────────────
      |                                         |
      |             32K RAM                     |
0000 ────────────────────────────────────────────

Fig. 7-3. 52K RAM Memory Map.
```

## Key Registers

- **$0001**: CPU Port – Controls memory configuration via LORAM and HIRAM bits.
- **$D000-$DFFF**: I/O Area – Registers for VIC-II, SID, CIAs, and other I/O devices.
- **$E000-$FFFF**: KERNAL ROM – 8K ROM region containing system routines.
- **$8000-$BFFF**: RAM – 16K RAM region.
- **$C000-$CFFF**: RAM – 4K RAM region.
- **$0000-$7FFF**: RAM – 32K RAM region.

## References

- "vic_memory_map_64k_fig7_2" — Full 64K memory map (Figure 7-2).
- "vic_bank_selection_values_table_7_1" — Table of explicit values to select the VIC-visible 16K bank.

## Labels
- CPU_PORT
