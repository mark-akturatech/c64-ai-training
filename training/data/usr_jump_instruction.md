# C64 RAM Map: $0310 — USR Jump Instruction Opcode

**Summary:** $0310 contains the first byte of the 6510/6502 absolute JMP instruction used by the BASIC USR command; opcode value is $4C (JMP absolute). Terms: $0310, JMP, opcode $4C, USR, 6510.

**Description**
$0310 is reserved for the first byte (the opcode) of the machine-language JMP used by the BASIC USR function. On the 6510/6502, the absolute JMP instruction is three bytes long: opcode $4C followed by a 16-bit little-endian address (low byte then high byte). The opcode byte (JMP absolute) is placed at $0310; the target address bytes are stored in the following two locations: $0311 (low byte) and $0312 (high byte).

By default, after a cold start (power-on or reset), the address at $0311–$0312 points to $B248 (45640 decimal), which contains a routine that generates an ?ILLEGAL QUANTITY ERROR. ([c64-wiki.com](https://www.c64-wiki.com/wiki/USR?utm_source=openai))

To redirect the USR function to a user-defined machine language routine, POKE statements can be used to set the desired address in $0311–$0312. ([commodore.ca](https://www.commodore.ca/wp-content/uploads/2018/11/c64-programmers_reference_guide-02-basic_language_vocabulary.pdf?utm_source=openai))

## Key Registers
- $0310 - RAM - First byte (opcode) of the 6510 JMP absolute instruction used by BASIC USR
- $0311 - RAM - Low byte of the target address for the JMP instruction used by BASIC USR
- $0312 - RAM - High byte of the target address for the JMP instruction used by BASIC USR

## References
- "usradd_and_parameter_passing" — expands on USR address vector and how USR jumps to user routine
- ([c64-wiki.com](https://www.c64-wiki.com/wiki/USR?utm_source=openai))
- ([commodore.ca](https://www.commodore.ca/wp-content/uploads/2018/11/c64-programmers_reference_guide-02-basic_language_vocabulary.pdf?utm_source=openai))

## Mnemonics
- JMP
