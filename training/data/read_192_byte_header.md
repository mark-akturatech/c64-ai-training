# Minimal C64 Datasette Program Loader — Read 192-byte Header

**Summary:** Assembly sequence for a C64 Datasette loader that sets a two-byte pointer (`ptr`/`ptr+1`) to a buffer address, calls `get_countdown` to synchronize to the tape file start, and calls `get_block` with A=192 to read the 192-byte header. Uses mnemonics LDX/LDY/STX/STY/JSR/LDA and pointer low/high (`#<buffer` / `#>buffer`).

**Description**
This snippet prepares a little-endian two-byte pointer in zero page (low byte at `ptr`, high byte at `ptr+1`) pointing to `buffer`, synchronizes the tape input using `get_countdown`, then requests a 192-byte read by placing 192 in A and calling `get_block`.

Important details:
- `LDX #<buffer` loads the low (least-significant) byte of `buffer` into X.
- `LDY #>buffer` loads the high byte of `buffer` into Y.
- `STX ptr` and `STY ptr+1` store the low/high bytes into the pointer address (`ptr` = low, `ptr+1` = high), i.e., a little-endian pointer.
- `JSR get_countdown` is used to synchronize to the start of the file.
- `LDA #192` sets the byte count to 192 (the header size).
- `JSR get_block` reads the block of bytes into memory at the pointer previously stored.

Behavioral assumptions:
- `get_block` expects A = number of bytes to read and a two-byte pointer at `ptr`/`ptr+1` pointing to the destination buffer.
- `get_countdown` performs the tape synchronization that must succeed before calling `get_block`.

## Source Code
```asm
    LDX #<buffer
    LDY #>buffer
    STX ptr
    STY ptr + 1
    JSR get_countdown
    LDA #192
    JSR get_block
```

## Key Registers
- `ptr`: Zero-page address used as a pointer to the buffer.
- `buffer`: Memory location where the 192-byte header will be stored.

## References
- "header_format" — expands on what is stored in the 192-byte header
- "get_countdown" — expands on synchronization to the file start before reading the header

## Labels
- PTR
- BUFFER
