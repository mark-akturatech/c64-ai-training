# C64 ROM $E422 — Print startup banner and initialize BASIC memory pointers

**Summary:** Initializes BASIC memory pointers ($002B/$002C start, $0037/$0038 end), checks available memory via $A408, computes and prints the free bytes (uses $BDCD to print XA as an unsigned integer), prints the startup strings (JSR $AB1E for null-terminated strings), and jumps to the NEW/CLEAR/RESTORE entry at $A644.

## Description
This ROM routine runs at cold start to present the "**** COMMODORE 64 BASIC V2 ****" banner and the " BYTES FREE" message and to prepare the BASIC program memory area.

Step-by-step behavior:
- Load the BASIC program start pointer (low/high) from zero page $002B/$002C.
- JSR $A408 — checks available memory and performs an out-of-memory error if there is insufficient room for BASIC.
- Set up a pointer to the startup banner string at $E473 (LDA #$73 / LDY #$E4) and JSR $AB1E to print a null-terminated string (print routine expects a zero-terminated string).
- Compute free bytes: subtract start ($002B/$002C) from end ($0037/$0038). The low-byte subtraction is done with SEC / SBC, result moved to X (TAX). The high-byte subtraction stores its result in A. JSR $BDCD prints XA as an unsigned integer (routine prints the two-byte unsigned value represented by X (low) and A (high)).
- Set up a pointer to the " BYTES FREE" string at $E460 (LDA #$60 / LDY #$E4) and JSR $AB1E to print it.
- JMP $A644 to continue into the NEW/CLEAR/RESTORE entry and return into the BASIC prompt initialization.

Notes:
- String printing is performed by $AB1E which expects a null-terminated string (zero terminator).
- The free-byte value printed is the 16-bit difference (end - start); low byte placed in X, high byte left in A before calling the print routine.

## Source Code
```asm
                                *** print the start up message and initialise the memory pointers
.,E422 A5 2B    LDA $2B         get the start of memory low byte
.,E424 A4 2C    LDY $2C         get the start of memory high byte
.,E426 20 08 A4 JSR $A408       check available memory, do out of memory error if no room
.,E429 A9 73    LDA #$73        set "**** COMMODORE 64 BASIC V2 ****" pointer low byte
.,E42B A0 E4    LDY #$E4        set "**** COMMODORE 64 BASIC V2 ****" pointer high byte
.,E42D 20 1E AB JSR $AB1E       print a null terminated string
.,E430 A5 37    LDA $37         get the end of memory low byte
.,E432 38       SEC             set carry for subtract
.,E433 E5 2B    SBC $2B         subtract the start of memory low byte
.,E435 AA       TAX             copy the result to X
.,E436 A5 38    LDA $38         get the end of memory high byte
.,E438 E5 2C    SBC $2C         subtract the start of memory high byte
.,E43A 20 CD BD JSR $BDCD       print XA as unsigned integer
.,E43D A9 60    LDA #$60        set " BYTES FREE" pointer low byte
.,E43F A0 E4    LDY #$E4        set " BYTES FREE" pointer high byte
.,E441 20 1E AB JSR $AB1E       print a null terminated string
.,E444 4C 44 A6 JMP $A644       do NEW, CLEAR, RESTORE and return
```

## Key Registers
- $002B-$002C - Zero page - BASIC program start pointer (low/high)
- $0037-$0038 - Zero page - BASIC program end pointer (low/high)
- $A408 - ROM routine - Check available memory (produces out-of-memory error if insufficient)
- $AB1E - ROM routine - Print null-terminated string
- $BDCD - ROM routine - Print XA as unsigned integer (uses X = low, A = high)
- $A644 - ROM entry - NEW/CLEAR/RESTORE entry point (jumped to at end)

## References
- "basic_warm_and_cold_start_initialisation" — expands on cold start behavior (banner, memory info)