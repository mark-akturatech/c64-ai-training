# 1541-side 16-byte encoding table (256‑byte autostart fast loader)

**Summary:** The Commodore 1541 disk drive employs a 16-byte lookup table to encode 4-bit nibbles for transmission over the C64's serial link. This encoding corrects for the inverted return lines and interleaves bit patterns, facilitating accurate data reconstruction on the C64 side. This method is integral to the 256-byte autostart fast loader.

**Drive-side encoding (sending code)**

The 1541 encodes outgoing data using a 16-byte lookup table, with each entry corresponding to a 4-bit nibble. Each table entry is a 4-bit pattern that interleaves bits and embeds inversion correction, allowing the C64 to recover the original nibble despite the drive's inverted return line. The encoding table is as follows:

| Index (Hex) | Encoded Pattern (Binary) |
|-------------|--------------------------|
| 0           | 1111                     |
| 1           | 0111                     |
| 2           | 1101                     |
| 3           | 0101                     |
| 4           | 1011                     |
| 5           | 0011                     |
| 6           | 1001                     |
| 7           | 0001                     |
| 8           | 1110                     |
| 9           | 0110                     |
| A           | 1100                     |
| B           | 0100                     |
| C           | 1010                     |
| D           | 0010                     |
| E           | 1000                     |
| F           | 0000                     |

This table maps each 4-bit nibble (0x0 to 0xF) to a unique 4-bit encoded pattern, ensuring distinct and reliable transmission.

The encoded output represents the 1541's "sending code" step in the serial protocol. The complementary C64 decoder reconstructs the original nibbles from the encoded bit pairs.

## Source Code

```text
16-byte lookup table (drive-side encoding):

Index  Encoded Pattern (Binary)
0      1111
1      0111
2      1101
3      0101
4      1011
5      0011
6      1001
7      0001
8      1110
9      0110
A      1100
B      0100
C      1010
D      0010
E      1000
F      0000
```

## References

- Commodore 64 Programmer's Reference Guide: Input/Output Guide - Serial Port
- Commodore 1541 Disk Drive User's Guide
- C64-Wiki: Fast Serial Bus Protocol
- C64-Wiki: Serial Port
