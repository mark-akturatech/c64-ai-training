# Garbage in Vertical Border or Behind FLD — clear VIC bank last byte ($3FFF, $7FFF, ...)

**Summary:** When black or garbage appears in the top/bottom border or during Flexible Line Distance (FLD) effects on a Commodore 64, the VIC-II chip may be reading the last byte of the selected VIC bank. Clearing that last byte (e.g., $3FFF for bank 0) often removes the artifact. However, clearing this byte may overwrite code or data, potentially causing crashes.

**Problem and Fix**

If you observe black garbage in the vertical top/bottom border or artifacts during FLD, the displayed data can come from the last byte of the current VIC bank. Clearing that byte to zero tends to remove the visible garbage because the VIC-II will fetch a harmless zero instead of whatever leftover value was there.

Typical bank-end addresses (last byte for each VIC bank):

- **Bank 0:** $0000–$3FFF — last byte $3FFF (default bank)
- **Bank 1:** $4000–$7FFF — last byte $7FFF
- **Bank 2:** $8000–$BFFF — last byte $BFFF
- **Bank 3:** $C000–$FFFF — last byte $FFFF

**Action:** Write 0 to the last byte of the currently selected VIC bank. For example, for bank 0:


Do this only after confirming what data or code resides at that address.

**Warning:** Clearing the bank-end byte can overwrite useful code or data. If that address contains executable code, pointers, or data used later, zeroing it may cause crashes or misbehavior. Back up or relocate code/data if necessary before clearing.

## Source Code

```assembly
LDA #$00
STA $3FFF
```


## Key Registers

- **$DD00 (CIA#2 Port A):** Controls the VIC bank selection. Bits 0 and 1 determine the active VIC bank:
  - %00: Bank 3 ($C000–$FFFF)
  - %01: Bank 2 ($8000–$BFFF)
  - %10: Bank 1 ($4000–$7FFF)
  - %11: Bank 0 ($0000–$3FFF)

  To select a bank, ensure bits 0 and 1 are set as outputs:

  ```assembly
  LDA $DD02
  ORA #$03
  STA $DD02
  ```

  Then, set the desired bank:

  ```assembly
  LDA $DD00
  AND #$FC
  ORA #<bank_number>
  STA $DD00
  ```

  Replace `<bank_number>` with the appropriate value (0 to 3) corresponding to the desired bank.

## References

- "Commodore 64 Programmer's Reference Guide: Programming Graphics - Overview" — Discusses VIC-II memory access and bank selection. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_101.html?utm_source=openai))
- "VIC-II for Beginners Part 1 - When Visibility Matters" — Explains VIC-II bank selection and memory mapping. ([dustlayer.com](https://dustlayer.com/vic-ii/2013/4/22/when-visibility-matters?utm_source=openai))

## Labels
- CIAPRA
- CIADDRA
