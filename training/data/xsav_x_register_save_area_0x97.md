# XSAV ($97) — temporary .X register save area

**Summary:** $0097 (XSAV) is a one-byte Kernal zero-page location (decimal 151) used as a temporary .X register save area by ASCII character I/O routines (get/put). Searchable terms: $97, zero page, XSAV, .X register, Kernal, ASCII.

## Description
XSAV is a single-byte zero-page variable in the Kernal area labelled XSAV at address $0097 (decimal 151). It serves as a temporary storage location for the processor X register (.X) used internally by the Kernal routines that get and put ASCII characters. The entry exists to allow those routines to preserve and restore .X across inner operations that need to modify it.

## Key Registers
- $0097 - Zero Page (Kernal) - XSAV: temporary .X register save area used by ASCII character I/O routines

## References
- "kernal_zero_page_overview_0x90_0xff" — overview of temporary save areas in the Kernal zero page
- "bsour_serial_buffered_character_0x95" — character I/O routines that may use the .X save area

## Labels
- XSAV
