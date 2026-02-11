# MACHINE - USR function vs SYS command

**Summary:** SYS executes a literal numeric address as a machine-code subroutine; USR calls the address stored in the BASIC USR vector and is evaluated as a function. USR passes its numeric argument in the BASIC floating accumulator (PET: $005E-$0063, VIC/C64/PLUS4: $0061-$0066) and expects a result returned there.

**Overview**
SYS is a BASIC command: `SYS <address>` jumps to the given numeric (literal) address and executes machine code as a subroutine. USR is a BASIC function: `USR(expression)` evaluates `expression`, places the value into the BASIC floating-point accumulator, then calls the machine-code routine whose entry address is taken from the USR vector. Because USR is a function, you must use it in an expression (for example, `PRINT USR(0)` or `X = USR(0)`); typing `USR(0)` alone is a syntax error.

The USR vector is a two-byte pointer that BASIC consults to find the machine-code entry point for `USR()`. On many Commodore/PET/CBM machines, the vector occupies addresses $0001-$0002 (zero page). On the Commodore 64, the BASIC USR vector is at $0311-$0312 (low byte, high byte).

**Calling convention (BASIC <-> machine code)**
- **Argument passing:** Whatever numeric value appears inside `USR(...)` is computed by BASIC and converted/placed into the BASIC floating-point accumulator immediately before the USR call.
- **Result returning:** The machine-code routine should place its numeric result into the floating-point accumulator before returning; BASIC will read the accumulator and return that value as the `USR()` function result.
- **Floating accumulator locations:**
  - PET/CBM systems: $005E-$0063 (floating accumulator bytes)
  - VIC-20, C64, PLUS/4: $0061-$0066 (floating accumulator bytes)
- **Floating-point format:** BASIC uses its internal floating-point format for the accumulator (see BASIC variable tables). Because the representation is nontrivial, many programmers prefer to pass simple integers via POKE/PEEK or use integer variables instead of using the floating accumulator directly.

## Key Registers
- $0001-$0002 - PET/CBM BASIC - USR vector (low/high)
- $0311-$0312 - Commodore 64 BASIC - USR vector (low/high)
- $005E-$0063 - PET/CBM BASIC - floating-point accumulator (argument/result)
- $0061-$0066 - VIC-20 / C64 / PLUS/4 BASIC - floating-point accumulator (argument/result)

## References
- "basic_variable_table_and_types" — expands on floating accumulator and variable formats when exchanging data

## Labels
- USR
- FAC
