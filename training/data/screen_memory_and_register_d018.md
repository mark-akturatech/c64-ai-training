# VIC-II $D018 / 53272 — Screen Memory Relocation (C64)

**Summary:** Use VIC-II control register $D018 (decimal 53272) to relocate screen memory by changing its upper 4 bits; use the POKE/PEEK pattern to modify only those bits. Remember to add the VIC-II bank base when computing absolute VIC addresses and inform the KERNAL screen editor via POKE 648,page.

**Description**

The VIC-II control register at $D018 (53272) contains bit fields used for video configuration. The UPPER 4 bits select the start page of screen memory (text/charset pointer), while the lower 4 bits include character set selection and other VIC uses — therefore writes must preserve the lower nybble.

Recommended BASIC statement to change only the upper 4 bits (screen page):

POKE 53272,(PEEK(53272) AND 15) OR A

where A is one of the allowed values that set the upper nybble (0, 16, 32, ...). The A value selects a 1 KB-aligned screen page (decimal offsets 0, 1024, 2048, ...). When relocating screen memory you must also add the VIC-II bank base (the 16 KB VIC bank selection) to compute the VIC-visible absolute address. After moving the screen memory, update the KERNAL's screen-page variable with POKE 648,page so KERNAL text-editor routines use the new page.

The VIC-II can access one of four 16 KB memory banks, selected via bits 0 and 1 of CIA #2's Port A at address 56576 ($DD00). The mapping is as follows:

| Bank # | CIA #2 Port A Bits | Memory Range  | ROM Characters Available? |
|--------|--------------------|---------------|---------------------------|
| 0      | %11                | $0000–$3FFF   | Yes, at $1000–$1FFF       |
| 1      | %10                | $4000–$7FFF   | No                        |
| 2      | %01                | $8000–$BFFF   | Yes, at $9000–$9FFF       |
| 3      | %00                | $C000–$FFFF   | No                        |

To select a VIC-II bank, set the two least significant bits of $DD00 accordingly. For example, to select bank 0:

POKE 56576, (PEEK(56576) AND 252) OR 3

Ensure that bits 0 and 1 of $DD02 (56578) are set as outputs:

POKE 56578, PEEK(56578) OR 3

After selecting the desired VIC-II bank and setting the screen memory location via $D018, add the bank base address to the screen memory offset to compute the absolute address. For example, if bank 0 is selected and A=16 (screen memory at $0400 within the bank), the absolute address is $0000 (bank base) + $0400 = $0400.

## Source Code

```basic
10 REM Set screen page without disturbing lower 4 bits
20 POKE 53272,(PEEK(53272) AND 15) OR A

REM Tell KERNAL screen editor which page to use (page = A/16)
POKE 648,page
```

```text
A value table (A = upper-4-bits value -> page start offset)

+------+-----------+---------+-------------------+
|  A   |   BITS    | DECIMAL |        HEX        |
+------+-----------+---------+-------------------+
|    0 | 0000XXXX  |      0  |  $0000            |
|   16 | 0001XXXX  |   1024  |  $0400 (DEFAULT)  |
|   32 | 0010XXXX  |   2048  |  $0800            |
|   48 | 0011XXXX  |   3072  |  $0C00            |
|   64 | 0100XXXX  |   4096  |  $1000            |
|   80 | 0101XXXX  |   5120  |  $1400            |
|   96 | 0110XXXX  |   6144  |  $1800            |
|  112 | 0111XXXX  |   7168  |  $1C00            |
|  128 | 1000XXXX  |   8192  |  $2000            |
|  144 | 1001XXXX  |   9216  |  $2400            |
|  160 | 1010XXXX  |  10240  |  $2800            |
|  176 | 1011XXXX  |  11264  |  $2C00            |
|  192 | 1100XXXX  |  12288  |  $3000            |
|  208 | 1101XXXX  |  13312  |  $3400            |
|  224 | 1110XXXX  |  14336  |  $3800            |
|  240 | 1111XXXX  |  15360  |  $3C00            |
+------+-----------+---------+-------------------+

Note: Add the VIC-II bank base to these offsets to obtain the VIC-visible absolute address.
```

## Key Registers

- $D018 - VIC-II - Upper 4 bits select screen memory page (1 KB increments); lower 4 bits control character set and related VIC-II functions
- $DD00 - CIA #2 Port A - Bits 0 and 1 select the VIC-II memory bank

## References

- "video_bank_selection_cia2_ports" — expands on need to add VIC-II bank base when relocating screen memory
- "C64 Programmer's Reference Guide: Programming Graphics - Overview" — details on VIC-II bank selection and screen memory relocation

## Labels
- D018
- DD00
