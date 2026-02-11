# LEN (BASIC function)

**Summary:** The LEN function in Commodore 64 BASIC returns the number of characters in a string. It reads the length field from a string descriptor and converts that integer length into a floating-point value for RETURN. The routine is located at address $B77C (decimal 46972).

**Description**

The LEN function operates by:

- Retrieving the string length from the string descriptor.
- Converting the integer length to the internal floating-point representation used for numeric RETURN values.
- Returning the floating-point value to the BASIC expression evaluator.

The routine at $B77C calls the subroutine at $B782 to obtain the string length, which is returned in the accumulator with the Y index register set to zero. It then jumps to the routine at $B3A7, which converts the contents of the accumulator and Y register to a floating-point value in FAC#1. ([files.commodore.software](https://files.commodore.software/reference-material/books/c64-books/c64-programming-books/basic-programming/advanced-commodore-64-basic-revealed.pdf?utm_source=openai))

## Source Code

```asm
; LEN function routine at $B77C
$B77C  JSR $B782        ; Call subroutine to get string length
       JSR $B3A7        ; Convert A and Y to floating-point in FAC#1
       RTS              ; Return
```

The subroutine at $B782 retrieves the string length:

```asm
$B782  LDA ($64),Y      ; Load string length from descriptor
       RTS              ; Return
```

The routine at $B3A7 converts the integer in A and Y to floating-point:

```asm
$B3A7  ; Conversion routine (details omitted for brevity)
```

## Key Registers

- **A (Accumulator):** Contains the string length as an integer.
- **Y:** Set to zero during the length retrieval process.

## References

- "pream_pull_string_params" — expands on string parameter handling; related to LEN and indicates LEN commonly does not need PREAM.
- Advanced Commodore 64 BASIC Revealed — provides details on the LEN function's operation and related routines. ([files.commodore.software](https://files.commodore.software/reference-material/books/c64-books/c64-programming-books/basic-programming/advanced-commodore-64-basic-revealed.pdf?utm_source=openai))