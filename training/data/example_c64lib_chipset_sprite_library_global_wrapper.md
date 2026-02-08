# Example: Sprite Library Global Wrapper

**Project:** c64lib_chipset - KickAssembler library with register definitions and macros for VIC-II, CIA, SID, and MOS 6510

## Summary
Re-exports sprite bitmap encoding macros (sh, sm) with @c64lib_ global namespace prefix for integrated library use. Allows multi-file projects to access high-res and multicolor sprite encoding without namespace collisions.

## Key Registers
- $D000-$D00E - VIC-II sprite X/Y position pairs (via macros)
- $D010 - VIC-II sprite X MSB - high bit for X coordinates > 255 (via macros)
- $D027-$D02E - VIC-II sprite colors - individual sprite color registers (via macros)

## Techniques
- namespace wrapping
- macro aliasing

## Hardware
VIC-II

## Source Code
```asm
/*
 * MIT License
 *
 * Copyright (c) 2017-2032 c64lib
 * Copyright (c) 2017-2023 Maciej Małecki
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
#import "sprites.asm"
#importonce
.filenamespace c64lib

.macro @c64lib_sh(data) { sh(data) }
.macro @c64lib_sm(data) { sm(data) }
```
