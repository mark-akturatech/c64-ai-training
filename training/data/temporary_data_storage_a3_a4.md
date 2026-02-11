# $A3-$A4 — Temporary Data Storage Area

**Summary:** $A3-$A4 are zero-page locations used as temporary data storage by the cassette (tape) and serial I/O routines on the C64; they serve as a small general-purpose working area for those routines.

## Description
These zero-page locations ($A3 and $A4) are used temporarily by the tape and serial I/O routines. They form part of the general-purpose working area and are used for transient housekeeping data by those routines.

See related temporary buffers and housekeeping locations in the referenced chunks.

## Key Registers
- $A3-$A4 - Zero Page - Temporary data storage area used by cassette/tape and serial I/O routines

## References
- "cassette_sync_countdown_CNTDN" — expands on nearby temporary tape/serial housekeeping locations  
- "rs232_input_byte_buffer_RIDATA_AA" — expands on related serial/tape temporary buffers

## Labels
- A3
- A4
