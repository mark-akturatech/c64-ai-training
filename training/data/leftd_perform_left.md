# LEFTD ($B700) — Perform LEFT$ (create temporary string descriptor)

**Summary:** LEFTD at $B700 (DEC 46848) implements the BASIC LEFT$ function by creating a temporary string descriptor containing a specified number of characters taken from the left side of a source string.

**Description**

LEFTD is the routine that performs the BASIC LEFT$ operation. It constructs a temporary string descriptor for a new string whose contents are the leftmost N characters of a source string, where N is supplied as the length parameter.

Behavioral notes:

- Creates a temporary string descriptor in the BASIC string descriptor format.
- Copies the specified number of characters from the left side (start) of the source string into the new temporary descriptor.
- Utilizes a shared parameter-pulling routine used by LEFT$, RIGHT$, and MID$ (see "pream_pull_string_params").
- RIGHT$ reuses LEFT$'s tail-end logic by manipulating parameters (see "rightd_perform_right$").

## Source Code

```assembly
; LEFTD routine at $B700
LEFTD:
    JSR pream_pull_string_params  ; Pull parameters: source string descriptor and length
    LDA LEN                        ; Load length parameter
    BEQ return_empty_string        ; If length is zero, return empty string
    CMP #$FF                       ; Compare length with 255
    BCC length_ok                  ; If less than 255, length is OK
    LDA #$FF                       ; Otherwise, set length to 255
length_ok:
    STA TEMP_LEN                   ; Store length in temporary variable
    LDX SRC_LEN                    ; Load source string length
    CPX TEMP_LEN                   ; Compare source length with requested length
    BCS copy_chars                 ; If source length >= requested length, proceed to copy
    STX TEMP_LEN                   ; Otherwise, set length to source length
copy_chars:
    LDA TEMP_LEN                   ; Load final length
    STA DEST_LEN                   ; Store in destination descriptor
    LDA SRC_PTR_LO                 ; Load source string pointer (low byte)
    STA SRC_PTR                    ; Store in source pointer
    LDA SRC_PTR_HI                 ; Load source string pointer (high byte)
    STA SRC_PTR+1                  ; Store in source pointer
    JSR allocate_temp_string       ; Allocate space for temporary string
    LDX TEMP_LEN                   ; Load length
    BEQ return_string              ; If length is zero, return string
copy_loop:
    LDA (SRC_PTR),Y                ; Load character from source
    STA (DEST_PTR),Y               ; Store character in destination
    INY                            ; Increment index
    DEX                            ; Decrement length
    BNE copy_loop                  ; Repeat until all characters are copied
return_string:
    JMP return_temp_string         ; Return temporary string descriptor
return_empty_string:
    JSR allocate_empty_string      ; Allocate empty string
    JMP return_temp_string         ; Return empty string descriptor
```

## Key Registers

- **SRC_PTR**: Pointer to the source string.
- **SRC_LEN**: Length of the source string.
- **TEMP_LEN**: Temporary storage for the length parameter.
- **DEST_PTR**: Pointer to the destination (temporary) string.
- **DEST_LEN**: Length of the destination string.

## References

- "pream_pull_string_params" — Routine to pull parameters for string functions.
- "rightd_perform_right$" — Routine where RIGHT$ reuses LEFT$'s logic.

## Labels
- LEFTD
- SRC_PTR
- SRC_LEN
- TEMP_LEN
- DEST_PTR
- DEST_LEN
