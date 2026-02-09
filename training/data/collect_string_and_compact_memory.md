# collect_string (B606-B63A)

**Summary:** Disassembles the Commodore 64 ROM routine at $B606-$B63A that compacts/moves a single string: checks working pointer ($4E/$4F), derives descriptor offset from step-size ($55), computes block end ($5A/$5B) by adding length to string start ($5F/$60), saves destination end ($58/$59) from bottom-of-string-space ($33/$34), calls the memory-shift routine (JSR $A3BF) to copy the string to the top of uncollected space, and updates the descriptor pointer via ($4E),Y.

## Description
This routine performs one string collection (compaction) step used by the ROM garbage/string-collection logic:

- Verify there is a working pointer:
  - ORA $4E with $4F; if both zero (no pointer) the routine exits (BEQ).
- Derive descriptor offset from step-size in $55:
  - AND #$04 masks step-size to test whether the descriptor is for a variable ($04) or for an array/stack ($00).
  - LSR then TAY produces an index (0 or 2) which is stored back in $55 and used as an offset into the descriptor (descriptor fields are 2 bytes apart).
- Compute the source block end (string start + length):
  - LDA ($4E),Y fetches string length low byte (descriptor + offset).
  - ADC $5F adds string start low byte; result stored into $5A (block end low).
  - Fetch string start high byte ($60), ADC #$00 to add carry, store into $5B (block end high).
  - This yields a 16-bit end address = start + length (low in $5A, high in $5B).
- Prepare destination end (where to copy to):
  - Load bottom-of-string-space low/high ($33/$34) into $58/$59 — the destination (top of uncollected area).
- Call memory-shift/open-up routine:
  - JSR $A3BF opens space and copies the string from its current location (start..end) to the destination end ($58/$59). This routine does the actual memory movement but does not set the array end.
- Update descriptor string pointer to point to the new string location:
  - LDY $55 restores the descriptor offset.
  - INY advances Y to point at the string pointer low byte within the descriptor.
  - STA ($4E),Y stores the new string pointer low byte (from $58) into the descriptor via the indirect pointer in $4E/$4F.
  - TAX copies the low byte into A/X as required by the caller semantics (XA will hold new bottom-of-string-memory pointer).
  - INC $59 increments the new string pointer high byte; LDA $59 then INY and STA ($4E),Y stores the high byte into the descriptor.
- Loop back to continue processing:
  - JMP $B52A re-runs the main collection loop from the last ending; XA contains the new bottom pointer.

Behavioral notes preserved from the ROM:
- Descriptor indexing via $55 (0 or 2) is how variable descriptors differ from array/stack descriptors.
- The block end computation properly propagates carry from low to high byte.
- The memory-shift routine at $A3BF is responsible for copying the string bytes; this routine only sets up its arguments and updates the descriptor afterward.

## Source Code
```asm
.,B606 A5 4F    LDA $4F         get working pointer low byte
.,B608 05 4E    ORA $4E         OR working pointer high byte
.,B60A F0 F5    BEQ $B601       exit if nothing to collect
.,B60C A5 55    LDA $55         get copied step size
.,B60E 29 04    AND #$04        mask step size, $04 for variables, $00 for array or stack
.,B610 4A       LSR             >> 1
.,B611 A8       TAY             copy to index
.,B612 85 55    STA $55         save offset to descriptor start
.,B614 B1 4E    LDA ($4E),Y     get string length low byte
.,B616 65 5F    ADC $5F         add string start low byte
.,B618 85 5A    STA $5A         set block end low byte
.,B61A A5 60    LDA $60         get string start high byte
.,B61C 69 00    ADC #$00        add carry
.,B61E 85 5B    STA $5B         set block end high byte
.,B620 A5 33    LDA $33         get bottom of string space low byte
.,B622 A6 34    LDX $34         get bottom of string space high byte
.,B624 85 58    STA $58         save destination end low byte
.,B626 86 59    STX $59         save destination end high byte
.,B628 20 BF A3 JSR $A3BF       open up space in memory, don't set array end. this
                                copies the string from where it is to the end of the
                                uncollected string memory
.,B62B A4 55    LDY $55         restore offset to descriptor start
.,B62D C8       INY             increment index to string pointer low byte
.,B62E A5 58    LDA $58         get new string pointer low byte
.,B630 91 4E    STA ($4E),Y     save new string pointer low byte
.,B632 AA       TAX             copy string pointer low byte
.,B633 E6 59    INC $59         increment new string pointer high byte
.,B635 A5 59    LDA $59         get new string pointer high byte
.,B637 C8       INY             increment index to string pointer high byte
.,B638 91 4E    STA ($4E),Y     save new string pointer high byte
.,B63A 4C 2A B5 JMP $B52A       re-run routine from last ending, XA holds new bottom
                                of string memory pointer
```

## Key Registers
- $4E-$4F - Zero Page - Indirect pointer to current descriptor (pointer used by STA ($4E),Y / LDA ($4E),Y)
- $55 - Zero Page - Step-size / descriptor offset (masked and shifted to 0 or 2)
- $5A-$5B - Zero Page - Computed block end (string end) low/high
- $58-$59 - Zero Page - Destination end (new string pointer) low/high (copied from $33/$34)
- $33-$34 - Zero Page - Bottom-of-string-space low/high (source for destination end)
- $5F-$60 - Zero Page - String start low/high (added to length to compute block end)

## References
- "check_string_salvageability_for_variables_and_update_pointers" — expands on how collect is triggered after salvageability logic sets the working pointer/offset
- "gc_init_and_process_descriptor_stack" — expands on how after collection the routine re-runs from the last ending to continue processing
- "iterate_string_arrays_and_prepare_descriptors" — expands on array and element descriptor preparation before reaching this collection step