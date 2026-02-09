# MACHINE — Challenge exercises: file counts, PRINT#→machine, printer/typewriter utilities

**Summary:** Exercises for writing machine-language programs that read sequential files and count characters (letter "S" and RETURN $0D), send text to the printer (PRINT# style, e.g., OPEN 15,8,15:PRINT#15,"S0:JUNK"), and implement a typed-input printer utility that echoes to screen and handles DELETE.

**Exercises**

1. **Count occurrences of the letter "S" in a sequential file.**
   - Count the number of times the character "S" appears in a sequential file. The source states "hex 41" for "S" (see note below). Use a BASIC PEEK to display the final count. You may assume the count will not exceed 255 (one byte).

   **[Note: Source may contain an error — ASCII "S" is $53, not $41.]**

2. **Count occurrences of the RETURN character in a sequential file.**
   - Count the number of times RETURN (character $0D) appears. Allow for up to 65,535 occurrences (two-byte counter). Consider what this count represents (for example, number of newline/record separators).

3. **Print "HAPPY NEW YEAR" to the printer ten times.**
   - Produce a program that sends the string "HAPPY NEW YEAR" to the printer device ten times.

4. **Convert a DOS PRINT# command to machine language to scratch a file.**
   - The BASIC sequence shown to scratch a disk file named JUNK is:
   - Convert the PRINT# portion to machine-language bytes that send the DOS command string to device channel 15. (Warning: do not accidentally delete a needed file.)

5. **Typewriter program: keyboard → screen + printer with DELETE handling.**
   - Write a program that reads a line from the keyboard, echoes what is typed to the screen, and forwards it to the printer. Include handling for the DELETE key so typed editing is reflected both on-screen and in the transmitted output to the printer.

## Source Code

     ```basic
     OPEN 15,8,15:PRINT#15,"S0:JUNK"
     ```


```assembly
; Exercise 1: Count occurrences of the letter "S" in a sequential file
; Assumes file is already opened as logical file number 1
; and assigned to input channel

        LDX #$00          ; Initialize count to 0
        STX COUNT

READ_LOOP:
        JSR CHRIN         ; Read a character from the file
        CMP #$53          ; Compare with ASCII 'S'
        BNE NOT_S
        INC COUNT         ; Increment count if 'S' is found

NOT_S:
        JSR READST        ; Check status
        AND #$40          ; End of file reached?
        BEQ READ_LOOP     ; If not, continue reading

        ; At this point, COUNT contains the number of 'S' characters
        ; Display COUNT using a BASIC PEEK or other method

        RTS

COUNT:  .BYTE $00
```

```assembly
; Exercise 2: Count occurrences of the RETURN character in a sequential file
; Assumes file is already opened as logical file number 1
; and assigned to input channel

        LDX #$00          ; Initialize low byte of count to 0
        LDY #$00          ; Initialize high byte of count to 0
        STX COUNT_LO
        STY COUNT_HI

READ_LOOP:
        JSR CHRIN         ; Read a character from the file
        CMP #$0D          ; Compare with RETURN character
        BNE NOT_RETURN
        INC COUNT_LO      ; Increment low byte of count
        BNE NO_CARRY
        INC COUNT_HI      ; Increment high byte if low byte overflows

NO_CARRY:
NOT_RETURN:
        JSR READST        ; Check status
        AND #$40          ; End of file reached?
        BEQ READ_LOOP     ; If not, continue reading

        ; At this point, COUNT_LO and COUNT_HI contain the number of RETURN characters
        ; Display COUNT_LO and COUNT_HI using a BASIC PEEK or other method

        RTS

COUNT_LO: .BYTE $00
COUNT_HI: .BYTE $00
```

```assembly
; Exercise 3: Print "HAPPY NEW YEAR" to the printer ten times
; Assumes printer is device 4

        LDA #$04          ; Logical file number
        LDX #$04          ; Device number (printer)
        LDY #$00          ; Secondary address
        JSR SETLFS

        LDA #$0E          ; Length of filename
        LDX #<FILENAME
        LDY #>FILENAME
        JSR SETNAM

        JSR OPEN          ; Open the file
        BCS ERROR         ; Branch if error

        LDA #$04          ; Logical file number
        JSR CHKOUT        ; Set output channel
        BCS ERROR         ; Branch if error

        LDY #$00
PRINT_LOOP:
        LDA MESSAGE,Y
        BEQ DONE          ; End of message
        JSR CHROUT        ; Output character
        INY
        BNE PRINT_LOOP

DONE:
        JSR CLRCHN        ; Restore default I/O channels
        LDA #$04          ; Logical file number
        JSR CLOSE         ; Close the file
        RTS

ERROR:
        ; Handle error
        RTS

FILENAME: .BYTE "PRINTER",0
MESSAGE:  .BYTE "HAPPY NEW YEAR",13,0
```

```assembly
; Exercise 4: Convert a DOS PRINT# command to machine language to scratch a file
; Equivalent to: OPEN 15,8,15:PRINT#15,"S0:JUNK"

        LDA #$0F          ; Logical file number 15
        LDX #$08          ; Device number 8 (disk drive)
        LDY #$0F          ; Secondary address 15 (command channel)
        JSR SETLFS

        LDA #$00          ; Filename length 0 (not used)
        LDX #$00
        LDY #$00
        JSR SETNAM

        JSR OPEN          ; Open the command channel
        BCS ERROR         ; Branch if error

        LDA #$0F          ; Logical file number 15
        JSR CHKOUT        ; Set output channel
        BCS ERROR         ; Branch if error

        LDY #$00
COMMAND_LOOP:
        LDA COMMAND,Y
        BEQ COMMAND_DONE  ; End of command
        JSR CHROUT        ; Output character
        INY
        BNE COMMAND_LOOP

COMMAND_DONE:
        JSR CLRCHN        ; Restore default I/O channels
        LDA #$0F          ; Logical file number 15
        JSR CLOSE         ; Close the command channel
        RTS

ERROR:
        ; Handle error
        RTS

COMMAND: .BYTE "S0:JUNK",0
```

```assembly
; Exercise 5: Typewriter program: keyboard → screen + printer with DELETE handling
; Assumes printer is device 4

        LDA #$04          ; Logical file number
        LDX #$04          ; Device number (printer)
        LDY #$00          ; Secondary address
        JSR SETLFS

        LDA #$07          ; Length of filename
        LDX #<FILENAME
        LDY #>FILENAME
        JSR SETNAM

        JSR OPEN          ; Open the file
        BCS ERROR         ; Branch if error

        LDA #$04          ; Logical file number
        JSR CHKOUT        ; Set output channel
        BCS ERROR         ; Branch if error

INPUT_LOOP:
        JSR GETIN         ; Get character from keyboard
        BEQ INPUT_LOOP    ; If no key pressed, loop

        CMP #$14          ; DELETE key?
        BEQ HANDLE_DELETE

        JSR CHROUT        ; Output character to screen
        LDA #$04          ; Logical file number
        JSR CHKOUT        ; Set output channel to printer
        JSR CHROUT        ; Output character to printer
        JSR CLRCHN        ; Restore default I/O channels
        JMP INPUT_LOOP

HANDLE_DELETE:
        ; Handle DELETE key: remove character from screen and printer
        ; (Implementation depends on specific requirements)
        JMP INPUT_LOOP

ERROR:
        ; Handle error
        RTS

FILENAME: .BYTE "PRINTER",0
```

## Key Registers

- **$FFBA**: SETLFS – Set logical file parameters
- **$FFBD**: SETNAM – Set filename
- **$FFC0**: OPEN – Open a logical file
- **$FFC3**: CLOSE – Close a logical file
- **$FFC6**: CHKIN – Set input channel
- **$FFC9**: CHKOUT – Set output channel
- **$FFCC**: CLRCHN – Restore default I/O channels
- **$FFCF**: CHRIN – Input a character
- **$FFD2**: CHROUT – Output a character
- **$FFE4**: GETIN – Get a character from the keyboard
- **$FFB7**: READST – Read I/O status word

## References

- "file_transfer_program_machine_and_basic" — additional file-handling and transfer examples (searchable resource)
- Commodore 64 Programmer's Reference Guide
- Commodore 1541 User's Guide
- Commodore 64 KERNAL API Documentation