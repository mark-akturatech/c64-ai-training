# ca65 pseudo-functions: .ADDRSIZE, .BANK, and .BANKBYTE

**Summary:** .ADDRSIZE(symbol) returns the assembler's internal address size for a symbol (0/1/2), useful in macros; .BANK(symbol) returns the 32-bit bank attribute of the run memory area for the segment containing the symbol (evaluated at link stage only); .BANKBYTE(expr) returns the bank byte (bits 16-23) of its argument, equivalent to the '^' operator. Keywords: ca65, pseudo-function, .ADDRSIZE, .BANK, .BANKBYTE, bank attribute, link stage, .LOBYTE.

**Behavior and usage**

- **Pseudo-functions** accept their arguments in parentheses and return either a string or an expression value.

- **.ADDRSIZE(symbol)**
  - Returns the internal address size associated with the given symbol.
  - Typical results: 1 (zeropage/8-bit address), 2 (absolute/16-bit address), 0 (no address size defined for the symbol).
  - Common use: macros that emit different instruction encodings depending on the address size of a symbol.
  - Example usage pattern (see Source Code): branching on .ADDRSIZE(foo) to emit zeropage or absolute opcodes, or error on size 0.

- **.BANK(expr)**
  - Designed for systems with banked memory.
  - Argument must be an expression containing exactly one segment reference (usually a label in a segment).
  - The result is the bank attribute value assigned to the run memory area of that segment (see linker docs for memory areas/attributes).
  - Bank attribute and .BANK result are 32-bit integers. Use .LOBYTE/.HIBYTE/etc. to extract portions.
  - .BANK is evaluated at link stage only. Therefore, expressions containing .BANK cannot be used where a constant known at assembly time is required (for example, in .RES).
  - Typical use: populate tables with bank numbers for bank-switching (example in Source Code shows writing low bank byte next to an address).
  - Note: Because .BANK resolves at link time, code that depends on its numeric value at assembly time is not valid.

- **.BANKBYTE(expr)**
  - Returns the bank byte (bits 16-23) of its argument.
  - Equivalent to the '^' operator.
  - Useful for extracting the bank byte from an address or label.
  - Example usage pattern (see Source Code): using .BANKBYTE to extract the bank byte of a label's address.

## Source Code
```asm
; Example: .ADDRSIZE usage inside a macro
.macro myLDA foo
        .if .ADDRSIZE(foo) = 1
                ;do custom command based on zeropage addressing:
                .byte 0A5h, foo
        .elseif .ADDRSIZE(foo) = 2
                ;do custom command based on absolute addressing:
                .byte 0ADh
                .word foo
        .elseif .ADDRSIZE(foo) = 0
                ; no address size defined for this symbol:
                .out .sprintf("Error, address size unknown for symbol %s", .string(foo))
        .endif
.endmacro

; Example: .BANK to populate bank bytes in a table
.segment "BANK1"
.proc   banked_func_1
        ...
.endproc

.segment "BANK2"
.proc   banked_func_2
        ...
.endproc

.proc   bank_table
        .addr   banked_func_1
        .byte   <.BANK (banked_func_1)

        .addr   banked_func_2
        .byte   <.BANK (banked_func_2)
.endproc

; Example: .BANKBYTE usage
.segment "CODE"
.proc   example
        lda     #.BANKBYTE(label)
        ...
.endproc

.segment "DATA"
label:
        .byte   0
.endsegment
```

## References
- "address_sizes_and_memory_models" — expands on address size semantics
- "pseudo_functions_misc" — expands on other pseudo-functions (.LOBYTE, .HIBYTE, .SIZEOF, etc.)