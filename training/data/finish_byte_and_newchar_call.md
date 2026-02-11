# RADJ — finish-byte handler (KERNAL $FA60)

**Summary:** KERNAL routine at $FA60 that finishes a received byte: calls NEWCH ($FB97), clears DPSW ($009C) throw-away flag, initializes dipole state (LDX #$DA) and calls STT1 ($F8E2) to reinitialize timeout/state, checks FSBLK ($00BE) for an exit condition and, if non-zero, stores FSBLK into SHCNL ($00A7) for later dispatch.

## Description
This short handler finalizes byte processing when a byte boundary is detected.

- JSR $FB97 (NEWCH) — finish processing the current character/byte and return with status updated.
- STA $9C (DPSW) — clear the DPSW byte in zero page; used here to clear the "throw away" flag bit.
- LDX #$DA — load X with $DA (218 decimal). The source labels this "initialize for next dipole"; the value is prepared before calling STT1.
- JSR $F8E2 (STT1) — reinitialize dipole state and timeout (STT1 likely uses X to set state/timers).
- LDA $BE (FSBLK) — test FSBLK for a non-zero value (FSBLK appears to indicate an exit or dispatch condition).
- BEQ $FA70 (RD15) — if FSBLK is zero, branch to RD15 at $FA70 (no dispatch).
- STA $A7 (SHCNL) — if FSBLK was non-zero, store it into SHCNL for later dispatch handling.

The routine therefore prepares the system to enter the byte-handling/dispatch path: NEWCH completes the byte, DPSW is cleared to drop the throw-away flag, STT1 resets dipole/timeout state, and FSBLK -> SHCNL arms a channel value for subsequent processing.

## Source Code
```asm
.,FA60 20 97 FB    JSR $FB97       ; RADJ   JSR NEWCH       ; FINISH BYTE, CLR FLAGS
.,FA63 85 9C       STA $9C         ; STA    DPSW            ; CLEAR BIT THROW AWAY FLAG
.,FA65 A2 DA       LDX #$DA        ; LDX    #218            ; INITILIZE FOR NEXT DIPOLE
.,FA67 20 E2 F8    JSR $F8E2       ; JSR    STT1
.,FA6A A5 BE       LDA $BE         ; LDA    FSBLK           ; CHECK FOR LAST VALUE
.,FA6C F0 02       BEQ $FA70       ; BEQ    RD15
.,FA6E 85 A7       STA $A7         ; STA    SHCNL
```

## Key Registers
- $00A7 - 6502 (KERNAL zero page) - SHCNL (store for later dispatch / channel)
- $009C - 6502 (KERNAL zero page) - DPSW (flags; throw-away bit cleared here)
- $00BE - 6502 (KERNAL zero page) - FSBLK (finish/block indicator tested for dispatch)

## References
- "long_pulse_handler_rad2" — expands on RADJ when a byte boundary is detected to finalize byte processing
- "byte_handler_intro_and_mode_flags" — expands on flow after NEWCH returns; interprets RDFLG/FSBLK and enters byte handler

## Labels
- RADJ
- SHCNL
- DPSW
- FSBLK
