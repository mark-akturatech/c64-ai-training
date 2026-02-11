# Example: MOS 6510 CPU Port Configuration

**Project:** c64lib_chipset - KickAssembler library with register definitions and macros for VIC-II, CIA, SID, and MOS 6510

## Summary
Defines the MOS 6510 on-chip I/O port registers at $00 (data direction) and $01 (port data). Provides bit constants for LORAM, HIRAM, and CHAREN that control PLA memory mapping between RAM, BASIC ROM, KERNAL ROM, and I/O chip visibility. Includes configureMemory macro for switching memory configurations and disableNMI macro for suppressing non-maskable interrupts.

## Key Registers
- $00 - MOS 6510 data direction register - controls port pin direction
- $01 - MOS 6510 I/O port - LORAM/HIRAM/CHAREN bits for memory mapping

## Techniques
- memory banking via CPU port
- PLA configuration
- ROM/RAM switching

## Hardware
MOS 6510

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
#importonce

.filenamespace c64lib

/*
 * MOS6510 Registers.
 */
.label MOS_6510_DIRECTION       = $00
.label MOS_6510_IO              = $01

/*
 * I/O Register bits.
 */
.label CASETTE_MOTOR_OFF        = %00100000
.label CASETTE_SWITCH_CLOSED    = %00010000
.label CASETTE_DATA             = %00001000
.label PLA_CHAREN               = %00000100
.label PLA_HIRAM                = %00000010
.label PLA_LORAM                = %00000001

/*
 * Possible I/O & PLA configurations.
 */
.label RAM_RAM_RAM              = %000
.label RAM_CHAR_RAM             = PLA_LORAM
.label RAM_CHAR_KERNAL          = PLA_HIRAM
.label BASIC_CHAR_KERNAL        = PLA_LORAM | PLA_HIRAM
.label RAM_IO_RAM               = PLA_CHAREN | PLA_LORAM
.label RAM_IO_KERNAL            = PLA_CHAREN | PLA_HIRAM
.label BASIC_IO_KERNAL          = PLA_CHAREN | PLA_LORAM | PLA_HIRAM

.macro configureMemory(config) {
  lda MOS_6510_IO
  and #%11111000
  ora #[config & %00000111]
  sta MOS_6510_IO
}

.macro disableNMI() {
    lda #<nmi
    sta c64lib.NMI_LO
    lda #>nmi
    sta c64lib.NMI_HI
    jmp end
  nmi: 
    rti
  end:
}
```

## Labels
- MOS_6510_DIRECTION
- MOS_6510_IO
- PLA_CHAREN
- PLA_HIRAM
- PLA_LORAM
