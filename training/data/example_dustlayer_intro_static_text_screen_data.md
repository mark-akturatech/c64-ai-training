# Example: Static Text Screen Data

**Project:** dustlayer_intro - Color wash intro with SID music, raster interrupts, and animated text

## Summary
Contains two 40-character text lines encoded in screen code format for display. Text is copied to screen RAM positions by the initialization routine. Lines remain visible throughout the demo with animated color wash effect applied via color RAM.

## Key Registers
- $0590/$05E0 - VIC-II Screen RAM positions - text line destinations

## Techniques
- screen code text encoding
- data tables

## Hardware
VIC-II

## Source Code
```asm
; the two lines of text for color washer effect

line1   !scr "     actraiser in 2013 presents...      "
line2   !scr "example effect for dustlayer tutorials  "
```
