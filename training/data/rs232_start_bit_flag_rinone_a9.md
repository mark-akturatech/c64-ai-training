# RINONE ($00A9) — RS-232 Start-Bit Flag

**Summary:** RINONE at $00A9 is an RS-232 input flag (label RINONE) used to check for a serial start bit; a value of 144 ($90) means no start bit was received, while 0 ($00) means a start bit was received.

## Description
RINONE is a single-byte flag used by the RS-232 input routines to indicate whether a start bit has been detected. The routine that polls or samples the serial line looks at this flag: $90 (decimal 144) encodes "no start bit received", and $00 encodes "start bit received". See related input-bit counting and byte-buffer routines for how detection transitions to bit counting and byte assembly.

## Key Registers
- $00A9 - Internal - RS-232 start-bit flag (RINONE): $90 (144) = no start bit; $00 = start bit detected

## References
- "rs232_input_bit_count_BITCI_A8" — expands on counting bits after start-bit detection
- "rs232_input_byte_buffer_RIDATA_AA" — expands on building an input byte after start-bit detection

## Labels
- RINONE
