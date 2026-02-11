# VIC-II Graphics Memory (16K Banks) and Bank Selection ($DD00 / $DD02)

**Summary:** The VIC-II can address one 16K block of the C64's 64K RAM at a time, referred to as VIC banks. The selection of the active VIC bank is controlled by bits 0 and 1 of the CIA #2 Port A register at $DD00.

**Graphics Memory Locations**

The Commodore 64's 64K RAM is divided into four 16K banks accessible by the VIC-II:

- **Bank 0**: $0000 - $3FFF (default at power-up)
- **Bank 1**: $4000 - $7FFF
- **Bank 2**: $8000 - $BFFF
- **Bank 3**: $C000 - $FFFF

To change the active VIC bank:

1. Ensure bits 0 and 1 of the Data Direction Register at $DD02 are set to 1, configuring them as outputs.
2. Set bits 0 and 1 of the Data Register at $DD00 to select the desired bank:

   - **00**: Bank 3 ($C000 - $FFFF)
   - **01**: Bank 2 ($8000 - $BFFF)
   - **10**: Bank 1 ($4000 - $7FFF)
   - **11**: Bank 0 ($0000 - $3FFF)

For example, to select Bank 2:


This sets bits 0 and 1 of $DD02 as outputs and configures $DD00 to select Bank 2.

## Key Registers

- **$DD00**: CIA #2 Port A Data Register; bits 0 and 1 select the VIC-II 16K bank.
- **$DD02**: CIA #2 Port A Data Direction Register; bits 0 and 1 must be set to 1 to configure them as outputs before changing $DD00.

## Source Code

```assembly
LDA $DD02
ORA #%00000011
STA $DD02

LDA $DD00
AND #%11111100
ORA #%00000001
STA $DD00
```


Below is an ASCII representation of the 64K memory map, illustrating the four VIC-II banks:

```text
$FFFF ┌───────────────────────────┐
      │                           │
      │        Bank 3             │
      │     ($C000-$FFFF)         │
      │                           │
$C000 ├───────────────────────────┤
      │                           │
      │        Bank 2             │
      │     ($8000-$BFFF)         │
      │                           │
$8000 ├───────────────────────────┤
      │                           │
      │        Bank 1             │
      │     ($4000-$7FFF)         │
      │                           │
$4000 ├───────────────────────────┤
      │                           │
      │        Bank 0             │
      │     ($0000-$3FFF)         │
      │                           │
$0000 └───────────────────────────┘
```

This diagram shows the division of the C64's 64K memory into four 16K banks accessible by the VIC-II.

## References

- "VIC Bank - C64-Wiki"
- "VIC-II for Beginners Part 1 - When Visibility Matters — Dustlayer"
- "C64 Programmer's Reference Guide: Programming Graphics - Overview"