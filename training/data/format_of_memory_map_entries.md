# Memory-map entry format and conventions

**Summary:** Describes the structure used for memory-map entries: large blocks (256-page areas, ROM ranges such as the 8192-byte BASIC ROM), grouped Location Range sections, individual entries with decimal then hexadecimal addresses, mnemonic labels (Commodore guide, Jim Butterfield PET maps), and distinctions between flags, pointers, and vectors.

## Format of entries
Entries are organized hierarchically:

- Large blocks: The book groups addresses into large blocks (for example, the 256-page 0 locations or the 8192 locations in the BASIC ROM). Each block usually begins with an overview explaining how the locations in that block are related to aid comprehension of individual entries.
- Location Range: Where several consecutive locations are tightly interrelated they are grouped under a Location Range heading and explained together rather than separately.
- Individual entries: Each individual location entry lists the address first in decimal, then in hexadecimal (hex addresses use $ notation), and sometimes a mnemonic label. The mnemonic is a convenience for machine-language programming and easier reference.

## Labels and sources
- Mnemonic labels: Labels are mnemonic devices used to name locations (not formal source code identifiers). Some labels are published in the Commodore 64 Programmer's Reference Guide.
- External label sources: Additional labels and conventions are taken from Jim Butterfield’s PET memory maps to help map PET information to the C64. Use of these labels is intended to assist adaptation; they are not guaranteed to match Commodore's internal symbol names.

## Entry contents and examples
- One-line summary: Each entry begins with a one-line description (type, brief purpose).
- Detailed explanation: A fuller explanation follows the one-line description; entries can range from a few sentences to multiple pages and occasionally include program samples.
- Program samples: When included, sample programs illustrate usage; samples are placed with the detailed explanation.

## Flags, pointers, and vectors
- Flag: A single-byte value used by programs to store the outcome or state of an operation.
- Pointer / Vector: Usually a two-byte location that holds a significant address. The text distinguishes the terms by intent:
  - Pointer: typically points to the start of some data.
  - Vector: typically points to the start of a machine-language routine.
  - Note: the terms are sometimes used interchangeably; context determines the intended meaning.

## References
- "memory_size_and_addressing" — expands on addresses and address ranges shown in entries
- "multi_byte_addresses_pages_and_byte_order" — expands on pointers and vectors as two-byte values and byte order
- "hexadecimal_and_nybbles" — expands on presenting addresses in decimal and hexadecimal
- "bitwise_logical_operations_and_examples" — expands on flags being manipulated with bitwise operations
