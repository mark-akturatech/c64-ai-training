# FRETMS ($B6DB) — Remove an entry from the string descriptor stack

**Summary:** Routine at $B6DB (FRETMS) removes a matching entry from the temporary string descriptor stack when a currently valid string's descriptor equals a stack entry; referenced by frestr_discard_temporary_string / FRESTR.

**Description**

If the descriptor of a currently valid string matches one of the entries on the temporary string descriptor stack, FRETMS removes that stack entry to keep descriptor bookkeeping consistent. The routine is intended to be invoked when temporary string descriptors must be discarded (see FRESTR / frestr_discard_temporary_string).

Behavioral note: the routine only removes stack entries that exactly match an active string descriptor; it is a housekeeping helper to avoid stale temporary descriptors.

## Source Code

```assembly
FRETMS:
    LDX TEMPPT        ; Load index of next available element on the temporary string descriptor stack
    DEX               ; Decrement to point to the last used descriptor
    DEX
    DEX
    BMI EXIT          ; If index is negative, stack is empty, exit

CHECK_DESCRIPTOR:
    LDA DSCTMP        ; Load length of current string descriptor
    CMP 0,X           ; Compare with length in stack entry
    BNE NEXT_ENTRY    ; If not equal, check next entry
    LDA DSCTMP+1      ; Load low byte of string pointer
    CMP 1,X           ; Compare with low byte in stack entry
    BNE NEXT_ENTRY    ; If not equal, check next entry
    LDA DSCTMP+2      ; Load high byte of string pointer
    CMP 2,X           ; Compare with high byte in stack entry
    BNE NEXT_ENTRY    ; If not equal, check next entry

REMOVE_ENTRY:
    TXA               ; Transfer index to accumulator
    SEC               ; Set carry flag for subtraction
    SBC #3            ; Subtract 3 to point to previous entry
    TAX               ; Transfer back to X
    BPL CHECK_DESCRIPTOR ; If index is non-negative, check next entry

EXIT:
    RTS               ; Return from subroutine

NEXT_ENTRY:
    DEX               ; Decrement index to point to previous entry
    DEX
    DEX
    BPL CHECK_DESCRIPTOR ; If index is non-negative, check next entry
    RTS               ; Return from subroutine
```

## Key Registers

- **TEMPPT ($0016):** Pointer to the next available element on the temporary string descriptor stack.
- **DSCTMP ($0061-$0063):** Temporary string descriptor containing length and pointer to the string.

## References

- "frestr_discard_temporary_string" — expands FRESTR and calls this routine to clear temporary descriptors.

## Labels
- TEMPPT
- DSCTMP
