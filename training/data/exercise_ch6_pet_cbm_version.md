# PET/CBM "Times Ten" Machine Routine (Start $0480)

**Summary:** PET/CBM 6502 machine routine (start $0480 / decimal 1152) that multiplies a 16-bit integer by 10 using indirect loads LDA ($2A),Y, temporary storage $033C-$033F, shifts (ASL/ROL) and add (CLC / ADC), then writes the result back via STA ($2A),Y. Uses the SOV pointer at zero page $002A/$002B to locate the BASIC numeric variable.

**Description**

This routine is the PET/CBM variant of the "times ten" exercise. It is intended to be invoked from BASIC (change the SYS line to SYS 1152) and operates on a 16-bit integer referenced through the SOV pointer in zero page at $002A/$002B.

Memory usage and register conventions in the code:

- **Zero-page pointer:** ($2A) is the SOV pointer (zero page address $002A/$002B). The code uses indexed-indirect addressing LDA ($2A),Y with Y values #$02 and #$03 to read the two bytes of the 16-bit value.
- **Temporary 4-byte buffer:** $033C-$033F
  - $033C/$033D — working/accumulator word (target)
  - $033E/$033F — copy of the original value (added back later)

Algorithm summary (step-by-step):

1. Load low/high bytes of the source (via LDA ($2A),Y with Y=#02 and #03) and store each byte twice: once into $033C/$033D (target) and once into $033E/$033F (original copy).
2. Shift the target word left twice (two ASL/ROL pairs) to multiply it by 4.
3. Add the original value (in $033E/$033F) to the shifted target (4*value + value = 5*value) using CLC / ADC sequences for the low and high bytes.
4. Shift the 5*value left once (ASL/ROL) to produce 10*value.
5. Store the resulting two bytes back to the variable via STA ($2A),Y (with Y=#02 and #03).
6. RTS returns to BASIC.

**Setting the SOV Pointer:**

To point the SOV pointer at a BASIC numeric variable, the monitor `.M` command can be used to change $002A/$002B. For example, to set the SOV pointer to address $0400:


This sets $002A to $00 and $002B to $04, making the SOV pointer ($2A) point to $0400.

**BASIC Integer Variable Layout:**

In Commodore BASIC, integer variables are stored in memory with the following structure:

- **Byte 0:** First character of the variable name (ASCII value)
- **Byte 1:** Second character of the variable name (ASCII value) or $00 if the name is a single character
- **Bytes 2-3:** 16-bit signed integer value in two's complement format (LSB first)

When the SOV pointer ($2A) points to the start of an integer variable, the 16-bit integer value is located at:

- **($2A) + 2:** LSB of the integer value
- **($2A) + 3:** MSB of the integer value

For example, if the integer variable `A%` is stored at address $0400, and `A%` has a value of 1234 (which is $04D2 in hexadecimal), the memory layout would be:


Therefore, setting the SOV pointer to $0400 will allow the machine routine to access the integer value correctly.

## Source Code

```
.M 002A 00 04
```

```
Address  | Value | Description
---------|-------|----------------------------
$0400    | 41    | 'A' (ASCII for 'A')
$0401    | 00    | $00 (second character, not used)
$0402    | D2    | LSB of 1234 ($04D2)
$0403    | 04    | MSB of 1234 ($04D2)
```


```asm
.A 0480  LDY #$02
.A 0482  LDA ($2A),Y
.A 0484  STA $033C
.A 0487  STA $033E
.A 048A  LDY #$03
.A 048C  LDA ($2A),Y
.A 048E  STA $033D
.A 0491  STA $033F
.A 0494  ASL $033D
.A 0497  ROL $033C
.A 049A  ASL $033D
.A 049D  ROL $033C
.A 04A0  CLC
.A 04A1  LDA $033D
.A 04A4  ADC $033F
.A 04A7  STA $033D
.A 04AA  LDA $033C
.A 04AD  ADC $033E
.A 04B0  STA $033C
.A 04B3  ASL $033D
.A 04B6  ROL $033C
.A 04B9  LDY #$02
.A 04BB  LDA $033C
.A 04BE  STA ($2A),Y
.A 04C0  LDY #$03
.A 04C2  LDA $033D
.A 04C5  STA ($2A),Y
.A 04C7  RTS
```

## Key Registers

- **$0480:** Code start / entry point (machine routine begins here)
- **$002A-$002B:** Zero page SOV pointer (pointer to BASIC numeric variable)
- **$033C-$033F:** Temporary 4-byte buffer used by the routine ($033C/$033D target, $033E/$033F original copy)

## References

- "pet_cbm_change_sov" — how to change the SOV pointer on PET/CBM