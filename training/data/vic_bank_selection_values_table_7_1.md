# VIC Bank Selection (Table 7-1)

**Summary:** Describes the four 16K banks the VIC-II can be switched to and references a BANK macro; lists memory ranges ($0000-$3FFF, $4000-$7FFF, $8000-$BFFF, $C000-$FFFF). Searchable terms: VIC bank, BANK macro, $0000-$3FFF, $4000-$7FFF, $8000-$BFFF, $C000-$FFFF.

**Bank selection overview**
The VIC-II addresses one 16K-aligned bank of the 64K system memory at a time. The source notes a BANK macro that will select the proper VIC bank automatically. If selecting the bank manually, the original Table 7-1 is the reference for the values to write.

The four 16K banks covered are the standard C64 16K boundaries:
- Bank 0: $0000–$3FFF
- Bank 1: $4000–$7FFF
- Bank 2: $8000–$BFFF
- Bank 3: $C000–$FFFF

To select a specific VIC bank, write the corresponding value to bits 0 and 1 of the CIA #2 Port A data register at address $DD00. Ensure these bits are set as outputs by configuring the data direction register at $DD02. The values to write for each bank are:

- Bank 0: Write 3 (binary 11) to bits 0 and 1 of $DD00
- Bank 1: Write 2 (binary 10) to bits 0 and 1 of $DD00
- Bank 2: Write 1 (binary 01) to bits 0 and 1 of $DD00
- Bank 3: Write 0 (binary 00) to bits 0 and 1 of $DD00

For example, to select Bank 2:


## Source Code

```assembly
LDA $DD02
ORA #$03        ; Set bits 0 and 1 as outputs
STA $DD02
LDA $DD00
AND #$FC        ; Clear bits 0 and 1
ORA #$01        ; Set bits 0 and 1 to 01 (Bank 2)
STA $DD00
```

```text
Table 7-1. The Values to Use When Selecting the Bank of Memory the VIC Chip Will Use.

VALUE    BANK #    MEMORY RANGE ADDRESSED
-----    ------    ----------------------
3        0         $0000-$3FFF
2        1         $4000-$7FFF
1        2         $8000-$BFFF
0        3         $C000-$FFFF
```

## Key Registers
- $DD00: CIA #2 Port A data register (bits 0 and 1 select VIC bank)
- $DD02: CIA #2 Port A data direction register (configure bits 0 and 1 as outputs)

## References
- "vic_bank_selection_intro" — expands on how to change the VIC bank by setting bits (registers, prerequisites such as $DD02).
- "vic_memory_map_32k_fig7_3" — visual mapping of the 16K address ranges used by the VIC (figure/table referenced by Table 7-1).