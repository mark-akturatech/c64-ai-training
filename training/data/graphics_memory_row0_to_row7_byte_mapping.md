# Graphics memory mapping — Table 7-3 (ROW0 and sub-rows 0–7)

**Summary:** First part of Table 7-3 showing how graphics memory bytes map to screen positions for ROW0 and its eight internal sub-rows (sub-rows 0–7). Illustrates the repeated per-sub-row byte sequence in three memory bands ($08–$0F, $10–$17, $138–$13F).

**Mapping description**

This chunk presents the ROW0 block of the graphics-memory mapping table: each internal sub-row (0–7) in ROW0 pulls bytes from three repeating address bands. The pattern is a simple vertical interleave — for sub-row n (0–7), the bytes are:

- **Band A:** $08 + n  (yields $08–$0F)
- **Band B:** $10 + n  (yields $10–$17)
- **Band C:** $138 + n (yields $138–$13F)  (Band C = Band A + $130)

Use this mapping when determining which graphics memory byte supplies each scanline-sub-row for the ROW0 character row. This chunk is the first part of the table; the sequence continues in the next block(s) (see References).

Note: The source text contained OCR artifacts. The interpreted/corrected mapping above follows the consistent +$8 / +$130 stride pattern visible across the entries.

## Source Code

```text
Original extracted text (raw):

ROW0

$8

$10 $18 $138

1

$9

$11

$139

2

$A

$12

$13A

3

$B

$13

$13B

4

$C

$14

$13C

5

$D

$15

$13D

6

$E

$16

$13E

7

$F

$17

$13F
```

```text
Interpreted / corrected mapping (canonical table for ROW0 sub-rows):

Sub-row | Band A | Band B | Band C
--------|--------|--------|-------
0       | $08    | $10    | $138
1       | $09    | $11    | $139
2       | $0A    | $12    | $13A
3       | $0B    | $13    | $13B
4       | $0C    | $14    | $13C
5       | $0D    | $15    | $13D
6       | $0E    | $16    | $13E
7       | $0F    | $17    | $13F
```
This table corrects OCR errors and aligns with the consistent +$8 / +$130 stride pattern observed across the entries.

## References

- "graphics_memory_table_introduction" — expands on table purpose and heading
- "graphics_memory_row1_block_$140_to_$27F" — continuation showing $140 and $278 regions that complete the row sequence
