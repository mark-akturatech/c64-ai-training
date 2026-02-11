# LSR and ROR — Divide-by-Two (Right Shift and Rotate)

**Summary:** Describes 6502 shift/rotate semantics for dividing by two using LSR and ROR, including bit movement, effect on the carry (C flag), and the multi-byte algorithm (start at the high-order byte with LSR, use ROR on lower bytes to propagate bits). Mentions that shift/rotate operate on the A register or directly on memory.

**Right Shift and Rotate**
**LSR (Logical Shift Right)**
- Shifts every bit one position to the right.
- A zero is injected into the high (bit 7) position.
- The low (bit 0) that is shifted out is placed into the Carry flag (C).
- The final Carry after a sequence is the remainder when dividing by two.

**ROR (Rotate Right)**
- Shifts every bit one position to the right.
- The previous Carry (C) is moved into the high (bit 7) position.
- The low bit shifted out is placed into Carry.
- Use ROR on lower-order bytes to accept the bit shifted out from the next-higher byte.

**Multi-byte division-by-two algorithm (concept)**
- Start at the high-order byte: execute LSR on that byte (its low bit goes to C).
- For each subsequent lower-order byte: execute ROR so that the Carry from the higher byte becomes the high bit of the current byte, and its low bit becomes the new Carry.
- After processing the lowest-order byte, the Carry contains the overall remainder (LSB of the original multi-byte value).

**Concrete Example: Dividing a 3-byte (24-bit) number by two**

Consider a 24-bit number stored in three consecutive memory locations: `HIGH`, `MID`, and `LOW`, representing the high, middle, and low bytes, respectively.

**Initial Values:**
- `HIGH` = $12 (00010010 in binary)
- `MID` = $34 (00110100 in binary)
- `LOW` = $56 (01010110 in binary)

**Step-by-Step Process:**

1. **LSR on HIGH:**
   - Original: `00010010`
   - After LSR: `00001001`
   - Carry (C): 0 (since the original bit 0 was 0)
   - Updated `HIGH`: $09

2. **ROR on MID:**
   - Original: `00110100`
   - Carry in: 0
   - After ROR: `00011010`
   - Carry (C): 0 (since the original bit 0 was 0)
   - Updated `MID`: $1A

3. **ROR on LOW:**
   - Original: `01010110`
   - Carry in: 0
   - After ROR: `00101011`
   - Carry (C): 0 (since the original bit 0 was 0)
   - Updated `LOW`: $2B

**Final Values:**
- `HIGH` = $09 (00001001 in binary)
- `MID` = $1A (00011010 in binary)
- `LOW` = $2B (00101011 in binary)
- Carry (C): 0

**Interpretation:**
- The original 24-bit value was $123456.
- After division by two, the result is $091A2B.
- The final Carry (C) is 0, indicating no remainder.

**Note:** If the original least significant bit (LSB) of the 24-bit number had been 1, the final Carry would be set, indicating a remainder of 1.

**Comments on Shift and Rotate**
- These instructions normally operate on the A register, but they also support memory operands: the CPU can shift/rotate a byte in memory directly (no explicit LDA/STA required).
- Both logical shifts (LSR/ASL) and rotates (ROR/ROL) are available; for division you use LSR + ROR to propagate bits rightward across bytes (mirror of ASL + ROL for multiplication).
- Final Carry semantics: consider C as the remainder bit after dividing by two (0 = even, 1 = odd) for the entire multi-byte value when processed high-to-low.

## Source Code
```text
                                  LSR
              +-----+----+----+----+----+----+----+-----+
              |     |    |    |    |    |    |    |     |
          0 -----> ---> ---> ---> ---> ---> ---> ---> ---->  CARRY
              |     |    |    |    |    |    |    |     |   (C FLAG)
              +-----+----+----+----+----+----+----+-----+

   IN AN LSR, ZERO MOVES INTO THE HIGH BIT, AND ALL BITS MOVE RIGHT ONE
   POSITION; THE LOWEST BITS BECOME THE CARRY.



         CARRY                    ROL                    
           |  +-----+----+----+----+----+----+----+-----+   
           |  |     |    |    |    |    |    |    |     |   
           `-----> ---> ---> ---> ---> ---> ---> ---> -----.
              |     |    |    |    |    |    |    |     |  |
              +-----+----+----+----+----+----+----+-----+  |
                                                           v
                                                         CARRY

   IN A ROL (ROTATE LEFT), THE CARRY MOVES INTO THE LOW ORDER BIT; EACH
   BIT MOVES LEFT; AND THE HIGH ORDER BIT BECOMES THE NEW CARRY.



        0      LSR
        |  +----------+
        |  |          |
        `---> -> -> ----.
           |          | |
           +----------+ |        ROR
                        |    +---------+
                        v    |         |
                      CARRY---> -> -> ----.
                             |         |  |
                             +---------+  |        ROR
                                          |    +---------+
                                          v    |         |
                                        CARRY---> -> -> ----.
                                               |         |  |
                                               +---------+  |
                                                            |
                                                            v

   TO DIVIDE A THREE-BYTE NUMBER BY TWO, WE SHIFT THE HIGH-ORDER BYTE
   WITH LSR; THEN WE USE ROR TO ALLOW THE C FLAG TO "LINK" FROM BYTE
   TO BYTE.

   Figure 4.5
```

## References
- "left_shift_and_rol" — mirror operations for division vs multiplication (LSR/ROR vs ASL/ROL)

## Mnemonics
- LSR
- ROR
