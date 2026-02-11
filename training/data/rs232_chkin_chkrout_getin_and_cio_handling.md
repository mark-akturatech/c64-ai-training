# Kernal RS-232 & Serial-Bus Device Routines (CHKOUT/CHKIN/GETIN, CIOUT, TKSA, ACPTR, NMI send)

**Summary:** Kernal RS-232 and serial-bus routines for defining logical RS-232 files and sending/receiving bytes (entries: CHKOUT $EFE1, CHROUT for RS-232 $F014, CHKIN $F04D, GETIN $F086), plus low-level serial-bus primitives (TKSA, CIOUT, ACPTR, UNTLK, UNLSN) and CIA#2 Data Port A bit control at $DD00 used for clock/data lines. Also includes NMI-driven bit-transmit ($EEBB) and RS-232 error handling (sets status at $0297).

**Overview**

This chunk documents the Kernal routines and low-level primitives used for RS-232 and IEC-style serial-bus I/O on the C64. It covers:

- **High-level logical-file entry points and RS-232-specific CHRIN/CHROUT hooks:**
  - CHKOUT entry for RS-232 logical files: $EFE1 (decimal 61409).
  - CHROUT for RS-232: $F014 (decimal 61460).
  - CHKIN for RS-232: $F04D (decimal 61517).
  - GETIN for RS-232: $F086 (decimal 61574).
  - Routine to stop CIA#2 NMIs for timing-critical serial/cassette ops: $F0A4 (decimal 61604).

- **Serial-bus routines (byte-level, control codes and jump-table entries):**
  - TKSA — send a secondary address after LISTEN: $EDC7 (decimal 60871). Jump-table entry at $FF96 (decimal 65430).
  - CIOUT — send a byte on the serial bus (buffers one char, final byte sent with EOI on UNLISTEN): $EDDD (decimal 60893). Jump-table entry at $FFA8 (decimal 65448).
  - ACPTR — receive a byte from a TALKer (places result in A): $EE13 (decimal 60947). Jump-table entry at $FFA5 (decimal 65445).
  - UNTLK — send UNTALK (0x5F): $EDEF (decimal 60911). Jump-table entry at $FFAB (decimal 65451).
  - UNLSN — send UNLISTEN (0x3F): $EDFE (decimal 60926). Jump-table entry at $FFAE (decimal 65454).
  - The jump-table entry that sends a secondary address after LISTEN lives at $FF93 (decimal 65427).

- **Low-level serial-bit primitives and helpers (operate on CIA #2 Data Port A at $DD00):**
  - Set serial clock low (active): $EE85 (decimal 61061) — clears bit 4 of $DD00.
  - Set serial clock high (inactive): $EE8E (decimal 61070) — sets bit 4 of $DD00.
  - Set serial data output low: $EE97 (decimal 61079) — clears bit 5 of $DD00.
  - Read serial data input and clock input bits: $EEA9 (decimal 61097) — reads bits 7 (data in) and 6 (clock in); returns data bit in Carry and clock bit in Negative flag.
  - 1 ms delay helper (timing): $EEB3 (decimal 61107).
  - NMI-driven transmitter: Send next RS-232 bit (invoked from NMI handler): $EEBB (decimal 61115).
  - Handle RS-232 errors (sets appropriate error bits in status): $EF2E (decimal 61230) — writes error bits into status register at $0297 (decimal 663).
  - Set word length for current RS-232 character (loads bit-count into X from control register): $EF4A (decimal 61258). **[Note: source had a typographic glitch showing "$#F4A"; corrected to $EF4A.]**

- **Status register used by RS-232 handler:**
  - Kernal status register referenced at $0297 (decimal 663) — RS-232 error/condition bits are set here by the RS-232 error handler.

## Source Code

```text
Kernal/primitive routine reference (address, mnemonic, purpose, jump-table entry if given)
-----------------------------------------------------------------------------
$EFE1  (61409)  CHKOUT   - CHKOUT entry used for RS-232 logical files.
$F014  (61460)  CHROUT   - CHROUT for RS-232 (character output).
$F04D  (61517)  CHKIN    - CHKIN for RS-232 (character input check).
$F086  (61574)  GETIN    - GETIN for RS-232 (character input).
$F0A4  (61604)  STOP NMI - Routine to stop CIA#2 NMIs for timing-critical ops.

$EDC7  (60871)  TKSA     - Send secondary address after LISTEN. Jump-table entry: $FF96 (65430).
$EDDD  (60893)  CIOUT    - Send a byte on serial bus (buffers, final bytes with EOI on UNLISTEN). Jump-table entry: $FFA8 (65448).
$EDEF  (60911)  UNTLK    - Send UNTALK (0x5F). Jump-table entry: $FFAB (65451).
$EDFE  (60926)  UNLSN    - Send UNLISTEN (0x3F). Jump-table entry: $FFAE (65454).
$EE13  (60947)  ACPTR    - Receive a byte from TALKer (returns in A). Jump-table entry: $FFA5 (65445).

$EE85  (61061)  CLK LOW  - Clear serial clock output (bit 4 of $DD00).
$EE8E  (61070)  CLK HIGH - Set serial clock output (bit 4 of $DD00).
$EE97  (61079)  DATA LO  - Clear serial data output (bit 5 of $DD00).
$EEA9  (61097)  RD INP   - Read serial data in (bit 7) and clock in (bit 6); returns data in C, clock in N.
$EEB3  (61107)  1ms DEL  - One-millisecond delay helper.
$EEBB  (61115)  NMI TX   - Send next RS-232 bit (called from NMI handler).
$EF2E  (61230)  ERR HNDL - Set RS-232 error bits in status register $0297.
$EF4A  (61258)  SET WLEN - Load word length (# data bits) into X from control register.

Jump-table entry addresses of interest (ROM jump table area):
$FF93 (65427)  - table entry used to send secondary address after LISTEN.
$FF96 (65430)  - TKSA entry.
$FFA5 (65445)  - ACPTR entry.
$FFA8 (65448)  - CIOUT entry.
$FFAB (65451)  - UNTLK entry.
$FFAE (65454)  - UNLSN entry.
```

```text
CIA #2 Data Port A ($DD00) - relevant bits for serial clock/data (as described in source)
Bit 7  - Serial data input (DI) (read)
Bit 6  - Serial clock input (CI) (read)
Bit 5  - Serial data output (DO) (write)
Bit 4  - Serial clock output (CO) (write)
Bits 3-0 - Other port lines / general-purpose I/O (not specified here)
```

```text
Kernal status register reference
$0297 (decimal 663) - Kernal status/error register (RS-232 error/condition bits are set here by the RS-232 error handler $EF2E).
Bit definitions:
Bit 7 (128) - Break detected
Bit 6 (64)  - DTR (Data Terminal Ready) signal missing
Bit 5       - Unused
Bit 4 (16)  - CTS (Clear To Send) signal missing
Bit 3 (8)   - Receiver buffer empty
Bit 2 (4)   - Receiver buffer overrun
Bit 1 (2)   - Framing error
Bit 0 (1)   - Parity error
```

## Key Registers

- $DD00 - CIA #2 - Data Port A (serial clock/data lines: bit 4 = serial clock output, bit 5 = serial data output, bit 6 = serial clock input, bit 7 = serial data input)
- $0297 - Kernal status register - RS-232 error/condition bits (set by RS-232 error handler $EF2E)

## References

- "serial_bus_kernal_routines_talk_listen_cioout" — higher-level serial-bus I/O uses and examples (covers TALK/LISTEN/CIOUT/TKSA usage)

## Labels
- CHKOUT
- CHROUT
- CHKIN
- GETIN
- CIOUT
- TKSA
- ACPTR
- UNTLK
