# KERNAL ROM I/O Device Base Addresses and Hardware Constants (VIC, SID, CIAs, Screen, Tape)

**Summary:** Defines base addresses and equates for VIC-II registers ($D000), SID registers ($D400), VIC color RAM ($D800), CIA1 ($DC00) and CIA2 ($DD00) register banks (PRA/PRB/DDRA/T1/T2/TOD/ICR/CRA/CRB), tape block type constants (EOT/BLF/BDF/PLF/BDFH), buffer/screen editor constants (BUFSZ=192, LLEN/LLEN2/NLINES) and CR (carriage return). Contains assembler equates and device register name bindings.

**Device/address equates and constants**
This chunk binds assembler labels to the standard C64 I/O base addresses and a few hardware/constants used by the KERNAL:

- VIC registers are anchored at $D000 (label VICREG).
- SID registers are anchored at $D400 (label SIDREG).
- VIC color RAM region (VICCOL) is set 1024 bytes after the current location counter in the original listing (the source sets VICCOL via *=*+1024; the assembled/absolute base used is $D800).
- CIA1 device bank (device1, page 1 IRQ) is anchored at $DC00 and its registers are named D1PRA/D1PRB/D1DDRA/D1DDRB/D1T1L/D1T1H/D1T2L/D1T2H/D1TOD1/D1TODS/D1TODM/D1TODH/D1SDR/D1ICR/D1CRA/D1CRB.
- CIA2 device bank (device2, page 2 NMI) is anchored at $DD00 and similarly defines D2PRA...D2CRB.
- A constant TIMRB ($19) is defined (6526 CRB enable one-shot TB).
- Tape block type constants are defined: EOT=5, BLF=1, BDF=2, PLF=3, BDFH=4.
- Buffer/screen constants: BUFSZ=192, LLEN=40, LLEN2=80, NLINES=25. Color constants WHITE=$01 and BLUE=$06 and CR (carriage return) = $D.

**SID Voice Register Offsets:**
The SID chip comprises three voices, each controlled by a set of seven registers. The offsets for these registers, relative to the SID base address ($D400), are as follows:

- **Voice 1:**
  - Frequency Low Byte: $D400
  - Frequency High Byte: $D401
  - Pulse Width Low Byte: $D402
  - Pulse Width High Byte: $D403
  - Control Register: $D404
  - Attack/Decay: $D405
  - Sustain/Release: $D406

- **Voice 2:**
  - Frequency Low Byte: $D407
  - Frequency High Byte: $D408
  - Pulse Width Low Byte: $D409
  - Pulse Width High Byte: $D40A
  - Control Register: $D40B
  - Attack/Decay: $D40C
  - Sustain/Release: $D40D

- **Voice 3:**
  - Frequency Low Byte: $D40E
  - Frequency High Byte: $D40F
  - Pulse Width Low Byte: $D410
  - Pulse Width High Byte: $D411
  - Control Register: $D412
  - Attack/Decay: $D413
  - Sustain/Release: $D414

**VIC-II Register Bit-Field Maps:**

- **Control Register 1 ($D011):**
  - Bit 7: 1 = Enable 25-row text display; 0 = Enable 24-row text display
  - Bit 6: 1 = Enable screen; 0 = Disable screen
  - Bit 5: 1 = Enable bitmap mode; 0 = Enable text mode
  - Bit 4: 1 = Enable extended color text mode; 0 = Disable
  - Bits 3-0: Vertical fine scrolling (0-15 pixels)

- **Control Register 2 ($D016):**
  - Bit 7: 1 = Enable 40-column text display; 0 = Enable 38-column text display
  - Bit 6: 1 = Enable multicolor mode; 0 = Disable
  - Bits 5-3: Unused
  - Bits 2-0: Horizontal fine scrolling (0-7 pixels)

**CIA Register Bit-Field Maps:**

- **Data Direction Register A ($DC02 for CIA1, $DD02 for CIA2):**
  - Bits 7-0: 1 = Corresponding bit in Port A is output; 0 = Input

- **Control Register A ($DC0E for CIA1, $DD0E for CIA2):**
  - Bit 7: 1 = Timer A starts; 0 = Timer A stopped
  - Bit 6: 1 = Timer A counts underflows of Timer B; 0 = Counts system clock pulses
  - Bit 5: 1 = Timer A forces output to zero; 0 = Normal operation
  - Bit 4: 1 = Timer A output mode toggle; 0 = Pulse
  - Bit 3: 1 = Timer A one-shot mode; 0 = Continuous
  - Bit 2: 1 = Timer A counts positive CNT pulses; 0 = Counts system clock pulses
  - Bit 1: 1 = Timer A load start value; 0 = No load
  - Bit 0: 1 = Timer A stop; 0 = No stop

## Source Code
```asm
                                .ORG   $E500          ; Set KERNAL start address
                                *      =$D000
                                VICREG =*              ;VIC REGISTERS
                                *      =$D400
                                SIDREG =*              ;SID REGISTERS
                                *      =$D800
                                VICCOL *=*+1024        ;VIC COLOR NYBBLES
                                *      =$DC00          ;DEVICE1 6526 (PAGE1 IRQ)
                                COLM                   ;KEYBOARD MATRIX
                                D1PRA  *=*+1
                                ROWS                   ;KEYBOARD MATRIX
                                D1PRB  *=*+1
                                D1DDRA *=*+1
                                D1DDRB *=*+1
                                D1T1L  *=*+1
                                D1T1H  *=*+1
                                D1T2L  *=*+1
                                D1T2H  *=*+1
                                D1TOD1 *=*+1
                                D1TODS *=*+1
                                D1TODM *=*+1
                                D1TODH *=*+1
                                D1SDR  *=*+1
                                D1ICR  *=*+1
                                D1CRA  *=*+1
                                D1CRB  *=*+1
                                *      =$DD00          ;DEVICE2 6526 (PAGE2 NMI)
                                D2PRA  *=*+1
                                D2PRB  *=*+1
                                D2DDRA *=*+1
                                D2DDRB *=*+1
                                D2T1L  *=*+1
                                D2T1H  *=*+1
                                D2T2L  *=*+1
                                D2T2H  *=*+1
                                D2TOD1 *=*+1
                                D2TODS *=*+1
                                D2TODM *=*+1
                                D2TODH *=*+1
                                D2SDR  *=*+1
                                D2ICR  *=*+1
                                D2CRA  *=*+1
                                D2CRB  *=*+1
                                TIMRB  =$19            ;6526 CRB ENABLE ONE-SHOT TB
                                ;TAPE BLOCK TYPES
                                ;
                                EOT    =5              ;END OF TAPE
                                BLF    =1              ;BASIC LOAD FILE
                                BDF    =2              ;BASIC DATA FILE
                                PLF    =3              ;FIXED PROGRAM TYPE
                                BDFH   =4              ;BASIC DATA FILE HEADER
                                BUFSZ  =192            ;BUFFER SIZE
                                ;
                                ;SCREEN EDITOR CONSTANTS
                                ;
                                LLEN   =40             ;SINGLE LINE 40 COLUMNS
                                LLEN2  =80             ;DOUBLE LINE = 80 COLUMNS
                                NLINES =25             ;25 ROWS ON SCREEN
                                WHITE  =$01            ;WHITE SCREEN COLOR
                                BLUE   =$06            ;BLUE CHAR COLOR
                                CR     =$D             ;CARRIAGE RETURN
                                .END
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II control, raster, sprite, and video registers (base VICREG).
- $D400-$D418 - SID (6581/8580) - Voice 1/2/3 registers and filter/control region (base SIDREG).
- $D800-$DBFF - VIC color RAM - 1024 nybble color entries for screen (VICCOL region).
- $DC00-$DC0F - CIA 1 (6526) - PRx/DDRx/Timers/TOD/ICR/CRA/CRB (device1, page1 IRQ).
- $DD00-$DD0F - CIA 2 (6526) - PRx/DDRx/Timers/TOD/ICR/CRA/CRB (device2, page2 NMI).

## References
- "declare_zero_page_part2" — expands zero-page pointers for VIC/SID/CIAs and buffer pointers
- Commodore 64 Programmer's Reference Guide
- MOS Technology 6581 SID Datasheet
- MOS Technology 6526 CIA Datasheet
- MOS Technology 6567/6569 VIC-II Datasheet
- Commodore 64 Memory Map

## Labels
- VICREG
- SIDREG
- VICCOL
- D1PRA
- D2PRA
- TIMRB
- WHITE
- BLUE
