# 6502 Instruction Set and Pinouts (NMOS 6502, WDC 65C02S, SALLY 6502C)

**Summary:** NMOS 6502 signal list and opcode decoding grid including documented and "illegal" opcodes (JAM, NOP variants, SLO, ANC, etc.), plus detailed WDC 65C02S (40‑pin PDIP) pinout and SALLY 6502C (Atari) differences (HALT pin, R/W pin relocation). Searchable terms: SYNC, S.O., RDY, VBP, illegal opcodes, JAM, opcode map.

**Pinouts and Signal Differences**

- **NMOS 6502 Signals:**
  - **Power:** VCC (pin 8), VSS (pin 21)
  - **Clocks:** Φ0 (pin 37), Φ1 (pin 3), Φ2 (pin 39)
  - **Address Bus:** A0–A15 (pins 9–20, 25–32)
  - **Data Bus:** D0–D7 (pins 33–26)
  - **Control Signals:**
    - R/W (pin 34)
    - RDY (pin 2)
    - S.O. (Set Overflow, pin 38)
    - SYNC (pin 7)
    - IRQ (pin 4)
    - NMI (pin 6)
    - RES (pin 40)
    - N.C. (pins 1, 5, 35, 36)

- **WDC W65C02S (40‑pin PDIP) Pinout:**
  - **Power:** VDD (pin 8), VSS (pin 21)
  - **Clocks:**
    - Φ1O (pin 3)
    - Φ2 (pin 37)
    - Φ2O (pin 39)
  - **Address Bus:** A0–A15 (pins 9–20, 25–32)
  - **Data Bus:** D0–D7 (pins 33–26)
  - **Control Signals:**
    - R/W (pin 34)
    - RDY (pin 2, bidirectional)
    - S.O. (Set Overflow, pin 38, active low)
    - SYNC (pin 7)
    - IRQB (pin 4)
    - NMIB (pin 6)
    - RESB (pin 40)
    - BE (Bus Enable, pin 36)
    - VPB (Vector Pull, pin 1)
    - MLB (Memory Lock, pin 5)
    - N.C. (pin 35)

  **Pinout Diagram:**


  *Source: W65C02S Datasheet, Figure 3-1*

- **SALLY 6502C (Atari Variant):**
  - **Differences from Standard 6502:**
    - **HALT Pin:** Pin 35 is used for the HALT signal, allowing the ANTIC chip to pause the CPU for direct memory access (DMA). This pin must be pulled high for normal operation.
    - **R/W Pin Relocation:** The R/W signal is moved from pin 34 to pin 36.
    - **SYNC Pin Absence:** The SYNC signal is not present in the SALLY 6502C.

  **Pinout Differences:**


  *Source: Atari 8-Bit Computers FAQ*

**Opcode Decoding and "Illegal" Opcodes**

- **Opcode Structure:**
  - The opcode tables follow a three-index decoding scheme:
    - **Columns (b):** Represent the low bits of the opcode.
    - **Rows (c and a):** Represent the higher nibble structure, correlating to addressing modes and instruction types.

- **Documented Opcodes:**
  - Standard instructions like AND, EOR, ADC, STA, LDA, CMP, SBC, INC, DEC, ASL, LSR, ROL, ROR, branch operations, flag operations, loads/stores, transfers, stack operations, JSR, RTS, RTI, and JMP occupy regular positions in the grid.

- **"Illegal" Opcodes:**
  - These occupy predictable cells in the opcode grid and often combine effects:
    - **JAM (Lockup):** Opcodes such as $02, $12, $22, etc.
    - **NOP Variants:** Including immediate, zero-page, absolute, and implied addressing modes.
    - **Combined Operations:** Examples include SLO, ANC, SHX, SHY, and their variants.

  *Note: The exact behavior of "illegal" opcodes can vary between different 6502 variants.*

## Source Code

  ```text
  W65C02S 40-Pin PDIP Pinout:

          +---\/---+
      VPB | 1    40| RESB
      RDY | 2    39| PHI2O
    PHI1O | 3    38| SOB
     IRQB | 4    37| PHI2
      MLB | 5    36| BE
     NMIB | 6    35| NC
     SYNC | 7    34| RWB
      VDD | 8    33| D0
       A0 | 9    32| D1
       A1 |10    31| D2
       A2 |11    30| D3
       A3 |12    29| D4
       A4 |13    28| D5
       A5 |14    27| D6
       A6 |15    26| D7
       A7 |16    25| A15
       A8 |17    24| A14
       A9 |18    23| A13
      A10 |19    22| A12
      A11 |20    21| VSS
          +--------+
  ```

  ```text
  SALLY 6502C Pinout Differences:

  Pin | Standard 6502 | SALLY 6502C
  ----|---------------|------------
  34  | R/W           | N.C.
  35  | N.C.          | HALT
  36  | N.C.          | R/W
  ```

