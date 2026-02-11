# VIC-II 16K Memory Blocks (Block 0–3)

**Summary:** Describes the four 16K VIC-II banks (Block 0–3), their uses for character/sprite/bitmap memory, the visibility of the Character ROM, interactions with BASIC and the OS, and bank-switch control via CIA2 Port A bits and their Data Direction Register (DDRA). Searchable terms: $D000, $CC00, $002C, $0038, VIC-II, Character ROM, Kernal ROM, CIA2 ($DD00).

**Overview**
The VIC-II accesses a selectable 16K window of the C64 address space. Which 16K bank is visible to the VIC determines whether the chip sees the system variables/BASIC text, BASIC ROM/BASIC-underlying-RAM, or the RAM under the Kernal ROM — and whether the on-board Character ROM is visible inside the VIC's 16K window (notably at the VIC address range $1000–$1FFF when visible).

Choosing a bank affects:
- Availability of the Character ROM to the VIC (affects text/charset rendering).
- Whether the VIC sees RAM that the CPU treats as ROM (useful for graphics data visible to VIC but not readable by BASIC/OS).
- Conflicts with system/DOS locations (some banks overlay areas used by DOS/Kernal).

Reserve or move BASIC program space by adjusting BASIC pointers at 56 (decimal $38) or 44 (decimal $2C) to avoid collisions with graphics areas.

**Block 0**
- Contents: system variables and BASIC text. When selected for the VIC, the Character ROM is visible to the VIC in the VIC address range $1000–$1FFF, which limits available graphics locations to the VIC-visible RAM that is not overlaid by the Character ROM.
- Implication: The Character ROM overlay reduces usable graphic memory within the VIC window while Block 0 is selected.
- Use case: Default/system bank; limited for large graphics that require the full 16K without ROM overlays.

**Block 1**
- Contents: BASIC program storage (normal use). When the VIC uses this bank, the Character ROM is not available to the VIC.
- Implication: This area is wide open for sprite shapes, custom character sets, and bitmap graphics (provided BASIC program space is lowered so the BASIC program does not collide).
- Drawbacks: No Character ROM (you must copy characters to RAM if needed) and reduced BASIC program space (possible as little as ~14K remaining).
- Note: Copying Character ROM to RAM is a common workaround (see Character ROM / $D000 references).

**Block 2**
- Contents: 8K RAM + 8K BASIC ROM overlay. The VIC reads the physical RAM beneath the BASIC ROM, so graphics data placed here is visible to the VIC even if the CPU has BASIC ROM switched in.
- Implications & caveats:
  - The CPU (BASIC/OS) will read the BASIC ROM image, not the underlying RAM; while the CPU writes go to RAM, the CPU cannot read back the RAM contents through BASIC/OS without bank tricks.
  - This makes Block 2 suitable for sprite and character data (VIC displays them normally), but unsuited for screen memory that the OS must read (for example, the OS reads the text screen to move the cursor; if the OS reads ROM instead of the RAM-based screen the system will misbehave).
  - The text notes “locations 36863–40959 ousted by the character ROM” (decimal) — this reduces true RAM available for a complete high-resolution screen; only ~4K of real RAM remains for screen use in that configuration.
- Use case: Good for graphics data that the program does not need to read via BASIC/OS. Not recommended for bitmap modes if the program or OS must read screen memory.

**Block 3**
- Contents: 4K unused system RAM, 4K I/O area, and 8K Kernal ROM (Kernal ROM overlays the top 8K).
- Implications:
  - The 8K under the Kernal can be used by placing graphics/sprite data there (VIC reads RAM underneath Kernal ROM when the VIC bank is selected accordingly).
  - Character ROM is not available in this bank; as with other banks, characters can be copied into RAM.
- Conflicts: DOS support utilities commonly reside at 52224 (decimal $CC00). Avoid using $CC00–$CFFF (52224–53247) for graphics if you plan to use DOS support as it may conflict with DOS code.
- Use case: Useful when you need significant space for both graphics and BASIC, provided you avoid DOS/Kernal conflicts.

**Copying Character ROM and Visibility**
- When a bank does not present the Character ROM to the VIC, a common workaround is to switch the ROM in temporarily and copy needed characters into RAM, then switch back so the VIC can read the RAM-resident charset.
- The Character ROM entry is referenced at 53248 (decimal) = $D000 in the source material.

**Changing Banks (from BASIC)**
- Steps given in source:
  1. Ensure the Data Direction Register for Port A (CIA2) sets bits 0 and 1 as outputs (this is normally the power-up default).
  2. Select a bank by setting bits 0–1 of Port A appropriately.

To select a bank, use the following BASIC lines:


Where `A` corresponds to the desired bank:

- `A = 0` : Bank 3 ($C000–$FFFF)
- `A = 1` : Bank 2 ($8000–$BFFF)
- `A = 2` : Bank 1 ($4000–$7FFF)
- `A = 3` : Bank 0 ($0000–$3FFF)

*Note: The Commodore 64 character set is not available to the VIC-II chip in Banks 1 and 3.*

**Copying Character ROM to RAM**
To copy the Character ROM to RAM for modification, use the following BASIC program:


This program copies the first 256 characters (each 8 bytes) from the Character ROM at $D000 to RAM starting at $3000 (decimal 12288). After copying, it sets the VIC-II to use the new character set location.

## Source Code

```basic
POKE 56578, PEEK(56578) OR 3 : REM MAKE SURE BITS 0 AND 1 ARE OUTPUTS
POKE 56576, (PEEK(56576) AND 252) OR A : REM CHANGE BANKS
```

```basic
POKE 56334, PEEK(56334) AND 254 : REM TURN OFF KEYSCAN INTERRUPT TIMER
POKE 1, PEEK(1) AND 251 : REM SWITCH IN CHARACTER ROM
FOR I = 0 TO 2047 : POKE 12288 + I, PEEK(53248 + I) : NEXT I
POKE 1, PEEK(1) OR 4 : REM SWITCH IN I/O
POKE 56334, PEEK(56334) OR 1 : REM RESTART KEYSCAN INTERRUPT TIMER
POKE 53272, (PEEK(53272) AND 240) OR 12 : REM SET CHARACTER SET TO RAM AT $3000
```

```text
Reference addresses and decimal/hex pairs mentioned in the source:

- BASIC pointer entries:
  - 44 (decimal) = $002C  (start of BASIC pointer)
  - 56 (decimal) = $0038  (end of BASIC pointer)

- Character ROM entry referenced:
  - 53248 (decimal) = $D000

- DOS support / conflict area:
  - 52224–53247 (decimal) = $CC00–$CFFF

- Reference decimal range noted as "ousted by the character ROM":
  - 36863–40959 (decimal) = $8FFF–$9FFF

- CIA2 registers (standard CIA locations; used for bank bits on Port A):
  - $DD00  - CIA 2 Port A (PRA)
  - $DD01  - CIA 2 Port B (PRB)
  - $DD02  - CIA 2 Data Direction Register A (DDRA)
  - $DD03  - CIA 2 Data Direction Register B (DDRB)
```

## Key Registers
- $002C - BASIC pointer (start of BASIC) — raising this reserves low memory above BASIC text.
- $0038 - BASIC pointer (end of BASIC) — lowering this reserves memory after BASIC text.
- $D000 - Character ROM (referenced at decimal 53248)
- $DD00-$DD03 - CIA 2 (PRA/PRB/DDRA/DDRB) — bits 0–1 of Port A (PRA) and their DDRA control VIC bank selection
- $CC00-$CFFF - DOS support region (52224–53247) — avoid for graphics if using DOS support
- $8FFF-$9FFF - Region noted as "ousted by the character ROM" (36863–40959 decimal)

## References
- "vic_ii_memory_banking_bits_in_cia2_porta" — expands on bank bit patterns in CIA2 Port A and exact bit values for selecting banks.
- "changing_vic_memory_banks_from_basic" — contains example BASIC code and procedures to change VIC-II memory banks and set VIC pointers.

## Labels
- CIAPRA
- CIAPRB
- CIADDRA
- CIADDRB
