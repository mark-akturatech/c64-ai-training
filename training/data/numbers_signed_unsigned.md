# Numbers: Signed and Unsigned

**Summary:** Describes the programmer's choice between signed and unsigned single-byte numbers (signed range -128..+127; unsigned range 0..255) and that the machine treats the byte identically either way. Sign tests are performed by examining the processor status N flag (negative flag).

## Explanation
A single byte can be interpreted either as a signed value (decimal range -128 to +127) or as an unsigned integer (decimal range 0 to 255). The choice of interpretation is made by the programmer; the hardware stores and manipulates the same 8-bit pattern regardless of that choice.

The processor does not inherently distinguish signed from unsigned arithmetic. If you want to test for a negative result when treating a byte as signed, examine the N (negative) flag in the processor status register. If treating the byte as unsigned, tests typically use carry/zero flags or compare against 0 or other unsigned thresholds instead of the N flag.

## References
- "chapter_header_and_toc_ignored" — chapter header and topics list
- "big_numbers_multi_byte" — multi-byte (big) numbers and sizing
