# Iterate string arrays and prepare per-array descriptors (ROM $B566–$B5B6)

**Summary:** Disassembles ROM routine that walks string arrays, saves the start-of-arrays ($0058/$0059) as a working pointer, sets descriptor step size ($0053) to 3, advances array pointer by array size (adding to $0058/$0059), computes element-descriptor start as ASL*2 + $05 (header size), propagates carry into the high byte, and scans element descriptors (indirect via ($22),Y) to find string arrays; each element is tested for salvageability (JSR $B5C7).

**Description**
This routine iterates the arrays table and prepares per-array element descriptors for string arrays. High-level flow:

- Save the start-of-arrays pointer (two bytes) into zero page $58 (low) / $59 (high) as the working pointer.
- Set descriptor step size to 3 ($53 = #$03), meaning each element descriptor is 3 bytes apart.
- Load the working pointer into $22/$23 (used for indirect indexed accesses via LDA ($22),Y).
- Compare the working pointer to the end-of-arrays marker ($32/$31). If equal, jump out to cleanup.
- For the current array:
  - Use indirect indexed loads LDA ($22),Y to read the array header bytes in sequence: name byte 1, name byte 2, flags, size low, size high, etc.
  - Preserve the status flags across arithmetic that follows (PHP before ADC sequence, PLP after).
  - Compute the start of element descriptors from the array header:
    - Multiply the number-of-elements by 2 (ASL — index was put in A then ASL).
    - Add $05 (array header size) to that result (ADC #$05).
    - Add the low byte of the computed offset to pointer low ($22) and store back into $22.
    - If the ASL+ADC caused a carry, INC the pointer high byte ($23).
  - Compare the pointer ($23:$22) to the end address of the array ($59:$58). If pointer reaches end, branch to process next array.
- Detect whether the array is a string array:
  - The code temporarily stores the first name byte in X (TXA/TAX), later uses TXA and BMI to test the sign bit of that byte (negative => indicates string array). The exact bit-definition is from surrounding code/format.
  - If not a string array, skip to next array.
- For string arrays, the routine loops through element descriptors and calls the salvageability check subroutine (JSR $B5C7) for each element descriptor.

Behavioral details preserved from the listing:
- Descriptor step size is fixed to 3 bytes (STA $53).
- Pointer arithmetic is done with ADC adding low and high bytes; carry into the high byte is handled via BCC/INC.
- Indirect reads use ($22),Y with Y used as an index into the array header.
- The routine exits/branches when the working pointer equals the end-of-arrays marker ($32/$31).

## Source Code
```asm
.,B566 85 58    STA $58         ; save start of arrays low byte as working pointer
.,B568 86 59    STX $59         ; save start of arrays high byte as working pointer
.,B56A A9 03    LDA #$03        ; set step size, collecting descriptors
.,B56C 85 53    STA $53         ; save step size
.,B56E A5 58    LDA $58         ; get pointer low byte
.,B570 A6 59    LDX $59         ; get pointer high byte
.,B572 E4 32    CPX $32         ; compare with end of arrays high byte
.,B574 D0 07    BNE $B57D       ; branch if not at end
.,B576 C5 31    CMP $31         ; else compare with end of arrays low byte
.,B578 D0 03    BNE $B57D       ; branch if not at end
.,B57A 4C 06 B6 JMP $B606       ; collect string, tidy up and exit if at end
.,B57D 85 22    STA $22         ; save pointer low byte
.,B57F 86 23    STX $23         ; save pointer high byte
.,B581 A0 00    LDY #$00        ; set index
.,B583 B1 22    LDA ($22),Y     ; get array name first byte
.,B585 AA       TAX             ; copy it
.,B586 C8       INY             ; increment index
.,B587 B1 22    LDA ($22),Y     ; get array name second byte
.,B589 08       PHP             ; push the flags
.,B58A C8       INY             ; increment index
.,B58B B1 22    LDA ($22),Y     ; get array size low byte
.,B58D 65 58    ADC $58         ; add start of this array low byte
.,B58F 85 58    STA $58         ; save start of next array low byte
.,B591 C8       INY             ; increment index
.,B592 B1 22    LDA ($22),Y     ; get array size high byte
.,B594 65 59    ADC $59         ; add start of this array high byte
.,B596 85 59    STA $59         ; save start of next array high byte
.,B598 28       PLP             ; restore the flags
.,B599 10 D3    BPL $B56E       ; skip if not string array
.,B59B 8A       TXA             ; get name first byte back
.,B59C 30 D0    BMI $B56E       ; skip if not string array
.,B59E C8       INY             ; increment index
.,B59F B1 22    LDA ($22),Y     ; get # of dimensions
.,B5A1 A0 00    LDY #$00        ; clear index
.,B5A3 0A       ASL             ; *2
.,B5A4 69 05    ADC #$05        ; +5 (array header size)
.,B5A6 65 22    ADC $22         ; add pointer low byte
.,B5A8 85 22    STA $22         ; save pointer low byte
.,B5AA 90 02    BCC $B5AE       ; branch if no rollover
.,B5AC E6 23    INC $23         ; else increment pointer high byte
.,B5AE A6 23    LDX $23         ; get pointer high byte
.,B5B0 E4 59    CPX $59         ; compare pointer high byte with end of this array high byte
.,B5B2 D0 04    BNE $B5B8       ; branch if not there yet
.,B5B4 C5 58    CMP $58         ; compare pointer low byte with end of this array low byte
.,B5B6 F0 BA    BEQ $B572       ; if at end of this array go check next array
.,B5B8 A0 00    LDY #$00        ; reset index for element descriptor loop
.,B5BA B1 22    LDA ($22),Y     ; load element descriptor
.,B5BC 20 C7 B5 JSR $B5C7       ; check salvageability
.,B5BF A5 22    LDA $22         ; load pointer low byte
.,B5C1 18       CLC             ; clear carry
.,B5C2 65 53    ADC $53         ; add step size
.,B5C4 85 22    STA $22         ; store back to pointer low byte
.,B5C6 90 02    BCC $B5CA       ; branch if no carry
.,B5C8 E6 23    INC $23         ; increment pointer high byte
.,B5CA A6 23    LDX $23         ; load pointer high byte
.,B5CC E4 59    CPX $59         ; compare with end of array high byte
.,B5CE D0 E8    BNE $B5B8       ; loop if not at end
.,B5D0 A5 22    LDA $22         ; load pointer low byte
.,B5D2 C5 58    CMP $58         ; compare with end of array low byte
.,B5D4 D0 E2    BNE $B5B8       ; loop if not at end
.,B5D6 4C 72 B5 JMP $B572       ; check next array
```

## Key Registers
- $0058 - Zero page - working pointer / start-of-arrays low byte (updated to start of next array)
- $0059 - Zero page - working pointer / start-of-arrays high byte (updated to start of next array)
- $0053 - Zero page - descriptor step size (set to #$03)
- $0022 - Zero page - indirect pointer low byte (used with Y: LDA ($22),Y)
- $0023 - Zero page - indirect pointer high byte
- $0031 - Zero page - end-of-arrays low byte (compared against working pointer)
- $0032 - Zero page - end-of-arrays high byte (compared against working pointer)

## References
- "collect_string_variables_setup_and_loop" — expands on variable collection setup and looping
- "check_string_salvageability_for_variables_and_update_pointers" — expands on calls to the salvageability routine for each element
- "collect_string_and_compact_memory" — expands on control transfer to the collect routine when an element needs collecting