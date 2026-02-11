# CIA #2 Port A (Bits 0-1) — VIC‑II 16K Video Bank Select

**Summary:** Bits 0–1 of CIA #2 Port A ($DD00) select which 16K block of the 64K address space the VIC‑II ($D000-$D02E) uses for all video data (sprites, character data, screen memory, bitmaps). The default power‑on bank is the bottom 16K ($0000-$3FFF); changing banks is required to place graphics in areas that don't conflict with BASIC, system variables, or visible ROM.

**Operation**
- The VIC‑II can only access one contiguous 16K window at a time. All graphics and character data the VIC displays must reside in that selected 16K block.
- Bits 0 and 1 of CIA #2 Port A (CIA2 Port A, $DD00) encode the bank selection as a 2‑bit value (00..11). Changing these bits switches which 16K of the CPU address space the VIC‑II sees.
- Within the selected 16K:
  - Sprite graphics can occupy any of 256 groups of 64 bytes.
  - Character generator (user-defined chars) data can be placed in any of eight 2K blocks.
  - Text screen memory can be anywhere among sixteen 1K areas.
  - Bitmap screen memory can occupy either of two 8K sections.

- At power‑on the VIC‑II uses the bottom 16K (Bank 0, $0000–$3FFF). This default often conflicts with system/BASIC data and with the character ROM being visible to the VIC‑II, so programs commonly switch banks.

**Bank contents and considerations**
- Bank mapping (2‑bit selection) — see the Source Code table for exact mapping.
- Bank 0 ($0000–$3FFF)
  - Default on power‑up. Contains system variables, the BASIC program text area, and default screen memory at $0400–$07FF.
  - The VIC‑II sees the character generator ROM at $1000–$1FFF in this bank, which makes that area unavailable for user character bitmaps (character ROM overlays those addresses for the VIC).
  - Very little free space for graphics in this bank. Specific free regions mentioned in the source:
    - Locations 679–767 ($02A7–$02FF) — unused; can hold one sprite shape (sprite number 11) or data for 11 characters.
    - Locations 820–1023 ($0334–$03FF) — includes the cassette I/O buffer; available for graphics and large enough for three sprite shapes (13–15) or data for 25 characters (numbers 103–127).
  - Because of these conflicts, many programs switch the VIC bank to avoid ROM overlays and BASIC/system areas.

- Bank 1 ($4000–$7FFF)
  - This bank is entirely RAM and free from ROM overlays, making it ideal for placing video data without conflicts. It provides a contiguous 16K block suitable for sprites, bitmaps, and user-defined character sets.

- Bank 2 ($8000–$BFFF)
  - Similar to Bank 0, this bank has the character ROM visible to the VIC‑II at $9000–$9FFF, which can interfere with custom character data. However, the remaining areas are available for graphics data.

- Bank 3 ($C000–$FFFF)
  - This bank includes the I/O registers and the Kernal ROM, which can limit available RAM for graphics. Careful management is required to use this bank effectively for video data.

**Changing VIC‑II Banks from BASIC**
To change the VIC‑II bank from BASIC, follow these steps:

1. **Set Bits 0 and 1 of CIA #2 Port A as Outputs:**
   This ensures that bits 0 and 1 are configured as outputs.

2. **Select the Desired Bank:**
   Replace `A` with the value corresponding to the desired bank:
   - `0` for Bank 3 ($C000–$FFFF)
   - `1` for Bank 2 ($8000–$BFFF)
   - `2` for Bank 1 ($4000–$7FFF)
   - `3` for Bank 0 ($0000–$3FFF)

   For example, to select Bank 1:

   This procedure configures the VIC‑II to access the specified 16K memory bank, allowing placement of graphics data in areas that do not conflict with system memory or ROM overlays.

## Source Code

   ```basic
   POKE 56578, PEEK(56578) OR 3
   ```

   ```basic
   POKE 56576, (PEEK(56576) AND 252) OR A
   ```

   ```basic
   POKE 56576, (PEEK(56576) AND 252) OR 2
   ```

```text
Bank selection table (CIA #2 Port A bits 0-1):

Bit pattern (bits 1..0)  Bank   Address range (decimal)  Address range (hex)
00                       3      49152 - 65535            $C000 - $FFFF
01                       2      32768 - 49151            $8000 - $BFFF
10                       1      16384 - 32767            $4000 - $7FFF
11                       0      0     - 16383            $0000 - $3FFF

Notable regions when VIC bank = Bank 0 ($0000-$3FFF):
- Default screen memory: $0400 - $07FF (locations 1024-2047 decimal)
- VIC-visible character ROM region (overlays RAM for VIC): $1000 - $1FFF (4096-8191 decimal)
- Small unused area: locations 679-767 ($02A7-$02FF) — can hold one 64-byte sprite or ~11 character definitions
- Area including cassette I/O buffer: locations 820-1023 ($0334-$03FF) — can hold three 64-byte sprites or ~25 character definitions
```

## Key Registers
- $DD00 - CIA #2 - Port A (bits 0-1 select VIC‑II 16K video bank)
- $D000-$D02E - VIC‑II - video chip (VIC sees only one 16K bank at a time; all graphics must be inside the selected bank)

## References
- "changing_vic_memory_banks_from_basic" — procedures and POKE examples to change CIA #2 Port A and VIC bank
- "character_generator_rom_and_user_defined_chars" — explains character ROM visibility and how it affects user-defined character data