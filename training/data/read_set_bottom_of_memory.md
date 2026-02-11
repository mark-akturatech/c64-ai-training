# Read/Set Bottom of Memory (KERNAL $FE34)

**Summary:** KERNAL routine at $FE34-$FE42 that reads or sets the OS start-of-memory words ($0281/$0282). Uses the processor carry flag to select mode (carry=1 read, carry=0 set); instructions: BCC, LDX, LDY, STX, STY, RTS.

## Description
Branch-on-carry entry: if carry clear (Cb = 0) the routine stores X/Y into the OS start-of-memory bytes; if carry set (Cb = 1) it loads X/Y from those bytes. The two bytes affected are $0281 (low) and $0282 (high). Returns with RTS.

Behavior summary:
- Carry = 1 (read mode): LDX $0281 (low), LDY $0282 (high), RTS.
- Carry = 0 (set mode): STX $0281 (low), STY $0282 (high), RTS.

This routine is located in the KERNAL ROM at $FE34-$FE42.

## Source Code
```asm
.; read/set the bottom of memory, Cb = 1 to read, Cb = 0 to set
.,FE34 90 06    BCC $FE3C       if Cb clear go set the bottom of memory
.,FE36 AE 81 02 LDX $0281       get the OS start of memory low byte
.,FE39 AC 82 02 LDY $0282       get the OS start of memory high byte
.,FE3C 8E 81 02 STX $0281       save the OS start of memory low byte
.,FE3F 8C 82 02 STY $0282       save the OS start of memory high byte
.,FE42 60       RTS
```

## Key Registers
- $0281 - RAM - OS start-of-memory low byte
- $0282 - RAM - OS start-of-memory high byte
- $FE34-$FE42 - KERNAL ROM - read/set bottom-of-memory routine

## References
- "read_set_bottom_wrapper" — expands on wrapper at $FF9C

## Labels
- READ_SET_BOTTOM
