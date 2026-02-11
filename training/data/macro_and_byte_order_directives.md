# MAC / MND and Byte-Order Directives

**Summary:** Describes assembler tokens found in listings: MAC and MND (macro delimiters), and directives that emit the low-order and high-order bytes of a 16-bit value; notes that any of these directives may be preceded by a label.

**Description**

- **MAC**: Used to start a macro definition.
- **MND**: Used to end a macro definition.
- **Byte-Order Directives**:
  - **.LOW.**: Specifies the low-order 8 bits of a 16-bit value.
  - **.HIGH.**: Specifies the high-order 8 bits of a 16-bit value.
- All of the above directives may be preceded by a label.

**Usage Examples**

### Macro Definition and Invocation


In this example:

- `DPINC` is a macro that increments a 16-bit value.
- `?1` and `?2` are macro parameters.
- The macro is invoked with the label `COUNT`.

### Byte-Order Directives


In this example:

- `ADDR` is a 16-bit address.
- `.LOW.ADDR` retrieves the low-order byte of `ADDR`.
- `.HIGH.ADDR` retrieves the high-order byte of `ADDR`.

**Macro Parameter Syntax**

- Parameters are referenced within a macro using `?` followed by a digit (1 through 9).
- For example, `?1` refers to the first parameter passed to the macro.

## Source Code

```assembly
; Define a macro to increment a 16-bit value
.MAC DPINC
    INC ?1
    BNE ?2
    INC ?1 + 1
?2
.MND

; Invoke the macro with a label
COUNT DPINC COUNT
```

```assembly
; Define a 16-bit address
ADDR = $C000

; Use .LOW. and .HIGH. to access low and high bytes
LDA #.LOW.ADDR
STA $00
LDA #.HIGH.ADDR
STA $01
```


## References

- "symbol_assignment_directive" — expands on labeling and symbol definitions.
- "macro_parameter_symbol" — expands on macro parameter syntax using `?`.