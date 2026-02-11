# Converting $12 to GCR (nybble→5-bit codes → 10-bit sequence)

**Summary:** Example converting byte $12 (decimal 18) to Group Code Recording (GCR) by splitting into high/low nybbles, mapping each 4-bit nybble to its 5-bit GCR code, and concatenating to a 10-bit sequence; includes intermediate binary forms and final 10-bit result.

**Conversion steps**
GCR (Group Code Recording) used here maps each 4-bit nybble to a 5-bit code. The process for a single byte is:
- Convert the byte to an 8-bit binary.
- Split into high nybble (bits 7–4) and low nybble (bits 3–0).
- Lookup each nybble in the binary→GCR table to get a 5-bit code.
- Concatenate high-nybble 5-bit code + low-nybble 5-bit code → 10-bit GCR sequence.

Applied to $12 (decimal 18):
- Byte: $12 = 00010010 (binary)
- High nybble: 0001 = $1 → GCR code 01011
- Low nybble: 0010 = $2 → GCR code 10010
- Concatenation: 01011 + 10010 = 0101110010 (10-bit GCR)

Notes:
- High nybble is encoded first, then low nybble.
- The binary→GCR lookup table referenced is required to map arbitrary nybbles; only mappings for $1 and $2 are shown here.

**Binary to GCR Lookup Table:**

| Nybble (Hex) | Binary | GCR Code |
|--------------|--------|----------|
| $0           | 0000   | 01010    |
| $1           | 0001   | 01011    |
| $2           | 0010   | 10010    |
| $3           | 0011   | 10011    |
| $4           | 0100   | 01110    |
| $5           | 0101   | 01111    |
| $6           | 0110   | 10110    |
| $7           | 0111   | 10111    |
| $8           | 1000   | 01001    |
| $9           | 1001   | 11001    |
| $A           | 1010   | 11010    |
| $B           | 1011   | 11011    |
| $C           | 1100   | 01101    |
| $D           | 1101   | 11101    |
| $E           | 1110   | 11110    |
| $F           | 1111   | 10101    |

*Source: "Inside Commodore DOS"*

**Packing 10-bit GCR Sequences into Bytes:**

When writing data to disk, the Commodore 1541 drive converts four 8-bit data bytes into four 10-bit GCR sequences, totaling 40 bits. These 40 bits are then packed into five 8-bit bytes for storage. This process ensures efficient use of disk space and maintains data integrity.

**Example:**

1. **Four Data Bytes:**
   - $08 = 00001000
   - $10 = 00010000
   - $00 = 00000000
   - $12 = 00010010

2. **Convert Each Byte to GCR:**
   - $08 → 01010 01001
   - $10 → 01011 01010
   - $00 → 01010 01010
   - $12 → 01011 10010

3. **Concatenate GCR Codes:**
   - 01010 01001 01011 01010 01010 01010 01011 10010

4. **Group into Five 8-bit Bytes:**
   - 01010010
   - 01010110
   - 10100101
   - 00101001
   - 01110010

5. **Resulting GCR Bytes:**
   - $52, $56, $A5, $29, $72

*Source: "Inside Commodore DOS"*

## Source Code
```text
STEP 1. Hexadecimal to Binary Conversion
$12 (18) = 00010010

STEP 2. High Nybble to GCR Conversion
0001 = $1 -> 01011

STEP 3. Low Nybble to GCR Conversion
0010 = $2 -> 10010

STEP 4. GCR Concatenation
01011 + 10010 = 0101110010
```

## References
- "Inside Commodore DOS" — Detailed explanation of GCR encoding and packing methods.