# STR$ concatenation and descriptor helpers (B63D-B6DA)

**Summary:** Implements string concatenation (first operand in a descriptor, second taken from input line), checks for overflow/error $17, requests allocation, copies strings via a utility buffer, and pushes the resulting descriptor onto the descriptor stack. Also includes helpers to copy a string from a descriptor to the utility pointer and to evaluate/clean string descriptors. Uses zero-page descriptor pointers and string-space pointers ($22-$23, $33-$36, $50-$51, $64-$65, $6F-$70).

## Description
This chunk contains the ROM routines that implement STR$-style concatenation and related descriptor/string-space helpers used by BASIC.

Main routines and behavior:

- concatenate (entry at B63D)
  - Calling convention / inputs:
    - First string is referenced by a descriptor whose pointer is stored in zero-page ($64 = low, $65 = high).
    - Second string is fetched from the current input line via JSR $AE83 (get value from line) and validated as a string via JSR $AD8F.
  - Operation:
    - Saves descriptor pointer ($64/$65) on the stack, then obtains the second string from the line (and validates its type).
    - Reads length of the first string from the descriptor and adds it to the length of the second string (ADC ($64),Y) to compute resultant length.
    - If the sum overflows (result > 255), sets X = $17 and jumps to error handler at $A437 (string too long error) which does a warm start.
    - Otherwise, requests allocation for the total length via JSR $B475 (copy descriptor pointer and make string space A bytes long).
    - Copies the first string from its descriptor into the utility string area via JSR $B67A.
    - Pops the second operand's descriptor (or uses top-of-string-space) via JSR $B6AA (returns A = length, X = pointer low, Y = pointer high) and stores the second string into the utility area via JSR $B68C.
    - Pops the first operand's descriptor back into YA via the same JSR $B6AA and then pushes the new result descriptor (address + length) onto the descriptor stack via JSR $B4CA.
    - Returns to evaluation flow at $ADB8.

- copy string from descriptor to utility pointer (entry at B67A)
  - Reads from the descriptor pointer at ($6F),Y:
    - Byte 0 = length, byte 1 = pointer low, byte 2 = pointer high.
  - Saves source pointer into $22/$23, then copies the string bytes into the utility buffer pointed to by $35/$36.
  - Updates the utility pointer $35/$36 (increments high byte on low-byte rollover).
  - Returns with RTS. If string length is zero, it skips the copy and still adjusts pointers.

- evaluate string (entry at B6A3)
  - Validates that the source is a string (JSR $AD8F).
  - Loads descriptor pointer from zero-page ($64/$65) and calls the same pop helper JSR $B6AA which returns A = length, X = pointer low, Y = pointer high.
  - Saves pointer into $22/$23 and calls JSR $B6DB to "clean descriptor stack" — ensures descriptor stack bookkeeping is consistent with YA as pointer.
  - Temporarily saves flags (PHP), then re-reads the descriptor data (length/pointer) and compares the pointer to last_sl/last_sh (these are held in $33/$34 — bottom/top of string-space). If the pointer equals the current top-of-string-space, it increments the bottom-of-string-space by the length (effectively reclaiming top-of-string-space allocation).
  - Saves final pointer into $22/$23 and returns. This routine ensures descriptors that reference string data at the top of string-space are folded back into the free-space pointer when evaluated/pop'd.

Notes on descriptor format and zero-page variables (as used in this code):
- String descriptor memory layout (3 bytes): [length][pointer low][pointer high] — accessed via indirect addressing (e.g., B1 6F / LDA ($6F),Y).
- Zero-page variables (used by these routines):
  - $64/$65 — descriptor pointer input (low/high)
  - $6F/$70 — temporary storage for descriptor pointer (low/high) while concatenating
  - $22/$23 — temporary source pointer (low/high) for copy operations
  - $33/$34 — bottom/top of string-space (low/high) used to manage top-of-string-space reclamation
  - $35/$36 — utility string pointer (low/high) where bytes are written during copy
  - $50/$51 — another descriptor pointer pair used during concatenation/pop sequence
- Helper routines called:
  - $AE83 — get value from line
  - $AD8F — check if source is string (type mismatch otherwise)
  - $B475 — allocate string space: "copy descriptor pointer and make string space A bytes long"
  - $B6AA — pop (YA) descriptor off stack or from top of string space; returns A = length, X = pointer low, Y = pointer high
  - $B68C — store string from pointer to utility pointer
  - $B4CA — check space on descriptor stack then put string address and length on descriptor stack and update stack pointers
  - $B6DB — clean descriptor stack (used by evaluate)
- Error handling:
  - If concatenated length > 255, X is set to $17 and execution jumps to $A437 to produce error $17 ("string too long") and perform warm start.

## Source Code
```asm
.,B63D A5 65    LDA $65         get descriptor pointer high byte
.,B63F 48       PHA             put on stack
.,B640 A5 64    LDA $64         get descriptor pointer low byte
.,B642 48       PHA             put on stack
.,B643 20 83 AE JSR $AE83       get value from line
.,B646 20 8F AD JSR $AD8F       check if source is string, else do type mismatch
.,B649 68       PLA             get descriptor pointer low byte back
.,B64A 85 6F    STA $6F         set pointer low byte
.,B64C 68       PLA             get descriptor pointer high byte back
.,B64D 85 70    STA $70         set pointer high byte
.,B64F A0 00    LDY #$00        clear index
.,B651 B1 6F    LDA ($6F),Y     get length of first string from descriptor
.,B653 18       CLC             clear carry for add
.,B654 71 64    ADC ($64),Y     add length of second string
.,B656 90 05    BCC $B65D       branch if no overflow
.,B658 A2 17    LDX #$17        else error $17, string too long error
.,B65A 4C 37 A4 JMP $A437       do error #X then warm start
.,B65D 20 75 B4 JSR $B475       copy descriptor pointer and make string space A bytes long
.,B660 20 7A B6 JSR $B67A       copy string from descriptor to utility pointer
.,B663 A5 50    LDA $50         get descriptor pointer low byte
.,B665 A4 51    LDY $51         get descriptor pointer high byte
.,B667 20 AA B6 JSR $B6AA       pop (YA) descriptor off stack or from top of string space
                                returns with A = length, X = pointer low byte,
                                Y = pointer high byte
.,B66A 20 8C B6 JSR $B68C       store string from pointer to utility pointer
.,B66D A5 6F    LDA $6F         get descriptor pointer low byte
.,B66F A4 70    LDY $70         get descriptor pointer high byte
.,B671 20 AA B6 JSR $B6AA       pop (YA) descriptor off stack or from top of string space
                                returns with A = length, X = pointer low byte,
                                Y = pointer high byte
.,B674 20 CA B4 JSR $B4CA       check space on descriptor stack then put string address
                                and length on descriptor stack and update stack pointers
.,B677 4C B8 AD JMP $ADB8       continue evaluation

                                *** copy string from descriptor to utility pointer
.,B67A A0 00    LDY #$00        clear index
.,B67C B1 6F    LDA ($6F),Y     get string length
.,B67E 48       PHA             save it
.,B67F C8       INY             increment index
.,B680 B1 6F    LDA ($6F),Y     get string pointer low byte
.,B682 AA       TAX             copy to X
.,B683 C8       INY             increment index
.,B684 B1 6F    LDA ($6F),Y     get string pointer high byte
.,B686 A8       TAY             copy to Y
.,B687 68       PLA             get length back
.,B688 86 22    STX $22         save string pointer low byte
.,B68A 84 23    STY $23         save string pointer high byte
                                store string from pointer to utility pointer
.,B68C A8       TAY             copy length as index
.,B68D F0 0A    BEQ $B699       branch if null string
.,B68F 48       PHA             save length
.,B690 88       DEY             decrement length/index
.,B691 B1 22    LDA ($22),Y     get byte from string
.,B693 91 35    STA ($35),Y     save byte to destination
.,B695 98       TYA             copy length/index
.,B696 D0 F8    BNE $B690       loop if not all done yet
.,B698 68       PLA             restore length
.,B699 18       CLC             clear carry for add
.,B69A 65 35    ADC $35         add string utility ptr low byte
.,B69C 85 35    STA $35         save string utility ptr low byte
.,B69E 90 02    BCC $B6A2       branch if no rollover
.,B6A0 E6 36    INC $36         increment string utility ptr high byte
.,B6A2 60       RTS             

                                *** evaluate string
.,B6A3 20 8F AD JSR $AD8F       check if source is string, else do type mismatch
                                pop string off descriptor stack, or from top of string space
                                returns with A = length, X = pointer low byte, Y = pointer high byte
.,B6A6 A5 64    LDA $64         get descriptor pointer low byte
.,B6A8 A4 65    LDY $65         get descriptor pointer high byte
                                pop (YA) descriptor off stack or from top of string space
                                returns with A = length, X = pointer low byte, Y = pointer high byte
.,B6AA 85 22    STA $22         save string pointer low byte
.,B6AC 84 23    STY $23         save string pointer high byte
.,B6AE 20 DB B6 JSR $B6DB       clean descriptor stack, YA = pointer
.,B6B1 08       PHP             save status flags
.,B6B2 A0 00    LDY #$00        clear index
.,B6B4 B1 22    LDA ($22),Y     get length from string descriptor
.,B6B6 48       PHA             put on stack
.,B6B7 C8       INY             increment index
.,B6B8 B1 22    LDA ($22),Y     get string pointer low byte from descriptor
.,B6BA AA       TAX             copy to X
.,B6BB C8       INY             increment index
.,B6BC B1 22    LDA ($22),Y     get string pointer high byte from descriptor
.,B6BE A8       TAY             copy to Y
.,B6BF 68       PLA             get string length back
.,B6C0 28       PLP             restore status
.,B6C1 D0 13    BNE $B6D6       branch if pointer <> last_sl,last_sh
.,B6C3 C4 34    CPY $34         compare with bottom of string space high byte
.,B6C5 D0 0F    BNE $B6D6       branch if <>
.,B6C7 E4 33    CPX $33         else compare with bottom of string space low byte
.,B6C9 D0 0B    BNE $B6D6       branch if <>
.,B6CB 48       PHA             save string length
.,B6CC 18       CLC             clear carry for add
.,B6CD 65 33    ADC $33         add bottom of string space low byte
.,B6CF 85 33    STA $33         set bottom of string space low byte
.,B6D1 90 02    BCC $B6D5       skip increment if no overflow
.,B6D3 E6 34    INC $34         increment bottom of string space high byte
.,B6D5 68       PLA             restore string length
.,B6D6 86 22    STX $22         save string pointer low byte
.,B6D8 84 23    STY $23         save string pointer high byte
.,B6DA 60       RTS             
```

## Key Registers
- $22-$23 - Zero page - temporary source pointer low/high used for copying strings
- $33-$34 - Zero page - bottom/top of string space low/high (used to detect/reclaim top-of-string-space)
- $35-$36 - Zero page - utility string pointer low/high (destination pointer for copies)
- $50-$51 - Zero page - additional descriptor pointer low/high used during concatenation/pop
- $64-$65 - Zero page - input descriptor pointer low/high (first operand)
- $6F-$70 - Zero page - saved copy of descriptor pointer (temporary while concatenating)

## References
- "str_destr_and_string_space_allocation" — expands on STR$ entry uses, descriptor allocation and copying helpers
- "garbage_collection_main_routine" — expands on descriptor stack layout maintained and used by GC