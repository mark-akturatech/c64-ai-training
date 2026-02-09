# ca65: Command line options (section 2.2)

**Summary:** Introduction to the ca65 assembler's command-line options; indicates that a detailed description of every ca65 command-line switch follows and points to related subtopics (bin_include_dir, cpu_type_and_supported_cpus).

**Overview**

This section provides a comprehensive list of ca65 command-line options, detailing their syntax, semantics, default values, precedence rules, and interactions. It also references two specific subtopics for further details:

- **bin_include_dir**: Discusses the binary include directory option.
- **cpu_type_and_supported_cpus**: Explores the CPU selection option and the list of supported CPUs.

**Command Line Options**

Below is a detailed description of all the command-line options available in ca65:

- **`-D name[=value]`**: Define a symbol with an optional value. If no value is provided, the symbol is set to 1.

- **`-I dir`** or **`--include-dir dir`**: Add a directory to the include file search path. This option can be used multiple times to specify multiple directories. The current directory is always searched first.

- **`-U`** or **`--auto-import`**: Mark unresolved symbols as imported. This delays error messages about undefined symbols until the linking stage.

- **`-V`** or **`--version`**: Print the assembler version and exit.

- **`-W n`**: Set the warning level to `n`. Higher values increase the verbosity of warnings.

- **`-g`** or **`--debug-info`**: Include debug information in the object file.

- **`-h`** or **`--help`**: Display help information and exit.

- **`-i`** or **`--ignore-case`**: Make the assembler case-insensitive for symbols and labels.

- **`-l name`** or **`--listing name`**: Generate a listing file with the specified name if the assembly is successful.

- **`-o name`**: Specify the name of the output file.

- **`-s`** or **`--smart`**: Enable smart mode, allowing the assembler to make certain optimizations.

- **`-t sys`** or **`--target sys`**: Set the target system. This affects default settings like CPU type and memory model.

- **`-v`** or **`--verbose`**: Increase verbosity. This option can be used multiple times for more detailed output.

- **`--bin-include-dir dir`**: Add a directory to the search path for binary include files. This option can be used multiple times. The current directory is always searched first.

- **`--color [on|auto|off]`**: Control the use of colors in diagnostic messages. The default is `auto`, which enables colors if the output is to a terminal.

- **`--cpu type`**: Set the default CPU type. Supported types include:

  - `6502`: NMOS 6502 (all legal instructions)
  - `6502X`: NMOS 6502 with all undocumented instructions
  - `6502DTV`: Emulated CPU of the C64DTV device
  - `65SC02`: First CMOS instruction set (no bit manipulation, no WAI/STP)
  - `65C02`: CMOS with Rockwell extensions
  - `W65C02`: Full CMOS instruction set (includes bit manipulation and WAI/STP)
  - `65816`: CPU of the SNES and SuperCPU
  - `HuC6280`: CPU of the PC Engine
  - `4510`: CPU of the Commodore C65
  - `45GS02`: CPU of the Commodore MEGA65
  - `M740`: Microcontroller by Mitsubishi

- **`--create-dep name`**: Generate a makefile dependency file with the specified name.

- **`--create-full-dep name`**: Generate a full makefile dependency file, including files passed via debug information.

- **`--debug`**: Enable debug mode.

- **`--expand-macros`**: Expand macros in the listing file. Repeating this option increases the level of expansion.

- **`--feature name`**: Enable an emulation feature. This is equivalent to using the `.FEATURE` directive in the source code. Feature names must be in lowercase, and each feature requires a separate `--feature` option.

- **`--forget-inc-paths`**: Forget the built-in include paths. Useful when building customized assembler modules where standard header files should be ignored.

- **`--large-alignment`**: Suppress warnings about large alignments.

- **`--list-bytes n`**: Set the maximum number of bytes per line in the listing file. A value of 0 allows an unlimited number of bytes.

- **`--memory-model model`**: Set the memory model.

- **`--no-utf8`**: Disable the use of UTF-8 in diagnostics.

- **`--pagelength n`**: Set the page length for the listing file.

- **`--relax-checks`**: Relax certain checks. Refer to the documentation for specifics.

- **`--segment-list`**: Generate segment offsets in the listing file.

- **`--warn-align-waste`**: Generate warnings when alignment requirements cause emission of fill bytes.

- **`--warnings-as-errors`**: Treat warnings as errors.

**Option Precedence and Interaction Rules**

- **Include Directories**: The current directory is always searched first for include files, followed by directories specified with `-I` or `--include-dir` options, in the order they appear on the command line.

- **Binary Include Directories**: Similar to include directories, the current directory is searched first, followed by directories specified with `--bin-include-dir`, in the order they appear.

- **CPU Type**: The `--cpu` option sets the default CPU type. This can be overridden within the source code using the `.SETCPU` directive.

- **Feature Enabling**: Features enabled with `--feature` can also be enabled within the source code using the `.FEATURE` directive. Command-line options take precedence over source code directives.

**Environment Variables and Configuration Files**

- **Include Path Environment Variable**: The environment variable `CA65_INC` can be set to specify additional directories to search for include files. These directories are searched after those specified with `-I` or `--include-dir`.

- **Configuration Files**: ca65 does not natively support configuration files for command-line options. All configurations must be specified via command-line options or within the source code.

**Detailed Expansion for `bin_include_dir`**

The `--bin-include-dir` option specifies directories to search for binary include files used with the `.incbin` directive. The search order is:

1. The current directory.
2. Directories specified with `--bin-include-dir`, in the order they appear on the command line.

Both relative and absolute paths can be used. Relative paths are interpreted relative to the current working directory at the time of assembler invocation.

**Detailed Expansion for `cpu_type_and_supported_cpus`**

The `--cpu` option sets the default CPU type for the assembler. Supported CPU types and their features include:

- **`6502`**: Supports all legal instructions of the NMOS 6502.

- **`6502X`**: Extends `6502` support to include all undocumented instructions.

- **`6502DTV`**: Supports the emulated CPU of the C64DTV device, including specific additional instructions.

- **`65SC02`**: Supports the first CMOS instruction set, excluding bit manipulation and WAI/STP instructions.

- **`65C02`**: Extends `65SC02` with Rockwell's bit manipulation instructions.

- **`W65C02`**: Further extends `65C02` with WAI and STP instructions.

- **`65816`**: Supports the 16-bit CPU used in the SNES and SuperCPU, including all `W65C02` instructions plus additional 16-bit operations.

- **`HuC6280`**: Supports the CPU of the PC Engine, which includes all `65C02` instructions plus additional ones like `SXY` and `CLX`.

- **`4510`**: Supports the CPU of the Commodore C65, based on the `65CE02` with additional features like a memory management unit.

- **`45GS02`**: Supports the CPU of the Commodore MEGA65, an enhanced version of the `4510`.

- **`M740`**: Supports the Mitsubishi microcontroller, a variant of the `6502` with additional instructions.

**Examples of Combining Options**

- **Assembling with a Specific CPU and Include Directory**:


  This command assembles `source.s` for the 65816 CPU, searching for include files in `/path/to/includes` and the current directory.

- **Generating a Listing with Macro Expansion**:


  This assembles `source.s`, generates a listing file `output.lst`, and includes macro expansions in the listing.

- **Setting Multiple Include Directories and Enabling a Feature**:


  This command sets two include directories and enables the `string_escapes` feature during the assembly of `source.s`.

## Source Code

  ```sh
  ca65 --cpu 65816 --include-dir /path/to/includes source.s
  ```

  ```sh
  ca65 --listing output.lst --expand-macros source.s
  ```

  ```sh
  ca65 -I /path/to/includes1 -I /path/to/includes2 --feature string_escapes source.s
  ```


## References

- [ca65 Users Guide](https://cc65.github.io/doc/ca65.html)
- [Supported CPUs in ca65](https://cc65.github.io/doc/cpus.html)