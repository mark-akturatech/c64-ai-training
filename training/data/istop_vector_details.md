# $0328-$0329 ISTOP (KERNAL STOP vector)

**Summary:** $0328-$0329 hold the ISTOP vector (KERNAL vector to the STOP key handler, currently pointing to $F6ED / 63213). Describes STOP/STOP+RESTORE disabling via POKE 808,<value> and how to restore behavior.

## Description
The two-byte vector at $0328-$0329 (ISTOP) contains the address of the KERNAL routine that tests the STOP key. On an unmodified C64 this vector points to the KERNAL STOP routine at $F6ED (decimal 63213).

You can alter system behavior by changing the byte(s) at address 808 (decimal) via POKE:

- POKE 808,239 — disables the STOP key test (STOP key ignored).  
- POKE 808,234 — disables both STOP and the STOP/RESTORE combination (note: POKE 808,234 will cause the BASIC LIST command not to function properly).  
- POKE 808,237 — restores normal STOP key behavior.

These POKE values modify the handler entry used by the system; changing them effectively bypasses the routine the vector points to. The STOP/RESTORE combination is treated differently from the plain STOP key and may require the alternate POKE value to disable both.

## Key Registers
- $0328-$0329 - KERNAL - ISTOP vector to STOP routine (points to $F6ED / 63213)

## References
- "cbinv_brk_vector" — expands on STOP/RESTORE behavior; related to BRK/USRCMD vectors

## Labels
- ISTOP
