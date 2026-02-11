# Zero Page $0099-$009F — Input/Output Devices, Datasette & RS232 Flags

**Summary:** Zero page locations $0099-$009F hold current input/output device numbers, datasette parity/byte-ready flags, system error-display control, RS232/datasette output buffer (or error counter), and an auxiliary datasette counter. Terms: zero page, datasette, RS232, $0099-$009F.

## Description
This block of zero page bytes is used by the Kernal and BASIC I/O routines to track active serial/RS232 devices and datasette (tape) transfer state.

- $0099 — Input Device  
  Stores the current input device number used by the system (default $00). This selects which device the Kernal/BASIC reads from.

- $009A — Output Device  
  Stores the current output device number used by the system (default $03). This selects which device the Kernal/BASIC writes to.

- $009B — Parity Bit (Datasette parity indicator)  
  Set/cleared by datasette routines to indicate the parity of the last bit/byte transferred (used by tape read/write routines).

- $009C — Byte Ready (Datasette byte ready flag)  
  Flag set when a byte from the datasette has been received and is ready to be read by higher-level routines.

- $009D — Error Display (System message display control)  
  Controls whether system messages/errors are displayed. Used by the Kernal to enable/disable error message output on screen or message routing.

- $009E — Output Buffer (RS232 / datasette output byte or error counter)  
  Used as the byte buffer for RS232 or datasette output operations; in some Kernal contexts it also serves as an error counter for transfer routines.

- $009F — Aux Counter (Datasette auxiliary counter)  
  Auxiliary counter used by datasette routines (timing/position/counting for tape operations).

Notes:
- Default device values shown are the common system defaults: input $00, output $03.
- These bytes are part of the standard C64 zero page layout used by the Kernal and BASIC I/O; modifying them affects where subsequent OPEN/PRINT/INPUT operations are directed.
- (datasette = tape device)

## Key Registers
- $0099-$009F - Zero Page - Input/output device numbers, datasette parity/byte-ready flags, error display control, RS232/datasette output buffer/error counter, auxiliary datasette counter

## References
- "serial_and_rs232_zero_page" — expands on RS232 buffers and control bytes in zero page

## Labels
- INPUT_DEVICE
- OUTPUT_DEVICE
- PARITY_BIT
- BYTE_READY
- ERROR_DISPLAY
- OUTPUT_BUFFER
- AUX_COUNTER
