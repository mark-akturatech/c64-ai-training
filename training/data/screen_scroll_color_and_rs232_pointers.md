# Zero Page $00F2-$010A — Scroll temp, pointers, RS232 buffers, FP->string

**Summary:** Zero-page layout for $00F2-$010A on the C64: scroll temporary ($00F2), Color RAM line pointer ($00F3-$00F4), keyboard conversion table pointer ($00F5-$00F6), RS232 input/output buffer pointers ($00F7-$00FA), four unused bytes ($00FB-$00FE), and the 12-byte floating-point-to-string conversion buffer ($00FF-$010A).

## Overview
This chunk documents zero-page usage by KERNAL/ROM routines in the area $00F2–$010A. All pointers in this region are 16-bit little-endian addresses unless stated otherwise.

- $00F2 — Scroll Temp: single-byte temporary storage used during screen-scrolling routines to hold intermediate values (e.g., line offsets or loop counters).
- $00F3-$00F4 — Color Line Pointer: 16-bit pointer to the current Color RAM line (little-endian). Used by screen/character color routines to index into Color RAM.
- $00F5-$00F6 — Keyboard Table Pointer: 16-bit pointer (little-endian) to the keyboard conversion table used by KERNAL keyboard decoding routines.
- $00F7-$00F8 — RS232 Input Buffer Pointer: 16-bit pointer (little-endian) to the RS-232 input buffer (managed by serial/RS232 routines).
- $00F9-$00FA — RS232 Output Buffer Pointer: 16-bit pointer (little-endian) to the RS-232 output buffer.
- $00FB-$00FE — Unused: four bytes reserved/unused in this zero-page area.
- $00FF-$010A — FP to String Buffer: 12-byte buffer used by floating-point-to-string conversion routines (referenced by FAC and floating-point formatting functions).

Behavioral notes:
- These zero-page locations are used by ROM/KERNAL services; code that calls KERNAL routines that modify or depend on these locations should preserve/restore them if needed.
- The FP-to-string buffer is temporary scratch space for routines converting FAC (floating-point accumulator) contents to ASCII.

## Source Code
```text
; Source: sta.c64.org - Complete Memory Map (Zero Page $00F2-$010A)
$00F2   Scroll Temp             Temporary area during screen scrolling
$00F3-$00F4  Color Line Ptr     Pointer to current Color RAM line
$00F5-$00F6  Keyboard Table Ptr Pointer to keyboard conversion table
$00F7-$00F8  RS232 In Buf Ptr   RS232 input buffer pointer
$00F9-$00FA  RS232 Out Buf Ptr  RS232 output buffer pointer
$00FB-$00FE  Unused             (4 bytes)
$00FF-$010A  FP to String       Float-to-string conversion buffer (12 bytes)
```

## Key Registers
- $00F2 - Zero Page RAM - Scroll temporary byte used during screen scrolling
- $00F3-$00F4 - Zero Page RAM - Color RAM line pointer (16-bit little-endian)
- $00F5-$00F6 - Zero Page RAM - Keyboard conversion table pointer (16-bit little-endian)
- $00F7-$00F8 - Zero Page RAM - RS232 input buffer pointer (16-bit little-endian)
- $00F9-$00FA - Zero Page RAM - RS232 output buffer pointer (16-bit little-endian)
- $00FB-$00FE - Zero Page RAM - Unused/reserved (4 bytes)
- $00FF-$010A - Zero Page RAM - Floating-point-to-string conversion buffer (12 bytes)

## References
- "floating_point_registers" — expands on FAC and FP conversion buffers referenced from this zero page region
- "serial_and_rs232_zero_page" — expands on RS232 buffer pointers and serial-related zero-page usage

## Labels
- SCROLL_TEMP
- COLOR_LINE_PTR
- KEYBOARD_TABLE_PTR
- RS232_INPUT_BUFFER_PTR
- RS232_OUTPUT_BUFFER_PTR
- FP_TO_STRING
