# VIC-II Video Bank Selection via CIA#2 ($DD00 / $DD02)

**Summary:** VIC-II bank selection is controlled by bits 0–1 of CIA #2 PORT A at $DD00 and the corresponding Data Direction Register at $DD02. Use POKE/PEEK (or equivalent machine code) to set bits 0–1 as outputs and write a value 0..3 to select one of the four 16K VIC-II banks.

**Video Bank Selection**

The VIC-II can only "see" one 16K window of the 64K address space at a time. CIA #2 provides two PORT A lines (bits 0 and 1) used as the bank-select lines. To change which 16K region the VIC-II fetches from:

- Set bits 0 and 1 of the CIA #2 Data Direction Register (PORT A DDR) at $DD02 to outputs (write 1 to those bits).
- Write the desired bank value (0..3) into CIA #2 PORT A at $DD00. Only the low two bits of $DD00 are used by the VIC-II for bank selection.

Typical BASIC idiom uses PEEK/POKE and bitwise operations to avoid disturbing other bits:
- First, make bits 0 and 1 outputs by OR-ing with 3 (binary 00000011).
- Then set the low two bits of $DD00 to A (0..3) while leaving other bits unchanged by AND-ing with 252 (11111100) and OR-ing with A.

A (0..3) selects the VIC-II base 16K window as follows:

- A = 0 -> base $C000
- A = 1 -> base $8000
- A = 2 -> base $4000
- A = 3 -> base $0000

(Changes apply to where the VIC-II fetches character/table/screen data; use the correct bank for your character set/screen/data placement.)

## Source Code

```basic
POKE 56578,PEEK(56578) OR 3: REM MAKE SURE BITS 0 AND 1 ARE OUTPUTS
POKE 56576,(PEEK(56576) AND 252) OR A: REM CHANGE BANK
```

```text
VIC-II bank mapping (A -> VIC base address):
A = 0  -> $C000-$FFFF
A = 1  -> $8000-$BFFF
A = 2  -> $4000-$7FFF
A = 3  -> $0000-$3FFF
```

## Key Registers

- $DD00 - CIA #2 PORT A - VIC-II bank select (bits 0-1)
- $DD02 - CIA #2 PORT A DDR - Data direction (set bits 0-1 = outputs to change bank)

## References

- "character_memory" — how bank choice affects character set locations
- "screen_memory" — how bank choice affects screen memory placement

## Labels
- CIA2_PORTA
- CIA2_DDRA
