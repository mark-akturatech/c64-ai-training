# Commodore 64 memory model — 64K (65536) bytes

**Summary:** The Commodore 64 has 64K (65536) bytes of addressable memory; each byte stores an integer 0–255 and is accessed by an address in the range 0–65535 (hex $0000–$FFFF). Memory locations may be read and, where writable, written by the CPU.

## Overview
The C64 address space comprises 65536 distinct byte locations. Each location holds one byte (8 bits), with a numeric range 0–255. Any location is referenced by its numeric address (0–65535); addresses are commonly represented in hexadecimal as $0000–$FFFF.

Reading from an address returns the byte stored there; writing replaces that byte where the location is writable (some address ranges are ROM or I/O and do not accept writes in the usual way).

## References
- "bits_bytes_and_binary_numbering" — expands on how bytes are composed of bits and their numeric ranges  
- "multi_byte_addresses_pages_and_byte_order" — expands on multi-byte addressing and the page concept  
- "format_of_memory_map_entries" — expands on how addresses are represented in the book's memory maps
