# ca65: Label types and scoping (standard, .PROC, cheap local, unnamed, .DEFINE, .DEBUGINFO)

**Summary:** Describes ca65 label kinds and scoping rules: standard labels (name:), local scopes via .PROC, cheap local labels (start with .LOCALCHAR, usually '@', visible only between two non-cheap labels), unnamed labels (':' with :++/:- or <,>), .DEFINE token-substitution constants (string-constant caveat), and what .DEBUGINFO writes to the object file.

## Standard labels
A standard label is declared by placing the label name at the start of a source line followed by a colon (name:). It defines a symbol with that name and the current program counter value.

## Local labels and .PROC
Use the .PROC directive to create nested regions where named labels and symbols are local to that region. Symbols declared inside a .PROC region are not visible outside it. Regions may be nested (like Pascal PROCEDUREs). See the .PROC directive documentation for details on starting/ending scopes.

## Cheap local labels
Cheap local labels are written like standard labels but must begin with a special character (commonly '@'; changeable via .LOCALCHAR). Their scope is limited: they are visible only between two non-cheap labels. As soon as a standard symbol (or a local symbol when inside a .PROC region) is encountered, the cheap local labels go out of scope. They are useful for short-lived reuse of common names (e.g., "Loop").

Behavioral note: cheap local label scope is determined by encountering the next non-cheap label; it does not persist across that boundary.

## Unnamed labels
Unnamed labels are defined by a sole colon (:) on a line. Reference them with : followed by one or more + (forward) or - (backward) characters; :++ refers to the second unnamed label forward, :- to the first unnamed label backward. Angle brackets < and > may be used instead of - and + with the same meaning.

Caveats:
- Unnamed labels have no name in the symbol table and are not affected by named-symbol scopes (.PROC). Scopes do not change unnamed label visibility.
- They can make code hard to read because targets are determined by counting unnamed labels; prefer cheap local labels when readability matters.

## Using .DEFINE for labels and constants
.DEFINE performs token substitution (low-level textual replacement). It can define constants and string constants (strings are not available via other symbol types). Because .DEFINE is textual substitution:
- Definitions do not follow scoping rules.
- Diagnostics and map files do not contain .DEFINE symbols.
- No debug info is generated for .DEFINE symbols.

These limitations can lead to subtle bugs; avoid .DEFINE unless necessary.

## Symbols and .DEBUGINFO
When .DEBUGINFO is enabled (or ca65 invoked with -g), the assembler writes global, local (.PROC), and cheap local labels to the object file; these symbols will be available in the linker's symbol file. Unnamed labels are not written to the object file (they have no name to export).

## Source Code
```asm
        Clear:  lda    #$00             ; Global label
                ldy    #$20
        @Loop:  sta    Mem,y            ; Cheap local label (default '@')
                dey
                bne    @Loop            ; Ok
                rts
        Sub:    ...                     ; New global label
                bne    @Loop            ; ERROR: Unknown identifier!

        cpy #0
        beq :++
    :
        sta $2007
        dey
        bne :-
    :
        rts

        .DEFINE two     2
        .DEFINE version "SOS V2.3"

        four = two * two        ; Ok
        .byte   version         ; Ok

        .PROC                   ; Start local scope
        two = 3                 ; Will give "2 = 3" - invalid!
        .ENDPROC
```

## References
- "scopes_and_namespace" — expands on how scopes affect named symbols  
- "macros_overview" — expands on using .DEFINE and macro-related caveats
