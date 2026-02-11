# CIA #2 register image mirroring ($DD10-$DDFF)

**Summary:** Describes the CIA #2 register images and mirroring behavior in the $DD10-$DDFF block on the C64; only $DD00-$DD0F are the unique CIA #2 registers (mirrors repeat every 16 bytes, i.e. only A0-A3 decoded).

## Description
The CIA #2 chip on the C64 occupies a 256-byte I/O block ($DD00–$DDFF) but actually implements only 16 hardware registers. Because the CIA decodes only the low four address lines (A0–A3), each 16-byte region in the 256-byte block is a mirror of the others. Concretely, the unique registers are at $DD00–$DD0F; addresses from $DD10 through $DDFF are repeated copies (images) of those registers.

Behavioral points:
- Any access to $DD10–$DDFF targets the same internal register as the corresponding address in $DD00–$DD0F (e.g., $DD10 mirrors $DD00, $DD11 mirrors $DD01, etc.).
- For clarity and maintainability, do not use the mirrored addresses; use the primary range $DD00–$DD0F in programs and documentation.

## Key Registers
- $DD00-$DD0F - CIA 2 - Primary unique registers (16 implemented registers)
- $DD10-$DDFF - CIA 2 - Register images / mirrors (mirrors of $DD00-$DD0F; avoid use)

## References
- "dc10_dcff_cia1_register_images" — Mirroring behavior common to both CIA chips
