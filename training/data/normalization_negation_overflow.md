# NORMAL / NEGFAC / OVERR — FAC1 normalization, two's-complement negation, overflow error

**Summary:** Routines at $B8FE (NORMAL), $B947 (NEGFAC), and $B97E (OVERR) operate on the floating-point accumulator FAC1: NORMAL performs normalization of FAC1 after arithmetic, NEGFAC replaces FAC1 with its two's-complement (negation), and OVERR emits/prints the overflow error message. Searchable terms: $B8FE, $B947, $B97E, FAC1, normalize, two's complement, overflow.

**Description**

- **NORMAL ($B8FE)**
  - **Purpose:** Normalize Floating Point Accumulator #1 (FAC1) after arithmetic operations. This involves adjusting the mantissa and exponent to ensure the mantissa's most significant bit is set, and handling exponent overflow or underflow conditions.
  - **Typical Callers:** Addition/subtraction routines and other floating-point operations that produce an unnormalized result.

- **NEGFAC ($B947)**
  - **Purpose:** Replace FAC1 with its two's-complement representation (i.e., negate FAC1). This is achieved by inverting all bits of the mantissa and sign, and adding one to the result.
  - **Typical Callers:** Used when a sign change must be applied to FAC1, such as after certain subtraction results or explicit NEG operations.

- **OVERR ($B97E)**
  - **Purpose:** Print/emit the overflow error message invoked when normalization or other floating-point operations detect an exponent that cannot be represented (overflow). This routine centralizes overflow reporting and is typically called by normalization or arithmetic routines when a numerical range limit is exceeded.

## Key Registers

- **FAC1 Structure:**
  - **Exponent:** Address $61
  - **Mantissa:** Addresses $62–$65
  - **Sign:** Address $66 (most significant bit indicates sign)
  - **Rounding Byte:** Address $70 (used for intermediate calculations)

## References

- "fadd_faddt_fadd4_addition_operations" — normalization following addition/subtraction routines
- "negop_not_operation_behavior" — additional negation / NOT operation behavior affecting FAC1 sign handling

## Labels
- NORMAL
- NEGFAC
- OVERR
- FAC1
