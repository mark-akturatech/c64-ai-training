# Divide-by-zero handling and FAC1 mantissa finalisation (ROM $BB8A-$BB9F)

**Summary:** 6502 assembly snippet from C64 ROM implementing divide-by-zero error handling and the normalisation/return path for FAC1; sets error code X = $14 and JMPs to $A437 on divide-by-zero, otherwise copies 4-byte temporary mantissa ($0026-$0029) into FAC1 mantissa ($0062-$0065) and JMPs to FAC1 normalisation at $B8D7.

## Description
This code covers the finalisation of a division routine: it chooses between the divide-by-zero error path and the normal return path that finalises FAC1 (floating-point accumulator 1).

- Divide-by-zero path: loads X with $14 (error code for divide by zero) and performs an unconditional jump to the error/warm-start handler at $A437. The error handler is entered via JMP (no RTS), so control does not return here.
- Normal path: copies the 4-byte temporary mantissa stored in zero page $26–$29 into FAC1's mantissa bytes at zero page $62–$65, then unconditionally jumps to $B8D7, the FAC1 normalisation/return helper.

No other state changes (flags, other zero-page locations) are modified in this snippet; the two paths are mutually exclusive and both end with an unconditional JMP to their respective handlers.

## Source Code
```asm
.,BB8A A2 14    LDX #$14        error $14, divide by zero error
.,BB8C 4C 37 A4 JMP $A437       do error #X then warm start
.,BB8F A5 26    LDA $26         get temp mantissa 1
.,BB91 85 62    STA $62         save FAC1 mantissa 1
.,BB93 A5 27    LDA $27         get temp mantissa 2
.,BB95 85 63    STA $63         save FAC1 mantissa 2
.,BB97 A5 28    LDA $28         get temp mantissa 3
.,BB99 85 64    STA $64         save FAC1 mantissa 3
.,BB9B A5 29    LDA $29         get temp mantissa 4
.,BB9D 85 65    STA $65         save FAC1 mantissa 4
.,BB9F 4C D7 B8 JMP $B8D7       normalise FAC1 and return
```

## Key Registers
- $0026-$0029 - Zero page - temporary mantissa (4 bytes) used by divide routine
- $0062-$0065 - Zero page - FAC1 mantissa bytes (4 bytes) — destination for finalised mantissa

## References
- "divide_ay_by_fac1_core_algorithm" — expands on the division routine's final jump and divide-by-zero branch