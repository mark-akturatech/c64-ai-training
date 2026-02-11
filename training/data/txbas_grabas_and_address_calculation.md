# TXBAS / GRABAS — text & graphics base selection (requires VIDBAS + bank offset)

**Summary:** Documents the TXBAS macro (change text base) and the GRABAS macro (change graphics base). Explains that text and graphics base addresses selected via VIDBAS must be added to the currently selected memory bank to obtain absolute addresses (example: bank $4000-$7FFF + text base $0400 → absolute $4400).

**Description**
- **TXBAS:** Macro to set the text base (pointer/offset) within the currently selected video/memory bank.
- **GRABAS:** Macro to set the graphics base (pointer/offset) within the currently selected video/memory bank.
- **VIDBAS (Memory Control Register at $D018):** Selects which base (text/graphics) is used and which bank is visible to the VIC/CPU; the base values from TXBAS/GRABAS are offsets that must be added to the start address of the currently selected bank to compute the absolute CPU address where character/graphics data resides.
- **Absolute address calculation:** `absolute_address = bank_start_address + base_offset` (base_offset as set by TXBAS or GRABAS).

Worked example:
- If bank 1 ($4000–$7FFF) is selected and the text base is $0400, the text data is located at $4000 + $0400 = $4400.

**[Note: Source may contain an error — the original text shows "80400", which is almost certainly the OCR/typo for "$0400".]**

**VIDBAS Register Details**
The VIDBAS register at $D018 controls the selection of screen memory and character memory within the current VIC bank. Its bit layout is as follows:

- **Bits 0–2:** Character memory pointer (bits 11–13), relative to the VIC bank.
  - Values:
    - %000: $0000–$07FF
    - %001: $0800–$0FFF
    - %010: $1000–$17FF
    - %011: $1800–$1FFF
    - %100: $2000–$27FF
    - %101: $2800–$2FFF
    - %110: $3000–$37FF
    - %111: $3800–$3FFF
  - Note: Values %010 and %011 in VIC bank #0 and #2 select Character ROM instead.

- **Bits 4–7:** Screen memory pointer (bits 10–13), relative to the VIC bank.
  - Values:
    - %0000: $0000–$03FF
    - %0001: $0400–$07FF
    - %0010: $0800–$0BFF
    - %0011: $0C00–$0FFF
    - %0100: $1000–$13FF
    - %0101: $1400–$17FF
    - %0110: $1800–$1BFF
    - %0111: $1C00–$1FFF
    - %1000: $2000–$23FF
    - %1001: $2400–$27FF
    - %1010: $2800–$2BFF
    - %1011: $2C00–$2FFF
    - %1100: $3000–$33FF
    - %1101: $3400–$37FF
    - %1110: $3800–$3BFF
    - %1111: $3C00–$3FFF

**Note:** The VIC-II chip can access four 16 KB banks in the C64's memory. The base address of the current VIC bank is determined by bits 0 and 1 of the CIA#2 Port A register at $DD00:
- %00: Bank 3 ($C000–$FFFF)
- %01: Bank 2 ($8000–$BFFF)
- %10: Bank 1 ($4000–$7FFF)
- %11: Bank 0 ($0000–$3FFF)

To calculate the absolute address of screen or character memory:
1. Determine the base address of the current VIC bank from $DD00.
2. Add the offset specified by the VIDBAS register to this base address.

For example, if the VIC bank is set to bank 1 ($4000–$7FFF) and VIDBAS is set to %00010000 (screen memory at $0400 within the bank), the absolute address of the screen memory is $4000 + $0400 = $4400.

## Source Code
```text
; Example of setting the text base to $0400 within the current VIC bank
LDA #$10        ; %00010000 - Screen memory at $0400, character memory at $0000
STA $D018       ; Store in VIDBAS register
```

## Key Registers
- **$D018 (53272):** Memory Control Register (VIDBAS) – Selects screen and character memory within the current VIC bank.
- **$DD00 (56576):** CIA#2 Port A – Selects the current VIC bank.

## References
- "standard_text_mode_and_vidbas_text_selection" — expands on VIDBAS bits and the role of text/graphics bases
- "character_generator_rom_memory_maps_and_banking" — expands on memory banking details and where the VIC/CPU see the character generator

## Labels
- VIDBAS
- CIAPRA
