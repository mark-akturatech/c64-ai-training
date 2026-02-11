# 1541 Format Routine Fragment (FORMAT / WAIT)

**Summary:** This 6502 assembly fragment is part of the Commodore 1541 disk drive's formatting routine. It initializes specific memory locations, sets up a polling loop to monitor a status byte, and eventually jumps to a ROM routine at $C194.

**Description**

This fragment performs low-level initialization and a short wait/poll loop used by a full-track formatting routine. The sequence of operations is as follows:

- **LDA #$00; STA $0003**: Loads the accumulator with $00 and stores it at zero-page location $0003. This initializes the status byte that will be polled later.
- **LDA #$4B; STA $0500**: Loads the accumulator with $4B and stores it at $0500. This value is likely a format parameter or buffer byte.
- **LDX #$01**: Sets the X register to 1. The usage of this register depends on the surrounding code.
- **FORMAT**: Label marking the start of the 1541 format routine.
- **WAIT loop**: A loop that loads the byte at $0003 and branches back to WAIT while the negative flag is set (i.e., bit 7 of the loaded value is 1). This polls $0003 until bit 7 becomes 0.
- **JMP $C194**: Transfers control to the absolute address $C194, which is a ROM routine responsible for preparing an error message after executing a command.

Note: The BMI instruction is "branch if negative," meaning it branches when bit 7 of the accumulator is 1.

## Source Code

```asm
; Fragment (original line numbers preserved where present)
; 1290
        LDA #$00         ; load immediate $00
        STA $0003        ; store A -> $0003 (initialize status byte)
; 820-840  (blank lines in original)

        LDA #$4B         ; load immediate $4B
        STA $0500        ; store A -> $0500 (format param/buffer)
        LDX #$01         ; set X = 1

; 1541 FORMAT
FORMAT

; 1310
WAIT    LDA $0003        ; poll status byte at $0003
        BMI WAIT         ; loop while negative flag set (A bit7 = 1)
; 1330

        JMP $C194        ; jump to $C194 (prepare error message)
```

## Key Registers

- **$0003**: Zero-page RAM location used as a status byte, polled by the WAIT loop.
- **$0500**: RAM location where the immediate value $4B is stored, likely serving as a format parameter or buffer.
- **$C194**: ROM address for a routine that prepares an error message after executing a command.

## References

- "Commodore 1541 Disk Drive ROM Disassembly"
- "Commodore 1541 Disk Drive User's Guide"