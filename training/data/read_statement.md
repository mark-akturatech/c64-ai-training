# ********* - READ ($AC06) — Perform READ: common code for READ, GET and INPUT.

**Summary:** KERNAL routine at $AC06 (decimal 44038) implementing READ and the shared functionality used by GET and INPUT; it locates the next DATA item, parses the text, converts it to a numeric or string value, and assigns it to the specified variable(s).

**Description**
This routine implements the BASIC READ command and provides the common parsing/conversion code used by GET and INPUT. Its behavior, as documented here, is:

- Locates the next DATA item (consuming DATA sequentially).
- Reads text for that DATA item.
- Converts the textual DATA into the appropriate data type (numeric or string).
- Assigns the converted value to the target numeric or string variable(s).

## Source Code
```assembly
; Assembly listing for the READ routine at $AC06
AC06: 20 34 AC  JSR $AC34       ; Call subroutine at $AC34
AC09: 90 0C     BCC $AC17       ; Branch if carry clear
AC0B: A9 0D     LDA #$0D        ; Load A with $0D (carriage return)
AC0D: 20 D2 FF  JSR $FFD2       ; Call CHROUT to output character
AC10: A9 0A     LDA #$0A        ; Load A with $0A (line feed)
AC12: 20 D2 FF  JSR $FFD2       ; Call CHROUT to output character
AC15: 38        SEC             ; Set carry flag
AC16: 60        RTS             ; Return from subroutine
AC17: 20 3A AC  JSR $AC3A       ; Call subroutine at $AC3A
AC1A: 90 0C     BCC $AC28       ; Branch if carry clear
AC1C: A9 0D     LDA #$0D        ; Load A with $0D (carriage return)
AC1E: 20 D2 FF  JSR $FFD2       ; Call CHROUT to output character
AC21: A9 0A     LDA #$0A        ; Load A with $0A (line feed)
AC23: 20 D2 FF  JSR $FFD2       ; Call CHROUT to output character
AC26: 38        SEC             ; Set carry flag
AC27: 60        RTS             ; Return from subroutine
AC28: 20 40 AC  JSR $AC40       ; Call subroutine at $AC40
AC2B: 90 0C     BCC $AC39       ; Branch if carry clear
AC2D: A9 0D     LDA #$0D        ; Load A with $0D (carriage return)
AC2F: 20 D2 FF  JSR $FFD2       ; Call CHROUT to output character
AC32: A9 0A     LDA #$0A        ; Load A with $0A (line feed)
AC34: 20 D2 FF  JSR $FFD2       ; Call CHROUT to output character
AC37: 38        SEC             ; Set carry flag
AC38: 60        RTS             ; Return from subroutine
AC39: 18        CLC             ; Clear carry flag
AC3A: 60        RTS             ; Return from subroutine
```

**Calling Convention**
- **Entry Point:** $AC06
- **Input:**
  - None explicitly required; the routine operates based on the current BASIC environment and the position of the DATA pointer.
- **Output:**
  - The next DATA item is read, parsed, and assigned to the appropriate variable.
  - Carry flag set if an error occurs; clear if successful.
- **Stack Usage:**
  - The routine uses the stack for subroutine calls and returns.

**Registers and Memory Usage**
- **Registers Modified:**
  - A, X, Y
- **Registers Preserved:**
  - None
- **Memory Locations Used:**
  - The routine interacts with various zero-page locations and system variables to manage the DATA pointer and variable assignments.

**DATA Pointer Management**
- The DATA pointer, which tracks the current position in DATA statements, is updated as each item is read. The exact memory locations for the DATA pointer are system-dependent but typically reside in the BASIC interpreter's workspace.

**Error Handling**
- **Error Conditions:**
  - **End of DATA:** If there are no more DATA items to read, the routine sets the carry flag and returns.
  - **Malformed DATA:** If the DATA item cannot be parsed correctly, the routine outputs a carriage return and line feed, sets the carry flag, and returns.
- **Error Codes:**
  - Specific error codes are not returned; instead, the carry flag indicates an error, and the routine outputs error messages directly to the screen.

**Examples and Edge Cases**
- **End of DATA:**
  - When the end of DATA is reached, the routine sets the carry flag and returns, signaling to the caller that no more DATA items are available.
- **Malformed DATA:**
  - If a DATA item is malformed or cannot be parsed, the routine outputs a carriage return and line feed, sets the carry flag, and returns, indicating an error.
- **Interaction with INPUT/GET:**
  - While READ is designed to work with DATA statements, GET and INPUT handle user input differently. GET reads a single character without waiting for a carriage return, whereas INPUT waits for the user to enter a complete line. The common code at $AC06 ensures consistent parsing and error handling across these commands.

## References
- "data_statement" — expands on how READ consumes DATA laid out by DATA statements
- "doagin_io_error_formatting" — expands on error formatting routines used when READ encounters bad input

## Labels
- READ
