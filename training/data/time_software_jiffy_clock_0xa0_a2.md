# TIME ($A0-$A2) — Software Jiffy Clock

**Summary:** Zero-page three-byte software jiffy clock at $00A0-$00A2 updated 60×/s (jiffies). $00A2 (LSB) increments each jiffy (1/60 s), $00A1 updates every 256 jiffies (~4.2667 s), $00A0 updates every 65,536 jiffies (~18.2044 min); the clock is set back to 0 after 24 hours.

## Description
Three consecutive zero-page locations (decimal 160–162, $00A0–$00A2) implement the C64 software jiffy clock. They are increased 60 times per second (one jiffy = 1/60 s) and present a running count of jiffies since power-up.

- $00A2 (LSB) increments every jiffy: 1/60 s ≈ 0.0166667 s.
- $00A1 (middle byte) is updated every 256 jiffies: 256 / 60 ≈ 4.2666667 s.
- $00A0 (MSB) is updated every 65,536 jiffies: 65,536 / 60 ≈ 1,092.266667 s ≈ 18.204444 min.

According to the source, these three locations are cleared (wrapped to 0) after 24 hours of elapsed time.

**[Note: Source may contain an error — a line in the original text gives $A2’s increment as "0.1667 second" and $A1’s update interval as "4.2267 seconds"; the correct values are 0.0166667 s and 4.2666667 s respectively.]**

(For related implementation details, see the IRQ routine that updates the keyboard matrix and jiffy clock; the kernel zero-page overview covers layout and other timing/control data.)

## Key Registers
- $00A0-$00A2 - Zero Page - Software jiffy clock (three-byte jiffy counter; $00A2 = LSB, $00A1 = middle, $00A0 = MSB; increments 60×/s)

## References
- "stkey_stop_key_and_keyboard_matrix_0x91" — expands on the IRQ routine that updates the keyboard matrix and the jiffy clock  
- "kernal_zero_page_overview_0x90_0xff" — overview of Kernal zero-page timing and control data

## Labels
- TIME
