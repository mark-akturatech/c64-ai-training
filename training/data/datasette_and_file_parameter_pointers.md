# Zero Page $00B2-$00BC — Datasette, RS232, Filename Pointers

**Summary:** Zero-page layout for $00B2-$00BC: pointer to the datasette buffer (default $033C), RS232 output control and buffers ($00B4-$00B6), and BASIC file parameter bytes including filename length and filename pointer ($00B7-$00BC).

## Zero Page Layout
This chunk documents the zero-page bytes used by the KERNAL/BASIC file and RS232/datasette I/O vectors:

- $00B2-$00B3 — Datasette Buffer Pointer: two-byte pointer (little-endian: low byte at $00B2, high byte at $00B3) to the datasette buffer; default value $033C.
- $00B4 — RS232 Bit Control: bit counter and stop-bit state used during RS232 byte transmission.
- $00B5 — RS232 Bit Buffer: temporary bit buffer holding the current output bit stream during RS232 transmission.
- $00B6 — RS232 Byte Buffer: byte buffer holding the outgoing byte while it is serialized to RS232.
- $00B7 — Filename Length: parameter length for file operations (number of characters in filename/command).
- $00B8 — Logical Number: current file logical number used by file operations.
- $00B9 — Secondary Address: secondary address (secondary device/channel) of the current file.
- $00BA — Device Number: device number for the current file operation.
- $00BB-$00BC — Filename Pointer: two-byte pointer (low byte at $00BB, high byte at $00BC) to the filename or disk command buffer.

These bytes are part of the zero page state used by BASIC/KERNAL I/O routines (file open/close, RS232 output, datasette operations).

## Source Code
```text
$00B2-$00B3  Datasette Buf      Pointer to datasette buffer (default: $033C)
$00B4   RS232 Bit Ctrl          Bit counter and stop bit for RS232 output
$00B5   RS232 Bit Buf           Bit buffer during RS232 output
$00B6   RS232 Byte Buf          Byte buffer during RS232 output
$00B7   Filename Length          Parameter length for file operations
$00B8   Logical Number          Current file logical number
$00B9   Secondary Addr          Secondary address of current file
$00BA   Device Number           Device number of current file
$00BB-$00BC  Filename Ptr       Pointer to filename or disk command
```

## Key Registers
- $00B2-$00BC - Zero Page - Datasette buffer pointer, RS232 bit/byte buffers, filename length, logical/secondary/device numbers, and filename pointer

## References
- "file_open_close_vectors" — expands on BASIC file handling vectors in $031A-$0323