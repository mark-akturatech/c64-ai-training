# ca65 -t, --target (set target system for character-set translation)

**Summary:** The ca65 assembler option -t / --target selects a target system so that character strings and character constants are translated into that system's character set; the default is "none" (no translation). Selecting a target may also set a default CPU type, which can be overridden with --cpu.

**Description**
-t sys, --target sys
- Selects the target system used by the assembler.
- Enables translation of character strings and character constants into the character set of the chosen target platform.
- Default target: "none" — no translation occurs.
- The assembler supports the same set of targets as the compiler (see compiler documentation for the list).

**Behavior**
- Character translation affects literal strings and character constants produced by the assembler; the chosen target determines the mapping used for translation.
- Some targets imply a sensible default CPU type for generated code or assembler behavior; when a target sets a default CPU, that default can be overridden explicitly with the --cpu option.
- No translation or CPU default is applied when the target is "none".

**Supported Target Systems and Character-Set Mappings**

The ca65 assembler supports various target systems, each with its own character-set mapping. Below is a list of supported targets and their corresponding character sets:

- **c64**: PETSCII
- **c128**: PETSCII
- **c16**: PETSCII
- **plus4**: PETSCII
- **cbm510**: PETSCII
- **cbm610**: PETSCII
- **apple2**: Apple II character set
- **apple2enh**: Apple II enhanced character set
- **atari**: ATASCII
- **atarixl**: ATASCII
- **atari2600**: ATASCII
- **atari5200**: ATASCII
- **atari7800**: ATASCII
- **atmos**: Oric Atmos character set
- **bbc**: BBC Micro character set
- **geos**: GEOS character set
- **geos-apple**: GEOS character set for Apple
- **geos-cbm**: GEOS character set for Commodore
- **kim1**: KIM-1 character set
- **cx16**: Commander X16 character set
- **gamate**: Gamate character set
- **creativision**: CreatiVision character set

*Note: The "none" target implies no character translation.*

**Target Systems and Default CPU Types**

When a target system is specified, ca65 may set a default CPU type. The following table outlines the default CPU types for each target:

- **c64**: 6502
- **c128**: 8502
- **c16**: 7501
- **plus4**: 7501
- **cbm510**: 6502
- **cbm610**: 6509
- **apple2**: 6502
- **apple2enh**: 65C02
- **atari**: 6502
- **atarixl**: 6502
- **atari2600**: 6507
- **atari5200**: 6502
- **atari7800**: 6502
- **atmos**: 6502
- **bbc**: 6502
- **geos**: 6502
- **geos-apple**: 6502
- **geos-cbm**: 6502
- **kim1**: 6502
- **cx16**: 65C02
- **gamate**: 6502
- **creativision**: 6502

*Note: The default CPU type can be overridden using the --cpu option.*

**Character Translation Details**

Character translation in ca65 involves converting literal strings and character constants from the source character set (typically ISO-8859-1) to the target system's character set. The translation process includes:

- **Control Characters**: Mapped to their equivalents in the target character set.
- **Printable ASCII Characters (0x20 to 0x7E)**: Translated to corresponding characters in the target set.
- **High-Bit Characters (0x80 to 0xFF)**: Mapped based on the target system's character set, which may include graphical symbols or extended characters.

For characters that do not have a direct equivalent in the target character set, the assembler's behavior depends on the specific target and character. In some cases, unmapped characters may be replaced with a placeholder or omitted, and a warning may be issued during assembly.

**Examples**

**Example 1: Character Translation**

Assembling a source file with a string constant for the Commodore 64:


Assemble with character translation for the C64:


In this case, the string "Hello, world!" is translated from ISO-8859-1 to PETSCII during assembly.

**Example 2: Overriding Default CPU with --cpu**

Assembling for the C64 target but specifying a different CPU:


Here, the target is set to C64 (which defaults to the 6502 CPU), but the --cpu option overrides this to use the 6502X CPU, enabling support for undocumented opcodes.

## Source Code

```assembly
; hello.s
.segment "CODE"
    .asciiz "Hello, world!"
```

```sh
ca65 -t c64 hello.s
```

```sh
ca65 -t c64 --cpu 6502X hello.s
```


## References
- [ca65 Users Guide](https://cc65.github.io/doc/ca65.html)
- [cc65 Compiler Intro](https://cc65.github.io/doc/intro.html)
- [Defining a Custom cc65 Target](https://cc65.github.io/doc/customizing.html)