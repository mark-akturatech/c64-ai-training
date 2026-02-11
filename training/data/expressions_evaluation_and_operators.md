# ca65 Expression Evaluation (ca65 Users Guide)

**Summary:** ca65 evaluates expressions with 32-bit precision; expressions containing undefined or imported symbols may be deferred to the linker. This chunk documents expression result sizing rules (byte vs word), boolean semantics and shortcut operators (.AND/.OR), constant-expression restrictions (.IF), and the available operators with precedence (unary +,-, ~, .LOBYTE/.HIBYTE/.BANKBYTE, arithmetic, bitwise, shifts, compare, logical).

## Expression evaluation
- All expressions are evaluated with at least 32-bit precision.
- Expressions may contain constant values, internal symbols, and external (imported) symbols.
- Any expression that cannot be fully evaluated at assembly time is stored in the object file for linker evaluation.
- Expressions referencing imported symbols must always be evaluated by the linker.

## Size of an expression result
When the assembler needs to know address size (for generating zero page vs absolute addressing), it follows these rules to determine whether an expression is treated as byte-sized or word-sized:

1. If the expression is constant (fully evaluable at assembly time), the actual numeric value is checked to see if it fits in a byte.
2. If the expression is explicitly cast to a byte using one of the unary operators .LOBYTE ('<'), .HIBYTE ('>') or .BANKBYTE ('^'), it is considered a byte expression.
3. If the expression contains a symbol explicitly declared as a zero-page symbol (via .importzp or .exportzp), the entire expression is assumed to be byte-sized.
4. If the expression contains symbols that are not defined, and those symbols are local symbols, enclosing scopes are searched for a symbol with the same name; if one exists and is defined, its attributes determine the result size.
5. In all other cases the expression is assumed to be word-sized.

Note: If the assembler cannot evaluate the expression at assembly time, the linker will evaluate it later and check for range errors once the result is known.

(See "address_size_overrides" for expanded rules on when the assembler needs to know address size.)

## Boolean expressions
- Boolean semantics: any non-zero value is true; zero is false. A boolean expression yields 1 for true and 0 for false.
- Shortcut operators: .AND and .OR are shortcut (short-circuit) operators in ca65 v2.x (where x > 0). If the left-hand side already determines the result, the right-hand side is not evaluated.
- There are boolean operators with very low precedence (see operator precedence table).
- The unary boolean not operator is ! or .NOT.

## Constant expressions
- Certain assembler directives (notably .IF) require expressions that are constant at the point they are read. An expression used in .IF cannot reference a symbol that is defined later in the source, because the decision must be made immediately.
- If an expression used in such a context contains only numeric constants, it is fine.
- If unresolvable symbols are involved, the assembler may not be able to determine constancy; simplifying the expression can help.
- When the result is not needed immediately, evaluation can be delayed until all input is read (so complex constant expressions are acceptable in many contexts).

## Parentheses
- Parentheses may be used to force a specific order of evaluation as usual.

## Source Code
```text
Operator	Description	Precedence
Built-in string functions	0
Built-in pseudo-variables	1
Built-in pseudo-functions	1
+	Unary positive	1
-	Unary negative	1
~ .BITNOT	Unary bitwise not	1
< .LOBYTE	Unary low-byte operator	1
> .HIBYTE	Unary high-byte operator	1
^ .BANKBYTE	Unary bank-byte operator	1

*	Multiplication	2
/	Division	2
.MOD	Modulo operator	2
& .BITAND	Bitwise and	2
^ .BITXOR	Binary bitwise xor	2
<< .SHL	Shift-left operator	2
>> .SHR	Shift-right operator	2

+	Binary addition	3
-	Binary subtraction	3
| .BITOR	Bitwise or	3

=	Compare operator (equal)	4
<>	Compare operator (not equal)	4
<	Compare operator (less)	4
>	Compare operator (greater)	4
<=	Compare operator (less or equal)	4
>=	Compare operator (greater or equal)	4

&& .AND	Boolean and	5
.XOR	Boolean xor	5

|| .OR	Boolean or	6

! .NOT	Boolean not	7

Available operators, sorted by precedence
```

## References
- "address_size_overrides" — expands on when assembler needs to know address size
- "pseudo_functions" — expands on operators and functions (.LOBYTE, .HIBYTE, .BANKBYTE, built-in pseudo-variables)
