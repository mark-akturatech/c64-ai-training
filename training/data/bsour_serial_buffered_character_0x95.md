# ********* - BSOUR ($95): the buffered character waiting to be sent on the serial bus

**Summary:** Zero-page variable $0095 (BSOUR) holds the single-byte buffered character awaiting transmission on the serial bus; a value of $FF (decimal 255) indicates no character is queued. Address: $95 (decimal 149).

## Description
BSOUR (at $0095) contains the character that is waiting to be sent on the serial bus. The stored value is a single byte; applications or ROM routines check this location to determine what character will be transmitted next. A sentinel value of $FF (255) explicitly means "no character is waiting" (buffer empty).

This variable is conceptually paired with a buffer-occupied/flag location (see references) and with serial status/error reporting (see references) for complete serial I/O state.

## Key Registers
- $0095 - Zero Page - BSOUR: Buffered character for serial bus (1 byte). $FF (255) = no character waiting.

## References
- "c3po_serial_output_buffer_flag_0x94" — expands on buffer-occupied flag corresponding to this buffered character  
- "st_status_io_status_word_0x90" — expands on serial status and error reporting