# ********* - Subroutine: Collect a String

**Summary:** Subroutine at $B606 (decimal 46598) used by the BASIC garbage collector to move a string's bytes up into high string memory and update the string descriptor; typically invoked after "garbag_check_most_eligible" and commonly uses the MOVINS utility (see "movins_move_string") to copy bytes.

**Operation**

This routine is the string-moving step of the garbage-collection process. Its observable behavior:

- Moves the text bytes of a string upward into high string memory (toward the bottom of the string storage area).
- Updates the string descriptor so that the descriptor now points to the string's new location in high memory.
- Is part of the collector flow that runs after eligibility selection (see "garbag_check_most_eligible").
- Commonly delegates the actual byte transfer to the MOVINS utility ("movins_move_string") rather than copying bytes inline.

## Source Code

```assembly
; Subroutine: Collect a String
; Address: $B606

B606   20 0C B6   JSR $B60C   ; Call MOVINS to move the string
B609   4C 26 B6   JMP $B626   ; Jump to update the string descriptor

; MOVINS subroutine
B60C   A0 00      LDY #$00    ; Initialize index register Y to 0
B60E   B1 62      LDA ($62),Y ; Load byte from source string
B610   91 6C      STA ($6C),Y ; Store byte to destination string
B612   C8         INY         ; Increment index register Y
B613   D0 F9      BNE $B60E   ; Loop until all bytes are moved
B615   60         RTS         ; Return from subroutine

; Update string descriptor
B626   A5 6C      LDA $6C     ; Load low byte of new string address
B628   85 62      STA $62     ; Store it in the string descriptor
B62A   A5 6D      LDA $6D     ; Load high byte of new string address
B62C   85 63      STA $63     ; Store it in the string descriptor
B62E   60         RTS         ; Return from subroutine
```

## Key Registers

- **$62/$63**: Pointer to the source string.
- **$6C/$6D**: Pointer to the destination in high string memory.

## References

- "garbag_check_most_eligible" — determines which strings are eligible for collection
- "movins_move_string" — the MOVINS utility commonly used to move string bytes during collection