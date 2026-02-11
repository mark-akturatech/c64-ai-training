# Zero Page $0000-$0006 (Processor Port & Conversion Vectors)

**Summary:** Zero page addresses $0000-$0006 include the 6510 Processor Port Data Direction Register (DDR) at $0000 and the Processor Port at $0001, which are used for memory bank switching and datasette control. Additionally, addresses $0002-$0006 are reserved zero-page locations holding default execution addresses for floating-point and integer conversion routines.

**Zero-page roles and behavior**

- **$0000 — Processor Port DDR:** Data Direction Register for the 6510 processor port. Bits set to 1 configure the corresponding processor-port pins as outputs; bits set to 0 configure them as inputs (1=output, 0=input). On power-up, this register is set to $2F (%00101111), indicating that all bits except for Bit 4 (which senses the cassette switch) are set up for output. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_320.html?utm_source=openai))

- **$0001 — Processor Port:** Controls memory-area configuration (bank switching that affects ROM/RAM/I/O visibility) and contains bits used for datasette control. Writing to $0001 changes which ROMs and I/O regions are visible in the CPU address space. The bit assignments are as follows:

  - **Bit 0 (LORAM):** Selects ROM or RAM at $A000-$BFFF. 1 = BASIC ROM visible; 0 = RAM visible.
  - **Bit 1 (HIRAM):** Selects ROM or RAM at $E000-$FFFF. 1 = Kernal ROM visible; 0 = RAM visible.
  - **Bit 2 (CHAREN):** Selects character ROM or I/O devices at $D000-$DFFF. 1 = I/O devices visible; 0 = Character ROM visible.
  - **Bit 3:** Cassette Data Output line.
  - **Bit 4:** Cassette Switch Sense. Reads 0 if a button is pressed, 1 if not.
  - **Bit 5:** Cassette Motor Control. A 1 turns the motor off, 0 turns it on.
  - **Bits 6-7:** Not connected; no function presently defined. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_320.html?utm_source=openai))

- **$0002-$0004 — Reserved / default execution addresses for floating-point conversion routines:** These zero-page locations hold the default addresses used by floating-point conversion routines, typically set up by the system ROM.

- **$0005-$0006 — Reserved / default execution addresses for integer conversion routines:** These zero-page locations hold the default addresses used by integer conversion routines, typically set up by the system ROM.

## Key Registers

- **$0000 - Zero Page - Processor Port DDR:** Data direction for processor port bits; 1=output, 0=input.
- **$0001 - Zero Page - Processor Port:** Memory-area/bank switching and datasette control.
- **$0002-$0004 - Zero Page - Default execution addresses for floating-point conversion routines.**
- **$0005-$0006 - Zero Page - Default execution addresses for integer conversion routines.**

## References

- "bank_switching_notes" — expands on visibility controlled by processor port $0001.
- "basic_rom_visibility" — expands on effect of $0001 on ROM visibility.
