# Minimal C64 Datasette Loader — Main Load Loop

**Summary:** Main load loop for a minimal C64 datasette program loader using 6502 assembly: calls `get_block` with `A = #$00`, uses the carry flag from `get_block` as an end-of-data marker, and increments the high byte of the 16-bit destination pointer (`ptr+1`) after each block; `BCC` repeats until carry set or high byte overflows.

**Main loop**

This loop repeatedly calls the block reader subroutine `get_block` with `A = #$00` as a parameter. `get_block` signals end-of-data by setting the processor carry flag on return; while carry is clear the loop continues.

After each successful block read, the code increments the high byte of the 16-bit destination pointer (labelled `ptr`, high byte at `ptr+1`) to advance where the next block will be stored. The loop uses `BCC` (branch if carry clear) to repeat; the loop ends when `get_block` returns with carry set or if the high byte overflows (wraps from `$FF` to `$00`), which also stops after the `INC` and `BCC` behavior.

Notes:
- `A = #$00` is passed to `get_block` (purpose defined in `get_block`).
- Carry clear = continue; carry set = end-of-data (return/exit).
- Incrementing `ptr+1` advances the destination by one block (moves to the next block storage area).

## Source Code

```asm
; Define the 16-bit pointer 'ptr' at a specific memory location
ptr:    .word $C000  ; Initialize 'ptr' to point to $C000

m3:     lda #$00
        jsr get_block
        inc ptr + 1
        bcc m3
```

## Key Registers

- **ptr**: 16-bit pointer to the destination address for loading data; initialized to `$C000`.

## References

- "extract_start_address" — expands on `ptr` initialization from the header (where to store program data)
- "data_block_reading" — expands on `get_block` implementation and actual byte writes per block

## Labels
- PTR
