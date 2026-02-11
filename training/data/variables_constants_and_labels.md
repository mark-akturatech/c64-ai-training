# Kick Assembler — Variables, .eval, .const, .enum, .label (Section 4.2)

**Summary:** Describes Kick Assembler script directives for declaring and mutating variables (.var, .eval), compound operators (++, --, +=, -=, *=, /=), immutable constants (.const and lock()), enumerations (.enum), and scope/visibility for .label declarations; includes postfix ++/-- semantics and assignment chaining behavior.

**Variable declarations and .eval**
- Use .var to declare a variable: `.var x = 25` (shorthand for `.eval var x = 25`).
- `.eval` forces evaluation of expressions and is used for assignments and arithmetic updates: `.eval x = x + 10`.
- Compound operators (++, --, +=, -=, *=, /=) invoke `.eval`-style updates on a referenced variable:
  - `x++` increments by 1, `x--` decrements by 1.
  - `x += y` increases `x` by `y`, `x *= y` multiplies by `y`, etc.
- `++` and `--` behave as true postfix operators: they return the original value and then mutate the variable.
  - Example behavior: `.eval x = 0; .eval y = x++;` results in `x = 1` and `y = 0`.
- Assignments return values, so chaining assignments like `x = y = z = 25` is supported (the RHS value is returned and assigned leftwards).

**Constants and locking mutable values**
- `.const` declares an immutable binding name (constant):
  - `.const c = 1`
  - `.const name = "Camelot"`
- A `.const` binding cannot be reassigned (`.eval pi = 22` will error if `pi` was `.const`).
- Note: immutability is shallow for container objects (lists, etc.). If a constant references a mutable container, the container's contents may still change.
- To make a mutable object truly immutable, call `lock()` on it:
  - `.const immutableList = List().add(1,2,3).lock()`
  - After `lock()`, attempts to modify the list will produce an error.

**Enumerations (.enum)**
- `.enum` defines a set of constants (auto-numbered unless explicitly assigned):
  - `.enum {singleColor, multiColor}` defines `singleColor = 0`, `multiColor = 1`
  - `.enum {effect1 = 1, effect2 = 2, end = $ff}` explicit values allowed
  - `.enum {up, down, left, right, none = $ff}` implicit and explicit mixing allowed

**Labels and visibility**
- Variables and constants are visible only after their declaration.
- Labels are visible for the entire scope regardless of textual order. Use `.label` to declare assembler-visible labels:
  - Incorrect (fails because label used before declared as constant): `inc myLabel1; .const myLabel1 = $D020`
  - Correct (label visible): `inc myLabel2; .label myLabel2 = $D020`
- Use `.label` to expose a symbol as a label (assembler jump/branch target) across scope boundaries.

## Source Code
```text
; Examples from section 4.2 (original text and corrected canonical forms)

; Original / as-printed (contains OCR/joining artifact on one line)
.var x=25
lda #x
; // Gives lda #25

; Change x later
.eval x=x+10
lda #x
; // Gives lda #35

; Compound operator examples (as printed)
.var x = 0
.eval x++
.eval x--
.eval x+=3
.eval x-=7
.eval x*=3
.eval x/=2

; Comments in original:
; // Gives x=x+1
; // Gives x=x-1
; // Gives x=x+3
; // Gives x=x-7
; // Gives x=x*3
; // Gives x=x/2

; Constants and lists
.const c=1
; // Declares the constant c to be 1
.const name = "Camelot"

; Locking a mutable list
.const immutableList = List().add(1,2,3).lock()

; Enumerations
.enum {singleColor, multiColor}
; // singleColor=0, multiColor=1
.enum {effect1=1,effect2=2,end=$ff}
.enum {up,down,left,right, none=$ff}

; Label visibility examples
; This fails (using inc on a symbol that is a constant later)
inc myLabel1
.const myLabel1 = $d020

; This is ok (label visible across the scope)
inc myLabel2
.label myLabel2 = $d020
```

```text
; Canonical / corrected examples (recommended)
.var x = 25
lda #x          ; expands to lda #25

.eval x = x + 10
lda #x          ; if x was 25, now lda #35

.var x = 0
.eval x++       ; x becomes 1, returns original value
.eval x--       ; x becomes 0, returns original value
.eval x += 3    ; x = x + 3
.eval x -= 7    ; x = x - 7
.eval x *= 3    ; x = x * 3
.eval x /= 2    ; x = x / 2

; Postfix semantics example
.eval x = 0
.eval y = x++
; After above: x = 1, y = 0

; Locking example
.const immutableList = List().add(1,2,3).lock()
; Any attempt to mutate immutableList now causes an error

; Enum examples
.enum {singleColor, multiColor}          ; singleColor=0, multiColor=1
.enum {effect1=1,effect2=2,end=$ff}      ; explicit values
.enum {up,down,left,right, none=$ff}     ; mix implicit and explicit

; Label example
inc myLabel2
.label myLabel2 = $D020
```

## References
- "working_with_mutable_values" — expands on locking mutable values and the .define directive (Section 6.3)
- "labels_argument_labels_and_multi_labels" — expands on label declarations and usage in assembler code (Section 3.4)
