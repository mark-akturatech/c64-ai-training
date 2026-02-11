# byRiclianll — Recognizing the last sector of a file (Commodore DOS)

**Summary:** Describes how the next-block track byte $00 marks the final sector, how the sector-link byte in that last block is interpreted as a byte count (example value $68 meaning bytes 2..104 are valid), that BASIC EOF is three consecutive $00 bytes, that the drive sends an End-or-Identify (EOI) on the serial bus after the indicated byte count, and that the C64 sets status variable ST = 64 on EOI.

## How to recognize the last sector
The next-block track byte in a sector header is the primary indicator: a value of $00 (track = 0) marks this sector as the final block of the file. The usual "sector link" terminology is misleading for the final block: on the last sector its second header byte contains a byte count rather than a link to a following sector.

## Sector-link-as-byte-count (final block)
- In the final sector the sector-link byte is a byte count telling DOS how many payload bytes in the sector are significant.
- In the example given, the count indicates that only bytes 2 through 104 (hex $68) of the sector contain useful file data.
- The drive will transmit exactly that many payload bytes across the serial bus from the sector.

## BASIC EOF, EOI, and C64 status
- BASIC represents end-of-file by three consecutive zero bytes ($00 $00 $00) within the file data.
- After the drive has transferred the indicated byte count (e.g., after byte 104 in the example), it will issue an End-or-Identify (EOI) serial signal.
- When the C64 receives the EOI, it sets the status variable ST to 64. Any further attempt by the host to read another byte will result in a drive timeout.

## Example tail bytes
- The three null bytes that mark BASIC EOF in this example are located at offsets $66/$67/$68 within the file data and are the final three bytes of the program file.

## References
- "dir_block_dump_hex_ascii_middle_blocks" — expands on the bytes that lead into this final-sector explanation  
- "dir_block_dump_tail_blocks_00_08_10_18" — shows the actual tail-end block dumps containing the final three null bytes
