# OPPTR ($4B-$4C) — Math Operator Table Displacement

**Summary:** OPPTR at $004B-$004C is a 2-byte zero-page location holding the displacement of the current math operator within the BASIC interpreter's operator table during expression evaluation; it is also reused as a save area for the pointer to the address of program text currently being read.

**Description**
OPPTR is a two-byte (word) zero-page variable at addresses $004B-$004C. Primary uses documented in the interpreter code:

- During evaluation of mathematical expressions, OPPTR contains the displacement (offset) of the current math operator inside the operator table used by the expression evaluator.
- The same two-byte area is also used as a temporary save area for a pointer to the current program text being read (i.e., it can hold part of a text pointer while parsing or stepping through program statements).

Because OPPTR is a general-purpose temporary in the interpreter, its contents are volatile across parsing/evaluation operations and should be treated as scratch storage by any routine that relies on interpreter internals.

## Source Code
```assembly
; Example usage of OPPTR in the BASIC interpreter

; Assume OPPTR ($4B-$4C) holds the offset to the current operator in the operator table
; Load the low byte of OPPTR into X register
LDX $4B
; Load the high byte of OPPTR into A register
LDA $4C
; Combine A and X to form the full offset
; (In 6502 assembly, this would typically involve shifting and adding, but for simplicity, assume direct usage)

; Now, use this offset to access the operator table
; Assume OP_TABLE is the base address of the operator table
; Calculate the address of the current operator
; OP_ADDR = OP_TABLE + (A * 256 + X)

; Load the operator code from the operator table
LDA OP_TABLE, X
; Process the operator as needed
```

## Key Registers
- $004B-$004C - Zero page - OPPTR: displacement of current math operator in operator table; temporary save area for pointer to current program text.

## References
- "opmask_comparison_mask_bits" — expands on OPMASK (comparison mask bits) created during expression evaluation.
- "oldtxt_pointer_to_current_basic_statement" — expands on OLDTXT and shows how program-text pointers (like those saved to OPPTR) relate to TXTPTR/OLDTXT.

## Labels
- OPPTR
