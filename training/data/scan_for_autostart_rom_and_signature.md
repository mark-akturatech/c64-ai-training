# Autostart ROM scan at $FD02 — compares bytes with $8003 and checks for "CBM80" signature

**Summary:** Assembly routine at $FD02 scans for an autostart ROM at $8000 by comparing bytes from $FD0F+X with $8003+X using LDX/CMP loop; signature bytes 'CBM80' appear at $FD10-$FD14. Uses 6502 addressing modes LDA abs,X and CMP abs,X and returns via RTS.

## Description
This routine tests for an autostart ROM by comparing a short sequence of bytes in zero/low page data area ($FD0F+X) against bytes in the ROM area starting at $8003+X. It uses:

- LDX to set the starting index.
- LDA $FD0F,X (LDA abs,X) to fetch the test character.
- CMP $8003,X (CMP abs,X) to compare with the ROM byte.
- BNE to exit early if any comparison fails (branches to RTS at $FD0F).
- DEX/BNE loop to iterate the index.
- If all tested bytes match, the routine eventually returns with the status of the last CMP (Z set if last compare was equal).

Behavioral note:
- The source comments state "five characters to test" but the listing shows LDX #$05. That value and the subsequent DEX/BNE loop create an off‑by‑one/control-flow ambiguity (see note below).

**[Note: Source may contain an error — LDX #$05 contradicts the "five characters" comment and the DEX/BNE loop semantics; the loop as listed will underflow X after comparing X=0 and continue, leading to an extra comparison. Likely the original intended LDX value or loop structure differs (e.g., LDX #$04), but that is not present in this chunk.]**

The autostart signature (PETSCII) bytes are present at $FD10-$FD14 and encoded as the byte sequence shown in the listing.

## Source Code
```asm
        ; scan for autostart ROM at $8000, returns Zb=1 if ROM found
.,FD02  A2 05       LDX #$05        ; five characters to test
.,FD04  BD 0F FD    LDA $FD0F,X     ; get test character
.,FD07  DD 03 80    CMP $8003,X     ; compare with byte in ROM space
.,FD0A  D0 03       BNE $FD0F       ; exit if no match
.,FD0C  CA          DEX             ; decrement index
.,FD0D  D0 F5       BNE $FD04       ; loop if not all done
.,FD0F  60          RTS

        ; autostart ROM signature
.:FD10  C3 C2 CD 38 30   ; bytes at $FD10-$FD14: 'CBM80' (PETSCII bytes)
```

## References
- "reset_hardware_startup" — expands on early reset detection and calls involved in autostart ROM detection
