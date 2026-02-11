# Kick Assembler: label-scope arrays, .for/.while label scoping, and segment/file output

**Summary:** Explains Kick Assembler behavior where placing a label immediately before a .for or .while creates a label-scope array (allowing inner-loop labels to be referenced as label[index].innerLabel), and shows .segment/.file usage for writing segments to files or patching existing PRGs.

## Label-scope arrays created by labeling loops
Placing a label directly before a .for or .while pseudocommand creates a label-scope array. Each iteration of the loop that defines a local label (for example, a label placed inside the loop body) generates an indexed slot under the outer label. Those inner labels can be referenced from outside the loop (or from other loops) using the array index syntax: outerLabel[index].innerLabel.

This is commonly used to fill or later modify per-item data created by a loop. You can also apply arithmetic to the referenced label (e.g., +1 to address fields).

## Segments, writing output files, and patching
- .segment File1 [outPrg="MyFile.prg"] creates/assembles a named segment and writes that segment to the specified output PRG when assembling. Set the origin inside the segment (e.g. *= $1000) and end the segment with .segment Default (or switch back to another segment).
- For patching an existing PRG: load the base PRG into a Base segment, place a Patch segment on top containing modifications, and write the combined result to a file. Because the Patch segment is placed after (on top of) the Base, its contents overwrite the corresponding addresses from the base PRG.

## Source Code
```asm
; Label-scope array example (as given)
.for (var i=0; i<20; i++) {
    lda #i
    sta loop2[i].color+1
}
loop2:
color:

; Another .for to clear colors (implied usage)
.for (var i=0; i<20; i++) {
    ; e.g. clear loop2[i].color here
    lda #$00
    sta loop2[i].color
}

; Segment / write-to-file example
.segment File1 [outPrg="MyFile.prg"]
*=$1000
    lda #$00
    ; ... more code ...
.segment Default

; Patch an existing PRG by layering segments
.file [name="Out.prg", segments="Base,Patch", allowOverlap]
.segment Base [prgFiles="basefile.prg"]
    ; basefile.prg is loaded into this segment
.segment Patch
    ; modifications placed here will overwrite Base where they overlap
```

## References
- "access_local_labels_of_macros_and_pseudocommands" — expands on label scopes for different constructs
