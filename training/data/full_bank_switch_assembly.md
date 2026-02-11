# VIC-II Memory Banking and $D018 Configuration (Bank 2 example)

**Summary:** Example 6502 assembly to switch to VIC bank 2 ($8000-$BFFF) and set VIC-II memory pointers via $D018 (screen offset bits 7-4, charset bits 3-1). Shows read-modify-write on $DD00 as the bank-select location and writes #%00011000 ($18) to $D018 to place screen at $0400 and charset at $2000.

**Overview**
This chunk contains a minimal 6502 assembly sequence that:
- Performs a read-modify-write on $DD00 to select "bank 2" (example uses bitmask/or to set bank bits).
- Writes $18 to $D018, encoding screen memory at offset $0400 (bits 7-4 = %0001) and character set at offset $2000 (bits 3-1 = %100).
The assembled value #%00011000 ($18) therefore encodes the two VIC-II pointer fields in $D018.

Important behavioral notes preserved from the source:
- The example treats $DD00 as the bank-selection register and uses AND/ORA read-modify-write to preserve unrelated bits.
- $D018 is used to program VIC-II screen and character memory offsets by packing the screen offset into bits 7–4 and the charset offset into bits 3–1.

**[Note: Source may contain an error — stock C64 systems normally use the CPU port at $0001 for memory banking. Verify the target hardware or system variant before relying on $DD00 for bank switching.]**

**Details**
- **Bank Selection via $DD00:**
  - **Bits 0-1:** Select the VIC-II memory bank:
    - %00: Bank 3 ($C000–$FFFF)
    - %01: Bank 2 ($8000–$BFFF)
    - %10: Bank 1 ($4000–$7FFF)
    - %11: Bank 0 ($0000–$3FFF)
  - **Bits 2-7:** Used for other functions (e.g., serial bus control) and should be preserved during modification.
  - **Note:** The example uses $DD00 for bank selection, which is correct for VIC-II memory bank switching. However, for CPU memory configuration, $0001 is typically used. Ensure the correct register is modified based on the desired operation.

- **$D018 Memory Control Register:**
  - **Bit 0:** Unused.
  - **Bits 1-3 (CB11–CB13):** Character memory pointer (in text mode) or bitmap memory pointer (in bitmap mode):
    - %000: $0000–$07FF
    - %001: $0800–$0FFF
    - %010: $1000–$17FF
    - %011: $1800–$1FFF
    - %100: $2000–$27FF
    - %101: $2800–$2FFF
    - %110: $3000–$37FF
    - %111: $3800–$3FFF
  - **Bits 4-7 (VM10–VM13):** Screen memory pointer:
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

- **Example Configuration:**
  - **Screen Memory Offset:** $0400
    - Bits 7-4 = %0001
  - **Character Set Offset:** $2000
    - Bits 3-1 = %100
  - **Combined $D018 Value:** #%00011000 = $18

## Source Code
```asm
; Switch to VIC Bank 2 ($8000-$BFFF)
; Place screen at $0400, charset at $2000

    ; Select bank 2
    lda $DD00
    and #%11111100
    ora #%00000001       ; Bank 2 = %01
    sta $DD00

    ; Configure screen at offset $0400, charset at offset $2000
    ; Screen: %0001 in bits 7-4 = $0400 offset
    ; Charset: %100 in bits 3-1 = $2000 offset
    lda #%00011000       ; $18
    sta $D018
```

## Key Registers
- **$D018 (53272):** VIC-II Memory Control Register
  - **Bits 7-4:** Screen memory pointer
  - **Bits 3-1:** Character memory pointer
  - **Bit 0:** Unused
- **$DD00 (56576):** CIA 2 Port A
  - **Bits 0-1:** VIC-II memory bank selection
  - **Bits 2-7:** Other functions (e.g., serial bus control)

## References
- "bank_selection_registers_and_rw" — expands on safe read-modify-write for $DD00
- "d018_vmcsb_overview" — expands on $D018 setup for screen and charset

## Labels
- D018
- DD00
