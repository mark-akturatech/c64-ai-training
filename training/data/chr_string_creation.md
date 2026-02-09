# CHR$() — single-byte string creation (C64 ROM)

**Summary:** Implements CHR$() by evaluating a byte expression (JSR $B7A1, result in X), saving the character, allocating a one-byte string (JSR $B47D with A=#$01), storing the byte into the allocated string via STA ($62),Y, and jumping to $B4CA to check descriptor-stack space and push the new string descriptor.

## Description
This ROM routine performs the CHR$() function for a single-byte result:

- JSR $B7A1 evaluates the byte expression. On return the byte value is in X (6502 X register).
- TXA / PHA copy and save the character to the CPU stack while the allocator is called.
- LDA #$01 sets A to 1 (string length = 1) which is the parameter for the string allocation routine.
- JSR $B47D allocates A bytes of string space; allocation uses the value in A and returns with the newly allocated string address pointed to by an indirect zero-page pointer (used below).
- PLA restores the saved character into A.
- LDY #$00 clears Y for a zero offset.
- STA ($62),Y stores the byte into the newly allocated string buffer. (The comment "byte IS string" indicates single byte string content.)
- Two PLA instructions are used to pop two bytes — the comment notes this dumps the return address to skip a type check on the call chain.
- JMP $B4CA transfers control to the descriptor-stack handler which checks available space on the descriptor stack and then pushes the descriptor (address + length) for the created string.

Notes:
- The routine relies on the byte-evaluator returning its value in X and on the allocator JSR $B47D accepting the desired length in A.
- STA ($62),Y uses the zero-page pointer at $62 as the base address for storing into the allocated string. The ROM convention for where the allocator leaves the string pointer is used here.
- The final jump to $B4CA centralizes descriptor-stack checks and the actual push of the (address,length) descriptor.

## Source Code
```asm
.,B6EC 20 A1 B7 JSR $B7A1       ; evaluate byte expression, result in X
.,B6EF 8A       TXA             ; copy X to A
.,B6F0 48       PHA             ; save character
.,B6F1 A9 01    LDA #$01        ; string is single byte
.,B6F3 20 7D B4 JSR $B47D       ; make string space A bytes long
.,B6F6 68       PLA             ; get character back
.,B6F7 A0 00    LDY #$00        ; clear index
.,B6F9 91 62    STA ($62),Y     ; save byte in string - byte IS string!
.,B6FB 68       PLA             ; dump return address (skip type check)
.,B6FC 68       PLA             ; dump return address (skip type check)
.,B6FD 4C CA B4 JMP $B4CA       ; check space on descriptor stack then put string address
                                ; and length on descriptor stack and update stack pointers
```

## Key Registers
(omitted — this chunk does not reference C64 hardware registers)

## References
- "descriptor_stack_check_and_cleanup" — ensures descriptor stack has room for pushed descriptor and performs push/update
- "byte_parameter_parsing_and_evaluation" — details the byte-expression evaluator (JSR $B7A1)