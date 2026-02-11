# Kick Assembler: .macro — defining and invoking macros (SetColor, ClearScreen)

**Summary:** .macro definitions in Kick Assembler generate assembler directives in-place; macro calls are scoped (local labels do not collide), colon prefix for calls is optional (v4.0+), macros may be recursive and can be invoked before their declaration, and macro-local labels can be accessed only via scope/namespace techniques. Examples: SetColor, ClearScreen. Also notes on overloaded .function by argument count.

## Overview
.macro creates a reusable block of assembler directives that are expanded in-place at each call site. Arguments are positional and unlimited. Each macro invocation is encapsulated in its own scope: labels and variables defined inside the macro are local to that invocation and do not conflict with other invocations.

Kick Assembler permits:
- Recursive macros (a macro may call itself).
- Forward calls (you may call a macro before its definition).
- Multiple functions with the same name as long as they differ in argument count (argument-count overloading for .function).

The colon prefix before a macro call is optional from Kick Assembler v4.0 onward (both `:SetColor(1)` and `SetColor(1)` are accepted).

## Scope and local labels
- Labels declared inside a macro are local to that macro invocation; repeated calls to the same macro produce distinct, non-colliding labels.
- Because labels are encapsulated, external code cannot directly reference macro-local labels. Accessing macro-local labels requires explicit scope/namespace techniques (the source references these techniques but does not include implementation detail here).

## Examples and behavior notes
- A single macro can be called with different arguments to generate different code sequences.
- The ClearScreen example demonstrates a loop label defined inside the macro; multiple invocations produce separate loop labels and therefore do not interfere.
- The provided polyFunction examples demonstrate function overloading (same name, different argument counts) for .function, which is distinct from .macro but relevant to Kick Assembler symbol handling.

## Source Code
```asm
// Define macro
.macro SetColor(color) {
    lda #color
    sta $d020
}

// Execute macro (colon optional from v4.0)
:SetColor(1)
SetColor(2)



// Define macro
.macro ClearScreen(screen,clearByte) {
    lda #clearByte
    ldx #0
Loop:
    // The loop label can’t be seen from the outside
    sta screen,x
    sta screen+$100,x
    sta screen+$200,x
    sta screen+$300,x
    inx
    bne Loop
}

// Execute macro
ClearScreen($0400,$20)
ClearScreen($4400,$20)



// Function overloading examples (for .function, not .macro)
.function polyFunction() { .return 0 }
.function polyFunction(a) { .return 1 }
.function polyFunction(a,b) { .return 2 }
```

## References
- "pseudo_commands_and_cmdvalue_api" — expands on pseudo-commands (like macros) that accept mnemonic-style command arguments
- "scopes_and_namespaces_scopes" — expands on label visibility and techniques when labeling macro invocations