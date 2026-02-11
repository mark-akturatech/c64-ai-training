# FAC1 Normalization after ADC Overflow ($B91D-$B929)

**Summary:** Disassembly fragment showing normalization for FAC1 after an ADC overflow (C=1): increments exponent (ADC #$01), shifts the FAC1 rounding byte ($70) into carry, then ROLs FAC1 mantissa bytes ($62-$65) to propagate the carry into the mantissa; loops using BPL until the high mantissa byte is normalized (bit 7 set).

**Description**
This code runs when an addition produced a carry (C=1) and the floating-point accumulator FAC1 must be normalized upward. Sequence and effects:

- **ADC #$01 (.,B91D)** — Add 1 to the exponent held in A (increment exponent-offset). This updates A, and sets N/Z/C/V as usual for ADC.
- **ASL $70 (.,B91F)** — Shift the FAC1 rounding byte left; bit 7 of $70 moves into the CPU Carry (C), and the new value of $70 sets N/Z.
- **ROL $65 (.,B921) then ROL $64 (.,B923) then ROL $63 (.,B925) then ROL $62 (.,B927)** — Rotate left each mantissa byte in descending significance order so the carry from the rounding byte is propagated into the least-significant mantissa byte and then through to the most-significant mantissa byte. Each ROL updates the CPU Carry, N, and Z flags based on the memory result.
- **BPL $B91D (.,B929)** — Branch back to the ADC/shift sequence while the Negative flag is clear (N=0). Practically, this loops until the most-significant mantissa byte (at $62) has its sign bit (bit 7) set, indicating the mantissa is normalized (high bit = 1).

Notes:
- The ASL on $70 seeds the chain by placing the rounding-bit into Carry; the subsequent ROLs propagate that into the mantissa.
- The BPL uses the N flag (set by the last ROL $62) to test the sign (bit 7) of the top mantissa byte. Looping continues while that byte's bit 7 is clear (not normalized).

## Source Code
```asm
.,B91D 69 01    ADC #$01        ; add 1 to exponent offset (A = A + 1 + C_in)
.,B91F 06 70    ASL $70         ; shift FAC1 rounding byte -> carry
.,B921 26 65    ROL $65         ; rotate FAC1 mantissa byte 4
.,B923 26 64    ROL $64         ; rotate FAC1 mantissa byte 3
.,B925 26 63    ROL $63         ; rotate FAC1 mantissa byte 2
.,B927 26 62    ROL $62         ; rotate FAC1 mantissa byte 1 (MSB)
                        ; normalize FAC1
.,B929 10 F2    BPL $B91D       ; loop if most-significant mantissa byte bit 7 == 0
```

## Key Registers
- **$61**: FAC1 exponent
- **$62-$65**: FAC1 mantissa (4 bytes)
- **$66**: FAC1 sign byte
- **$70**: FAC1 rounding byte

## References
- "mantissa_add_path" — expands on calls after mantissa addition to normalize result
- "underflow_and_exponent_adjustment" — continues to exponent adjustments and underflow checks after normalization

## Labels
- FAC1
- FAC1_EXP
- FAC1_MANTISSA
- FAC1_SIGN
- FAC1_ROUND
