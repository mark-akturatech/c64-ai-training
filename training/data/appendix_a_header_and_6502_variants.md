# 6502 Family: Differences in Zero Page Addresses $00/$01 (6502, 6510, 6509, 7501)

**Summary:** Describes how zero-page addresses $0000/$0001 are used differently across 6502-family CPUs: on the NMOS 6502 they are normal zero-page memory; on the 6510 and 7501 $0000 is a direction register and $0001 is an I/O register (cassette/memory control); on the 6509 $0000 selects the program bank and $0001 selects the bank used for LDA (..),Y / STA (..),Y accesses.

## Differences
- 6502: $0000 and $0001 behave as ordinary zero-page memory locations (general-purpose RAM).
- 6510 and 7501: address $0000 is a directional register (data-direction for port lines) and $0001 is an I/O register used for system functions such as cassette interface and memory control (bank lines, I/O signals). These two zero-page addresses are thus hardware-mapped I/O rather than ordinary RAM.
- 6509: address $0000 is used to switch the program execution bank (changes which bank is visible to the program counter). Address $0001 is used to switch the memory bank accessed by the two instructions LDA (..),Y and STA (..),Y (indirect indexed Y).

## Key Registers
- $0000-$0001 - 6502 - Zero-page general-purpose RAM (both addresses are normal zero-page memory)
- $0000-$0001 - 6510 / 7501 - $0000 = directional register; $0001 = I/O register (cassette/memory control)
- $0000-$0001 - 6509 - $0000 = program bank select; $0001 = bank select for LDA (..),Y and STA (..),Y

## References
- "programming_model_and_registers" — expands on 6502 core register concepts referenced in Appendix A
