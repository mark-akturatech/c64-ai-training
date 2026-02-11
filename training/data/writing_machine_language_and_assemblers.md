# Writing Machine Language on the Commodore 64 (Assemblers, POKEing, 64MON)

**Summary:** Describes methods for creating machine language programs on the C64: using an assembler (mnemonic source), manual POKEing from BASIC, and the Commodore 64MON monitor cartridge (features: 6510 register display, memory editor, assembler/disassembler). Recommends using an assembler; examples use 64MON conventions.

**Writing machine language programs**
Machine language programs reside in memory and must be entered into RAM. The C64 lacks a built-in facility for editing machine code directly, so you must either:
- Use an external program (an assembler or machine-language monitor), or
- Write a BASIC program that POKEs the numeric opcode bytes into memory.

An assembler accepts standardized mnemonics (e.g., LDA, STA, JMP) and produces the corresponding opcode bytes, making code far more readable and maintainable than a stream of numeric POKEs. A disassembler performs the reverse: it displays opcode bytes as mnemonics.

Manual POKEing (typing numeric opcode bytes into memory via BASIC) is possible but error-prone and described in the source as “totally unadvisable.”

**Assembler vs disassembler**
- **Assembler:** Allows writing machine language in mnemonic format and assembles to bytes placed at specified memory addresses. Most C64 assemblers share compatible mnemonic formats.
- **Disassembler:** Reads memory bytes and outputs mnemonic source (useful for studying or reverse-engineering memory regions).

Both are essential tools when writing, inspecting, or debugging machine code on the C64.

**64MON monitor cartridge**
The Commodore 64MON (64MON) cartridge is a machine-language monitor available as a cartridge for the C64. Its documented features include:
- Display of 6510 internal registers (PC, A, X, Y, SP, processor status) for debugging.
- Memory display and editing with an on-screen editor (modify arbitrary RAM contents).
- Built-in assembler: enter mnemonic source and assemble into memory.
- Built-in disassembler: display memory bytes as mnemonics.
- Additional monitor features to aid writing and editing machine language programs.

The manual specifies that examples use 64MON conventions. Since assembler formats are largely compatible, examples shown should be usable with most assemblers.

**Recommended practice**
- Strong recommendation: use an assembler (or a monitor with assembler support such as 64MON) rather than POKEing bytes from BASIC.
- The manual’s examples and notation follow 64MON conventions.

**Hexadecimal numbering system**
Before delving into machine language programming, it's essential to understand the hexadecimal numbering system, commonly used to represent memory addresses and values in assembly language.

**Hexadecimal (Base 16):**
- Uses 16 symbols: 0–9 and A–F (where A=10, B=11, ..., F=15).
- Each hexadecimal digit represents four binary digits (bits), making it a concise way to express binary values.

**Comparison of Numbering Systems:**

| Decimal | Binary    | Hexadecimal |
|---------|-----------|-------------|
| 0       | 00000000  | 00          |
| 1       | 00000001  | 01          |
| 2       | 00000010  | 02          |
| 3       | 00000011  | 03          |
| 4       | 00000100  | 04          |
| 5       | 00000101  | 05          |
| 6       | 00000110  | 06          |
| 7       | 00000111  | 07          |
| 8       | 00001000  | 08          |
| 9       | 00001001  | 09          |
| 10      | 00001010  | 0A          |
| 11      | 00001011  | 0B          |
| 12      | 00001100  | 0C          |
| 13      | 00001101  | 0D          |
| 14      | 00001110  | 0E          |
| 15      | 00001111  | 0F          |
| 16      | 00010000  | 10          |

**Place Values in Hexadecimal:**
- Similar to decimal, where each position represents a power of 10, in hexadecimal, each position represents a power of 16.

For example, the hexadecimal number 11D9 translates to decimal as:
- (1 × 16³) + (1 × 16²) + (13 × 16¹) + (9 × 16⁰)
- (1 × 4096) + (1 × 256) + (13 × 16) + (9 × 1)
- 4096 + 256 + 208 + 9 = 4569

**Notation:**
- In C64 assembly language, hexadecimal numbers are typically prefixed with a dollar sign ($). For example, $10 represents the decimal number 16.

Understanding hexadecimal notation is crucial for effective machine language programming on the C64, as it simplifies the representation and manipulation of binary data.

## References
- "simple_memory_map_overview" — expands on Memory areas where assembled programs live
- "hex_notation_and_64mon_examples" — expands on Hexadecimal notation used in assemblers and 64MON examples