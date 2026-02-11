# Set filename pointer and length (KERNAL)

**Summary:** Stores filename length and pointer into zero-page KERNAL variables $00B7, $00BB, $00BC using STA/STX/STY and returns (RTS). Terms: $B7, $BB, $BC, STA, STX, STY, RTS, KERNAL, filename pointer.

## Description
This short KERNAL routine writes the file-name parameters used by subsequent I/O calls: the length (byte) and a 16-bit pointer (low/high). It expects the length in A, the pointer low byte in X, and the pointer high byte in Y, then stores them into the KERNAL zero-page variables and returns to the caller.

- Purpose: prepare filename parameters for file open/read/write operations in the C64 KERNAL API.
- Inputs (caller-supplied):
  - A = filename length
  - X = filename pointer low byte
  - Y = filename pointer high byte
- Side effects: writes zero-page variables and returns with RTS.
- Related entry point: wrapper at $FFBD (see References).

## Source Code
```asm
.,FDF9 85 B7    STA $B7         set file name length
.,FDFB 86 BB    STX $BB         set file name pointer low byte
.,FDFD 84 BC    STY $BC         set file name pointer high byte
.,FDFF 60       RTS             
```

## Key Registers
- $00B7 - KERNAL / zero page - filename length for I/O operations
- $00BB - KERNAL / zero page - filename pointer low byte (pointer to filename buffer)
- $00BC - KERNAL / zero page - filename pointer high byte

## References
- "set_filename_wrapper" — expands on wrapper entry at $FFBD