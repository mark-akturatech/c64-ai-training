# BITCI ($A8) — RS-232 Input Bit Count / Cassette Temporary Storage

**Summary:** Zero-page location $00A8 (label BITCI) holds the RS-232 input bit count used by serial receive routines and is also repurposed as a temporary storage / error flag during cassette (tape) loads.

## Description
Label: BITCI  
Original listing line: 168  $A8  BITCI

BITCI ($00A8) is a zero-page byte used to count how many bits of serial data have been received so the RS-232 serial routines know when a full word has arrived. The same location is reused during cassette (tape) operations as a temporary storage location and as an error flag during tape loads.

Behavioral notes included in the source:
- Tracks the number of bits received for serial input (RS-232).
- Used by serial routines to determine when a full word has been assembled.
- Reused during tape load routines to indicate an error condition (cassette temporary storage / error flag).

## Key Registers
- $00A8 - Zero Page RAM - RS-232 input bit count / cassette temporary storage (BITCI)

## References
- "rs232_start_bit_flag_RINONE_A9" — expands on start-bit checking flag used along with bit counts  
- "rs232_input_byte_buffer_RIDATA_AA" — expands on assembly of counted bits into bytes

## Labels
- BITCI
