# ASCII vs PETSCII (Commodore PET) — conversion rules

**Summary:** Differences between ASCII and Commodore PET character sets (PETSCII) in graphic vs text mode and precise byte-range conversion rules for transmitting PETSCII to 7-bit ASCII: bytes <$3F, $40–$5F (OR $20), $C0–$DF (AND $7F). Control characters may need special handling.

## Differences between ASCII and PETSCII
- In Commodore graphic mode the character set corresponds closely to 7-bit ASCII: numeric digits, upper-case alphabetic (in graphic mode), punctuation, and several control characters (e.g. RETURN) match ASCII. Commodore graphics characters (line/shape graphics) have no ASCII equivalents.
- In Commodore text mode the mapping diverges:
  - Numeric characters and most punctuation still correspond to ASCII.
  - ASCII upper-case alphabetic codes map to the Commodore machine's lower-case codes in text mode.
  - Commodore upper-case alphabetic glyphs are located outside the 7-bit ASCII range (Commodore uses 8-bit codes for these), so their codes do not directly match ASCII.

## PETSCII → ASCII conversion rules
When sending data from a Commodore PET (PETSCII) to a 7-bit ASCII device/line, apply these rules to convert character codes:

1. If the PETSCII byte is less than $3F (0x3F), transmit the byte directly (no change).
2. If the PETSCII byte is between $40 and $5F (inclusive), logically OR the byte with $20 (i.e., set bit 5, equivalent to adding decimal 32) before transmission.
3. If the PETSCII byte is between $C0 and $DF (inclusive), logically AND the byte with $7F (i.e., clear bit 7, equivalent to subtracting decimal 128) before transmission.

- Apply these rules to printable character ranges; some control characters may require special handling (e.g., non-printing controls, device-specific controls).
- Equivalent reverse rules exist for receiving ASCII into a Commodore machine (apply inverse bit operations).

## References
- "appendix_d_petscii_table" — expands on full PETSCII mapping table for reference