# Zero Page $00BD-$00C5 — RS232 / Datasette / Save Start / Key Matrix

**Summary:** Zero-page memory locations $00BD-$00C5 hold RS232 parity/datasette buffering, the datasette block counter and motor switch, save-start addresses (little-endian), a secondary start address, and the previous key-matrix entry (matrix code). Searchable terms: $00BD, $00BE, $00C0, $00C1-$00C4, $00C5, datasette, RS232, zero page, save start, key matrix.

## Description
This zero-page range is used by the KERNAL and I/O routines for serial (RS232) buffering and datasette tape handling, plus temporary storage for save/load start addresses and key-scanning state.

- $00BD — RS232 parity / datasette buffer: used to hold RS232 parity information or a byte used as a temporary buffer for datasette operations (shared usage depending on routine).
- $00BE — Block counter: a single-byte counter used by the datasette routines to track tape block numbers or block-transfer progress.
- $00BF — Unused: reserved/unused zero-page location in this map.
- $00C0 — Motor switch: a flag/switch used by datasette routines to control or indicate the motor state (start/stop). Treated as a control/status byte by tape routines.
- $00C1-$00C2 — Save Start (start address for save operations): a 16-bit little-endian address (low byte at $00C1, high byte at $00C2) storing the default or requested start address for SAVE operations.
- $00C3-$00C4 — Secondary Start (start address 0): a second 16-bit little-endian start address used by some disk/tape routines (secondary start or auxiliary start pointer).
- $00C5 — Previous Key Matrix: stores the matrix code (key scan value) of the previously-detected key press for debouncing or repeat detection in the keyboard routine.

Note: 16-bit start addresses follow the standard little-endian layout used throughout the 6502/C64 system (low byte first, then high byte).

## Key Registers
- $00BD - Zero Page - RS232 parity / datasette buffer
- $00BE - Zero Page - Datasette block counter
- $00BF - Zero Page - Unused (reserved)
- $00C0 - Zero Page - Datasette motor switch (motor control/status)
- $00C1-$00C2 - Zero Page - Save Start address (16-bit, little-endian)
- $00C3-$00C4 - Zero Page - Secondary Start address 0 (16-bit, little-endian)
- $00C5 - Zero Page - Previous key matrix entry (matrix code)

## References
- "datasette_and_serial_buffers" — expands on motor control and block counter usage for the datasette routines
