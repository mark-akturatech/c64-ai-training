# CIA #2 Port A ($DD00 / CI2PRA) — Data Port A / VIC-II Bank & Serial/User Port Signals

**Summary:** CIA 2 Data Port A at $DD00 (CI2PRA) maps bits 0–1 to the VIC‑II 16K memory bank select and bits 2–7 to RS‑232 / serial-bus / User Port signals (Sout, ATN, CLK out, DATA out, CLK in, DATA in).

## Description
CI2PRA ($DD00) is the CIA‑2 port A data register. Bits are assigned as follows:
- Bits 0–1: VIC‑II 16K memory-bank select (two-bit value; 11 = bank 0, 10 = bank 1, 01 = bank 2, 00 = bank 3). These select which 16K block of the C64 memory map is visible to the VIC‑II.
- Bit 2: RS‑232 data output (Sout) — appears on User Port pin M.
- Bit 3: Serial bus ATN (attention) output.
- Bit 4: Serial bus clock pulse output.
- Bit 5: Serial bus data output.
- Bit 6: Serial bus clock pulse input.
- Bit 7: Serial bus data input.

Notes:
- Bits labeled "output" drive the respective User Port / serial-bus signals when the port's direction for that bit is set to output (direction controlled by the CIA direction register for port A).
- Bits labeled "input" reflect the state of the external signals when read.
- The two-bit VIC bank select is the standard mapping used to choose the VIC‑II’s 16 KB view of main memory (commonly used by cartridges and memory banking).

## Source Code
```text
$DD00        CI2PRA       Data Port Register A

                     0-1  Select the 16K VIC-II chip memory bank (11=bank 0, 00=bank 3)
                     2    RS-232 data output (Sout)/Pin M of User Port
                     3    Serial bus ATN signal output
                     4    Serial bus clock pulse output
                     5    Serial bus data output
                     6    Serial bus clock pulse input
                     7    Serial bus data input
```

## Key Registers
- $DD00 - CIA 2 - Data Port A (CI2PRA): VIC‑II 16K bank select (bits 0–1), RS‑232/serial/User Port signals (bits 2–7)

## References
- "cia2_porta_bits_video_bank_selection" — Specifies which patterns correspond to which banks
- "user_port_pinout" — Which User Port pins carry these signals

## Labels
- CI2PRA
