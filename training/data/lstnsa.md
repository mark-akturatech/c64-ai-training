# LSTNSA ($FF93)

**Summary:** KERNAL routine LSTNSA at $FF93 (real ROM address $EDB9) transmits a LISTEN secondary address on the IEC serial bus; requires a prior LISTEN call. Input: A = secondary address (uses A register).

**Description**

LSTNSA sends the secondary address byte on the IEC bus for a device previously selected with LISTEN. It only transmits the secondary (sub-)address — do a LISTEN first to select the target device and then call LSTNSA with the desired secondary address in A. After LSTNSA you normally send data bytes (for example, with IECOUT $FFA8).

Calling convention:
- Input: A = secondary address
- Registers used: A

**Error Handling:**

LSTNSA does not return error codes directly. To check for errors after calling LSTNSA, use the READST routine ($FFB7), which returns the status of the last I/O operation. ([pagetable.com](https://www.pagetable.com/c64ref/kernal/?utm_source=openai))

## Source Code

```assembly
; LSTNSA routine at $EDB9
EDB9: 48        PHA             ; Push A onto stack
EDBA: 09 60     ORA #$60        ; OR A with $60 to form secondary address command
EDBC: 20 8F ED  JSR $ED8F       ; Jump to IECOUT routine to send the byte
EDBF: 68        PLA             ; Pull A from stack
EDC0: 60        RTS             ; Return from subroutine
```

## Key Registers

- $FF93 - KERNAL - LSTNSA entry point (call to transmit LISTEN secondary address)
- $EDB9 - ROM - real ROM address for the routine

## References

- "listen" — explains that LISTEN must be called before LSTNSA
- "iecout" — explains sending bytes to the bus after addressing (IECOUT $FFA8)

## Labels
- LSTNSA
