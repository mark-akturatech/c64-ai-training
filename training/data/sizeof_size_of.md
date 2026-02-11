# ca65 .SIZEOF pseudo-function (10.23)

**Summary:** .SIZEOF() is a ca65 pseudo-function that returns the size of a struct/union, a struct member, a scope/procedure, or a label. For procedures/labels the size is the amount of data emitted into the segment where the label/scope is relative to; data emitted after a segment switch (into another segment) is not counted. Scopes take precedence over same-named symbols and the symbol/scope must exist before use.

## Behavior and rules
- Arguments accepted: struct/union, struct member, scope (including procedures), or label.
- Struct/union: .SIZEOF(Type) returns the byte size of the type (sum of members).
- Struct member: .SIZEOF(Type::member) returns the size of that member.
- Label / procedure / scope:
  - The size is defined as the amount of data emitted into the segment that was active when the label/scope was entered (the segment the label is relative to).
  - If a line of code switches segments (for example, a .data line inside a scope), data emitted into other segments does not count toward the size.
  - Data emitted in child scopes is included in the parent scope's size (i.e., .SIZEOF(parent) includes child-scope data).
- Existence requirement: the symbol or scope must exist before it can be used with .SIZEOF() (this is always enforced for scopes; may be relaxed later for symbols).
- Name resolution: if the final name component can refer to both a scope and a symbol, the scope is chosen over the symbol.

## Example and expected results
Given the example below, the following .SIZEOF values apply:
- .sizeof(Point) => 4 (size of struct Point)
- .sizeof(Point::xcoord) => 2 (size of the xcoord member)
- .sizeof(P) => 4 (data declared on the same source line as label P, in P's segment)
- .sizeof(@P) => 4 (works for local/cheap labels as well)
- .sizeof(Code) => 3 (amount of data emitted into the code segment where Code was entered; includes child scopes like Code::Inner)
- .sizeof(Code::Inner) => 1
- .sizeof(Data) => 0 (Data enters a scope and then switches segment before emitting data into the scope's original segment, so nothing counts)

## Source Code
```asm
        .struct Point                   ; Struct size = 4
                xcoord  .word
                ycoord  .word
        .endstruct

        P:      .tag    Point           ; Declare a point
        @P:     .tag    Point           ; Declare another point

        .code
        .proc   Code
                nop
                .proc   Inner
                        nop
                .endproc
                nop
        .endproc

        .proc   Data
        .data                           ; Segment switch!!!
                .res    4
        .endproc
```

## References
- "max_value" — example use of .sizeof inside expressions (used in .MAX example)