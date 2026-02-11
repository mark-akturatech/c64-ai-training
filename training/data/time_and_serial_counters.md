# Zero Page $00A0-$00B1 — TI variables, datasette and RS232 buffers/pointers

**Summary:** Zero page addresses $00A0-$00B1 map TI time counters (1/60s), datasette/EOI counters and buffers, RS232 bit/byte buffers and counters, and save/load start & load address pointers. Searchable terms: $00A0-$00B1, zero page, TI variable, datasette, RS232, save/load pointer.

## Layout and purpose
These zero-page locations (within the C64 zero page $0000–$00FF) are used by the kernal and device handling code to track timing, serial/datasette input, RS232 reception state, and save/load addresses. Fields are mostly single-byte counters/buffers; the save and load addresses are stored as two-byte little-endian pointers across consecutive zero-page locations.

- $00A0–$00A2: TI variable/time counter (incremented every 1/60 second).
- $00A3–$00A6: Datasette / EOI-related counters and buffers (EOI delay or bit counter, byte buffer, bit counter, buffer offset).
- $00A7–$00AA: RS232 input bit buffer and counters (bit buffer, bit count, stop-bit indicator, byte buffer).
- $00AB: RS232 parity or datasette checksum byte.
- $00AC–$00AD: SAVE start pointer (two-byte start address or pointer used by save/load).
- $00AE–$00AF: Load address (two-byte address read from file or end pointer).
- $00B0–$00B1: Unused (spare bytes).

These bytes are typically used by low-level I/O routines; they are transient state and modified by interrupt-driven timing and serial/datasette handlers.

## Source Code
```text
$00A0-$00A2  TI Variable        Time counter incremented every 1/60 second
$00A3   EOI Switch              EOI delay or datasette bit counter
$00A4   Byte Buffer             Serial bus or datasette input buffer
$00A5   Bit Counter             Serial bus/datasette bit counter
$00A6   Buffer Offset           Current byte offset in datasette buffer
$00A7   RS232 Bit Buffer        Bit buffer during RS232 input
$00A8   RS232 Bit Cnt           Bit counter during RS232 input
$00A9   Stop Bit Switch         RS232 stop bit indicator
$00AA   RS232 Byte Buf          Byte buffer during RS232 input
$00AB   RS232 Parity            RS232 parity or datasette checksum
$00AC-$00AD  SAVE Start         Start address or pointer for save/load
$00AE-$00AF  Load Address       Address read from file or end pointer
$00B0-$00B1  Unused
```

## Key Registers
- $00A0-$00A2 - Zero Page - TI time counter (increments every 1/60s)
- $00A3-$00A6 - Zero Page - EOI/datasette: EOI delay/bit counter, byte buffer, bit counter, buffer offset
- $00A7-$00AA - Zero Page - RS232 input: bit buffer, bit counter, stop-bit indicator, byte buffer
- $00AB - Zero Page - RS232 parity / datasette checksum
- $00AC-$00AF - Zero Page - SAVE start pointer (2 bytes) and Load address pointer (2 bytes)
- $00B0-$00B1 - Zero Page - Unused / spare bytes

## References
- "datasette_and_serial_buffers" — expands on datasette/RS232 buffer pointers and counters