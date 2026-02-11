# RIGHT$() implementation (C64 ROM) — JSR $B761 then JMP $B706

**Summary:** Disassembly of the RIGHT$() entry at $B72C showing a call to the parameter/descriptor fetch routine ($B761), arithmetic that computes the start offset for the rightmost N characters using SBC/EOR, and a JMP into the LEFT$ continuation at $B706. Search terms: $B72C, $B761, $B706, RIGHT$(), LEFT$(), SBC ($50),Y, EOR #$FF, JSR, JMP.

**Description**
This snippet implements the RIGHT$() string function by reusing the LEFT$() copy/allocation path. Steps performed:

- **JSR $B761**: Calls the routine at $B761 to retrieve the string descriptor and the byte parameter (requested N) from the stack. After return:
  - The string descriptor pointer is stored in the zero-page address $50.
  - The requested byte (N) is in the accumulator (A) and register X.
  - Register Y is set to zero.

- **CLC / SBC ($50),Y**: Clears the carry flag and subtracts the string length (obtained from the descriptor at $50) from the requested byte N. This operation effectively computes A := N - LEN - 1.

- **EOR #$FF**: Inverts the bits of A. Combined with the previous subtraction, this results in A := (LEN - N) mod 256, which is the start offset required to obtain the rightmost N characters.

- **JMP $B706**: Jumps to the continuation of the LEFT$() function at $B706, which handles the allocation and copying of the substring.

This design avoids duplicating allocation and copy code by computing the appropriate start offset for LEFT$ and branching into that code path.

## Source Code
```asm
.,B72C 20 61 B7    JSR $B761       ; pull string data and byte parameter from stack
.,B72F 18          CLC             ; clear carry for add-1
.,B730 F1 50       SBC ($50),Y     ; subtract string length
.,B732 49 FF       EOR #$FF        ; invert it (A=LEN(expression$)-l)
.,B734 4C 06 B7    JMP $B706       ; go do rest of LEFT$()
```

## Key Registers
- **$50**: Zero-page address holding the pointer to the string descriptor.
- **A**: Accumulator holding the computed start offset for the substring.
- **X**: Also holds the requested byte parameter (N).
- **Y**: Set to zero during the operation.

## References
- "left_string_function" — expands on continuation at $B706 and LEFT$ processing (copy/allocation).
- "pull_string_and_byte_param" — expands on the JSR $B761 routine that retrieves the descriptor and byte parameter.