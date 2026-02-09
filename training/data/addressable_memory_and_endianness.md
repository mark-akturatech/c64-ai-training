# 6502 Addressable Memory & Little-endian Address Storage

**Summary:** Total addressable memory is 64 Kb (16-bit address bus, 65536 bytes). The 6502 is little-endian: 16-bit addresses are stored least-significant byte first (example: $458D stored as $8D $45).

## Addressable Memory
The 6502 has a 16-bit address bus, so the processor can address 64 Kb (65,536 bytes) of memory. Any 16-bit pointer or address value therefore occupies two consecutive bytes in memory.

## Little-endian 16-bit Addresses
On the 6502 (little-endian), a 16-bit address is stored low byte first, then high byte (LSB first). For example, the 16-bit value $458D is laid out in memory as the byte $8D followed by the byte $45. Code and data that treat addresses as two-byte values must account for this byte order when reading or writing pointers.

## Source Code
```text
Example representation:
$458D -> $8D $45    ; low byte ($8D) then high byte ($45)
(16-bit address occupies two consecutive bytes, little-endian)
```

## References
- "addresses_and_address_bus" — expands on 16-bit address bus and ranges