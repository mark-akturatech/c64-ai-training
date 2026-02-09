# Kick Assembler: .if label scope and segmentout/segmentdef examples

**Summary:** Shows Kick Assembler label-scope behavior for .if/.else control blocks (local labels accessible only when the branch is taken) and an example of using .segment, .segmentout and .segmentdef to emit a 4-bank cartridge (outBin and bank ranges, $1000-$1FFF).

## Label scope with .if
Placing a label immediately before an .if creates a label namespace (scope) whose symbols are resolved only to labels declared inside the branch that is actually taken. If code references a symbol that exists only in the taken branch, the reference resolves when that branch is active; if the condition is false and there is no else branch (or the symbol only exists in the other branch), the assembler reports "symbol undefined".

See the example in Source Code for the exact behavior: a label namespace `myIf` is declared before an .if; `myIf.label` resolves to the label defined in the taken branch.

## Segment usage (CARTRIDGE_FILE, .segmentout, .segmentdef)
Segments can be used to emit alternate output formats and to define multiple banks for cartridge files. The example in Source Code demonstrates:
- declaring a cartridge output file with .segment CARTRIDGE_FILE [outBin="myfile.bin"]
- linking segment names to output banks via .segmentout
- defining bank address ranges and fill behavior with .segmentdef (min, max, fill)
- switching to a bank with .segment BANK1 and emitting code for that bank

## Source Code
```asm
; Example: label-scope behavior with .if
*=$8021 "Insert jump"
jmp $8044

; reference a label inside an .if-block namespace
jmp myIf.label
myIf:
.if (true) {
    label: lda #0
} else {
    label: nop
}

; Example: segments for a 4-bank cartridge output
.segment CARTRIDGE_FILE [outBin="myfile.bin"]
.segmentout [segments ="BANK1"]
.segmentout [segments ="BANK2"]
.segmentout [segments ="BANK3"]
.segmentout [segments ="BANK4"]

.segmentdef BANK1 [min=$1000, max=$1fff, fill]
.segmentdef BANK2 [min=$1000, max=$1fff, fill]
.segmentdef BANK3 [min=$1000, max=$1fff, fill]
.segmentdef BANK4 [min=$1000, max=$1fff, fill]

.segment BANK1
; ..code for segment 1 goes here...
```

## References
- "access_local_labels_of_for_while_loops" — expands on control-structure label scopes