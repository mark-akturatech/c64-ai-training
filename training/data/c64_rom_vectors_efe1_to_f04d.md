# KERNAL ROM: RS-232 / Serial & I/O Routines ($EF06–$F04D)

**Summary:** KERNAL ROM entry points and brief descriptions for RS-232/serial send/receive, parity and framing/error handling, timer/bit-count helpers, serial clock, and bus talk/listen control for addresses in the $EFxx–$F04D range (e.g., $EF06, $EF59, $F017). Useful for locating ROM vectors for serial I/O and related error handling.

**Overview**

This chunk lists KERNAL routine entry addresses and their short purpose descriptions from the $EFxx block through $F04D. It covers:

- RS-232 send/receive and buffering
- Parity, framing, break, and overflow error handling
- Timer enable/disable and bit-count computation helpers
- Setup/submit/open/close operations for serial devices
- Hooks that reference later file and tape handling routines (outside $F04D)

Each routine is listed by its vector address and its short label/purpose as found in the ROM map.

**Routines**

- $EF06 - Send new RS-232 byte
- $EF2E - No-DSR error
- $EF31 - No-CTS error
- $EF3B - Disable timer
- $EF4A - Compute bit count
- $EF59 - RS-232 receive
- $EF7E - Set up to receive
- $EFC5 - Receive parity error
- $EFCA - Receive overflow
- $EFCD - Receive break
- $EFD0 - Framing error
- $EFE1 - Submit to RS-232
- $F00D - No-DSR error (another entry)
- $F017 - Send to RS-232 buffer
- $F04D - Input from RS-232

**Notes:**

- These entries include low-level error handlers (parity, framing, overflow, break) and control helpers (timer disable, bit-count) used by the KERNAL serial driver.
- Several entries later in the ROM (beyond $F04D) are referenced by the listing but are outside this chunk's range.

## Source Code

The following is an ASCII representation of the RS-232 routine flow within the KERNAL ROM, illustrating the interaction between various components:

```text
+------------------+       +------------------+       +------------------+
| RS-232 Send Byte |       | RS-232 Receive   |       | Error Handlers   |
| Routine ($EF06)  |       | Routine ($EF59)  |       | (e.g., Parity,   |
|                  |       |                  |       | Framing Errors)  |
+------------------+       +------------------+       +------------------+
        |                          |                          |
        v                          v                          v
+------------------+       +------------------+       +------------------+
| Check CTS/DSR    |       | Setup Receiver   |       | Handle Specific  |
| ($EF31/$EF2E)    |       | ($EF7E)          |       | Error ($EFC5,    |
|                  |       |                  |       | $EFD0, etc.)     |
+------------------+       +------------------+       +------------------+
        |                          |                          |
        v                          v                          v
+------------------+       +------------------+       +------------------+
| Transmit Data    |       | Receive Data     |       | Return to Caller |
| ($F017)          |       | ($F04D)          |       |                  |
+------------------+       +------------------+       +------------------+
```

This diagram provides a high-level overview of the control flow between the RS-232 send and receive routines, error handlers, and their associated checks within the KERNAL ROM.

## Key Registers

- $EF06 - KERNAL ROM - Send new RS-232 byte
- $EF2E - KERNAL ROM - No-DSR error
- $EF31 - KERNAL ROM - No-CTS error
- $EF3B - KERNAL ROM - Disable timer
- $EF4A - KERNAL ROM - Compute bit count
- $EF59 - KERNAL ROM - RS-232 receive
- $EF7E - KERNAL ROM - Set up to receive
- $EFC5 - KERNAL ROM - Receive parity error
- $EFCA - KERNAL ROM - Receive overflow
- $EFCD - KERNAL ROM - Receive break
- $EFD0 - KERNAL ROM - Framing error
- $EFE1 - KERNAL ROM - Submit to RS-232
- $F00D - KERNAL ROM - No-DSR error
- $F017 - KERNAL ROM - Send to RS-232 buffer
- $F04D - KERNAL ROM - Input from RS-232

## References

- "c64_rom_vectors_f157_to_fffa" — expanded coverage of I/O, tape and file routines, IRQ/NMI vectors, and additional ROM entry points