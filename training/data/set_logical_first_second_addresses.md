# Set logical, first and second addresses (ROM $FE00)

**Summary:** Small KERNAL routine at $FE00 that stores A, X, Y into zero page locations $B8, $BA, $B9 (logical file, device number, secondary address) and returns with RTS. Related wrapper: "set_logical_addresses_wrapper" (jump at $FFBA).

## Description
This routine saves three processor registers into zero page variables used to hold file/IO addressing information:
- STA $B8 — store A into $B8 (logical file)
- STX $BA — store X into $BA (device number)
- STY $B9 — store Y into $B9 (secondary address)
- RTS — return from subroutine

No stack or flag side-effects beyond the normal STA/STX/STY behavior. Callers (see wrapper at $FFBA) are expected to load A/X/Y with the values to be recorded before JSR $FE00.

## Source Code
```asm
.,FE00 85 B8    STA $B8         save the logical file
.,FE02 86 BA    STX $BA         save the device number
.,FE04 84 B9    STY $B9         save the secondary address
.,FE06 60       RTS             
```

## Key Registers
- $00B8 - Zero Page - logical file
- $00BA - Zero Page - device number
- $00B9 - Zero Page - secondary address

## References
- "set_logical_addresses_wrapper" — expands on the wrapper at $FFBA (jump to this routine)

## Labels
- LOGICAL_FILE
- DEVICE_NUMBER
- SECONDARY_ADDRESS
