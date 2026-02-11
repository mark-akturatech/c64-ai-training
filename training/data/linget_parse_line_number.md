# ********* - LINGET ($A96B) — Convert an ASCII decimal number to a two-byte binary line number

**Summary:** LINGET at $A96B parses an ASCII decimal number and converts it to a two-byte binary line number (low-byte, high-byte). It validates that the resulting integer is within the BASIC line range 0–63999. Search terms: $A96B, LINGET, ASCII decimal, two-byte, BASIC line range.

**Description**
LINGET is a utility subroutine used by multiple BASIC statement parsers to obtain a line-number operand supplied as ASCII decimal text. It:

- Parses a decimal ASCII number from the current parse buffer/input.
- Converts the decimal text into a 16-bit binary integer represented as two bytes: low byte first, then high byte.
- Verifies the binary value is within the legal BASIC line number range 0–63999 inclusive.

The routine is referenced by statement handlers that need line targets (for example, GOTO, ON GOTO/ON GOSUB). Callers expect LINGET to return a two-byte binary line number (low/high) and to perform range checking before returning control.

## Source Code
```assembly
; LINGET - Convert ASCII decimal number to two-byte binary line number
; Entry: TXTPTR points to the first digit of the ASCII number
; Exit:  $14/$15 contains the binary line number (low byte/high byte)
;        TXTPTR points to the first non-digit character
;        A contains the first non-digit character
;        Carry set if non-digit character is a terminator (e.g., space, comma)
;        Carry clear if non-digit character is invalid
;        Zero flag set if no digits were found

LINGET:
    LDX #$00        ; Initialize X to 0
    STX $14         ; Clear low byte of line number
    STX $15         ; Clear high byte of line number

    JSR CHRGET      ; Get next character from input
    BCS LINGET_EXIT ; If not a digit, exit

LINGET_LOOP:
    SBC #$2F        ; Convert ASCII '0'-'9' to binary 0-9
    STA $07         ; Store the digit in $07

    LDA $15         ; Load high byte of current line number
    STA $22         ; Store it in $22
    CMP #$19        ; Compare with 25 (high byte of 6400)
    BCS LINGET_ERROR; If greater, line number is out of range

    LDA $14         ; Load low byte of current line number
    ASL             ; Multiply by 2
    ROL $22         ; Rotate high byte
    ASL             ; Multiply by 4
    ROL $22         ; Rotate high byte
    ADC $14         ; Add original low byte (x5)
    STA $14         ; Store new low byte
    LDA $22         ; Load high byte
    ADC $15         ; Add original high byte
    STA $15         ; Store new high byte

    ASL $14         ; Multiply by 2 (x10 total)
    ROL $15         ; Rotate high byte

    LDA $14         ; Load low byte
    ADC $07         ; Add current digit
    STA $14         ; Store new low byte
    BCC LINGET_NEXT ; If no carry, continue
    INC $15         ; Otherwise, increment high byte

LINGET_NEXT:
    JSR CHRGET      ; Get next character
    BCS LINGET_LOOP ; If it's a digit, process it

LINGET_EXIT:
    RTS             ; Return

LINGET_ERROR:
    JMP SYNTAX_ERROR; Jump to syntax error handler
```

## Key Registers
- **$14/$15**: Stores the resulting two-byte binary line number (low byte/high byte).
- **A**: Contains the first non-digit character upon exit.
- **Carry Flag**: Set if the non-digit character is a valid terminator (e.g., space, comma); clear if invalid.
- **Zero Flag**: Set if no digits were found during parsing.

## References
- "goto_statement" — expands on GOTO use of LINGET to parse target line numbers
- "on_goto_on_gosub_statement" — expands on ON GOTO/GOSUB use of LINGET for line numbers

## Labels
- LINGET
