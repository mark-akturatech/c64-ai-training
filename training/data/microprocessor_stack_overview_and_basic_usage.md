# 6510 Stack Area and Microsoft BASIC Usage ($0100-$01FF)

**Summary:** Description of the 6510 microprocessor hardware stack area at $0100-$01FF, Stack Pointer/LIFO behavior, overflow/underflow effects, and how Microsoft BASIC reserves and uses subregions (floating-point work area, BAD tape error log, and the runtime stack). Includes byte layouts pushed by BASIC for FOR, GOSUB and DEF.

## Overview
Locations $0100-$01FF (decimal 256–511) are the 6510 microprocessor hardware stack (LIFO). The Stack Pointer (SP) tracks the last stack location used; the first byte pushed goes at $01FF and subsequent pushes decrement the pointer toward $0100. Popping increments the pointer. Pushing more than 256 bytes wraps the pointer and causes stack overflow behavior; popping past what was pushed causes underflow — both typically lead to system failure until reset.

Uses:
- CPU return addresses for JSR and interrupt vectors.
- Saving internal registers (e.g., P, A, X, Y during interrupts/BRK).
- Temporary storage available to the programmer (but must avoid colliding with system/BASIC/Kernal use).

Microsoft BASIC and the Kernal use portions of this area for temporary workspace; BASIC also enforces available-stack checks (it returns OUT OF MEMORY if an operation would leave fewer than 62 free bytes for its needs).

## BASIC stack subregions (Microsoft BASIC)
BASIC reserves parts of $0100-$01FF for its working storage and tape error logging; the remainder is used as the hardware stack.

- $0100-$010A — Work area for floating-point to string conversions and string scanning (temporary workspace used during numeric formatting and parsing).
- $0100-$013E — BAD (Tape Input Error Log): 62 bytes that record which bytes in a tape block were received incorrectly on the first read (each tape block is stored twice; this index allows correction on the second pass). Note: this range overlaps the FP work area; both ranges are specified by the source.
- $013F-$01FF — Exclusive hardware stack area for microprocessor pushes/pops and BASIC/Kernal use. BASIC requires at least 62 bytes free; FOR-NEXT and other constructs push sizable entries.

## BASIC stack entry formats (what BASIC pushes)
BASIC pushes structured entries onto the hardware stack. Entries are popped in LIFO order.

- FOR entry (18 bytes total). Popped in this order:
  1. 1 byte: constant $81 (decimal 129)
  2. 2 bytes: pointer to the address of the loop variable (variable pointer)
  3. 5 bytes: floating-point representation of the TO value (5-byte FP format used by Microsoft BASIC)
  4. 2 bytes: line number to RETURN to after a NEXT
  5. 2 bytes: address (pointer) of the next character in the program line after the FOR statement

- GOSUB entry (5 bytes total). Popped in this order:
  1. 1 byte: constant $8D (decimal 141)
  2. 2 bytes: line number of the statement to which RETURN will transfer control
  3. 2 bytes: pointer to the BASIC program text for that RETURN statement

- DEF entry (5 bytes total). Same structure as GOSUB except the first byte is a dummy value (first byte has no defined significance); the remaining 4 bytes match the GOSUB layout (2-byte return line number, 2-byte pointer to program text).

## Source Code
```text
Memory map (decimal / hex)
256-511       $0100-$01FF    Microprocessor stack area (6510)
256-266       $0100-$010A    Work area: floating-point -> ASCII conversions, string scanning
256-318       $0100-$013E    BAD: Tape input error log (62 bytes) - indices for first-read errors
319-511       $013F-$01FF    Reserved exclusively for the 6510 hardware stack (BASIC/Kernal usage)

BASIC stack entry layouts (byte order as they are popped from the stack):

FOR entry (18 bytes, popped in this order)
Byte 0    : $81                    ; constant (129)
Byte 1-2  : 2-byte pointer to variable address
Byte 3-7  : 5-byte floating-point "TO" value (Microsoft BASIC 5-byte FP)
Byte 8-9  : 2-byte line number to RETURN to after NEXT
Byte 10-11: 2-byte pointer to next character in program line after FOR

GOSUB entry (5 bytes, popped in this order)
Byte 0    : $8D                    ; constant (141)
Byte 1-2  : 2-byte return line number
Byte 3-4  : 2-byte pointer to BASIC program text for RETURN

DEF entry (5 bytes, popped in this order)
Byte 0    : dummy byte (value not significant)
Byte 1-2  : 2-byte return line number
Byte 3-4  : 2-byte pointer to BASIC program text for RETURN
```

## Key Registers
- $0100-$01FF - RAM - 6510 hardware stack area (microprocessor stack, BASIC/Kernal workspace)
- $0100-$010A - RAM - BASIC work area: floating-point to string conversions
- $0100-$013E - RAM - BAD: Tape input error log indices (62 bytes)
- $013F-$01FF - RAM - Exclusive hardware stack region (BASIC stack entries, system/Kernal use)

## References
- "basic_kernal_working_storage_and_buf_input_buffer" — expands on BASIC and Kernal working storage and the BUF input buffer