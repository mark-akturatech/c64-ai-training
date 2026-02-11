# I/O Expansion Area ($DE00-$DEFF)

**Summary:** $DE00-$DEFF is an I/O expansion area accessible via Expansion Port pin 7 and reserved for cartridges/expansion hardware; common uses include CPU switching (CP/M module) and cartridge enable/disable toggles (Simon's BASIC). Addresses cited: $DE00 (decimal 56832), cartridge ROM ranges $8000-$BFFF and $A000-$BFFF.

## Details
This 256-byte range ($DE00-$DEFF) is not used by the C64's internal chips; it is exposed on Expansion Port pin 7 for external cartridges and expansion modules to implement custom I/O or control signals.

Examples from shipped hardware:
- CP/M module: uses address 56832 ($DE00) to switch control between the 6510 and a Z-80 CPU (writing to $DE00 turns the Z-80 on/off).
- Simon's BASIC cartridge (16K): the cartridge is mapped at $8000-$BFFF (32768–49151 decimal), overlapping the system BASIC ROM at $A000-$BFFF (40960–49151). To allow the cartridge to extend BASIC while still using the system BASIC ROM, the cartridge copies its $8000-$9FFF (32768–40959) area to RAM and toggles the cartridge overlay by writing or reading $DE00 (56832) to turn the cartridge logic on/off.

Behavioral notes:
- Accesses to this range are implementation-defined by the cartridge or expansion hardware connected to the Expansion Port; the C64's internal hardware does not provide fixed functions for these addresses.
- Both read and write accesses may be used by cartridges as control strobes (some cartridges react to either operation).

## Key Registers
- $DE00-$DEFF - Expansion Port I/O area - reserved for cartridges and expansion hardware (accessible via Expansion Port pin 7)

## References
- "df00_dfff_reserved_expansion_port" — Other expansion port reserved ranges
