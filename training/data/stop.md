# $FFE1 - STOP (KERNAL)

**Summary:** KERNAL entry $FFE1 (STOP) checks the STOP key status at RAM $0091 and returns processor flags indicating press state; implemented indirectly via the vector at $0328 which points to ROM routine $F6ED. Uses A and X registers; calls CLRCHN when STOP is detected.

## Operation
Queries the STOP-key status byte at $0091. If the STOP key is pressed the routine calls CLRCHN and clears the input buffer. On return the processor flags indicate the key state:

- Zero flag: 0 = STOP unpressed, 1 = STOP pressed  
- Carry flag: 1 = STOP pressed

Registers used: A, X.

Vectoring/real address:
- The callable KERNAL entry is at $FFE1. Its implementation is reached indirectly via the two-byte pointer stored at $0328 (low/high), which points into ROM at $F6ED where the actual STOP handling code resides.

## Key Registers
- $FFE1 - KERNAL entry point for STOP
- $F6ED - ROM routine (actual implementation address referenced by vector)
- $0328 - RAM (KERNAL vector pointer for STOP; 16-bit little-endian)
- $0091 - RAM (STOP key status byte)

## References
- "CLRCHN ($FFCC)" — called when STOP is detected; clears input channel/buffer  
- "UDTIM ($FFEA)" — updates STOP key indicator (UDTIM updates STOP status)

## Labels
- STOP
