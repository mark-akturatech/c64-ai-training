# Datasette: Extract start address from header buffer (LDX/LDY → STX/STY)

**Summary:** Extract the 16-bit start address from a recently read header buffer ($buffer+1 = low, $buffer+2 = high) by loading low into X and high into Y, then storing X/Y into a zero-page pointer (ptr/ptr+1) to set the destination pointer for the program load.

## Operation
The header buffer contains the 2-byte start address at offsets +1 (low byte) and +2 (high byte). The sequence loads those bytes into the index registers X (low) and Y (high) and writes them into a pointer in zero page (ptr / ptr+1). After this, the two-byte pointer at ptr holds the target address where incoming program bytes should be written by the load routine.

Notes:
- buffer+1 = low byte (LSB), buffer+2 = high byte (MSB).
- ptr / ptr+1 is a two-byte destination pointer (typically zero-page) used by the data write loop.

## Source Code
```asm
    ; Extract start address from header buffer
    LDX buffer+1     ; X <- low byte (buffer+1)
    LDY buffer+2     ; Y <- high byte (buffer+2)
    STX ptr          ; ptr <- low byte (store X into ptr)
    STY ptr+1        ; ptr+1 <- high byte (store Y into ptr+1)
```

## References
- "read_192_byte_header" — expands on start address comes from the header just read
- "load_program_data_loop" — expands on uses ptr set here to write incoming bytes

## Labels
- PTR
- BUFFER
