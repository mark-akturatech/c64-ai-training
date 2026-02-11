# LINE 20 — FOR S1=12288 TO 12350 (load sprite shape 1)

**Summary:** Loads 63 bytes of sprite-shape data from DATA statements (line 100) into memory $3000-$303E (12288–12350 decimal) using BASIC READ/POKE in a FOR...NEXT loop; used for rotating multiple shapes into a single hardware sprite (sprite 0) by switching sprite pointers.

**Explanation**
- **Purpose:** Copy the first sprite-shape (63 bytes) from the program's DATA list into RAM at addresses 12288–12350 (hex $3000–$303E). These bytes form "sprite shape 1".
- **Mechanism:**
  - `FOR S1=12288 TO 12350` iterates S1 over the 63 consecutive RAM addresses ($3000..$303E).
  - `READ Q1` fetches the next numeric value from the DATA statements (DATA block begins at line 100 in the original program).
  - `POKE S1,Q1` writes that byte into memory; for the first DATA value (30), this executes as `POKE 12288,30` (same as `POKE $3000,30`).
  - `NEXT S1` increments S1 and causes the loop to READ the next DATA value and POKE it into the next address; the loop ends after `POKE 12350,0` (the final DATA byte).
- **Result:** One contiguous 63-byte sprite definition is placed in memory. The program stores multiple such blocks (shape 2, shape 3) elsewhere and animates by changing the sprite pointer for sprite 0 to point to these blocks in turn (pointer switching code appears elsewhere).
- **Notes:**
  - 12288..12350 inclusive = 63 bytes (12350 - 12288 + 1 = 63).
  - This technique reuses one hardware sprite to display multiple shapes by rapidly changing which memory block the VIC-II uses for the sprite definition.

## Source Code
```basic
20 FOR S1 = 12288 TO 12350
   READ Q1
   POKE S1, Q1
NEXT S1
```
(First DATA block referenced starts at line 100 — actual DATA lines not included here.)

Example equivalence (first iteration):
```basic
READ Q1     -> Q1 = 30    (first DATA value)
POKE S1,Q1  -> POKE 12288,30
```

The following DATA statements define the sprite shapes:
