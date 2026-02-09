# Build and Write Tape Header (ROM $F76F–$F7CF)

**Summary:** This routine constructs a tape header in the tape buffer using zero-page pointers ($B2, $BB, $B7, $9E, $9F), saves and restores I/O and tape end addresses ($C1/$C2, $AE/$AF), sets tape buffer start/end pointers (JSR $F7D7), stores a write lead cycle count ($AB), and calls the tape-write entry (JSR $F86B).

**Description**

This ROM routine assembles a tape header in the tape buffer and initiates a tape write. High-level steps:

- **Early exit:** The routine begins with a `BCC $F7CF` instruction, which branches to the return statement (`RTS`) if the carry flag is clear. The behavior of this branch depends on the carry flag state set prior to entry.
- **Save current addresses:** Push the current I/O start address (low byte in $C1, high byte in $C2) and tape end address (low byte in $AE, high byte in $AF) onto the stack.
- **Clear header region:** Fill the header buffer with the SPACE character ($20) from the end of the buffer (index $BF) down to the start.
- **Write header type:** Store the header type from $9E into the buffer.
- **Write addresses into header:** Insert the I/O start and tape end addresses into the header buffer in sequence: $C1, $C2, $AE, $AF.
- **Save index:** Store the resulting index in $9F.
- **Copy file name:** Clear $9E (used as the file-name index) and copy the file-name bytes from the pointer at $BB into the header buffer, looping for the length specified in $B7.
- **Set buffer pointers:** Call JSR $F7D7 to set tape buffer start and end pointers.
- **Set write lead cycle count:** Set $AB to #$69.
- **Initiate tape write:** Call JSR $F86B to perform the tape write.
- **Restore saved addresses:** Pull the saved tape end and I/O start addresses from the stack and restore them to $AE/$AF and $C1/$C2, respectively.
- **Return:** Execute `RTS` to return from the routine.

**Notes:**

- $9E serves dual purposes: it holds the header type initially and is later used as the file-name index after being cleared.
- The initial `BCC` at $F76F branches if the carry flag is clear. The behavior of this branch depends on the carry flag state set prior to entry.

## Source Code

```asm
.,F76F 90 5E    BCC $F7CF       ; Branch to RTS if carry is clear
.,F771 A5 C2    LDA $C2         ; Load I/O start address high byte
.,F773 48       PHA             ; Push onto stack
.,F774 A5 C1    LDA $C1         ; Load I/O start address low byte
.,F776 48       PHA             ; Push onto stack
.,F777 A5 AF    LDA $AF         ; Load tape end address high byte
.,F779 48       PHA             ; Push onto stack
.,F77A A5 AE    LDA $AE         ; Load tape end address low byte
.,F77C 48       PHA             ; Push onto stack
.,F77D A0 BF    LDY #$BF        ; Set index to header end
.,F77F A9 20    LDA #$20        ; Load SPACE character
.,F781 91 B2    STA ($B2),Y     ; Store in header buffer
.,F783 88       DEY             ; Decrement index
.,F784 D0 FB    BNE $F781       ; Loop until index is zero
.,F786 A5 9E    LDA $9E         ; Load header type
.,F788 91 B2    STA ($B2),Y     ; Store in header buffer
.,F78A C8       INY             ; Increment index
.,F78B A5 C1    LDA $C1         ; Load I/O start address low byte
.,F78D 91 B2    STA ($B2),Y     ; Store in header buffer
.,F78F C8       INY             ; Increment index
.,F790 A5 C2    LDA $C2         ; Load I/O start address high byte
.,F792 91 B2    STA ($B2),Y     ; Store in header buffer
.,F794 C8       INY             ; Increment index
.,F795 A5 AE    LDA $AE         ; Load tape end address low byte
.,F797 91 B2    STA ($B2),Y     ; Store in header buffer
.,F799 C8       INY             ; Increment index
.,F79A A5 AF    LDA $AF         ; Load tape end address high byte
.,F79C 91 B2    STA ($B2),Y     ; Store in header buffer
.,F79E C8       INY             ; Increment index
.,F79F 84 9F    STY $9F         ; Save index
.,F7A1 A0 00    LDY #$00        ; Clear Y
.,F7A3 84 9E    STY $9E         ; Clear file-name index
.,F7A5 A4 9E    LDY $9E         ; Load file-name index
.,F7A7 C4 B7    CPY $B7         ; Compare with file name length
.,F7A9 F0 0C    BEQ $F7B7       ; If equal, exit loop
.,F7AB B1 BB    LDA ($BB),Y     ; Load file name byte
.,F7AD A4 9F    LDY $9F         ; Load buffer index
.,F7AF 91 B2    STA ($B2),Y     ; Store file name byte in buffer
.,F7B1 E6 9E    INC $9E         ; Increment file-name index
.,F7B3 E6 9F    INC $9F         ; Increment buffer index
.,F7B5 D0 EE    BNE $F7A5       ; Loop
.,F7B7 20 D7 F7 JSR $F7D7       ; Set tape buffer start and end pointers
.,F7BA A9 69    LDA #$69        ; Set write lead cycle count
.,F7BC 85 AB    STA $AB         ; Store in $AB
.,F7BE 20 6B F8 JSR $F86B       ; Perform tape write
.,F7C1 A8       TAY             ; Transfer result to Y
.,F7C2 68       PLA             ; Restore tape end address low byte
.,F7C3 85 AE    STA $AE         ; Store in $AE
.,F7C5 68       PLA             ; Restore tape end address high byte
.,F7C6 85 AF    STA $AF         ; Store in $AF
.,F7C8 68       PLA             ; Restore I/O start address low byte
.,F7C9 85 C1    STA $C1         ; Store in $C1
.,F7CB 68       PLA             ; Restore I/O start address high byte
.,F7CC 85 C2    STA $C2         ; Store in $C2
.,F7CE 98       TYA             ; Transfer Y to A
.,F7CF 60       RTS             ; Return
```

## Key Registers

- **$C1**: Zero Page - I/O start address, low byte
- **$C2**: Zero Page - I/O start address, high byte
- **$AE**: Zero Page - Tape end address, low byte
- **$AF**: Zero Page - Tape end address, high byte
- **$B2**: Zero Page - Pointer (indirect), tape header buffer base used with Y (STA ($B2),Y)
- **$BB**: Zero Page - Pointer (indirect), file-name source used with Y (LDA ($BB),Y)
- **$B7**: Zero Page - File name length (compare against name index)
- **$9E**: Zero Page - Header type (also reused as name index after clearing)
- **$9F**: Zero Page - Tape buffer index / header write index
- **$AB**: Zero Page - Write lead cycle count (set to #$69 prior to write)

## References

- "set_tape_buffer_start_and_end_pointers" — derives I/O and end pointers from buffer start (JSR $F7D7)
- "initiate_tape_write" — calls the tape write entry (JSR $F86B)
- "get_tape_buffer_start_pointer" — helper used by the set-pointer routine