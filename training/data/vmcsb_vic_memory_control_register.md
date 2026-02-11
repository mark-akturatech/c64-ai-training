# $D018 — VMCSB (VIC-II Memory Control Register)

**Summary:** $D018 (53272) VMCSB — VIC-II Memory Control Register sets the Video Matrix base (bits 4–7) in 1K increments and the Character Dot‑Data / bitmap base (bits 1–3; bit 3 significant in bitmap mode). Changing it requires updating BASIC's screen pointer at location 648 ($288).

**Description**
$D018 is the VIC-II memory control register. It establishes two important base addresses (offsets from the beginning of the VIC-II 16K address space):

- **Bits 1–3 (lower nybble, bit 0 unused):** Select the Character Dot‑Data base address. These three bits encode an even 1K offset (0, 2, 4, …, 14) from the start of VIC-II memory; the encoded value times 1K is the character/bitmap base. Default for this field is 4 (i.e., $1000 / 4096), the nominal location of the Character ROM as seen by the VIC-II. In bitmap mode, only bit 3 of this field is significant (bitmap may start at offset 0 or 8K).

- **Bits 4–7 (upper nybble):** Select the Video Matrix (screen RAM) base address in 1K increments (values 0..15). The Video Matrix is the 1024‑byte area holding screen character codes; its last eight bytes are also used as sprite pattern pointers (each selects a 64‑byte block).

**Notes and implications:**
- Character dot data and screen memory are offsets into the VIC-II 16K view; the actual CPU addresses depend on which 16K bank is mapped for the VIC-II.
- The BASIC editor expects the visible screen's page number at memory location 648 ($288). If you relocate the Video Matrix via $D018, you must update 648 with the page number (page = address/256) of the new screen memory or typed input and the BASIC editor cursor will not appear in the relocated screen.
- In bitmap mode, the lower nybble's only useful bit is bit 3: 0 => bitmap at offset 0; 1 => bitmap at offset 8192 (8K).
- Example values and bit behavior are preserved from the original VIC-II documentation.

**VIC-II Bank Selection:**
The VIC-II can access one of four 16K memory banks, selected via bits 0 and 1 of CIA #2 Port A at $DD00 (56576). The mapping is as follows:

| Bank | $DD00 Bits 1–0 | Address Range | Character ROM Available? |
|------|----------------|---------------|--------------------------|
| 0    | 11             | $0000–$3FFF   | Yes, at $1000–$1FFF      |
| 1    | 10             | $4000–$7FFF   | No                       |
| 2    | 01             | $8000–$BFFF   | Yes, at $9000–$9FFF      |
| 3    | 00             | $C000–$FFFF   | No                       |

**Calculating Absolute CPU Addresses:**
To determine the absolute CPU address for screen memory or character data:

1. **Select the VIC-II Bank:**
   - Set bits 0 and 1 of $DD00 to choose the desired bank.

2. **Set $D018 for Screen and Character Base:**
   - Bits 4–7: Set the Video Matrix base (screen memory) in 1K increments.
   - Bits 1–3: Set the Character Dot‑Data base in 2K increments.

3. **Calculate the Absolute Address:**
   - Absolute Address = VIC-II Bank Start Address + (Value from $D018 * Increment)

**Example:**
- **VIC-II Bank 2 ($8000–$BFFF):**
  - Set $DD00 to %00000001 to select Bank 2.
  - Set $D018 to %00010010:
    - Bits 4–7 = %0001 (Video Matrix base at 1 * 1024 = $0400)
    - Bits 1–3 = %010 (Character Dot‑Data base at 2 * 2048 = $1000)
  - Absolute Screen Memory Address = $8000 + $0400 = $8400
  - Absolute Character Memory Address = $8000 + $1000 = $9000

**Updating BASIC Screen Pointer:**
After changing the Video Matrix base, update the BASIC screen pointer at location 648 ($288):


**Full Bit-by-Bit Numeric Examples:**


## Source Code

```basic
POKE 648, ScreenMemoryAddress / 256
```

## Labels
- VMCSB
