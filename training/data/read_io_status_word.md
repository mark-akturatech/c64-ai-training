# read I/O status word ($FE07)

**Summary:** Checks device number at $BA and if it equals RS232 ($02) reads and clears the RS232 status register at $0297; preserves the status across the clear using PHA/PLA and returns the original status in A. Search terms: $FE07, $BA, $0297, RS232, PHA/PLA, RTS, 6502.

## Operation
This routine implements the KERNAL-style "read I/O status word" behavior for the RS232 device:

- Load the current device number from zero page $BA.
- Compare with the RS232 device number #$02; if it is not RS232, branch out (routine exits without touching $0297).
- If device == $02:
  - Load the RS232 status byte from absolute address $0297.
  - Push (PHA) that status to the stack to preserve it while clearing the hardware status.
  - Clear A and store #$00 to $0297, thereby clearing the RS232 status register.
  - Pull (PLA) the preserved status back into A.
  - RTS returns to the caller with the original RS232 status in A.

Stack and side effects:
- Stack is balanced (one PHA matched by one PLA); after RTS the stack pointer is unchanged relative to entry.
- The hardware/status register at $0297 is cleared (written #$00).
- The caller receives the previous RS232 status in the A register.

**[Note: Source may contain an error — an external summary claiming the routine "returns previous status on stack" is incorrect; the code preserves the status with PHA/PLA but restores it into A before returning, so the return value is in A and the stack is balanced.]**

## Source Code
```asm
                                *** read I/O status word
.,FE07 A5 BA    LDA $BA         get the device number
.,FE09 C9 02    CMP #$02        compare device with RS232 device
.,FE0B D0 0D    BNE $FE1A       if not RS232 device go ??
                                get RS232 device status
.,FE0D AD 97 02 LDA $0297       get the RS232 status register
.,FE10 48       PHA             save the RS232 status value
.,FE11 A9 00    LDA #$00        clear A
.,FE13 8D 97 02 STA $0297       clear the RS232 status register
.,FE16 68       PLA             restore the RS232 status value
.,FE17 60       RTS             
```

## Key Registers
- $BA - Zero Page - device number for I/O routines
- $0297 - I/O - RS232 status register (readable and clearable)

## References
- "read_io_status_word_wrapper" — wrapper expanded at $FFB7