# Disk Destructive Write Sequence — Emit Destructive Bytes (LDA #$FF, STA $1C01, WRITEL / WRITE2 Loops)

**Summary:** This assembly routine configures the disk drive's data direction for output and writes a sequence of bytes to the disk via the $1C01 register. It utilizes loops labeled WRITEL and WRITE2 to perform the write operations, potentially overwriting sync marks on the disk.

**Description**

This routine is designed to perform a destructive write operation on a Commodore 1541 disk drive by repeatedly sending bytes to the disk's data port. The sequence involves:

- Setting the data direction to output by writing $FF to the data direction register.
- Initializing the X register to a specific count value.
- Loading the accumulator with a pattern byte.
- Entering the WRITEL loop, which clears the overflow flag, writes the accumulator's value to the disk data port ($1C01), decrements the X register, and loops until X reaches zero.
- Proceeding to the WRITE2 loop, which calls a subroutine at $FE00, loads the accumulator with $01, and jumps to the label SF969.

The primary function of this routine is to overwrite existing data on the disk, including sync marks, by continuously writing specific byte patterns.

## Source Code

The following assembly code represents the routine:

```asm
; --- Initialization ---
        LDA #$FF         ; Set data direction to output
        STA $1C03        ; Write to data direction register

        LDX #$00         ; Initialize X register (count)

        LDA #$55         ; Load pattern byte into accumulator

WRITEL:
        CLV              ; Clear overflow flag
        STA $1C01        ; Write accumulator to disk data port
        DEX              ; Decrement X register
        BNE WRITEL       ; Loop until X = 0

WRITE2:
        JSR $FE00        ; Call subroutine at $FE00
        LDA #$01         ; Load accumulator with $01
        JMP SF969        ; Jump to label SF969
```

In this code:

- `$1C03` is the data direction register for Port A of VIA2 in the 1541 disk drive. Writing $FF sets all bits to output mode.
- `$1C01` is the data port (Port A) of VIA2, used for reading from or writing to the disk.
- The WRITEL loop writes the pattern byte ($55) to the disk repeatedly, controlled by the X register.
- The WRITE2 section calls a subroutine at $FE00, then loads $01 into the accumulator and jumps to the label SF969.

## Key Registers

- **$1C01**: Port A data register of VIA2 in the 1541 disk drive. Used for reading from or writing to the disk.
- **$1C03**: Data direction register for Port A of VIA2. Determines the direction (input or output) of the port's pins.

## References

- "Commodore 1541 Drive Memory Map" — Details on VIA2 registers in the 1541 disk drive.
- "How the Block-Sync and Byte-Sync Signals of a Commodore 1541 Drive Work" — Explains the operation of sync signals in the 1541 disk drive.