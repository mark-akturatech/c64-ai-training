# IOBASE (KERNAL $FFF3)

**Summary:** IOBASE is a KERNAL call at $FFF3 (65523) that returns the memory-mapped I/O page base in X (low byte) and Y (high byte) for accessing C64/VIC-20 I/O registers; call with JSR IOBASE, store X/Y, then set Y = offset to access a specific I/O register.

## Description
Purpose: define the I/O memory page base for memory-mapped I/O access on Commodore machines (C64, VIC-20, and compatible future models).

Call address: $FFF3 (hex) / 65523 (decimal).  
Communication registers: X = low-order byte of base address, Y = high-order byte of base address.  
Preparatory routines: None.  
Error returns: None specified.  
Stack requirements: 2 (standard JSR return address).  
Registers affected: X, Y (other registers unchanged as per source).

Behavior: On entry via JSR, IOBASE sets X and Y to point to the start of the memory page that contains the system's memory-mapped I/O device registers. The desired I/O register is accessed by adding an offset (number of locations from the page start) to that base address: store X and Y into consecutive zero-page locations (a 16-bit pointer), then load Y with the offset and use indirect indexed or absolute indexed addressing to read/write the specific I/O register.

Compatibility: Using this routine to obtain I/O locations keeps machine-language programs compatible across C64, VIC-20, and future KERNAL-compatible models even if the physical I/O page changes.

How to use (steps):
1. JSR IOBASE
2. STX <low-byte-address> ; save base low byte
3. STY <high-byte-address> ; save base high byte
4. LDY #<offset>           ; load offset within the I/O page
5. Access the I/O register using the saved pointer plus offset (e.g., LDA (<ptr>),Y or STA (<ptr>),Y as appropriate)

Example purpose: set the User Port data direction register to input (0).

## Source Code
```asm
; SET THE DATA DIRECTION REGISTER OF THE USER PORT TO 0 (INPUT)
    JSR IOBASE
    STX POINT       ; store base low byte at POINT
    STY POINT+1     ; store base high byte at POINT+1
    LDY #2          ; offset for User Port data direction register
    ; then e.g. LDA (POINT),Y or STA (POINT),Y to access the register
```

## Key Registers
- $FFF3 - KERNAL - IOBASE entry point: sets X (low) and Y (high) to the base address of the memory-mapped I/O page

## References
- "cint_initialize_screen_editor_and_video" — expands on using IOBASE to locate video-related I/O registers
- "ciout_transmit_byte_over_serial_bus" — shows complementary use of IOBASE to locate memory-mapped I/O pages for serial/bus routines

## Labels
- IOBASE
