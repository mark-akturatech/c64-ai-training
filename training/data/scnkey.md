# SCNKEY ($FF9F)

**Summary:** SCNKEY ($FF9F) is a C64 KERNAL keyboard-scan routine (real ROM address $EA87) that scans the keyboard matrix, stores the raw scan code at $00CB, saves shift/modifier status at $028D, and converts the key into a PETSCII code written to the input buffer. Uses CPU registers A, X, and Y.

**Description**

SCNKEY performs a low-level keyboard matrix scan and produces a PETSCII character suitable for the KERNAL input buffer. Behavior summarized from source notes:

- **Keyboard Matrix Scan:** SCNKEY scans the keyboard matrix and writes the raw key code (matrix result) to $00CB (zero page).

- **Modifier Status Storage:** The current shift/modifier status (Shift, Control, Commodore keys) is stored at $028D.

- **PETSCII Conversion:** The detected key is converted into a PETSCII code and written to the keyboard input buffer, which starts at memory address $0277. ([files.commodore.software](https://files.commodore.software/reference-material/books/c64-books/c64-programming-books/basic-programming/advanced-commodore-64-basic-revealed.pdf?utm_source=openai))

- **Calling Convention:** The routine uses the A, X, and Y registers; the caller should preserve them if needed.

- **Vector:** Callable via the KERNAL vector at $FF9F; the actual implementation resides at ROM address $EA87.

**Additional Details:**

- **Input Buffer Address:** The PETSCII code is written to the keyboard input buffer starting at $0277. ([files.commodore.software](https://files.commodore.software/reference-material/books/c64-books/c64-programming-books/basic-programming/advanced-commodore-64-basic-revealed.pdf?utm_source=openai))

- **Calling/Return Semantics:** SCNKEY does not return a status in any register or flag. It updates memory locations as described but does not provide direct feedback to the caller.

- **Raw Code Format at $00CB:** The raw key code stored at $00CB is a value between 0 and 63 ($00 to $3F), representing the pressed key's position in the keyboard matrix. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Keyboard_code?utm_source=openai))

- **Modifier Bits at $028D:** The bitfield layout of $028D is as follows:

  - **Bit 0:** 1 = One or more of left Shift, right Shift, or Shift Lock was pressed or locked at the time of the previous check.

  - **Bit 1:** 1 = Commodore key was pressed at the time of the previous check.

  - **Bit 2:** 1 = Control key was pressed at the time of the previous check. ([dusted.dk](https://www.dusted.dk/pages/c64/C64-programming/files/Commodore%2064%20memory%20map%20named.html?utm_source=openai))

## Key Registers

- **$FF9F:** KERNAL - SCNKEY vector (JMP entry to ROM)

- **$EA87:** ROM - SCNKEY implementation (real address)

- **$00CB:** RAM - raw keyboard scan code (matrix result)

- **$028D:** RAM - shift/modifier status (Shift, Control, Commodore keys)

- **$0277:** RAM - start of keyboard input buffer

## References

- "GETIN ($FFE4)" — expands on reading input bytes from the default input and may show how SCNKEY's output is consumed.

## Labels
- SCNKEY
