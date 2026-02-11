# Programmable Characters (VIC-II Character RAM via $D018)

**Summary:** The VIC-II's register at $D018 allows selection of the memory locations for screen and character data. By configuring this register, you can point the VIC-II to a custom character set stored in RAM, enabling the creation of programmable characters. When using a RAM-based character set, the original ROM characters are inaccessible unless copied into RAM. This setup consumes 2 KB of system RAM, reducing the memory available for BASIC programs.

**What This Does**

The VIC-II's $D018 register determines the locations of screen memory and character memory within the current 16 KB VIC-II bank. By modifying $D018, you can direct the VIC-II to use a character set stored in RAM, allowing for custom character definitions.

Key considerations:

- **Character Set Location:** The character set occupies 2 KB (256 characters × 8 bytes each). The VIC-II can access character sets at specific 2 KB boundaries within its current 16 KB bank. The character set's starting address is determined by bits 1–3 of $D018, multiplied by 2048 (2 KB). Valid starting addresses are:
  - $0000
  - $0800
  - $1000
  - $1800
  - $2000
  - $2800
  - $3000
  - $3800

- **Screen Memory Location:** Screen memory occupies 1 KB and is used to store character codes displayed on the screen. Its starting address is determined by bits 4–7 of $D018, multiplied by 1024 (1 KB). Valid starting addresses are:
  - $0000
  - $0400
  - $0800
  - $0C00
  - $1000
  - $1400
  - $1800
  - $1C00
  - $2000
  - $2400
  - $2800
  - $2C00
  - $3000
  - $3400
  - $3800
  - $3C00

**Important Notes:**

- **Avoid Overlapping Memory Areas:** Ensure that the chosen addresses for screen memory and character memory do not overlap. For example, if screen memory starts at $0400 (default), avoid placing the character set at $0000 or $0800, as these areas would overlap.

- **Protecting Character RAM from BASIC:** To prevent BASIC programs from overwriting the character set in RAM, adjust the start of BASIC memory to a higher address. This can be done by modifying the "start of BASIC" pointer at locations 43 and 44 ($2B and $2C). For example, to move the start of BASIC to $2000:


  This sets the start of BASIC to $2000 (32 × 256). After executing this, use the `NEW` command to reset BASIC, ensuring it starts at the new address.

## Source Code

  ```basic
  POKE 44, 32
  NEW
  ```


To copy the ROM character set into RAM and point the VIC-II to use it, follow these steps:

1. **Disable Interrupts:** Prevent interrupts during the copy operation.

2. **Enable Character ROM Access:** Make the character ROM visible to the CPU.

3. **Copy Character Data:** Transfer the character data from ROM to the desired RAM location.

4. **Restore I/O Configuration:** Re-enable I/O access.

5. **Re-enable Interrupts:** Allow interrupts to occur again.

6. **Update $D018:** Point the VIC-II to the new character set location in RAM.

Here's an example in assembly language:

```assembly
sei                     ; Disable interrupts
lda $01
and #%11111011          ; Clear bit 2 to enable character ROM
sta $01

ldx #$08                ; Number of 256-byte pages to copy (2048 bytes / 256)
ldy #$00                ; Offset within page
copy_loop:
    lda $D000, y        ; Load byte from character ROM
    sta $3000, y        ; Store byte into RAM at $3000
    iny
    bne copy_loop       ; Loop until end of page
    inc $D0             ; Increment high byte of source address
    inc $30             ; Increment high byte of destination address
    dex
    bne copy_loop       ; Repeat for all pages

lda $01
ora #%00000100          ; Set bit 2 to disable character ROM
sta $01
cli                     ; Re-enable interrupts

lda $D018
and #%11110000          ; Clear character set bits
ora #%00001100          ; Set bits to point to $3000
sta $D018
```

In this example:

- The character set is copied from $D000 (ROM) to $3000 (RAM).

- $D018 is updated to point the VIC-II to the new character set at $3000.

**Note:** Ensure that the chosen RAM location ($3000 in this case) does not overlap with other critical memory areas.

## Key Registers

- **$D018 (53272):** VIC-II Memory Control Register

  - **Bits 1–3:** Character memory location (values 0–7, multiplied by 2048).

  - **Bits 4–7:** Screen memory location (values 0–15, multiplied by 1024).

- **$01:** Processor Port

  - **Bit 2:** Character ROM enable/disable.

- **$2B (43) and $2C (44):** Start of BASIC program pointer.

## References

- "Character Set - C64-Wiki"

- "53272 - C64-Wiki"

- "Commodore 64 Programmer's Reference Guide"

- "Commodore 64 Memory Map"