# CAT ($B63D) - Concatenate Two Strings (A$ + B$)

**Summary:** Routine at $B63D that concatenates two BASIC strings (A$ + B$). It checks the combined length, calls `getspa_allocate_string_space` to reserve text-area space, and builds the new string at the bottom of the string text area (uses `movins_move_string` to move string bytes).

**Description**

This routine implements BASIC string concatenation: it appends the text of B$ onto A$ to produce A$+B$. Workflow:

- **Validate Combined Length:** Ensures the total length of A$ and B$ does not exceed 255 characters. If the combined length is greater than 255, the routine triggers a `?STRING TOO LONG ERROR` and halts execution.
- **Allocate Space:** Calls `getspa_allocate_string_space` to reserve space in the string text area for the concatenated result.
- **Build New String:** Constructs the new string at the bottom of the string text area by copying string data, utilizing `movins_move_string` to move the bytes.

The routine is part of the BASIC string management subsystem; it does not include the low-level copy or allocation code itself but invokes the named helper routines for those tasks.

## Source Code

```assembly
; CAT - Concatenate Two Strings
; Entry: A$ descriptor at (ptr1), B$ descriptor at (ptr2)
; Exit: Concatenated string descriptor at (ptr1)

CAT:
    ; Load length of A$ into X
    LDX $62
    ; Load length of B$ into A
    LDA $65
    ; Add lengths to get total length
    CLC
    ADC $62
    ; Check if total length exceeds 255
    BCC LENGTH_OK
    ; If carry set, length > 255, trigger error
    JMP STRING_TOO_LONG_ERROR

LENGTH_OK:
    ; Store total length in $61
    STA $61
    ; Call getspa_allocate_string_space to allocate space
    JSR GETSPA
    ; Move A$ into allocated space
    LDX $62
    LDY $63
    LDA $64
    STA $66
    LDA $65
    STA $67
    JSR MOVINS
    ; Move B$ into allocated space
    LDX $65
    LDY $66
    LDA $67
    STA $66
    LDA $68
    STA $67
    JSR MOVINS
    ; Update descriptor at (ptr1) to point to new string
    LDA $66
    STA $62
    LDA $67
    STA $63
    LDA $61
    STA $64
    RTS

STRING_TOO_LONG_ERROR:
    ; Trigger ?STRING TOO LONG ERROR
    LDA #$0A
    JMP ERROR
```

## Key Registers

- **$61:** Total length of the concatenated string.
- **$62/$63:** Pointer to the start of the concatenated string.
- **$64/$65:** Pointer to the start of A$.
- **$66/$67:** Pointer to the start of B$.

## References

- `movins_move_string` — Moves string data when building the concatenated result.
- `getspa_allocate_string_space` — Allocates string space for the concatenated string.