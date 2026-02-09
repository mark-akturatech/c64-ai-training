# C64 RAM Map — Stack Area $0100-$01FF

**Summary:** Describes the 6510 CPU hardware stack at $0100-$01FF (Stack Pointer, LIFO behavior, wrap-around/overflow), the Microsoft BASIC usage and reserved Tape Input Error Log at $0100-$013E, and BASIC stack usage sizes for FOR, GOSUB and DEF entries.

## Stack organization
The 6510 CPU uses $0100-$01FF (decimal 256–511) as its hardware stack. The stack is a descending LIFO structure: the first byte pushed goes to $01FF and subsequent pushes decrease the address toward $0100. The Stack Pointer register tracks the current top of stack. If more than 256 pushes occur the pointer wraps and an overflow results; conversely excessive pops cause underflow — both typically leave the system unstable.

The stack stores return addresses for JS/RTS and interrupt vectors and is used to save internal registers. The Kernal and BASIC routines make heavy use of the stack; BASIC (Microsoft BASIC on the C64) reserves part of the stack for its own temporary work area and enforces a minimum free-stack requirement (62 bytes) before allowing operations that would consume more stack.

A 62-byte subregion at the base of the stack ($0100-$013E) is used as a Tape Input Error Log (indices of bytes in a tape block that failed on first transmission). The remainder ($013F-$01FF) is used exclusively for general microprocessor stack activity and BASIC stack entries.

For exact byte layouts (FOR, GOSUB, DEF entries) and the tape-error-log range, see the Source Code section below.

## Source Code
```text
$0100-$01FF  Microprocessor Stack Area (decimal 256-511)
             CPU hardware stack (descending, LIFO). Pushes start at $01FF down to $0100.
             Overflow: Stack Pointer wraps after 256 pushes -> system error/instability.
             Underflow: Popping more than pushed -> system error/instability.

$0100-$013E  Tape Input Error Log (62 bytes)
             Each tape block is transmitted twice. These 62 bytes are indices marking
             which bytes in the tape block failed during first transmission so corrections
             can be made on the second pass.

$013F-$01FF  Microprocessor stack area used by BASIC/Kernal
             BASIC requires at least 62 bytes of available stack memory; otherwise operations
             that would consume stack space return OUT OF MEMORY.

BASIC stack entry sizes and contents (reference):

- FOR statement: 18 bytes pushed per FOR.
  Order (bytes popped in reverse):
    1) 1 byte constant $81 (129)
    2) 2-byte pointer to variable address (subject variable pointer)
    3) 5-byte floating-point representation of TO value
    4) 2-byte line number to RETURN to after NEXT
    5) 2-byte pointer to address of next character in line after the FOR statement

- GOSUB: 5 bytes pushed
  Contents:
    1) 1-byte constant $8D (141)
    2) 2-byte line number to RETURN to after subroutine
    3) 2-byte pointer to BASIC program text address for that RETURN statement

- DEF: 5 bytes pushed (same layout as GOSUB)
  Contents:
    1) 1-byte dummy value (value not significant)
    2) 2-byte line number to RETURN to
    3) 2-byte pointer to BASIC program text address for that RETURN statement
```

## Key Registers
- $0100-$01FF - CPU - Microprocessor hardware stack area (descending LIFO)
- $0100-$013E - CPU - Tape Input Error Log (62 bytes)
- $013F-$01FF - CPU - Stack area reserved for BASIC/Kernal usage (BASIC minimum 62 bytes free)

## References
- "C64 RAM Map (Mapping The Commodore 64)" — overall memory map entries for C64 RAM regions