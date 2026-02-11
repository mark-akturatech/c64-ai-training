# CIA #1 register mirroring ($DC10-$DCFF)

**Summary:** Describes CIA #1 (Complex Interface Adapter) register mirroring across $DC10-$DCFF and the base register region $DC00-$DC0F. Explains that only 16 internal registers are decoded (low 4 address bits), so every 16-byte block in the 256-byte window is a mirror.

## Mirroring Behavior
The CIA #1 contains 16 internal registers and is mapped into a 256-byte region ($DC00-$DCFF). Because the chip decodes only the low 4 address lines (enough to select 16 registers), the higher address bits are ignored; therefore every 16-byte block inside $DC00-$DCFF is a mirror of the base $DC00-$DC0F registers.

- Mirrored region: $DC10-$DCFF are images of the base registers at $DC00-$DC0F.
- Effective register selection: the accessed CIA register is the base plus the low 4 bits — i.e. effective = $DC00 + (address & $0F).
- Practical implication: reads/writes to any address in $DC00-$DCFF target one of the 16 CIA registers, with the mapping determined by the low 4 address bits.

## Usage Recommendation
For clarity and maintainability, address the CIA using the base range $DC00-$DC0F rather than higher mirrored addresses ($DC10-$DCFF). This avoids confusion when reading code or documenting register usage.

## Source Code
```text
CIA #1 Register Mirroring:

Base registers: $DC00-$DC0F (16 registers, only A0-A3 decoded)
Mirror region:  $DC10-$DCFF (mirrors repeat every 16 bytes)

Effective register = $DC00 + (address & $0F)
Example: $DC1D → $DC00 + ($1D & $0F) = $DC0D (CIA1 Timer B high byte)
```

## Key Registers
- $DC00-$DC0F - CIA 1 - internal registers (base register set)
- $DC10-$DCFF - CIA 1 - mirror images of $DC00-$DC0F (repeated every 16 bytes)

## References
- "dc0e_control_register_a_cia1" — expands on CIA #1 control registers located in the mirrored register space