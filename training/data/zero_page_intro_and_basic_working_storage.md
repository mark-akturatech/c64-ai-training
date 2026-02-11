# Zero Page ($00-$FF) — 6502 / 6510 significance

**Summary:** Zero page ($00-$FF) is the 6502/6510 region addressable with one-byte operands, producing shorter/faster instructions; the C64/6510 reserves many zero-page locations for system variables, with $00 and $01 acting as the 6510 on-chip I/O registers. Addresses $00-$8F ($0-$143) are used by BASIC for working storage but may be reused by pure machine-language programs that do not interact with BASIC.

**Overview**
- Zero page (addresses $0000–$00FF) is encoded with a single-byte address in 6502 instructions; load/store and many addressing modes use one-byte operands when targeting zero page, yielding smaller code and faster execution than absolute (two-byte) addressing.
- Because of this speed and compactness, operating systems and system software (including the C64 ROMs and KERNAL) heavily use zero page for frequently accessed variables, pointers, and temporary storage.
- On the 6510 (the C64 CPU variant), locations $0000 and $0001 are implemented as an on-chip I/O port:
  - $0000 is the data-direction register (controls which bits of the port are inputs/outputs).
  - $0001 is the port register used to read/write the pins; on the C64 this port is used to control ROM/RAM mapping (which ROMs are visible) and cassette I/O lines.
- The subrange $0000–$008F ($0–$143 decimal) is designated as BASIC working storage by the C64 ROMs (BASIC uses it for variables and bookkeeping). A standalone machine-language program that does not call or interact with BASIC may reuse these addresses freely, but doing so while using BASIC routines will conflict with BASIC's data.

**6510 On-Chip I/O Registers**

The 6510 microprocessor includes an integrated 6-bit I/O port mapped to memory addresses $0000 and $0001:

- **$0000 (Data Direction Register):** Determines the direction (input or output) of each bit in the I/O port.
- **$0001 (I/O Port Register):** Used to read from or write data to the I/O port.

### Data Direction Register ($0000)

Each bit in this register corresponds to a bit in the I/O port register ($0001):

- **Bit 0 (P0):** 0 = Input, 1 = Output
- **Bit 1 (P1):** 0 = Input, 1 = Output
- **Bit 2 (P2):** 0 = Input, 1 = Output
- **Bit 3 (P3):** 0 = Input, 1 = Output
- **Bit 4 (P4):** 0 = Input, 1 = Output
- **Bit 5 (P5):** 0 = Input, 1 = Output
- **Bits 6-7:** Not used

### I/O Port Register ($0001)

This register controls various functions based on the data written to it:

- **Bit 0 (P0):** Controls LORAM (Low ROM). 0 = RAM at $A000-$BFFF, 1 = BASIC ROM at $A000-$BFFF.
- **Bit 1 (P1):** Controls HIRAM (High ROM). 0 = RAM at $E000-$FFFF, 1 = KERNAL ROM at $E000-$FFFF.
- **Bit 2 (P2):** Controls CHAREN (Character ROM). 0 = RAM at $D000-$DFFF, 1 = I/O devices at $D000-$DFFF.
- **Bit 3 (P3):** Cassette data output. 0 = Low, 1 = High.
- **Bit 4 (P4):** Cassette switch sense. 0 = Pressed, 1 = Not pressed.
- **Bit 5 (P5):** Cassette motor control. 0 = Motor off, 1 = Motor on.
- **Bits 6-7:** Not used

### Memory Configuration Control

The combination of LORAM, HIRAM, and CHAREN bits allows for different memory configurations:

- **All RAM:** LORAM = 0, HIRAM = 0, CHAREN = 1. Entire 64KB of RAM is accessible.
- **I/O and KERNAL ROM:** LORAM = 0, HIRAM = 1, CHAREN = 1. I/O devices and KERNAL ROM are accessible.
- **I/O Only:** LORAM = 1, HIRAM = 0, CHAREN = 1. I/O devices are accessible.

## Source Code

```text
+-------------------------------+
|  6510 I/O Port Bit Functions  |
+-------------------------------+
| Bit | Function                |
+-----+-------------------------+
|  0  | LORAM (Low ROM)         |
|  1  | HIRAM (High ROM)        |
|  2  | CHAREN (Character ROM)  |
|  3  | Cassette Data Output    |
|  4  | Cassette Switch Sense   |
|  5  | Cassette Motor Control  |
| 6-7 | Not Used                |
+-------------------------------+
```

## Key Registers

- **$0000-$00FF:** Zero Page - single-byte addressing; faster access; used for system variables, pointers, and frequent temporaries.
- **$0000:** 6510 Data Direction Register - controls input/output direction of I/O port bits.
- **$0001:** 6510 I/O Port Register - controls ROM/RAM mapping and cassette I/O on the C64.

## References

- "MOS 6510 datasheet" — Detailed specifications of the 6510 microprocessor.
- "Commodore 64 Programmer's Reference Guide" — Comprehensive guide to C64 programming and hardware.