# Switching input: CHKIN ($FFC6) and CLRCHN ($FFCC)

**Summary:** CHKIN ($FFC6) switches GETIN ($FFE4) input to a previously OPENed logical file (X = file number); CLRCHN ($FFCC) restores keyboard/screen input. GETIN returns a character in A (file CHR$(0) is a real zero), ST (at $0090 on VIC/C64, $0096 on PET/CBM) signals end-of-file/errors, and A/X and status flags (carry on VIC/C64) may be changed by the calls.

**Switching Input**

**CHKIN ($FFC6):**
- Call with X = logical file number (file must already be OPENed).
- Switches the input path used by KERNAL GETIN ($FFE4) so subsequent GETIN reads come from that logical file.
- Registers A and X are altered by the CHKIN call; save them if needed.
- Status flags may change; on VIC and C64 the carry flag indicates an error connecting to the channel.

**CLRCHN ($FFCC):**
- Restores input to keyboard/screen (disconnects the logical file from the input path).

**GETIN ($FFE4):**
- Reads a single input character into A.
- When reading from a file, a binary zero is returned as a bona fide CHR$(0). This differs from keyboard GETIN semantics where A=0 means “no key pressed.”

**ST ($0090 on VIC/C64, $0096 on PET/CBM):**
- Used to detect end-of-file or error after file input operations (standard BASIC/KERNAL status byte usage).
- Disk status can also be obtained via secondary address 15 on a command channel (requires a command channel to be OPENed).

**Practical notes:**
- CHKIN/CLRCHN simply connect/disconnect input paths; they are not OPEN/CLOSE.
- You may switch input repeatedly while a file remains OPEN.

To switch input to logical file 1, follow these steps:

1. **Open the file:**
   - Use the KERNAL OPEN routine to open the desired file and assign it a logical file number. For example, to open a file named "DATA" on device 8 with logical file number 1:
     Ensure that the filename is defined elsewhere in your code:

2. **Switch input to the logical file:**
   - Load the X register with the logical file number and call CHKIN:

3. **Read data from the file:**
   - Use GETIN to read a character from the file:
     The character will be returned in the accumulator (A). Check the status byte (ST) for end-of-file or errors:

4. **Restore input to the keyboard:**
   - After reading the necessary data, call CLRCHN to restore the default input:

5. **Close the file:**
   - Finally, close the file using the CLOSE routine:

## Source Code

     ```assembly
     LDA #1          ; Logical file number
     LDX #8          ; Device number (e.g., 8 for disk drive)
     LDY #0          ; Secondary address
     JSR $FFBA       ; SETLFS - Set logical file parameters

     LDA #4          ; Length of filename
     LDX #<FILENAME  ; Low byte of filename address
     LDY #>FILENAME  ; High byte of filename address
     JSR $FFBD       ; SETNAM - Set filename

     JSR $FFC0       ; OPEN - Open the file
     ```

     ```assembly
     FILENAME .BYTE "DATA"
     ```

     ```assembly
     LDX #1          ; Logical file number
     JSR $FFC6       ; CHKIN - Switch input to logical file X
     ```

     ```assembly
     JSR $FFE4       ; GETIN - Get character from input
     ```

     ```assembly
     BIT $0090       ; Test ST for EOF/error
     BVC NO_ERROR    ; Branch if no error
     ; Handle error condition here
     NO_ERROR:
     ```

     ```assembly
     JSR $FFCC       ; CLRCHN - Restore keyboard/screen input
     ```

     ```assembly
     LDA #1          ; Logical file number
     JSR $FFC3       ; CLOSE - Close the file
     ```


```assembly
; Open file "DATA" on device 8 with logical file number 1
    LDA #1          ; Logical file number
    LDX #8          ; Device number
    LDY #0          ; Secondary address
    JSR $FFBA       ; SETLFS - Set logical file parameters

    LDA #4          ; Length of filename
    LDX #<FILENAME  ; Low byte of filename address
    LDY #>FILENAME  ; High byte of filename address
    JSR $FFBD       ; SETNAM - Set filename

    JSR $FFC0       ; OPEN - Open the file

; Switch input to logical file 1
    LDX #1          ; Logical file number
    JSR $FFC6       ; CHKIN - Switch input to logical file X

; Read one character from the file
    JSR $FFE4       ; GETIN - Get character from input
    BIT $0090       ; Test ST for EOF/error
    BVC NO_ERROR    ; Branch if no error
    ; Handle error condition here
    NO_ERROR:

; Restore input to keyboard/screen
    JSR $FFCC       ; CLRCHN - Restore keyboard/screen input

; Close the file
    LDA #1          ; Logical file number
    JSR $FFC3       ; CLOSE - Close the file

; Define filename
FILENAME .BYTE "DATA"
```

## Key Registers

- $FFC6 - KERNAL - CHKIN (switch input path to logical file in X)
- $FFCC - KERNAL - CLRCHN (restore keyboard/screen input)
- $FFE4 - KERNAL - GETIN (read input character into A)
- $0090 - Zero Page (VIC/C64) - ST (EOF/error status byte used after file GETIN)
- $0096 - Zero Page (PET/CBM) - ST (EOF/error status byte used after file GETIN)

## References

- "input_example_read_sequential_file" — expands on Example reading a sequential file using CHKIN/GETIN and CLRCHN

## Labels
- CHKIN
- CLRCHN
- GETIN
- ST
