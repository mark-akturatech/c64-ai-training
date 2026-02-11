# Garbage collection: initialize string-space and descriptor-stack loop ($B526–$B54B)

**Summary:** Initializes garbage-collection state for string variables by setting bottom-of-string-space ($33/$34) from $37/$38, clearing the working pointer ($4E/$4F), initializing the highest-uncollected-string pointer ($5F/$60) from end-of-arrays ($31/$32), setting the descriptor-stack pointer ($22/$23) to #$19, and repeatedly JSR $B5C7 (descriptor salvageability check) until the descriptor stack is exhausted.

## Routine overview
This ROM fragment prepares and drives the string-variable garbage-collection loop:

- Reloads the "end of memory" address from $37/$38 and writes it into the bottom-of-string-space pointers $33/$34 so the collector restarts from the last known end-of-strings area.
- Clears the 16-bit working pointer (zeroes $4E/$4F) used by later compaction code.
- Copies the end-of-arrays pointer at $31/$32 into $5F/$60 to mark the highest uncollected string address.
- Initializes the descriptor-stack pointer to low-byte #$19 and high-byte $00 (stored to $22/$23).
- Compares A (containing #$19) with $16 (current descriptor-stack pointer) and, if not equal, calls the salvageability check at $B5C7 (JSR $B5C7). After the subroutine returns, the code branches back to the compare and repeats until $16 equals #$19 (descriptor stack exhausted).

Behavioral notes:
- The JSR $B5C7 invoked in the loop performs the actual test/processing of a descriptor (see referenced chunk "check_string_salvageability_for_variables_and_update_pointers").
- The loop exits when the descriptor stack pointer equals the initial value (#$19), indicating no more descriptors to examine.
- Values stored/loaded are 16-bit pairs in little-endian (low byte first).

## Source Code
```asm
                                *** garbage collection routine
.,B526 A6 37    LDX $37         get end of memory low byte
.,B528 A5 38    LDA $38         get end of memory high byte
                                re-run routine from last ending
.,B52A 86 33    STX $33         set bottom of string space low byte
.,B52C 85 34    STA $34         set bottom of string space high byte
.,B52E A0 00    LDY #$00        clear index
.,B530 84 4F    STY $4F         clear working pointer high byte
.,B532 84 4E    STY $4E         clear working pointer low byte
.,B534 A5 31    LDA $31         get end of arrays low byte
.,B536 A6 32    LDX $32         get end of arrays high byte
.,B538 85 5F    STA $5F         save as highest uncollected string pointer low byte
.,B53A 86 60    STX $60         save as highest uncollected string pointer high byte
.,B53C A9 19    LDA #$19        set descriptor stack pointer
.,B53E A2 00    LDX #$00        clear X
.,B540 85 22    STA $22         save descriptor stack pointer low byte
.,B542 86 23    STX $23         save descriptor stack pointer high byte ($00)
.,B544 C5 16    CMP $16         compare with descriptor stack pointer
.,B546 F0 05    BEQ $B54D       branch if =
.,B548 20 C7 B5 JSR $B5C7       check string salvageability
.,B54B F0 F7    BEQ $B544       loop always
```

## Key Registers
- $31-$32 - Zero Page - end-of-arrays pointer (low/high)
- $33-$34 - Zero Page - bottom-of-string-space pointer (low/high)
- $37-$38 - Zero Page - source end-of-memory pointer used to set bottom-of-string-space (low/high)
- $4E-$4F - Zero Page - working pointer (low/high), cleared here
- $5F-$60 - Zero Page - highest uncollected string pointer (low/high), set from $31/$32
- $16 - Zero Page - descriptor-stack pointer currently in use (compared against #$19)
- $22-$23 - Zero Page - descriptor-stack pointer initialized here to $19/$00 (low/high)

## References
- "collect_string_variables_setup_and_loop" — continues after descriptor stack setup to collect variables
- "check_string_salvageability_for_variables_and_update_pointers" — implements the JSR $B5C7 salvageability check called here
- "collect_string_and_compact_memory" — performs move/compaction when a string is chosen for collection