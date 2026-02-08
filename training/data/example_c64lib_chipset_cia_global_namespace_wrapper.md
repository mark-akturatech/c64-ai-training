# Example: CIA Global Namespace Wrapper

**Project:** c64lib_chipset - KickAssembler library with register definitions and macros for VIC-II, CIA, SID, and MOS 6510

## Summary
Re-exports CIA chip macros with @c64lib_ global namespace prefix for use in larger projects. Provides scoped macro access for setVICBank and disableCIAInterrupts without name collision. This wrapper enables clean integration of CIA functionality into multi-file c64lib-based projects.

## Key Registers
- $DC00 - CIA1 data port A - keyboard/joystick input (via macros)
- $DC0D - CIA1 interrupt control - enable/disable timer interrupts (via macros)
- $DD00 - CIA2 data port A - VIC-II bank selection bits 0-1 (via macros)
- $DD0D - CIA2 interrupt control - NMI source control (via macros)

## Techniques
- namespace wrapping
- macro aliasing
- library organization

## Hardware
CIA1, CIA2

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
#import "cia.asm"
#importonce
.filenamespace c64lib

.macro @c64lib_setVICBank(bank) { setVICBank(bank) }
.macro @c64lib_disableCIAInterrupts() { disableCIAInterrupts() }
```
