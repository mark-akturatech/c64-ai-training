# KERNAL LOAD: LOAD RAM (vectored from $FFD5)

**Summary:** KERNAL LOAD entry (vectored from $FFD5) stores a relocated load address in MEMUSS ($C3/$C4), jumps through the ILOAD vector ($0330) to perform the serial load, sets the load/verify flag VERCK ($93), clears the I/O STATUS ($90), and validates the device number in FA ($BA), trapping illegal devices (keyboard/screen) to I/O error #9 ($F713).

## Description
This KERNAL routine is the vectored LOAD entry (originally called from $FFD5). Behavior and steps:

- Store relocated load address: X and Y registers are saved to MEMUSS low/high at $C3/$C4 (used when a non-default load address is desired).
- Jump through ILOAD vector: JMP ($0330) performs an indirect jump to the ILOAD handler (the vector points to the code that continues the load sequence; in this listing it resolves to $F4A5).
- Set load/verify flag: the accumulator is stored to $93 to set VERCK (load/verify) for the subsequent load/verify operation.
- Clear I/O status: A #$00 is written to STATUS ($90) to reset the I/O status word before the operation.
- Validate device number: the device number FA at $BA is tested. If zero (keyboard) or three (screen) the routine branches to the I/O error handler (illegal device number), using JMP $F713 which raises I/O error #9.

**[Note: Source may contain an error — label for $93 appears as both "VERCK" and "VRECK" in the listing/comments.]**

## Source Code
```asm
.,F49E 86 C3    STX $C3         MEMUSS, relocated load address
.,F4A0 84 C4    STY $C4
.,F4A2 6C 30 03 JMP ($0330)     ILOAD vector. Points to $F4A5
.,F4A5 85 93    STA $93         VRECK, load/verify flag
.,F4A7 A9 00    LDA #$00
.,F4A9 85 90    STA $90         clear STATUS, I/O status
.,F4AB A5 BA    LDA $BA         get FA, current device
.,F4AD D0 03    BNE $F4B2       keyboard
.,F4AF 4C 13 F7 JMP $F713       I/O error #9, illegal device
.,F4B2 C9 03    CMP #$03        screen?
.,F4B4 F0 F9    BEQ $F4AF       yes, illegal device
```

## Key Registers
- $C3 - KERNAL - MEMUSS low (relocated load address low byte)
- $C4 - KERNAL - MEMUSS high (relocated load address high byte)
- $0330 - KERNAL vector - ILOAD (indirect JMP target for load handler)
- $FFD5 - KERNAL entry point - LOAD (vectored to this routine)
- $93  - KERNAL - VERCK / VRECK (load/verify flag)
- $90  - KERNAL - STATUS (I/O status word)
- $BA  - Zero Page - FA (current device number)
- $F713 - KERNAL - I/O error #9 handler (illegal device number)

## References
- "load_from_serial_bus" — expands on the serial-bus load implementation that follows the ILOAD vector

## Labels
- LOAD
- ILOAD
- MEMUSS
- VERCK
- STATUS
- FA
