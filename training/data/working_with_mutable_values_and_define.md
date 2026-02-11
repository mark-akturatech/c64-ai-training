# Kick Assembler: Mutable vs Immutable Values, .lock(), and .define (Function Mode)

**Summary:** Explains mutable vs immutable values in Kick Assembler (List() vs Numbers/Strings/Booleans), the .lock() method and .define directive for locking mutable values across passes, and the function-mode restrictions and performance characteristics (function mode, .define, .lock()).

## Mutable vs Immutable Values
Lists (List()) in Kick Assembler are mutable: their contents can change over time (e.g. [1,6,7] → [1,4,8,9]). Numbers, strings and booleans are immutable. Starting with Kick Assembler 3, mutable values must be locked if they will be used in an assembly pass different from the pass in which they were created. A locked value becomes immutable; attempts to call functions that would modify it will cause an error.

## Locking mutable values
There are two ways to lock a mutable value:
- Call its .lock() method (locks the instance directly).
- Define the value inside a .define directive (the directive defines listed symbols and executes its body in a new scope; after execution the defined symbols are locked and inserted as constants in the outer scope).

The .define mechanism is useful when you need to build values in a local scope and then export them as immutable constants for use in other passes.

(See the Source Code section for concise examples.)

## .define directive and function mode
.define <symbols> { ... }:
- The identifiers after .define become symbols defined by the directive.
- The body is executed in a new (inner) scope; local variables inside that scope are not visible outside.
- After executing the inner directives, the listed symbols are locked and inserted as constants in the outer scope.
- The inner directives run in "function mode" (faster, lower memory).

Placing heavy calculations (e.g. loops) inside a .define can improve performance and reduce memory usage because of function-mode execution.

## Function mode restrictions
Function mode (used inside .define bodies and inside functions) only allows script directives. Allowed examples: .var, .const, .eval, .enum, and other script-only directives. Byte output or assembly-generating directives are forbidden inside function mode and will produce errors. Examples of disallowed constructs include assembly/byte-output style lines such as:
- lda #10
- byte $22
- .word $33
- .fill 10
- literal data entries like 0

Function mode is intended for pure script computation and symbol construction, not for producing assembled output.

## Source Code
```text
// Example: locking a list with .lock()
.var list1 = List().add(1,3,5).lock()

// Example: using .define to create locked constants outside the scope
.define list2, list3 {
  .var list2 = List().add(1,2)
  .var list3 = List()
  .eval list3.add("a")
  .eval list3.add("b")
}
// .eval list3.add("c") // This will give an error (list3 is locked outside the .define)
```

## References
- "optimization_considerations_when_using_loops" — expands on placing heavy loops inside .define for function-mode performance
- "variables_constants_and_labels" — expands on how .const and .var interact with .define and .lock()