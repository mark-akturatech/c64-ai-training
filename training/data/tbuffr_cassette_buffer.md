# $033C-$03FB TBUFFR: Cassette I/O Buffer

**Summary:** $033C-$03FB (192 bytes) is the TBUFFR cassette I/O buffer used for tape header blocks and data blocks; identifier byte at $033C selects block type (1,3,4,2,5). When unused for tape I/O the area is commonly reused for small machine‑language routines or VIC‑II graphics (sprite data blocks $0340-$037F and $0380-$03BF).

## Description
- Size and location: 192 bytes at $033C-$03FB.
- Purpose: temporary buffer for data read from or written to the cassette device (device 1). The buffer holds tape header blocks (program headers or data file headers) and tape data blocks.
- Layout rules:
  - The first byte (at $033C) is the block identifier.
  - Header blocks: identifier byte, then a two‑byte starting RAM address, a two‑byte ending RAM address, and a filename padded with spaces so the name portion equals 187 bytes. (1 + 2 + 2 + 187 = 192 bytes.)
  - Data blocks: identifier byte followed by 191 bytes of data.
- Identifier values:
  - 1 = relocatable program header.
  - 3 = nonrelocatable program header.
  - 4 = data file header (used when BASIC OPENs a tape data file).
  - 2 = data block (contains actual data bytes written/read via PRINT #1, GET #1, INPUT #1).
  - 5 = logical end of tape (Kernal stops searching past this point).
- Relocatable vs nonrelocatable program files:
  - Relocatable: created when SAVE uses a secondary address of 0 or any even number — will load at current BASIC start unless loaded with secondary address 1.
  - Nonrelocatable: created when SAVE uses a secondary address of 1 or any odd number — will always load at the address specified in the header.
- Data transfer note: program files use the cassette buffer only for the header; the program body is transferred directly to/from RAM (not via the buffer). Data files (OPEN/PRINT/GET/INPUT) do use the cassette buffer for data blocks.
- Alternate uses when tape is not in use:
  - Small machine‑language routines are often placed here.
  - VIC‑II graphics (sprite shape or character dot data) can be placed here if the VIC bank is mapped to the low 16K: sprite data block 13 → $0340-$037F (locations 832–895), sprite data block 14 → $0380-$03BF (locations 896–959).

## Key Registers
- $033C-$03FB - RAM - TBUFFR (192‑byte cassette I/O buffer; identifier byte at $033C; header/data block formats)

## References
- "irqtmp_cassette_irq_vector_save" — expands on cassette I/O routines and IRQ vector swapping  
- "unused_02A7_02FF" — expands on alternative small RAM areas for ML/graphics

## Labels
- TBUFFR
