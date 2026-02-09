# Process string variables and garbage-collection pointer setup ($B54D–$B566)

**Summary:** Sets garbage-collection step size ($53 = $07), copies the start-of-variables pointer ($2D/$2E) into the working pointer ($22/$23), compares the working pointer against the variable/array boundary ($2F/$30), and repeatedly calls the variable-salvageability routine (JSR $B5BD) until the variable area end is reached or processing completes.

## Description
This code snippet initializes the per-cycle garbage-collection step size for string variables and prepares a working pointer for scanning the variable area. Behavior:

- LDA #$07 / STA $53 — establishes a collection step size of 7 bytes (or 7 units as used by the GC) and stores it at zero page $53.
- LDA $2D / LDX $2E / STA $22 / STX $23 — copy the start-of-variables pointer (low/high at $2D/$2E) into the working pointer (low/high at $22/$23).
- CPX $30 / BNE ... / CMP $2F / BEQ ... — compare the working pointer to the start-of-arrays / end-of-variables pointer (high byte at $30, low byte at $2F); if the pointer equals the end marker, branch out (done).
- JSR $B5BD — call the variable-salvageability check/processor (checks and possibly advances the working pointer or handles the current variable).
- BEQ back to the comparison loop — the routine loops, repeatedly invoking the salvageability routine and re-checking the pointer until the variable area end is reached.

The snippet is annotated with the original comment "done stacked strings, now do string variables" and is intended to run after descriptor-stack processing. The called routine ($B5BD) is expected to perform per-variable checks and to update $22/$23 (the working pointer) as it processes variables.

## Source Code
```asm
; done stacked strings, now do string variables
.,B54D A9 07    LDA #$07        set step size = $07, collecting variables
.,B54F 85 53    STA $53         save garbage collection step size
.,B551 A5 2D    LDA $2D         get start of variables low byte
.,B553 A6 2E    LDX $2E         get start of variables high byte
.,B555 85 22    STA $22         save as pointer low byte
.,B557 86 23    STX $23         save as pointer high byte
.,B559 E4 30    CPX $30         compare end of variables high byte,
                                start of arrays high byte
.,B55B D0 04    BNE $B561       branch if no high byte match
.,B55D C5 2F    CMP $2F         else compare end of variables low byte,
                                start of arrays low byte
.,B55F F0 05    BEQ $B566       branch if = variable memory end
.,B561 20 BD B5 JSR $B5BD       check variable salvageability
.,B564 F0 F3    BEQ $B559       loop always
```

## Key Registers
- $53 - Zero Page - garbage-collection step size (set to $07 here)
- $2D-$2E - Zero Page - start-of-variables pointer (low/high)
- $22-$23 - Zero Page - working pointer for variable scanning (low/high)
- $2F-$30 - Zero Page - end-of-variables / start-of-arrays boundary (low/high)

## References
- "gc_init_and_process_descriptor_stack" — expands on descriptor-stack processing that precedes this routine
- "check_string_salvageability_for_variables_and_update_pointers" — expands on the salvageability checks performed by JSR $B5BD
- "iterate_string_arrays_and_prepare_descriptors" — expands on continuation into array processing after variables