# Keyboard-scan (commented overview)

**Summary:** Overview of the Commodore 64 ROM keyboard-scan routine called from the IRQ handler (JSR $EA87). Describes high-level steps: key-press presence test, I/O port initialization and decode table pointers, and per-row scan by driving one Port B line low and testing Port A (shift + carry check).

**Keyboard-scan overview**

This comment documents the keyboard-scanner entry immediately after the IRQ handler. It describes the sequence of operations performed by the scanner:

1) **Check if any key is pressed; if no key is pressed, exit the routine.**  
   - The keyboard matrix is connected to the CIA #1 (Complex Interface Adapter) at addresses $DC00 and $DC01. ([scribd.com](https://www.scribd.com/document/40434/COMMODORE-64-PROGRAMMER-S-REFERENCE-GUIDE?utm_source=openai))

2) **Initialize the I/O ports of the CIA #1 for keyboard scanning, set pointers to decode table 1, and clear the character counter.**  
   - Port A ($DC00) is configured to output, and Port B ($DC01) is configured to input. ([c64os.com](https://c64os.com/post/howthekeyboardworks?utm_source=openai))

3) **Drive one line of Port A low and test for a closed key on Port B by shifting the byte read from the port and checking the CPU carry flag; if the carry is clear, then a key is closed and should be processed.**  
   - For each column, set the corresponding bit in Port A to 0 (low) while keeping other bits high.
   - Read Port B to check which rows have been pulled low, indicating a key press.
   - Shift the byte read from Port B and check the carry flag to determine the specific key pressed.

Note: This routine is invoked from the IRQ handler (see JSR $EA87 in related ROM code).

## Key Registers

- **CIA #1 Data Port A ($DC00):** Used to select keyboard columns.
- **CIA #1 Data Port B ($DC01):** Used to read keyboard rows.
- **CIA #1 Data Direction Register A ($DC02):** Set to $FF to configure Port A as output.
- **CIA #1 Data Direction Register B ($DC03):** Set to $00 to configure Port B as input.

## References

- ([scribd.com](https://www.scribd.com/document/40434/COMMODORE-64-PROGRAMMER-S-REFERENCE-GUIDE?utm_source=openai))
- ([c64os.com](https://c64os.com/post/howthekeyboardworks?utm_source=openai))
- ([cx16.dk](https://cx16.dk/mapping_c64.html?utm_source=openai))

## Labels
- CIAPRA
- CIAPRB
- CIADDRA
- CIADDRB
