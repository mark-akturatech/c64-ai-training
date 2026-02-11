# Kick Assembler: Label Scopes Declared After a Label

**Summary:** Explains Kick Assembler label scopes where a block/scope declared after a label makes inner labels accessible as fields of that outer label (syntax: label.inner). Shows usage with a subroutine (clearScreen.fillbyte), the .label directive inside scopes, and how label scopes are created when a label precedes a macro/pseudocommand. Includes examples referencing $D020 (VIC-II border color).

## Behavior and rules
- If a label is immediately followed by a scope block, labels declared inside that block become fields of the outer label and can be referenced with dot syntax: outer.inner. This applies to scopes created with { ... } after a label and to scopes created by placing a label before a macro or pseudocommand execution.
- The .label directive can be used inside such a scope; those labels become fields of the outer label when the scope follows a label.
- When a scope is created by placing a label before a macro or pseudocommand, local labels defined inside the macro/pseudocommand (using .label) are accessible as fields of the preceding label.
- Example usages include storing a fill byte by addressing an inner label via outer.fillbyte and calling the subroutine via jsr outer.
- [Note: Source may contain a confusing/contradictory line claiming "Now you don't have to remember to add one..." while an example still uses +1. Verify intended offset semantics in your original source if precise +1 behavior matters.]

## Source Code
```asm
; Example: named scope attached to a subroutine label
clearScreen:
{
fillbyte:
    .byte $00, $00, $00 ; example data; fillbyte is inside the clearScreen scope
    ; other scope-local data/labels...
}
; Use:
    lda #' '                 ; load ASCII space
    sta clearScreen.fillbyte+1
    jsr clearScreen
    rts
```

```asm
; .label directive used inside a scope attached to an existing label
.label mylabel1 = $1000 {
    .label mylabel2 = $1234
}
.print "mylabel2=" + mylabel1.mylabel2
```

```asm
; Label scope created by placing a label before macro/pseudocommand execution
start:
c1:
c2:

* = $1000
inc c1.color
dec c2.color
:setColor()
:setColor()
jmp start

.macro setColor() {
    .label color = *+1
    lda #0
    sta $d020
}
```

## Key Registers
- $D020 - VIC-II - Border color register (used in examples where .macro stores to $D020)

## References
- "label_scope_label_directive_example" — expands on alternate .label directive example for fillbyte

## Labels
- $D020
