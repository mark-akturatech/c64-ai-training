# Using $D018 to select VIC-II screen memory and character set

**Summary:** $D018 (VIC-II) stores the upper 4 bits of the 14-bit screen memory address and the lower 4 bits of the 14-bit character-set address; screen memory is selected in $0400-sized chunks, character sets in $0800-sized chunks (example: screen $0400 + charset $2000 → $D018 = $18).

## Changing character set and screen memory with $D018
$D018 is a single VIC-II register that encodes the start locations of two distinct 14-bit VIC addresses:
- upper nibble (bits 7–4) = four most significant bits of the 14-bit screen memory address;
- lower nibble (bits 3–0) = four most significant bits of the 14-bit character-set address.

Constraints and chunk sizes:
- Screen memory size and alignment: $0400 bytes (1024 bytes); start address must be a multiple of $0400 (possible starts: $0000, $0400, $0800, $0C00, ...). Default C64 screen memory is at $0400.
- Character set size and alignment: $0800 bytes (2048 bytes); start address must be a multiple of $0800 (possible starts: $0000, $0800, $1000, $1800, $2000, ...).

Practical method (counting chunks):
- To compute the nibble for screen memory, count how many $0400 chunks from $0000 to the desired screen start. That count (0..15) is placed into the upper 4 bits of $D018.
- To compute the nibble for the character set, count how many $0800 chunks from $0000 to the desired charset start. That count (0..15) is placed into the lower 4 bits of $D018.

Example from source:
- Screen at $0400 → count $0400 chunks: $0000, $0400 = 1 → upper nibble = 1.
- Charset at $2000 → count $0800 chunks: $0000, $0800, $1000, $1800, $2000 = 8 → lower nibble = 8.
- Combine: upper=1, lower=8 → $D018 = %00011000 = $18.

(Equivalently: treat screen nibble = screen_start / $0400, charset nibble = charset_start / $0800, then write (screen_nibble << 4) | charset_nibble to $D018.)

## Source Code
(omitted — no assembly/BASIC listings or register maps in this chunk)

## Key Registers
- $D018 - VIC-II - Screen memory (upper 4 bits, $0400 units) and character set base (lower 4 bits, $0800 units)

## References
- "altering_charset_realtime_example" — real-time charset modification example that sets $D018 and writes into character memory