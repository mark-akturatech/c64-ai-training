# SETTMO — Set IEEE timeout (KERNAL)

**Summary:** Vectored KERNAL routine (entry via $FFA2) that stores the accumulator into the KERNAL variable TIMOUT ($0285) to set the IEEE timeout flag; implementation is a single STA $0285 followed by RTS.

**Description**

SETTMO is the KERNAL entry that writes the accumulator into the IEEE timeout flag. The KERNAL vector at $FFA2 jumps to this routine; on entry, the value in A is stored to TIMOUT ($0285), and the routine returns. The implementation occupies four bytes at $FE21–$FE24 and consists solely of STA $0285 followed by RTS.

The TIMOUT variable at $0285 is used to control the timeout behavior for IEEE-488 (GPIB) operations. Setting bit 7 of TIMOUT enables or disables the timeout:

- Bit 7 = 0: Timeouts are enabled.
- Bit 7 = 1: Timeouts are disabled.

When timeouts are enabled, the system waits for a device to respond for 64 milliseconds. If no response is received within this period, a timeout error is recognized, and the handshake sequence is aborted. ([pagetable.com](https://www.pagetable.com/c64ref/kernal/?utm_source=openai))

## Source Code

```asm
                                *** SETTMO: SET TIMEOUT
                                The KERNAL routine SETTMO ($FFA2) jumps to this routine.
                                On entry, the value in (A) is stored in the IEEE timeout
                                flag.
.,FE21 8D 85 02 STA $0285       store in TIMOUT
.,FE24 60       RTS
```

## Key Registers

- $0285 - KERNAL RAM variable - TIMOUT (IEEE timeout flag)
- $FFA2 - KERNAL vector (entry address for SETTMO)

## References

- "Commodore 64 Programmer's Reference Guide" — details on KERNAL routines and variables
- "Ultimate Commodore 64 Reference" — comprehensive information on KERNAL functions ([pagetable.com](https://www.pagetable.com/c64ref/kernal/?utm_source=openai))

## Labels
- SETTMO
- TIMOUT
