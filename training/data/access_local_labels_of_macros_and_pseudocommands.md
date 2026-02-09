# Kick Assembler — label scopes for macros and pseudocommands

**Summary:** Describes Kick Assembler's label-scope arrays created when a label is placed immediately before executing a macro or pseudocommand (e.g. .macro, .if). Shows how inner labels become addressable as qualified names (scope.inner) and demonstrates usage with inc/dec and conditional branches.

## Mechanism
Placing a label immediately before executing a macro or certain pseudocommands (example invocation: :setColor()) creates a label-scope array. Labels defined inside the executed macro/pseudocommand are recorded in that scope and can be referenced from outside using the qualified form <scope_label>.<inner_label>. Each execution/instance yields separate entries in the scope array, so multiple calls produce distinct scoped labels. This applies to macros and control-flow pseudocommands such as .if/.else (the scope label resolves to the inner label from the active branch).

Qualified scoped labels can be used anywhere a label is allowed (including with operators such as inc/dec in the example below).

## Examples
See the Source Code section for the exact assembly examples illustrating:
- Creating scoped labels via a label placed before a macro invocation and referencing them as c1.color and c2.color (with inc/dec).
- Jumping to an inner label inside a .if/.else block via myIf.label (the .if true branch in the example).

## Source Code
```asm
; Example: label before macro creates scope; inner label is "color"
start:
c1:
c2:
* = $1000

inc c1.color
dec c2.color

:setColor()
:setColor()
jmp start

; Macro definition (defines an inner scoped label 'color')
.macro setColor() {
    .label color = *+1
    lda #0
    sta $D020
}

; Example: jumping to a label inside a .if/.else block via a scope label
jmp myIf.label

myIf:
.if (true) {
    ; ... code ...
label:
    lda #0   ; <-- Jumps here when using jmp myIf.label
    ; ... more code ...
} else {
    ; ... code ...
label:
    nop
    ; ... more code ...
}
```

## References
- "label_scopes_for_functions" — expands on label scopes concept and usage patterns