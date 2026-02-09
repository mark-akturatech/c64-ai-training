# MACHINE - CHROUT subroutine ($FFD2)

**Summary:** CHROUT at $FFD2 is the KERNAL output subroutine that sends the byte in the A register to the current output channel (screen by default). Typical use is single-character screen output; character codes are ASCII (or PETSCII), A/X/Y are preserved across the call, and status flags may be altered (on the C64 the C flag can signal output problems).

**Description**
CHROUT ($FFD2) is the KERNAL routine for sending one character to the active output channel (screen, disk, cassette, printer, or any device the system has routed output to). It is equivalent to a single-character PRINT/PRINT# — only one byte is emitted.

- **Purpose:** Transmit the character contained in the A register to the current output channel.
- **Typical use:** Printing a single character to the screen (e.g., as part of a character-output routine).
- **Character encoding:** ASCII (or "PETSCII" as historically documented); when output is the screen, graphics, color codes, and cursor-control characters are handled according to the usual screen interpretation.
- **Calling convention:** Call the subroutine located at $FFD2 (invoke the KERNAL entry for CHROUT). The character to output must be in A on entry.
- **Register preservation:** A, X, and Y are preserved by the subroutine; on return their values are unchanged.
- **Status flags:** Processor status flags may be modified by the call. On the VIC and Commodore 64, the carry (C) flag can indicate some type of output problem on return.

## Source Code
Below is an example of using the CHROUT subroutine to print the string "HELLO WORLD" to the screen:

```assembly
; Define the CHROUT routine address
CHROUT = $FFD2

; Start of the program
*=$0801  ; Standard BASIC program start address

; Initialize the X register to 0
LDX #0

; Loop through each character in the message
PRINT_LOOP:
    ; Load the character from the message into the accumulator
    LDA MESSAGE,X
    ; Check if the end of the message (null terminator) is reached
    BEQ DONE
    ; Call CHROUT to print the character
    JSR CHROUT
    ; Increment the X register to point to the next character
    INX
    ; Repeat the loop
    JMP PRINT_LOOP

; End of the program
DONE:
    RTS

; Message to be printed
MESSAGE:
    .BYTE "HELLO WORLD",0
```

In this example:
- The program starts at the standard BASIC program start address ($0801).
- The X register is initialized to 0 to serve as an index for the message.
- The `PRINT_LOOP` loads each character of the message into the accumulator and calls CHROUT to print it.
- The loop continues until the null terminator (0) is encountered, signaling the end of the message.
- The program then returns from the subroutine.

This example demonstrates how to use the CHROUT subroutine to output a string to the screen in assembly language.

## Key Registers
- $FFD2 - KERNAL - CHROUT subroutine (send A register to current output channel; preserves A/X/Y)

## References
- "common_kernal_subroutines_table" — expands on CHROUT location and role  
- "printing_single_character_steps" — expands on how to use CHROUT to print a single character