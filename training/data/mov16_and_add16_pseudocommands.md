# Kick Assembler: .pseudocommand mov16 / add16 (uses _16bitnextArgument)

**Summary:** Kick Assembler .pseudocommands mov16 and add16 implement 16-bit load/store and 16-bit addition by operating on low/high byte argument pairs via _16bitnextArgument; respects optional target argument (AT_NONE behavior).

## Definition and behavior
- mov16 src:tar — copies a 16-bit value from src to tar by loading/storing the low byte, then loading/storing the high byte obtained via _16bitnextArgument(src)/_16bitnextArgument(tar).
- add16 arg1 : arg2 : tar — performs a 16-bit addition (arg1 + arg2) with proper low-byte then high-byte ADC sequence. If tar is omitted and represented as AT_NONE, the first argument (arg1) is used as the target (in-place add).
- Both macros rely on _16bitnextArgument(arg) to reference the paired high byte that follows a low-byte argument in the assembler argument list.
- The addition macro clears the carry (CLC) before the low-byte ADC so the low-byte addition is computed correctly; the subsequent ADC of the high bytes uses the carry produced by the low-byte ADC (standard 16-bit ADC sequence).
- The macros expand into normal 6502 A/STA/ADC instructions; they do not define additional carry handling beyond the two ADCs shown (final carry left as ADC sets it).

## Source Code
```asm
.pseudocommand mov16 src:tar {
    lda src
    sta tar
    lda _16bitnextArgument(src)
    sta _16bitnextArgument(tar)
}

.pseudocommand add16 arg1 : arg2 : tar {
    .if (tar.getType()==AT_NONE) .eval tar=arg1
    clc
    lda arg1
    adc arg2
    sta tar
    lda _16bitnextArgument(arg1)
    adc _16bitnextArgument(arg2)
    sta _16bitnextArgument(tar)
}
```

## References
- "constructing_cmdargument_and_16bit_next_argument_function" — expands on using _16bitnextArgument to operate on high/low argument pairs
- "using_16bit_pseudocommands_and_notes" — examples of calling these 16-bit pseudocommands and notes on optional target argument (AT_NONE)
