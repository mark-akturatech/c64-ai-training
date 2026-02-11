# 6510 internal memory map and Zero Page I/O ($0000-$0001)

**Summary:** 6510 internal memory map showing Zero Page ($0000-$00FF), Stack Page ($0100-$01FF) and addressable external memory ($0200-$FFFF); highlights the 6510 Data Direction Register ($0000) and Output Register ($0001) placement in page zero and the benefits for Zero Page and Zero Page Indirect addressing.

## Memory Map and Layout
- $0200-$FFFF — Addressable external memory (main RAM/ROM/IO mapped externally).
- $0100-$01FF — Stack (page 1). The stack pointer is initialized to $01FF.
- $0000-$00FF — Page zero (Zero Page). Fast addressing area used by 6502/6510 zero-page instructions and indirect addressing.
- $0000 — Data Direction Register (DDR) of the 6510 internal I/O port; configures port pins as inputs or outputs.
- $0001 — Output Register of the 6510 internal I/O port; writing here drives the port outputs (reads reflect port state depending on DDR).
- Placing the Output Register at page zero enables use of powerful Zero Page and Zero Page Indirect addressing modes to access and modify the I/O register quickly; setting DDR bits to inputs permits external devices to change the contents of $0001, enabling indirect and peripheral-driven programming techniques.

## Application Notes
- Locating the Output Register at page zero leverages zero-page addressing speed and the Zero Page Indirect instructions of the 6510.
- By configuring the Data Direction Register ($0000) so selected I/O pins are inputs, peripheral devices can change the contents of $0001 (Output Register). Combined with Zero Page Indirect addressing, this allows programming techniques where peripheral inputs can alter vector or pointer values stored in zero page — enabling behaviors not possible with I/O outside zero page.

## Source Code
```text
Cleaned original ASCII memory map and application notes:

       +-------------------+
FFFF |                   |
     |    ADDRESSABLE    |
     /      EXTERNAL     /
     /       MEMORY      /
     |                   |
0200 |                   |
     +-------------------+           STACK
01FF |  |    STACK    |  | 01FF <- POINTER
0100 | \|/   Page 1  \|/ |           INITIALIZED
     +-------------------+
00FF |                   |
     |       Page 0      |
     +-------------------+
     |  OUTPUT REGISTER  | 0001 <-+- Used For
     +-------------------+        |  Internal
0000 |DATA DIRECTION REG.| 0000 <-+  I/O Port
     +-------------------+

APPLICATIONS NOTES

Locating the Output Register at the internal I/O Port in Page Zero
enhances the powerful Zero Page Addressing instructions of the 6510.
By assigning the I/O Pins as inputs (using the Data Direction Register)
the user has the ability to change the contents of address 0001 (the
Output Register) using peripheral devices. The ability to change these
contents using peripheral inputs, together with Zero Page Indirect
Addressing instructions, allows novel and versatile programming tech-
niques not possible earlier.

COMMODORE SEMICONDUCTOR GROUP reserves the right to make changes to
any products herein to improve reliability, function or design.
COMMODORE SEMICONDUCTOR GROUP does not assume any liability arising
out of the application or use of any product or circuit described
herein; neither does it convey any license under its patent rights nor
the rights of others.
```

## Key Registers
- $0000-$0001 - 6510 - Data Direction Register ($0000) and Output Register ($0001) — internal I/O port in page zero
- $0000-$00FF - Zero Page - fast zero-page addressing and zero-page indirect vectors
- $0100-$01FF - Stack (Page 1) - stack area; stack pointer initialized to $01FF
- $0200-$FFFF - Addressable external memory (external RAM/ROM/IO mapped)

## References
- "6526_cia_overview_and_pin_configuration" — expands on 6526 CIA Appendix M, for CIA chip details and pinouts

## Labels
- DATA_DIRECTION_REGISTER
- OUTPUT_REGISTER
