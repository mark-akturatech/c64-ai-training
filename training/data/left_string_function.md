# LEFT$() implementation (C64 ROM, at $B700)

**Summary:** Disassembly and explanation of the Commodore 64 ROM routine implementing LEFT$(), showing calls and stack/zero-page usage: JSR $B761, CMP/indirect ($50),Y, JSR $B47D (allocate), JSR $B6AA (pop descriptor), JSR $B68C (copy), JMP $B4CA (return descriptor on stack).

## Operation
This routine implements the LEFT$(string, n) primitive by pulling a string descriptor and the byte parameter n from the calling stack, clamping n to the source string length, allocating a target string of length n, adjusting the source pointer by the start offset (default 0), copying n bytes into the utility/string area, and finally returning the resulting descriptor on the descriptor stack.

Key behaviors:
- Entry: JSR $B761 (pull string descriptor and byte parameter). After that call: the descriptor pointer is available on zero page ($50/$51 per the calling convention used here), the requested length is in A (also copied to X later), and Y is 0.
- Bounds clamp: CMP ($50),Y compares requested length (A) to the source string length (indirect via ($50),Y). If requested length exceeds source length, the routine loads the actual length from ($50),Y and copies it into the parameter register.
- Start offset: The start offset is cleared to 0 (TYA / PHA) unless set elsewhere; it is saved to the stack before the length is saved.
- Allocation: JSR $B47D is called with A = length to allocate target string space (utility/string area).
- Descriptor retrieval: The routine obtains the actual source pointer and length by calling JSR $B6AA, which pops the descriptor (from stack or from top of string space) and returns A = length, X = pointer low, Y = pointer high.
- Pointer adjustment: The saved start offset is pulled and added to the source pointer low byte ($22), with carry incrementing the high byte ($23) if necessary.
- Copy: JSR $B68C is used to copy the requested number of bytes from the source pointer to the utility pointer (destination).
- Return: JMP $B4CA checks space on the descriptor stack and places the resulting string descriptor (address + length) on the descriptor stack, returning control to the caller.

This routine uses zero-page locations $50/$51 (descriptor pointer held by the pull routine) and $22/$23 (temporary source pointer adjusted by start offset) as the working pointers used by subsequent string helpers.

## Algorithm (step-by-step)
1. JSR $B761 — pull descriptor and byte parameter from the stack; after return: descriptor pointer on $50/$51, requested length in A (and transferred to X later), Y = 0.
2. CMP ($50),Y — compare requested length (A) to source string length (indirect via ($50),Y).
3. If A >= source length:
   - LDA ($50),Y and TAX — set requested length = source length.
4. Clear start offset (TYA then PHA) and push it on stack.
5. TXA then PHA — push the (possibly clamped) length on stack.
6. JSR $B47D — allocate A bytes in the utility/string area (A contains length).
7. Load descriptor pointer low/high from $50/$51 into A/Y, then JSR $B6AA — pop descriptor; returns A = length, X = pointer low, Y = pointer high.
8. PLA -> TAY — retrieve length saved earlier into Y.
9. PLA — retrieve start offset saved earlier into A (start offset was 0 here).
10. CLC; ADC $22 — add start offset to source pointer low byte at $22; if carry, INC $23 to adjust high byte.
11. TYA -> A (copy length to A).
12. JSR $B68C — copy A bytes from adjusted source pointer ($22/$23) to the utility/destination pointer.
13. JMP $B4CA — finalize by pushing result descriptor and length onto the descriptor stack and updating pointers.

## Source Code
```asm
.,B700 20 61 B7    JSR $B761       ; pull string data and byte parameter from stack
                                ; return pointer in descriptor, byte in A (and X), Y=0
.,B703 D1 50       CMP ($50),Y     ; compare byte parameter with string length
.,B705 98          TYA             ; clear A
.,B706 90 04       BCC $B70C       ; branch if string length > byte parameter
.,B708 B1 50       LDA ($50),Y     ; else make parameter = length
.,B70A AA          TAX             ; copy to byte parameter copy
.,B70B 98          TYA             ; clear string start offset
.,B70C 48          PHA             ; save string start offset
.,B70D 8A          TXA             ; copy byte parameter (or string length if <)
.,B70E 48          PHA             ; save string length
.,B70F 20 7D B4    JSR $B47D       ; make string space A bytes long
.,B712 A5 50       LDA $50         ; get descriptor pointer low byte
.,B714 A4 51       LDY $51         ; get descriptor pointer high byte
.,B716 20 AA B6    JSR $B6AA       ; pop (YA) descriptor off stack or from top of string space
                                ; returns with A = length, X = pointer low byte,
                                ; Y = pointer high byte
.,B719 68          PLA             ; get string length back
.,B71A A8          TAY             ; copy length to Y
.,B71B 68          PLA             ; get string start offset back
.,B71C 18          CLC             ; clear carry for add
.,B71D 65 22       ADC $22         ; add start offset to string start pointer low byte
.,B71F 85 22       STA $22         ; save string start pointer low byte
.,B721 90 02       BCC $B725       ; branch if no overflow
.,B723 E6 23       INC $23         ; else increment string start pointer high byte
.,B725 98          TYA             ; copy length to A
.,B726 20 8C B6    JSR $B68C       ; store string from pointer to utility pointer
.,B729 4C CA B4    JMP $B4CA       ; check space on descriptor stack then put string address
                                ; and length on descriptor stack and update stack pointers
```

## References
- "pull_string_and_byte_param" — expands on retrieval of descriptor and byte parameter (JSR $B761)
- "chr_string_creation" — expands on descriptor push routine used for returning strings (JMP $B4CA)
- "right_string_function" — shows RIGHT$ handling that branches into this LEFT$ processing for copying remainder bytes
