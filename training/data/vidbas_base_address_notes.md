# VIDBAS (video base) — changing text and graphics base addresses

**Summary:** The VIDBAS register at address $D018 (53272) in the VIC-II chip controls the base addresses for text and graphics modes. It allows selection of screen memory (video matrix) and character memory (character generator) locations within the current 16 KB VIC bank. Modifying specific bits of this register enables precise control over these base addresses.

**Changing the video base (VIDBAS) register values**

- **Screen Memory (Video Matrix):** The upper 4 bits (bits 4–7) of the VIDBAS register determine the starting address of the screen memory. Each value corresponds to a 1 KB boundary within the current VIC bank.

- **Character Memory (Character Generator):** Bits 1–3 of the VIDBAS register select the starting address of the character memory. Each value corresponds to a 2 KB boundary within the current VIC bank.

- **VIC Bank Selection:** The VIC-II can access one of four 16 KB memory banks. The active bank is selected via bits 0 and 1 of the CIA-2 Port A data register at address $DD00 (56576). The mapping is as follows:

  | Bank Number | Bits 1–0 of $DD00 | Address Range  | Character ROM Availability |
  |-------------|-------------------|----------------|----------------------------|
  | 0           | 11                | $0000–$3FFF    | Yes, at $1000–$1FFF        |
  | 1           | 10                | $4000–$7FFF    | No                         |
  | 2           | 01                | $8000–$BFFF    | Yes, at $9000–$9FFF        |
  | 3           | 00                | $C000–$FFFF    | No                         |

  *Note:* In banks 1 and 3, the character ROM is not available to the VIC-II. ([c64-wiki.com](https://www.c64-wiki.com/wiki/VIC_bank?utm_source=openai))

**VIDBAS Register Bit Layout**

The VIDBAS register ($D018) is structured as follows:

- **Bits 7–4 (VM13–VM10):** Select the 1 KB offset for screen memory within the current VIC bank.
- **Bits 3–1 (CB13–CB11):** Select the 2 KB offset for character memory within the current VIC bank.
- **Bit 0:** Unused.

**Table of VIDBAS Values and Corresponding Base Addresses**

The following table maps VIDBAS values to their corresponding screen and character memory base addresses within the current VIC bank:

| VIDBAS Value | Screen Memory Base Address | Character Memory Base Address |
|--------------|----------------------------|-------------------------------|
| $00          | $0000                      | $0000                         |
| $02          | $0000                      | $0800                         |
| $04          | $0000                      | $1000                         |
| $06          | $0000                      | $1800                         |
| $08          | $0000                      | $2000                         |
| $0A          | $0000                      | $2800                         |
| $0C          | $0000                      | $3000                         |
| $0E          | $0000                      | $3800                         |
| $10          | $0400                      | $0000                         |
| $12          | $0400                      | $0800                         |
| $14          | $0400                      | $1000                         |
| $16          | $0400                      | $1800                         |
| $18          | $0400                      | $2000                         |
| $1A          | $0400                      | $2800                         |
| $1C          | $0400                      | $3000                         |
| $1E          | $0400                      | $3800                         |
| $20          | $0800                      | $0000                         |
| $22          | $0800                      | $0800                         |
| $24          | $0800                      | $1000                         |
| $26          | $0800                      | $1800                         |
| $28          | $0800                      | $2000                         |
| $2A          | $0800                      | $2800                         |
| $2C          | $0800                      | $3000                         |
| $2E          | $0800                      | $3800                         |
| $30          | $0C00                      | $0000                         |
| $32          | $0C00                      | $0800                         |
| $34          | $0C00                      | $1000                         |
| $36          | $0C00                      | $1800                         |
| $38          | $0C00                      | $2000                         |
| $3A          | $0C00                      | $2800                         |
| $3C          | $0C00                      | $3000                         |
| $3E          | $0C00                      | $3800                         |
| $40          | $1000                      | $0000                         |
| $42          | $1000                      | $0800                         |
| $44          | $1000                      | $1000                         |
| $46          | $1000                      | $1800                         |
| $48          | $1000                      | $2000                         |
| $4A          | $1000                      | $2800                         |
| $4C          | $1000                      | $3000                         |
| $4E          | $1000                      | $3800                         |
| $50          | $1400                      | $0000                         |
| $52          | $1400                      | $0800                         |
| $54          | $1400                      | $1000                         |
| $56          | $1400                      | $1800                         |
| $58          | $1400                      | $2000                         |
| $5A          | $1400                      | $2800                         |
| $5C          | $1400                      | $3000                         |
| $5E          | $1400                      | $3800                         |
| $60          | $1800                      | $0000                         |
| $62          | $1800                      | $0800                         |
| $64          | $1800                      | $1000                         |
| $66          | $1800                      | $1800                         |
| $68          | $1800                      | $2000                         |
| $6A          | $1800                      | $2800                         |
| $6C          | $1800                      | $3000                         |
| $6E          | $1800                      | $3800                         |
| $70          | $1C00                      | $0000                         |
| $72          | $1C00                      | $0800                         |
| $74          | $1C00                      | $1000                         |
| $76          | $1C00                      | $1800                         |
| $78          | $1C00                      | $2000                         |
| $7A          | $1C00                      | $2800                         |
| $7C          | $1C00                      | $3000                         |
| $7E          | $1C00                      | $3800                         |
| $80          | $2000                      | $0000                         |
| $82          | $2000                      | $0800                         |
| $84          | $2000                      | $1000                         |
| $86          | $2000                      | $1800                         |
| $88          | $2000                      | $2000                         |
| $8A          | $2000                      | $2800                         |
| $8C          | $2000                      | $3000                         |
| $8E          | $2000                      | $3800                         |
| $90          | $2400                      | $0000                         |
| $92          | $2400                      | $0800                         |
| $94          | $2400                      | $1000                         |
| $96          | $2400                      | $1800                         |
| $98          | $2400                      | $2000                         |
| $9A          | $2400                      | $2800                         |
| $9C          | $2400                      | $3000                         |
| $9E          | $2400                      | $3800                         |
| $A0          | $2800                      | $0000                         |
| $A2          | $2800                      | $0800                         |
| $A4          | $2800                      | $1000                         |
| $A6          | $2800                      | $1800                         |
| $A8          | $2800                      | $2000                         |
| $AA          | $2800                      | $2800                         |
| $AC          | $2800                      | $3000                         |
| $AE          | $2800                      | $3800                         |
| $B0          | $2C00                      | $0000                         |
| $B2          | $2C00                      | $0800                         |
| $B4          | $2C00                      | $1000                         |
| $B6          | $2C00                      | $1800                         |
| $B8          | $2C00                      | $2000                         |
| $BA          | $2C00                      | $2800                         |
| $BC          | $2C00                      | $3000                         |
| $BE          | $2C00                      | $3800                         |
| $C0          | $3000                      | $0000                         |
| $C2          | $3000                      | $0800                         |
| $C4          | $3000                      | $1000                         |
| $C6          | $3000                      | $1800                         |
| $C8          | $3000                      | $2000                         |
| $CA          | $3000                      | $2800                         |
| $CC          | $3000                      | $3000                         |
| $CE          | $3000                      | $3800                         |
| $D0          | $3400                      | $0000                         |
| $D2          | $3400                      | $0800                         |
| $D4          | $3400                      | $1000                         |
| $D6          | $3400                      | $1800                         |
| $D8          | $3400                      | $2000                         |
| $DA          | $3400                      |

## Labels
- VIDBAS
- CIAPRA
