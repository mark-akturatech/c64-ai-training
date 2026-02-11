# Floating Point Accumulator #2 (FAC2) $69-$6E

**Summary:** FAC2 ($0069-$006E) is the second floating-point accumulator used by the BASIC floating-point routines; it pairs with FAC1 for multi-value arithmetic (products, sums, differences). Its format mirrors FAC1, consisting of exponent, mantissa, and sign fields.

**Overview**

FAC2 serves as a secondary Floating Point Accumulator, utilized alongside Floating Point Accumulator #1 (FAC1) for operations requiring two operands, such as multiplication, addition, subtraction, and intermediate storage during expression evaluation. The internal structure of FAC2 is identical to that of FAC1, comprising an exponent, mantissa, and sign field.

The floating-point number format used in FAC2 is as follows:

- **Exponent:** 1 byte
- **Mantissa:** 4 bytes (32 bits)
- **Sign:** Incorporated within the most significant bit of the mantissa

### Detailed Field Layout

The 6-byte structure of FAC2 is organized as:

- **Byte 0 ($69):** Exponent
- **Byte 1 ($6A):** Most significant byte of the mantissa (with sign bit)
- **Byte 2 ($6B):** Second byte of the mantissa
- **Byte 3 ($6C):** Third byte of the mantissa
- **Byte 4 ($6D):** Least significant byte of the mantissa
- **Byte 5 ($6E):** Unused (padding)

**Exponent (Byte 0):** This byte represents the exponent in a biased form. The actual exponent is calculated by subtracting 129 from the stored value. For example, a stored exponent of $81 (129 in decimal) corresponds to an actual exponent of 0.

**Mantissa (Bytes 1-4):** The mantissa is a 32-bit value stored in big-endian order. The most significant bit of Byte 1 serves as the sign bit: 0 for positive numbers and 1 for negative numbers. The mantissa represents the fractional part of the number, normalized such that the binary point is just to the right of the sign bit.

**Unused Byte (Byte 5):** This byte is reserved and not used in the floating-point representation.

## Source Code

```text
FAC2 Memory Layout:

Byte  | Description
------+------------------------------
$69   | Exponent (biased by 129)
$6A   | Mantissa byte 1 (MSB, sign bit in MSB)
$6B   | Mantissa byte 2
$6C   | Mantissa byte 3
$6D   | Mantissa byte 4 (LSB)
$6E   | Unused (padding)
```

## Key Registers

- $0069-$006E - BASIC/Floating Point - Floating Point Accumulator #2 (FAC2): second accumulator used with FAC1 for multi-value arithmetic (products, sums, differences)

## References

- "fac2_fields_exponent_mantissa_sign" — expands on detailed FAC2 field layout (exponent, mantissa, sign)
- "fac1_fields_exponent_mantissa_sign" — expands on FAC1 and how FAC1/FAC2 are used together for multi-value arithmetic

## Labels
- FAC2
