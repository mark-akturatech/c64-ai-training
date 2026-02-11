# NMOS 6510 — DCP-based loop decrement + compare example

**Summary:** Example showing use of the undocumented DCP (DEC + CMP) illegal opcode on NMOS 6510/6502 to decrement a memory loop counter and compare it to A in one instruction, replacing a DEC / LDA / CMP / BNE sequence. Includes small data definition and the rewritten loop sequence.

**Example and explanation**
The undocumented DCP (aka DCM) performs a memory decrement followed immediately by a compare of that memory with the accumulator (effectively DEC mem ; CMP mem). This lets you replace a common four-instruction loop-close sequence:

- DEC counter
- LDA counter
- CMP #$00
- BNE loop

with a DCP-based sequence that requires the accumulator to hold the comparison value (e.g. #$00) before the loop, then uses DCP inside the loop and branches on the flags set by the CMP part of DCP.

Requirements and effects:
- A must be preloaded with the value you want to compare the decremented memory against (for testing nonzero, use A = #$00).
- DCP changes the memory (decrements it) and sets flags according to the compare (so Z/N/C reflect the CMP result).
- The optimization reduces code size and saves CPU cycles compared to the DEC/LDA/CMP/BNE sequence.

Use this technique when you can arrange A beforehand and you are willing to use an undocumented opcode.

## Source Code
```asm
; Small data definition (zero-page loop counter)
        .org $0801
counter = $FB      ; example zero-page address for counter

; Original sequence (explicit: DEC / LDA / CMP / BNE)
;         ; assume counter contains initial count
Loop_orig:
        DEC counter        ; decrement memory
        LDA counter        ; load the decremented value into A
        CMP #$00           ; compare with zero
        BNE Loop_orig      ; branch if not zero

; Rewritten using undocumented DCP:
; Preload A with the comparison value (here #$00), then DCP does DEC mem ; CMP mem
        LDA #$00           ; prepare A = 0 (do once, before the loop)
Loop_dcp:
        DCP counter        ; undocumented: DEC counter ; CMP counter (compares with A)
        BNE Loop_dcp       ; branch if counter != A (i.e. not zero)

; Data: initialize counter for demonstration
        .org $0810
        .byte $05          ; example initial value (assembler label can set counter to point here)
```

## References
- "dcp_operation_equivalents" — explains the DCP semantics that make this replacement possible
- "dcp_opcode_variants_table" — which DCP addressing mode to use for different memory locations

## Mnemonics
- DCP
- DCM
