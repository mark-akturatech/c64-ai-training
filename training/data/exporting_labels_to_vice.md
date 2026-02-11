# Kick Assembler: VICE .vs export and Opcode Constants

**Summary:** Explains Kick Assembler's option to export labels to a VICE-readable .vs symbol file and the assembler's opcode constant naming convention (mnemonic + addressing mode) used for self-modifying code and unrolled speed code.

**VICE symbol export**
Kick Assembler can export assembly labels and symbols into a VICE-readable ".vs" symbol file so that the VICE emulator (Commodore 64 emulator) can show symbols during debugging. The option is invoked on the command line when running the Kick Assembler JAR; the source shows the example invocation:

- `java -jar KickAss.jar source1.asm -vicesymbols`

The correct syntax uses a single dash (`-vicesymbols`), as specified in the [Kick Assembler Manual](https://www.theweb.dk/KickAssembler/webhelp/content/ch12s07.html).

**Opcode Constants**
Kick Assembler provides constants for all 6502 opcodes to make writing self-modifying code or tight unrolled speed code easier. The naming convention for these constants is:
- Write the mnemonic in uppercase, and append the addressing mode identifier.

For example, the constant for an `rts` command is `RTS`. To place an `rts` command at a target location, you write:


This information is detailed in the [Kick Assembler Manual](https://www.theweb.dk/KickAssembler/webhelp/content/ch14s03.html).

## Source Code

```assembly
    lda #RTS
    sta target
```


## References
- [Kick Assembler Manual: Exporting Labels to VICE](https://www.theweb.dk/KickAssembler/webhelp/content/ch12s07.html)
- [Kick Assembler Manual: Opcode Constants](https://www.theweb.dk/KickAssembler/webhelp/content/ch14s03.html)

## Mnemonics
- RTS
