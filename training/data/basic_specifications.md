# 6502 Microprocessor — Basic Hardware Specifications

**Summary:** 6502 CPU: 8-bit word length, available in 1, 2 and 3 MHz clock speeds, and uses memory-mapped I/O (no dedicated CPU I/O registers); example I/O address $E000.

## Basic specifications
- Clock speed: 1, 2 and 3 MHz models were available.
- Word length: 8 bits.
- Input / Output: memory-mapped (no dedicated I/O instructions or I/O registers inside the CPU).

## Memory-mapped I/O
The 6502 exposes a linear address space (via the address bus) and does not contain dedicated I/O registers. Peripheral devices are accessed by mapping device registers into memory addresses; external logic on the motherboard (decoding/address-mapping hardware or bus logic) detects accesses to those addresses and steers data to/from the device.

Example: a write to address $E000 (STA $E000 or STX/STY/STA absolute, etc.) is routed by the system hardware to the device register mapped at $E000 rather than to RAM. The CPU itself performs a normal memory write cycle; differentiation between RAM and device registers is performed entirely by system address decoding.

## References
- "addresses_and_address_bus" — expands on address bus width and address range
- "paged_memory_and_zero_page" — expands on memory organization (zero page optimization)
