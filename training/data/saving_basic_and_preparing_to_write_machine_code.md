# MACHINE — Options for development workflow

**Summary:** Describes two development workflows for a C64 program: saving the BASIC portion to tape/disk so BASIC and machine language (ML) can be refined independently, or assembling/loading the ML directly into memory (example uses ML assembled at $0880 in the monitor).

**Development workflow options**
- **Option A — Save BASIC to tape/disk:** Store the BASIC listing so you can reload it later; this lets you edit and test the BASIC portion independently of the machine code. Useful when the ML needs repeated refinement or separate versioning.
- **Option B — Assemble ML directly into memory:** Write the machine code straight into RAM using the machine-language monitor. This is faster for small, simple examples that likely won't require iterative fixes.

For this example, the authors choose Option B: the ML is assembled directly into memory at $0880 so the combined program can be tested immediately without saving the BASIC first.

## Source Code

To assemble the machine language code directly into memory at address $0880 using the Commodore 64's built-in machine language monitor, follow these steps:

1. **Enter the Monitor:**
   - If using the built-in monitor, type `MONITOR` in BASIC and press RETURN.
   - If using an external monitor like MONITOR$C000, load and start it with:
     ```
     LOAD "MONITOR$C000",8,1
     SYS 49152
     ```
     ([c64-wiki.com](https://www.c64-wiki.com/wiki/MONITOR%24C000%2C_MONITOR%248000_%28Commodore%29?utm_source=openai))

2. **Assemble the Code:**
   - Once in the monitor, use the `A` (Assemble) command to enter assembly instructions starting at address $0880. For example:
     ```
     A 0880 LDX #$00
     A 0882 LDA #$01
     A 0884 STA $D020
     A 0887 RTS
     ```
     This sequence loads the X register with 0, loads the accumulator with 1, stores the accumulator's value into the border color register ($D020), and returns from the subroutine. ([scribd.com](https://www.scribd.com/document/657116484/Jim-Butterfield-Machine-Language-for-the-Commodore-64-and-Other-Commodore-Computers-1984-Prentice-Hall-Publishing-Libgen-lc?utm_source=openai))

3. **Exit the Monitor:**
   - To return to BASIC, type `X` and press RETURN.

4. **Execute the Machine Code:**
   - In BASIC, execute the machine code with:
     ```
     SYS 2176
     ```
     (Since $0880 in hexadecimal equals 2176 in decimal.)

This process allows you to assemble and test machine language routines directly in memory without saving the BASIC program first, facilitating immediate testing and refinement.

## References
- "estimating_ml_location_and_sys_setup" — expands on the chosen ML start address ($0880) and system setup
- "extract_variable_bytes_and_prepare_for_shifts" — expands on assembling the ML code in the monitor starting at $0880
