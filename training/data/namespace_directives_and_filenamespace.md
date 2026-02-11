# .namespace and .filenamespace directives (Kick Assembler — Section 9.4)

**Summary:** Describes Kick Assembler's .namespace and .filenamespace directives for placing symbols/labels inside a named namespace so they are accessed as fields (e.g. vic.borderColor). Includes examples that define VIC-related labels ($D020-$D023) and an example of partitioning files with .filenamespace.

## Description
.namespace creates a named scope and places subsequent .label definitions (and other symbols) as fields of that namespace symbol. Labels declared inside the namespace are referenced as namespace.field (for example vic.borderColor). Typical use is to avoid symbol collisions (library isolation).

.filenamespace applied at top of a source file places every symbol defined in that file into the given namespace, allowing simple file partitioning (e.g., part1.init becomes part1.init).

The section's examples define VIC-related color registers inside a namespace and demonstrate storing to those names from ordinary code. The filenamespace example shows how different source files can be logically grouped.

## Source Code
```asm
; Example: define VIC color registers inside a namespace
.namespace vic {
    .label borderColor = $d020
    .label backgroundColor0 = $d021
    .label backgroundColor1 = $d022
    .label backgroundColor2 = $d023
}

; Usage: store zero to background color 0 and border color via the namespace-qualified labels
    lda #$00
    sta vic.backgroundColor0
    sta vic.borderColor
```

```asm
; File partitioning example using .filenamespace
; /* FILE 0 */
    jsr part1.init
    jsr part1.exec
    jsr part2.init
    jsr part2.exec
    rts

; /* FILE 1 */
.filenamespace part1
init:
    ; ...
```

## Key Registers
- $D020-$D023 - VIC-II - Border and background color registers

## References
- "scopes_and_namespaces_namespaces" — expands on declaration and reuse of namespaces  
- "front_matter_and_table_of_contents_ignored" — expands on TOC references to Chapter 9 for namespace directives

## Labels
- BORDERCOLOR
- BACKGROUNDCOLOR0
- BACKGROUNDCOLOR1
- BACKGROUNDCOLOR2
