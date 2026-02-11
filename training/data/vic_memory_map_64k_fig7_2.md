# 64K RAM Memory Map (Figure 7-2)

**Summary:** This section provides an overview of the Commodore 64's 64K address space, illustrating the division into 16K and 32K RAM blocks and the role of the LORAM and HIRAM signals in selecting visible RAM or ROM areas. The diagram below represents the memory map, highlighting key regions and their address boundaries.

**Diagram Notes**

The following diagram represents the 64K memory map of the Commodore 64, divided into 16K and 32K RAM blocks. It also indicates the influence of the LORAM and HIRAM signals on memory configuration.

## Source Code

```text
+-------------------------------+-------------------------------+
| Address Range                 | Description                   |
+-------------------------------+-------------------------------+
| $0000 - $3FFF                 | 16K RAM                       |
+-------------------------------+-------------------------------+
| $4000 - $7FFF                 | 16K RAM                       |
+-------------------------------+-------------------------------+
| $8000 - $9FFF                 | 8K RAM or Cartridge ROM       |
+-------------------------------+-------------------------------+
| $A000 - $BFFF                 | 8K BASIC ROM or RAM           |
+-------------------------------+-------------------------------+
| $C000 - $CFFF                 | 4K RAM                        |
+-------------------------------+-------------------------------+
| $D000 - $DFFF                 | 4K I/O, Character ROM, or RAM |
+-------------------------------+-------------------------------+
| $E000 - $FFFF                 | 8K KERNAL ROM or RAM          |
+-------------------------------+-------------------------------+

Control Signals:
- LORAM (bit 0 of $0001): Controls visibility of BASIC ROM at $A000-$BFFF.
  - 1: BASIC ROM visible.
  - 0: RAM visible.

- HIRAM (bit 1 of $0001): Controls visibility of KERNAL ROM at $E000-$FFFF.
  - 1: KERNAL ROM visible.
  - 0: RAM visible.

- CHAREN (bit 2 of $0001): Controls visibility of Character ROM at $D000-$DFFF.
  - 1: I/O devices visible.
  - 0: Character ROM visible.

Note: The VIC-II video chip always accesses RAM in the $D000-$DFFF range, regardless of the CHAREN bit state.
```

## Key Registers

- **$0001**: CPU port controlling memory configuration.
  - **Bit 0 (LORAM)**: Controls BASIC ROM visibility at $A000-$BFFF.
  - **Bit 1 (HIRAM)**: Controls KERNAL ROM visibility at $E000-$FFFF.
  - **Bit 2 (CHAREN)**: Controls Character ROM visibility at $D000-$DFFF.

## References

- "vic_bank_selection_intro" — expands on textual explanation of VIC bank selection and default bank.
- "vic_memory_map_32k_fig7_3" — expands on alternate memory map (Figure 7-3) showing ROM/I/O overlays and different visible RAM size.

## Labels
- LORAM
- HIRAM
- CHAREN
