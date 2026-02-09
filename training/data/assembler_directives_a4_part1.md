# Kick Assembler — Appendix A.4: Assembler directives (part 1)

**Summary:** Reference list of Kick Assembler directives and concise examples: origin setting (*=$1000), data emitters (.byte/.dw/.dword/.by), control directives (.if/.for/.function/.define/.assert/.asserterror), file/output directives (.file/.filemodify/.filenamespace/.disk), assembler options (.cpu/.encoding/.enum/.const), and utility directives (.fill/.fillword/.eval/.error/.errorif/.break/.import). Includes example usages for each directive.

## Directives
The following entries preserve the directive name, example syntax, and description.

- Origin
  - Example: *= $1000
  - Description: Set the current assembly origin (program counter).

- .align
  - Example: .align $100
  - Description: Align the output to a specified byte boundary. `.align $100` aligns to the next 256-byte page boundary; `.align $10` aligns to the next 16-byte boundary.

- .assert
  - Example: .assert "Code at correct address", *, $1000
  - Description: Assert a condition at assembly time. Takes a description string, the expression to test, and the expected value. Assembly fails if the assertion is false.

- .asserterror
  - Example: .asserterror { .byte 256 }
  - Description: Assert that the enclosed code block produces an assembly error. Useful for testing that invalid input is properly rejected.

- .break
  - Example: .break
  - Description: Define a breakpoint (debugging aid). When used with a compatible debugger/emulator, inserts a breakpoint at this address.

- .by
  - Example: .by 1,2,3
  - Description: Alias for .byte (emit bytes).

- .byte
  - Example: .byte 0,$FF,"ABC"
  - Description: Output raw bytes. Accepts decimal, hex, and string literals.

- .const
  - Example: .const SCREEN = $0400
  - Description: Define a constant value. Constants cannot be reassigned after definition.

- .cpu
  - Example: .cpu _65c02
  - Description: Change selected CPU instruction set (affects available mnemonics and encoding). Common values: _6502, _65c02, _6502NoIllegals, _dtv.

- .define
  - Example: .define val { .byte 1,2,3 }
  - Description: Execute a block in function/define mode. Used for defining reusable blocks and conditional compilation.

- .disk
  - Example: .disk [filename="game.d64", name="GAME DISK", id="01"] { [name="GAME", type="prg", segments="Code,Data"] }
  - Description: Create a D64 disk image containing one or more files from named segments.

- .dw / .dword
  - Example: .dw $12345678
  - Description: Output 4-byte (32-bit) double-word values in little-endian order.

- .encoding
  - Example: .encoding "screencode_upper"
  - Description: Sets the character encoding for string literals. Built-in encodings include "screencode_mixed", "screencode_upper", "petscii_mixed", "petscii_upper", "ascii".

- .enum
  - Example: .enum { on, off, standby }
  - Description: Defines a series of auto-incrementing constants starting from 0. Values can also be explicitly assigned: `.enum { red=1, green=2, blue=4 }`.

- .error
  - Example: .error "not good!"
  - Description: Create a user-raised error that halts assembly.

- .errorif
  - Example: .errorif x>10 "not good!"
  - Description: Create a user-raised error if the condition evaluates true; assembly continues if false.

- .eval
  - Example: .eval x = x + y / 2
  - Description: Evaluate a script expression at assembly time. Used for variable assignments and computations.

- .file
  - Example: .file [name="myfile.prg", segments="Code, Data"]
  - Description: Create a PRG or BIN output file from the given segments. Used with the segment/file output system.

- .filemodify
  - Example: .filemodify Encrypt(33)
  - Description: Modify the output of the current source file with the given modifier plugin (e.g. encryption, compression).

- .filenamespace
  - Example: .filenamespace myspace
  - Description: Create a namespace for all labels and symbols in the current source file. Labels are accessed as `myspace.labelName` from other files.

- .fill
  - Example: .fill 10, i*2
  - Description: Fill a number of bytes with the value of a given expression. The variable `i` iterates from 0 to count-1. `.fill 256, 0` fills 256 zero bytes.

- .fillword
  - Example: .fillword 10, i*$102
  - Description: Fill a number of 16-bit words with the value of a given expression. Each value is output as two bytes (little-endian).

- .for
  - Example: .for(var i=0; i<10; i++) { .byte i }
  - Description: Create a for-loop that repeats the enclosed block. Loop variables are declared with `var`.

- .function
  - Example: .function area(h,w) { return h*w }
  - Description: Define a function that returns a value. Can be called in expressions: `area(3,4)`.

- .if
  - Example: .if(x>10) { .byte 1 } else { .byte 0 }
  - Description: Conditionally assemble code if the given expression is true. Supports `.else` and `.elif` clauses.

- .import binary
  - Example: .import binary "sprites.bin"
  - Description: Import a binary file into the current output at the current program counter. Optional parameters: `.import binary "file.bin", offset, length` to import a subset of the file.

## Source Code
```asm
* = $1000

.align $100
.assert "PC check", *, $1100
.asserterror { .byte 256 }
.break
.by 1,2,3
.byte 0,$FF,"ABC"
.const SCREEN = $0400
.cpu _65c02
.define val { .byte 1,2,3 }
.disk [filename="game.d64", name="GAME DISK", id="01"] {
    [name="GAME", type="prg", segments="Code"]
}
.dw $12345678
.encoding "screencode_upper"
.enum { on, off, standby }
.error "not good!"
.errorif x>10 "not good!"
.eval x = x + y / 2
.file [name="myfile.prg", segments="Code, Data"]
.filemodify Encrypt(33)
.filenamespace myspace
.fill 10, i*2
.fillword 10, i*$102
.for(var i=0; i<10; i++) { .byte i }
.function area(h,w) { return h*w }
.if(x>10) { .byte 1 } else { .byte 0 }
.import binary "sprites.bin"
```

## References
- "assembler_directives_a4_part2" — continues the directive list (part 2)
- "mnemonics_65c02_a3_4" — details which CPU/mnemonic sets .cpu can select
