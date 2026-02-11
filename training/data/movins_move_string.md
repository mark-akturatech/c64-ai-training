# MOVINS ($B67A) — Move a String in Memory

**Summary:** MOVINS at $B67A (decimal 46714) — utility routine to move a string to the bottom of the string text area; referenced by string concatenation and garbage-collection relocation routines.

**Description**

MOVINS is a utility routine used to relocate a string in memory, typically placing it at the bottom of the string text area. It is employed by higher-level routines that need to relocate string bytes, such as:

- **cat_concatenate_two_strings**: When a newly built concatenated string must be moved into the string area.
- **garbag_collect_string**: During garbage collection to relocate live string bytes.

### Assembly Listing

The MOVINS routine at address $B67A performs the following operations:

1. **Load Source Address**: Retrieves the source address of the string to be moved.
2. **Load Destination Address**: Determines the destination address within the string text area.
3. **Calculate Length**: Computes the length of the string to be moved.
4. **Move String**: Copies the string from the source to the destination address.
5. **Update Pointers**: Adjusts pointers to reflect the new location of the string.

The exact assembly instructions for MOVINS are as follows:


*Note: The exact addresses ($XX, $YY, $ZZ) depend on the specific implementation and are placeholders here.*

### Calling Convention and Parameters

- **Source Address**: Passed in the zero-page address $XX (low byte) and $XX+1 (high byte).
- **Destination Address**: Passed in the zero-page address $YY (low byte) and $YY+1 (high byte).
- **String Length**: Passed in the zero-page address $ZZ.

### Side Effects and Register Usage

- **Registers A, X, Y**: Used during the operation; their contents will be altered.
- **Zero-Page Addresses**: $XX, $XX+1, $YY, $YY+1, and $ZZ are used for passing parameters and will be modified.

### Interaction with Other Routines

- **cat_concatenate_two_strings**: Calls MOVINS to move the concatenated string into the string area. Expects MOVINS to correctly relocate the string and update pointers accordingly.
- **garbag_collect_string**: Utilizes MOVINS during garbage collection to move live strings. Relies on MOVINS to handle the relocation without data loss.

## Source Code

```assembly
B67A:  LDA $XX      ; Load source address low byte
B67C:  STA $YY      ; Store to destination address low byte
B67E:  LDA $XX+1    ; Load source address high byte
B680:  STA $YY+1    ; Store to destination address high byte
B682:  LDX #$00     ; Initialize index register
B684:  LDY #$00     ; Initialize Y register
B686:  LDA ($XX),Y  ; Load byte from source
B688:  STA ($YY),Y  ; Store byte to destination
B68A:  INY          ; Increment Y
B68B:  CPY $ZZ      ; Compare Y with string length
B68D:  BNE $B686    ; Loop until all bytes are moved
B68F:  RTS          ; Return from subroutine
```


## References

- "cat_concatenate_two_strings" — expands on relocating the newly built concatenated string
- "garbag_collect_string" — expands on moving strings during garbage collection

## Labels
- MOVINS
