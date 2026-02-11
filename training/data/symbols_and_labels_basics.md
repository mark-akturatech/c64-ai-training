# ca65: Symbols and Labels (identifier rules, numeric constants, .SET, .SPRINTF)

**Summary:** Identifier rules (start with a letter, follow with letters/digits; optional extra chars via at_in_identifiers/dollar_in_identifiers/leading_dot_in_identifiers), reserved single-letter tokens (e.g. A is the accumulator), numeric constants with = or :=, mutable numeric variables via .SET (usable inside .REPEAT and macros), and generating unique labels with .SPRINTF.

**Identifier syntax**
A symbol/label must start with a letter and may be followed by letters and digits. Optional characters (such as @, $ or a leading dot) can be allowed if the corresponding assembler features are enabled:

- **at_in_identifiers**: Allows the at symbol ('@') as a valid character in identifiers. The at character is not allowed to start an identifier, even with this feature enabled.

- **dollar_in_identifiers**: Accepts the dollar sign ('$') as a valid character in identifiers. The dollar character is not allowed to start an identifier, even with this feature enabled.

- **leading_dot_in_identifiers**: Permits the dot ('.') as the first character of an identifier. This may be used, for example, to create macro names that start with a dot, emulating control directives of other assemblers. Note, however, that none of the reserved keywords built into the assembler that start with a dot may be overridden.

Single-character identifiers are unreliable because some single letters are assembler keywords or tokens (for example, "A" is the accumulator keyword and cannot be used as a label).

Identifiers are used interchangeably with literal values wherever a numeric value is expected, improving readability.

**Numeric constants ("=" and ":=")**
Numeric constants are created with the equal sign (=) or the label assignment operator (:=).

- Using "=" defines a symbol to a constant value:
  - Example: `two = 2` — the symbol `two` evaluates to 2 wherever a number is required.
- Using ":=" is almost identical but marks the symbol as a label (affects debugger/display tools):
  - Example: `io := $d000`

Either side of the assignment may be an expression; e.g.:
- `four = two * two`

**Numeric variables (.SET)**
Use `.SET` to create symbols whose numeric value may be reassigned later (useful inside macros, .REPEAT, and other control structures). Because the symbol's value can change, its expression must be a constant expression at the point of evaluation (no delayed evaluation semantics).

- Example pattern:
  - `four .set 4`
  - `lda #four`          ; immediate uses current value of four
  - `four .set 3`
  - `lda #four`          ; now immediate loads 3

This allows counters and mutable numeric state during assembly-time control flow.

**Generating unique labels with .SPRINTF**
Combine a numeric `.SET` counter and the `.SPRINTF` function to produce unique label names each time a macro is expanded. Typical pattern:

- Initialize a numeric counter with `.set`
- In a macro, create a label using `.ident` with `.sprintf` formatting that incorporates the counter
- Increment the counter with `.set`

This produces distinct labels on each macro invocation suitable for local naming.

## Source Code
```asm
; Numeric constant with =
two = 2

; Numeric constant with label assignment operator
io := $d000

; Expression using previously defined symbol
four = two * two

; Mutable numeric variable via .set
four .set 4
lda     #four           ; Loads 4 into A
four .set 3
lda     #four           ; Loads 3 into A

; Example: generate unique labels with .sprintf and a counter
lcount  .set 0          ; Initialize the counter

.macro  genlab
        .ident (.sprintf ("L%04X", lcount)):
        lcount .set lcount + 1
.endmacro
```

## References
- "macros_overview" — expands on macros using .SET and .SPRINTF
- "symbols_and_debuginfo" — expands on .DEBUGINFO behavior for symbols