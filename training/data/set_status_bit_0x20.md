# KERNAL helper: set bit $20 in $01 (FCCA–FCD0)

**Summary:** Small KERNAL helper routine (addresses $FCCA–$FCD0) that sets bit #%00100000 ($20) in zero page $01 using 6502 mnemonics LDA/ORA/STA/RTS. Searchable terms: $01, $20, ORA, LDA, STA, RTS, KERNAL, FCCA.

## Description
This four-instruction helper reads the byte at zero page address $01, ORs it with #$20 (sets bit 5), writes the result back to $01, and returns (LDA $01 / ORA #$20 / STA $01 / RTS). It preserves all other bits in $01 while ensuring bit $20 is set. The routine lives in the KERNAL disassembly at $FCCA–$FCD0 and is intended to enable a control/status flag in the processor status/port area (as noted in the source).

Behavioral notes:
- ORA #$20 sets bit 5 (value $20) leaving other bits unchanged.
- Typical usage is a simple, atomic read-modify-write helper to ensure a particular control bit is asserted before returning.

## Source Code
```asm
.,FCCA A5 01    LDA $01
.,FCCC 09 20    ORA #$20
.,FCCE 85 01    STA $01
.,FCD0 60       RTS
```

## Key Registers
- $0001 - Processor port (CPU zero page) - memory/configuration and control/status bits (bit $20 set by this routine)

## References
- "load_device_vectors_from_rom_table" — expands on often-called near vector reconfiguration
- "subtract_indirect_pair_offsets" — expands on status bit changes accompanying offset computations