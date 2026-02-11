# Sprite visibility limits (X/Y ranges, 9-bit X, $D010)

**Summary:** Sprite vertical visibility (Y register 0–255) and horizontal visibility (9‑bit X using X LSB registers + XMSB $D010) for unexpanded sprites: Y must be between $32 and $E9; 9‑bit X must be greater than $18 and less than $140. Mentions HINC/HDEC macros for 9‑bit X increments/decrements and a referenced Table 7-6 of coordinates.

**Visibility rules (vertical)**

The value written to a sprite's Y position register is an 8‑bit value (0–255) that sets vertical position. For an unexpanded (normal-height) sprite to be entirely on-screen, the Y register value must be between $32 and $E9. Values outside that range place the sprite partially or fully off-screen.

**Visibility rules (horizontal, 9‑bit X)**

Each sprite's X position is a 9‑bit value composed of:

- the sprite's X position register (least significant 8 bits)
- one ninth bit stored in the VIC‑II XMSB register ($D010)

For an unexpanded sprite to be completely visible horizontally, the full 9‑bit X value must be:

- greater than $18
- less than $140

The text references HINC and HDEC macros to perform 9‑bit increments and decrements of the 9‑bit X value (these handle carry/borrow into/out of the XMSB bit).

## Source Code

The following table lists the VIC‑II registers used to set each sprite's X and Y positions, along with the corresponding bit in the XMSB register ($D010) that stores the ninth bit of the X coordinate:

```text
+---------+----------------------+----------------------+----------------------+
| Sprite  | X Position Register  | Y Position Register  | XMSB Register Bit    |
+---------+----------------------+----------------------+----------------------+
|   0     | $D000                | $D001                | Bit 0                |
|   1     | $D002                | $D003                | Bit 1                |
|   2     | $D004                | $D005                | Bit 2                |
|   3     | $D006                | $D007                | Bit 3                |
|   4     | $D008                | $D009                | Bit 4                |
|   5     | $D00A                | $D00B                | Bit 5                |
|   6     | $D00C                | $D00D                | Bit 6                |
|   7     | $D00E                | $D00F                | Bit 7                |
+---------+----------------------+----------------------+----------------------+
```

In this table:

- The "X Position Register" column lists the memory-mapped register address for the least significant 8 bits of the sprite's X coordinate.
- The "Y Position Register" column lists the memory-mapped register address for the sprite's Y coordinate.
- The "XMSB Register Bit" column indicates which bit in the XMSB register ($D010) corresponds to the ninth bit of the sprite's X coordinate.

For example, to set the X position of sprite 0 to 300 (which is $12C in hexadecimal):

1. Set the least significant byte of the X position:

   ```assembly
   LDA #$2C
   STA $D000
   ```

2. Set the most significant bit of the X position:

   ```assembly
   LDA $D010
   ORA #%00000001  ; Set bit 0 for sprite 0
   STA $D010
   ```

This sets sprite 0's X position to 300.

## Key Registers

- $D000–$D00F: VIC‑II Sprite X and Y Position Registers
- $D010: VIC‑II Sprite X MSB Register

## References

- Commodore 64 Programmer's Reference Guide, Chapter 3: Programming Graphics