# Per-descriptor salvageability checks and pointer bookkeeping ($B5B8-$B605)

**Summary:** Routine tests each descriptor to decide whether it refers to a string (BMI/BPL tests), reads string length and pointer, skips null or non-string entries, compares the string pointer against bottom-of-string-space ($33/$34) and highest-uncollected-string ($5F/$60) to update bookkeeping, saves a working descriptor pointer ($4E/$4F) and copies the step size ($53 -> $55), advances the descriptor pointer by the step (handling carry), sets the "not moved" flag ($00 in Y) and returns (RTS).

## Description
This routine scans a descriptor at the pointer stored in $22/$23 (used with indirect Y) and:

- Calls the inlined check at $B5C7 to test string salvageability for descriptor types that are stored as strings.
- For variable-style descriptors it reads the name bytes via LDA ($22),Y and uses BMI/BPL tests to decide whether the descriptor represents a string; non-string descriptors are skipped.
- For string descriptors it reads: length (LDA ($22),Y), then pointer low/high (LDA ($22),Y twice), copying the low byte to X (TAX) for later comparison.
- Compares the string pointer (high byte vs $34, low vs $33) against bottom-of-string-space to detect strings that live below the movable region (already collected). If the pointer is below bottom-of-string-space the descriptor is treated as already collected.
- Compares the string pointer against the current highest-uncollected-string pointer ($60 high, $5F low) to decide whether this string becomes the new highest-uncollected-string.
  - If current string > highest-uncollected-string, it stores the pointer low in $5F (STX $5F) and pointer high in $60 (STA $60).
- Saves the descriptor pointer low/high into $4E/$4F (STA $4E / STX $4F) as the working pointer for potential collection.
- Copies the step size byte from $53 into $55 for the collect routine.
- Adds the step ($53) to the descriptor pointer in $22/$23, using ADC and INC to handle carry from low to high byte.
- Sets Y to #$00 as a "not moved" flag and returns (RTS).

Behavioral notes preserved from source:
- Zero-length strings (length == 0) are skipped.
- High/low comparisons explicitly test both bytes; branches handle equality and less/greater cases.
- The routine leaves the working pointer ($4E/$4F) and saved step ($55) only when a candidate string is retained as a highest-uncollected candidate.

## Source Code
```asm
.,B5B8 20 C7 B5 JSR $B5C7       check string salvageability
.,B5BB F0 F3    BEQ $B5B0       loop
                                check variable salvageability
.,B5BD B1 22    LDA ($22),Y     get variable name first byte
.,B5BF 30 35    BMI $B5F6       add step and exit if not string
.,B5C1 C8       INY             increment index
.,B5C2 B1 22    LDA ($22),Y     get variable name second byte
.,B5C4 10 30    BPL $B5F6       add step and exit if not string
.,B5C6 C8       INY             increment index
                                check string salvageability
.,B5C7 B1 22    LDA ($22),Y     get string length
.,B5C9 F0 2B    BEQ $B5F6       add step and exit if null string
.,B5CB C8       INY             increment index
.,B5CC B1 22    LDA ($22),Y     get string pointer low byte
.,B5CE AA       TAX             copy to X
.,B5CF C8       INY             increment index
.,B5D0 B1 22    LDA ($22),Y     get string pointer high byte
.,B5D2 C5 34    CMP $34         compare string pointer high byte with bottom of string
                                space high byte
.,B5D4 90 06    BCC $B5DC       if bottom of string space greater go test against highest
                                uncollected string
.,B5D6 D0 1E    BNE $B5F6       if bottom of string space less string has been collected
                                so go update pointers, step to next and return
                                high bytes were equal so test low bytes
.,B5D8 E4 33    CPX $33         compare string pointer low byte with bottom of string
                                space low byte
.,B5DA B0 1A    BCS $B5F6       if bottom of string space less string has been collected
                                so go update pointers, step to next and return
                                else test string against highest uncollected string so far
.,B5DC C5 60    CMP $60         compare string pointer high byte with highest uncollected
                                string high byte
.,B5DE 90 16    BCC $B5F6       if highest uncollected string is greater then go update
                                pointers, step to next and return
.,B5E0 D0 04    BNE $B5E6       if highest uncollected string is less then go set this
                                string as highest uncollected so far
                                high bytes were equal so test low bytes
.,B5E2 E4 5F    CPX $5F         compare string pointer low byte with highest uncollected
                                string low byte
.,B5E4 90 10    BCC $B5F6       if highest uncollected string is greater then go update
                                pointers, step to next and return
                                else set current string as highest uncollected string
.,B5E6 86 5F    STX $5F         save string pointer low byte as highest uncollected string
                                low byte
.,B5E8 85 60    STA $60         save string pointer high byte as highest uncollected
                                string high byte
.,B5EA A5 22    LDA $22         get descriptor pointer low byte
.,B5EC A6 23    LDX $23         get descriptor pointer high byte
.,B5EE 85 4E    STA $4E         save working pointer high byte
.,B5F0 86 4F    STX $4F         save working pointer low byte
.,B5F2 A5 53    LDA $53         get step size
.,B5F4 85 55    STA $55         copy step size
.,B5F6 A5 53    LDA $53         get step size
.,B5F8 18       CLC             clear carry for add
.,B5F9 65 22    ADC $22         add pointer low byte
.,B5FB 85 22    STA $22         save pointer low byte
.,B5FD 90 02    BCC $B601       branch if no rollover
.,B5FF E6 23    INC $23         else increment pointer high byte
.,B601 A6 23    LDX $23         get pointer high byte
.,B603 A0 00    LDY #$00        flag not moved
.,B605 60       RTS             
```

## Key Registers
- $22 - zero page - Descriptor pointer low byte (used with indirect Y LDA ($22),Y)
- $23 - zero page - Descriptor pointer high byte
- $33 - zero page - Bottom-of-string-space low byte
- $34 - zero page - Bottom-of-string-space high byte
- $4E - zero page - Working descriptor pointer low/high saved (low/high ordering in source: STA $4E / STX $4F)
- $4F - zero page - Working descriptor pointer other byte (see above)
- $53 - zero page - Descriptor step size (increment)
- $55 - zero page - Saved step size (copied from $53 for collect routine)
- $5F - zero page - Highest-uncollected-string low byte
- $60 - zero page - Highest-uncollected-string high byte

## References
- "iterate_string_arrays_and_prepare_descriptors" — expands on repeated invocation while scanning array element descriptors
- "gc_init_and_process_descriptor_stack" — expands on invocation from the descriptor-stack scanning loop
- "collect_string_and_compact_memory" — expands on when this logic decides a string must be moved and uses the working pointer left by this routine