# VIC-II ROM Character Set Shadow — Banks 0 & 2

**Summary:** VIC‑II maps the built‑in ROM character set into a 4 KB window inside banks 0 and 2 (visible at $1000-$1FFF in bank 0 and $9000-$9FFF in bank 2), which prevents those 4 KB regions from being used for sprite data, custom charsets, or screen memory.

## ROM Character Set Shadows
Banks 0 and 2 contain a ROM character set shadow that the VIC‑II reads directly:

- Bank 0: ROM charset visible to VIC‑II at $1000-$1FFF
- Bank 2: ROM charset visible to VIC‑II at $9000-$9FFF

Because the ROM charset occupies a 4 KB region in each of those banks, that region is not available for RAM‑resident graphics resources (sprite shapes, custom character sets, or text screen memory). The VIC‑II accesses the ROM character data there without needing a RAM copy.

## Effects on Graphics Resources
The 4 KB ROM charset window reduces available RAM area for VIC‑II graphics in banks 0 and 2. Practical capacities (VIC‑II view):

- Banks 0 & 2 (with 4 KB ROM charset shadow):
  - 192 sprite shapes, OR
  - 12 text screens, OR
  - 6 custom character sets

- Banks 1 & 3 (full 16 KB available to VIC‑II):
  - 256 sprite shapes, OR
  - 16 text screens, OR
  - 8 custom character sets

Additional note: in banks 0 and 2 the lower half of a high‑resolution bitmap screen can be obscured by the ROM charset region (because that 4 KB falls inside the bitmap address range for certain bitmap layouts).

## References
- "bank_selection_table" — expands on which banks contain ROM charset shadows  
- "character_memory_offsets" — expands on how $D018 charset offsets map into bank addresses
