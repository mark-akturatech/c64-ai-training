# C3PO ($0094) - Serial Output Buffered Flag

**Summary:** Zero-page flag at $0094 (decimal 148), labeled C3PO, used by the KERNAL serial output routines to indicate a character has been placed in the serial output buffer and is awaiting transmission (serial output buffered).

## Description
This zero-page location (C3PO, $0094) is set by the serial output routines when a character is placed in the serial output buffer. Its purpose is purely a status/flag: it signals that the output buffer is occupied and that transmission is pending. The flag is consulted by serial-transmit code to avoid overwriting the buffered character.

Do not assume bit-level semantics beyond "flag set when buffered" — the source only documents that the location indicates an occupied output buffer, not the exact value used.

## Source Code
(omitted — no assembly/BASIC listings or register maps present in this chunk)

## Key Registers
- $0094 - Zero Page - Serial output buffered flag (C3PO): set when a character has been placed in the serial output buffer and is waiting to be sent

## References
- "bsour_serial_buffered_character_0x95" — holds the actual buffered character for serial output
- "st_status_io_status_word_0x90" — serial device status bits and timeouts