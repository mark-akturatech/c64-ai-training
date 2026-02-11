# USR (BASIC) — call machine-language via two-byte pointer at $0311-$0312

**Summary:** USR(<numeric>) calls a user machine-language subroutine whose two-byte start address is stored at memory locations $0311-$0312 (decimal 785–786). The numeric argument and return value are passed via the BASIC floating‑point accumulator (FAC) starting at $0061 (decimal 97).

**Description**
Type: Floating-Point Function  
Format: USR(<numeric>)

Action: USR invokes a machine-language subroutine whose starting address is taken from the two-byte pointer at $0311-$0312. The caller must store (POKE) the low and high bytes of the target address into $0311 and $0312 before calling USR; otherwise BASIC reports ?ILLEGAL QUANTITY. The numeric argument given to USR is placed into the BASIC floating‑point accumulator (FAC) starting at $0061 so the assembler routine can read it. When the machine-language subroutine finishes, it must leave its result in the same FAC location; USR then returns that floating-point value to BASIC.

Notes:
- USR uses the pointer at $0311-$0312 (BASIC workspace). It does not perform a direct SYS jump; see SYS for direct jumps to machine code.
- The FAC is the standard BASIC floating-point accumulator area (5‑byte floating-point format beginning at $0061) used for numeric argument/return passing.

To set the USR function to call a machine-language routine located at a specific address, you need to store the address in memory locations 785 and 786. The address should be stored in little-endian format, meaning the low byte is stored first, followed by the high byte. For example, to set the USR function to call a routine at address 49152 ($C000 in hexadecimal), you would use the following POKE commands:


This sets the USR function to call the machine-language routine starting at address 49152. ([retroisle.com](https://retroisle.com/commodore/c64128/Articles/theusrfunction.php?utm_source=openai))

## Source Code

```basic
POKE 785, 0   : REM Store low byte of $C000
POKE 786, 192 : REM Store high byte of $C000
```

```basic
10 B = T * SIN(Y)
20 C = USR(B/2)
30 D = USR(B/3)
```

(Reference text: USR stores the <numeric> argument in the floating-point accumulator at location 97 for assembler access; the result returned by the machine subroutine should be placed back into that accumulator. The two-byte start address for the user routine must be placed into locations 785-786 before calling USR.)

## Key Registers
- $0311-$0312 - BASIC workspace (RAM) - two-byte pointer (low, high) to USR machine-code start address (decimal 785-786)
- $0061-$0065 - BASIC workspace (RAM) - floating-point accumulator (FAC) start (decimal 97-101); argument/result area for USR (5-byte FP)

## References
- "sys_statement" — SYS for direct jumps to machine code vs USR which uses pointer at 785-786

## Labels
- FAC
