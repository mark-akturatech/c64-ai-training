# 6502 Decimal Mode Flag (D)

**Summary:** The Decimal Mode flag (D) in the 6502 processor status register enables Binary Coded Decimal (BCD) arithmetic for addition and subtraction (ADC and SBC) instructions. It is set with the SED instruction and cleared with CLD.

**Decimal Mode (D flag)**

When the D flag is set, the 6502 performs BCD arithmetic during addition and subtraction operations. Use the SED instruction to set the flag and CLD to clear it. The D flag is bit 3 of the processor status register P.

## References

- "processor_status_register" — expands on the processor status P and its flags (includes D bit)

## Mnemonics
- ADC
- SBC
- SED
- CLD
