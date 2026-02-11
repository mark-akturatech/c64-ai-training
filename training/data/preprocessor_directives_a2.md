# Kick Assembler — Appendix A.2: Preprocessor Directives

**Summary:** This section details Kick Assembler's preprocessor directives, including `#define`, `#undef`, `#if`/`#elif`/`#else`/`#endif`, `#import`, `#importif`, and `#importonce`. It provides concrete usage examples for each directive, explains the expression language used in conditional directives, and clarifies the behavior of `#importonce`. Additionally, it illustrates the interaction between command-line defines and preprocessor directives.

**Preprocessor Directives**

- `#define` — Defines a preprocessor symbol. Symbols are used in conditional expressions and substitutions.

  **Example:**

- `#undef` — Removes a previously defined preprocessor symbol.

  **Example:**

- `#if` — Begins a conditional block evaluated using Kick Assembler's expression language.

  **Example:**

- `#elif` — Else-if for `#if` conditional chains.

  **Example:**

- `#else` — Fallback branch for `#if` blocks.

  **Example:**

- `#endif` — Closes an `#if` conditional block.

- `#import` — Includes another file by textually inserting its contents.

  **Example:**

- `#importif` — Conditionally imports a file if the given expression evaluates to true.

  **Example:**

- `#importonce` — Ensures a file is included only once; subsequent imports are ignored.

  **Example:**

**Expression Language in Conditional Directives**

The expressions used in `#if` and `#elif` directives support the following:

- **Operators:**
  - Arithmetic: `+`, `-`, `*`, `/`
  - Comparison: `==`, `!=`, `<`, `>`, `<=`, `>=`
  - Logical: `&&`, `||`, `!`

- **Constants:** Numeric literals (e.g., `0`, `1`, `2`).

- **Defined Operator:** `defined(SYMBOL)` returns true if `SYMBOL` is defined.

  **Example:**

**Behavior of `#importonce`**

The `#importonce` directive ensures that the current file is imported only once, preventing multiple inclusions. This is particularly useful for header files or common code segments that should not be processed multiple times.

**Example:**

When a file containing `#importonce` is imported, the assembler records its inclusion. If the same file is imported again, the assembler skips its contents, avoiding redundant processing.

**Interaction Between Command-Line Defines and Preprocessor Directives**

Preprocessor symbols can be defined via the command line using the `-define` option. These symbols interact with preprocessor directives within the source code.

**Command-Line Example:**

**Source Code Example:**

In this example, if the `DEBUG` symbol is defined via the command line, the assembler processes the code within the `#if DEBUG` block. Otherwise, it processes the code within the `#else` block.

## Source Code

  ```asm
  #define DEBUG
  ```

  ```asm
  #undef DEBUG
  ```

  ```asm
  #if DEBUG
      .print "Debug mode is ON"
  #endif
  ```

  ```asm
  #if DEBUG
      .print "Debug mode is ON"
  #elif RELEASE
      .print "Release mode is ON"
  #endif
  ```

  ```asm
  #if DEBUG
      .print "Debug mode is ON"
  #else
      .print "Debug mode is OFF"
  #endif
  ```

  ```asm
  #import "common.asm"
  ```

  ```asm
  #importif DEBUG "debug.asm"
  ```

  ```asm
  #importonce
  ```

  ```asm
  #if defined(DEBUG)
      .print "Debug mode is defined"
  #endif
  ```

```asm
#importonce
```

```sh
java -jar KickAss.jar -define DEBUG
```

```asm
#if DEBUG
    .print "Debug mode is ON"
#else
    .print "Debug mode is OFF"
#endif
```


## References

- [Kick Assembler Manual: Chapter 8. Preprocessor](https://www.theweb.dk/KickAssembler/webhelp/content/ch08.html)
- [Kick Assembler Manual: Chapter 5. Branching and Looping](https://theweb.dk/KickAssembler/webhelp/content/ch05s02.html)
- [Kick Assembler Manual: Chapter 3. Basic Assembler Functionality](https://theweb.dk/KickAssembler/webhelp/content/ch03s11.html)