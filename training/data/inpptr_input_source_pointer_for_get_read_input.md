# INPPTR ($43-$44)

**Summary:** INPPTR at $0043-$0044 is the zero-page pointer used by BASIC's READ, INPUT and GET to locate the source of incoming data (DATA statements via DATPTR or the keyboard/input buffer at $0200 / 512).

## Description
INPPTR is a two-byte pointer (low byte at $0043, high byte at $0044) used by the BASIC interpreter when executing READ, INPUT or GET. It contains the address of the current source of input:

- When reading DATA statements, INPPTR is set to the address supplied via DATPTR (pointer into program text for DATA).
- When reading from the keyboard or text input buffer, INPPTR points to the keyboard/input buffer at $0200 (512 decimal).

The interpreter loads and advances INPPTR as it consumes input from the selected source. (Pointer stored little-endian: low byte first.)

## Key Registers
- $0043-$0044 - BASIC - INPPTR pointer used by READ/INPUT/GET (low byte at $0043, high byte at $0044); points to DATA via DATPTR or to keyboard/input buffer at $0200 ($200 / 512).

## References
- "datptr_pointer_to_current_data_item_and_sample_program" — expands on DATPTR pointing to DATA inside program text; contrasts DATPTR with INPPTR (source used by READ/INPUT/GET).

## Labels
- INPPTR
