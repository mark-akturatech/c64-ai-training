# Wrapper at $FF90 — control KERNAL messages

**Summary:** The routine at $FF90 is a wrapper that jumps to the KERNAL routine at $FE18, which sets the KERNAL message control flag at memory location $9D. This flag determines whether the KERNAL will print error or control messages. The caller selects the message type by placing a value in the accumulator before invoking the routine: if bit 7 is set, the KERNAL will print error messages (e.g., "I/O ERROR #4"); if bit 6 is set, the KERNAL will print control messages (e.g., "SEARCHING FOR"). The wrapper itself is a single JMP instruction that transfers execution to the actual implementation at $FE18.

**Description**

The KERNAL routine at $FE18 controls the printing of error and control messages by setting the message control flag at memory location $9D. The accumulator value passed to this routine determines the behavior:

- **Bit 7 (value $80):** When set, enables KERNAL error messages.
- **Bit 6 (value $40):** When set, enables KERNAL control messages.
- **Bit 6 and 7 both set (value $C0):** Enables both error and control messages.
- **Bits 6 and 7 both clear (value $00):** Disables all KERNAL messages.

The routine at $FE18 operates as follows:

1. **Store the accumulator value into location $9D:** This sets the message control flag.
2. **Return from the subroutine:** The routine concludes its operation.

This mechanism allows programs to control the verbosity of KERNAL messages during operations such as loading or saving files.

## Source Code

```asm
; Wrapper at $FF90
.,FF90 4C 18 FE   JMP $FE18       ; Jump to control KERNAL messages routine

; Implementation at $FE18
.,FE18 85 9D      STA $9D         ; Store accumulator value into message control flag
.,FE1A 60         RTS             ; Return from subroutine
```

## Key Registers

- **Accumulator (A):** Determines the message control settings based on bits 6 and 7.

## References

- "control_kernal_messages" — expands on implementation at $FE18
- Commodore 64 Programmer's Reference Guide, Chapter 5: "User Callable KERNAL Routines"