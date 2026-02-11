# D6510 Data Direction Register (zero page $00)

**Summary:** 6510 on-chip I/O Data Direction Register at zero page $00 (D6510). Controls direction (input=0, output=1) of the corresponding bits of the internal I/O port at $01; power-up default = $EF (239), bit 4 defaults to input (cassette switch).

## Description
This byte at zero page address $00 is the 6510 Data Direction Register (D6510). Each bit selects the data direction for the corresponding bit of the internal I/O port located at the next address ($01): a bit value of 0 = input (peripherals may drive the line), 1 = output (CPU drives the line). Although readable/writable like RAM, this location is hardware-connected and writes/reads affect attached devices.

Only bits 0–5 are significant on the C64; bits 6 and 7 are unused (but retain a power-up state). On power-up the register contains $EF (239, binary 1110 1111), which configures all bits except bit 4 as outputs; bit 4 is input by default because it senses the cassette motor/switch.

Behavior summary:
- Input = 0: the corresponding port bit becomes an input (peripherals can drive it).
- Output = 1: the corresponding port bit becomes an output (CPU drives it).
- Bit 4 = cassette switch sense line (default input).
- Bits 6–7: not used on the C64 (ignored for port-direction purposes).

## Source Code
```text
Address: $0000  -- 6510 On-Chip I/O Data Direction Register (D6510)
Power-up default: $EF  (239 decimal)  Binary: %11101111

Bit layout (7..0):
Bit 7: Not used.
Bit 6: Not used.
Bit 5: Direction of Bit 5 I/O on internal port at $01. Default = 1 (output)
Bit 4: Direction of Bit 4 I/O on internal port at $01. Default = 0 (input)  ; cassette switch sense
Bit 3: Direction of Bit 3 I/O on internal port at $01. Default = 1 (output)
Bit 2: Direction of Bit 2 I/O on internal port at $01. Default = 1 (output)
Bit 1: Direction of Bit 1 I/O on internal port at $01. Default = 1 (output)
Bit 0: Direction of Bit 0 I/O on internal port at $01. Default = 1 (output)

Example (assembly reference):
; Set D6510 to power-up default
LDA #$EF
STA $00
; Read current direction mask
LDA $00
```

## Key Registers
- $0000 - 6510 - 6510 On-Chip I/O Data Direction Register (D6510); controls direction of bits for internal I/O port at $0001. Power-up $EF.

## References
- "zero_page_intro_and_basic_working_storage" — context on zero page special locations (0 and 1)
- "r6510_internal_io_port_overview" — how D6510 bits affect R6510 port bits at $01

## Labels
- D6510
