# System Hardware Vectors ($FFF6-$FFFF) - KERNAL

**Summary:** KERNAL vector table and 4-byte padding at $FFF6-$FFF9; hardware vectors at $FFFA-$FFFB (NMI -> $FE43), $FFFC-$FFFD (RESET -> $FCE2), and $FFFE-$FFFF (IRQ -> $FF48). Vectors store little-endian addresses that point to ROM entry routines which perform indirect JMPs to RAM-based handlers.

## Description
This ROM area contains the three standard system hardware vectors and a 4-byte signature/padding word:

- $FFF6-$FFF9: 4-byte signature/padding (bytes 52 52 42 59).
- $FFFA-$FFFB: NMI vector (word stored little-endian -> $FE43).
- $FFFC-$FFFD: RESET vector (word stored little-endian -> $FCE2).
- $FFFE-$FFFF: IRQ/BRK vector (word stored little-endian -> $FF48).

The vectors themselves point to KERNAL ROM entry routines. Those ROM routines perform indirect JMPs (i.e., they dispatch to RAM-based handler addresses), allowing user-defined routines in RAM to be installed as interrupt handlers while keeping the ROM vectors fixed.

Interpretation example (little-endian):
- Bytes "43 FE" at $FFFA/$FFFB form the word $FE43 (NMI entry).
- Bytes "E2 FC" at $FFFC/$FFFD form $FCE2 (RESET entry).
- Bytes "48 FF" at $FFFE/$FFFF form $FF48 (IRQ entry).

## Source Code
```text
.:FFF6 52 52 42 59

                                *** SYSTEM HARDWARE VECTORS
                                This table contains jumpvectors for system reset, IRQ, and
                                NMI. The IRQ and NMI vectors points to addresses which
                                contains an indirect jump to RAM, to provide user defined
                                routines.
.:FFFA 43 FE
.:FFFC E2 FC
.:FFFE 48 FF
```

## Key Registers
- $FFF6-$FFF9 - ROM padding/signature (bytes 52 52 42 59)
- $FFFA-$FFFB - ROM - NMI vector (pointer -> $FE43)
- $FFFC-$FFFD - ROM - RESET vector (pointer -> $FCE2)
- $FFFE-$FFFF - ROM - IRQ/BRK vector (pointer -> $FF48)

## References
- "power_reset_entry_point" — expands on reset vector pointing to ROM power-on entry routine
- "irq_entry" — expands on IRQ vector entry handler
- "nmi_entry_point" — expands on NMI entry handler