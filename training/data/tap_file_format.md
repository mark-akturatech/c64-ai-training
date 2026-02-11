# Datassette Encoding — TAP file format (Per Hakan Sundell, 1997)

**Summary:** TAP is a digital representation of Commodore datassette pulses where each nonzero TAP byte encodes a single pulse length using the C64 PAL clock: TAP byte = pulse_length(µs) * C64 PAL frequency / 8 (factor ≈ 0.123156). Common CBM pulse values: Short $2B, Medium $3F, Long $53.

## TAP File Format
Each nonzero byte in a TAP file represents the time length of one tape pulse. The conversion between pulse length in microseconds and the stored TAP byte uses the C64 PAL clock:

TAP Data Byte = Pulse length (microseconds) * C64 PAL Frequency / 8  
TAP Data Byte = Pulse length (µs) * 0.123156

Typical CBM (Commodore) pulse lengths and their TAP byte equivalents (PAL reference):
- Short pulse ~352 µs  → TAP ≈ 43  (hex $2B)
- Medium pulse ~512 µs → TAP ≈ 63  (hex $3F)
- Long pulse ~672 µs   → TAP ≈ 83  (hex $53)

Notes:
- Each nonzero byte encodes one pulse length. (The source states "nonzero TAP byte" encodes pulse lengths.)
- Values are shown as the calculated decimal TAP byte with hexadecimal notation for common CBM pulses.

## Source Code
```text
Formula:
TAP Data Byte = Pulse length (microseconds) * C64 PAL Frequency / 8
TAP Data Byte ≈ Pulse length (µs) * 0.123156

Standard CBM pulse conversions (PAL):
Pulse Name | Pulse (µs) | Calculation                       | TAP (dec) | TAP (hex)
Short      | 352        | 352 * 0.123156 = 43.333...       | 43        | $2B
Medium     | 512        | 512 * 0.123156 = 63.046...       | 63        | $3F
Long       | 672        | 672 * 0.123156 = 82.760...       | 83        | $53

(Values shown as calculated; source lists the standard TAP bytes: Short $2B, Medium $3F, Long $53.)
```

## References
- "pulse_types" — numeric TAP equivalents for short/medium/long pulses  
- "overview" — TAP as digital representation of tape pulse-based encoding