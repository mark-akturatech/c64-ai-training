# Custom character sets (8x8, RAM-based) — VIDBAS, $0800 alignment, VIC uses RAM CG

**Summary:** Custom C64 character sets are 256 characters × 8 rows (8 bytes per character = 2048 bytes) stored in RAM on a $0800 boundary in the current VIC bank; point the VIC to them (kernel/VIC base pointer often referred to as VIDBAS) and the VIC-II will use the RAM character generator instead of its ROM ($D018 controls VIC memory/graphics base). Each character is 8×8 bits (one byte per row); a bit=1 draws the character color, bit=0 draws the background color.

**How custom character sets work**
- Character format: each character = 8 rows × 8 bits; each row is one byte stored sequentially. Character N occupies bytes N*8 .. N*8+7.
- Full set size: 256 characters × 8 bytes = 2048 bytes (2 KB). Because of this size, the set must be placed on a $0800 (2 KB) boundary inside the currently selected VIC bank.
- Display mapping: the value in screen/text RAM is used as an index into the character generator (graphics RAM) to select which 8-byte character pattern to draw for that cell.
- Bit meaning: within a row byte, bit=1 => pixel drawn in the character color; bit=0 => pixel uses the background color.
- RAM vs ROM: when you instruct the VIC-II to fetch character generator data from RAM (via the VIC graphics base/kernel pointer), it no longer uses the on-chip character ROM; writes to text RAM that reference character codes will fetch your RAM patterns.
- First character(s): the first 8 bytes in your RAM-resident set correspond to character code 0 (and bytes 0..7 define character 0). Writing that code into screen memory will display that pattern (same for subsequent character codes mapping to subsequent 8-byte blocks).

**Placement and bank rules**
- Alignment: the character set must begin on a multiple of $0800 within the current VIC bank (2 KB-aligned).
- Bank: the 2 KB block must lie in the VIC-visible bank (the current bank the VIC is configured to use for character/screen memory).
- Avoid overlap with ROM: do not place the RAM character set in addresses that conflict with the VIC's visibility of the on-chip character ROM. Specifically, avoid placing the character set at $1000–$17FF or $1800–$1FFF in bank 0, and at $9000–$97FF or $9800–$9FFF in bank 2, as these areas are "overshadowed" by the ROM character sets as seen by the VIC-II chip. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Character_set?utm_source=openai))
- Save: after constructing a RAM character set (for example with a machine-language monitor), save it to disk if you want to reuse it later.

## Key Registers
- $D018 - VIC-II - Graphics base / memory bank and character/screen pointer (controls where VIC fetches character generator and screen memory)

## References
- "standard_text_mode_and_vidbas" — expands on changing the graphics base so VIC obtains character data from RAM

## Labels
- $D018
