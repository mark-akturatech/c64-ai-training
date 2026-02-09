# CHECK FOR 8-ROM (KERNAL $FD02)

**Summary:** Routine at $FD02 checks for an autostart ROM identifier by comparing five bytes at $8004-$8008 with bytes stored at $FD10-$FD14 using indexed LDA/CMP loops (LDX #$05, LDA $FD0F,X; CMP $8003,X). If all bytes match, the Z flag is left set on return.

## Operation
This KERNAL entry (start $FD02) verifies a 5-byte autostart identifier by performing five indexed comparisons. Sequence:

- LDX #$05 initializes a 5-byte countdown in X.
- Each loop iteration performs LDA $FD0F,X and CMP $8003,X:
  - With X counting 5→1 the comparisons are:
    - $FD14 vs $8008
    - $FD13 vs $8007
    - $FD12 vs $8006
    - $FD11 vs $8005
    - $FD10 vs $8004
- If any CMP is not equal, the routine branches to the RTS ($FD0F) immediately, leaving Z=0.
- If all comparisons are equal, the final CMP leaves Z=1 and the routine falls through to RTS, leaving Z=1 to indicate an identical identifier.

Effectively: Z=1 on return means the 5 bytes at $8004-$8008 match the 5 bytes at $FD10-$FD14; Z=0 means they do not match.

## Source Code
```asm
.,FD02 A2 05    LDX #$05        ; 5 bytes to check
.,FD04 BD 0F FD LDA $FD0F,X     ; Identifier at $FD10-$FD14 (indexed)
.,FD07 DD 03 80 CMP $8003,X     ; Compare with $8004-$8008 (indexed)
.,FD0A D0 03    BNE $FD0F       ; NOT equal -> exit (Z=0)
.,FD0C CA       DEX
.,FD0D D0 F5    BNE $FD04       ; loop until X==0
.,FD0F 60       RTS             ; return, Z=1 if all matched
```

## Key Registers
- $FD02-$FD0F - KERNAL - CHECK FOR 8-ROM routine (code entry $FD02)
- $FD10-$FD14 - KERNAL - stored autostart identifier bytes compared by routine
- $8004-$8008 - ROM - autostart parameters compared against $FD10-$FD14

## References
- "8rom_identifier" — expands on identifier bytes compared by this routine
- "power_reset_entry_point" — expands on called at reset to detect autostart cartridges