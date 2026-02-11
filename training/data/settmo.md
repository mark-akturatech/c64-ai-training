# SETTMO ($FFA2)

**Summary:** SETTMO KERNAL call at $FFA2 (real address $FE21) sets the serial bus timeout value; input: A = timeout value (8-bit). Searchable terms: $FFA2, $FE21, SETTMO, KERNAL, serial bus, timeout, A register.

## Description
Sets the serial bus timeout used by KERNAL serial routines. The only documented input is the A register containing the timeout value (one byte). The routine is vectored at $FFA2; the actual implementation resides at $FE21 in the ROM.

Effect: changes how long the KERNAL will wait for serial-bus operations to complete; this affects serial communications initiated by LISTEN/TALK (see related routines).

Calling convention (documented):
- Input: A = timeout value (byte)
- No other inputs/outputs are documented in this source.

Example (brief): load desired timeout into A and call JSR $FFA2 (e.g. LDA #$10 / JSR $FFA2).

## References
- "listen" — serial communications initiated by LISTEN/TALK
- "talk" — serial communications initiated by TALK

## Labels
- SETTMO
