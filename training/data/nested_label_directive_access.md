# Kick Assembler: .label nested scopes and .if local-label access

**Summary:** Describes Kick Assembler's support for nested label definitions using the `.label` directive, allowing access to inner labels via dot notation (e.g., `mylabel1.mylabel2`). It also explains how placing a label before an `.if` directive enables access to labels defined within the taken branch. Additionally, it includes examples demonstrating these concepts and the usage of the `$D020` register.

**Nested .label Blocks**

Kick Assembler supports nested local label scopes using the `.label` directive with a block. A label assigned to a block becomes a namespace; labels defined inside that block are referenced via dot notation from the outer label.

- **Syntax example (block creates a namespace):**
- **Accessing nested label:**
  - Use `mylabel1.mylabel2` to refer to the inner label's value (the inner symbol is namespaced under the outer label).

This allows grouping related symbols under a named namespace and referencing them with dot-qualified names.

**Accessing Local Labels of .if Directives**

Placing a label immediately before an `.if` directive makes the label namespace resolve to labels defined inside the taken branch (true or false) of that `.if`. Only the labels defined in the branch that is actually taken are available for resolution.

- The symbol (namespace) only needs to be defined in the taken branch.
- If the condition evaluates to false and there is no false branch, any references to symbols inside that namespace result in a "symbol undefined" error.

**Example:**


In this example, the `jmp myIf.label` instruction will jump to the `label` defined within the true branch of the `.if` directive. Since the condition is true, the assembler resolves `myIf.label` to the `label` inside the true branch. If the condition were false and no false branch existed, referencing `myIf.label` would result in an error.

## Source Code

  ```asm
  .label mylabel1 = $1000 {
      .label mylabel2 = $1234
  }
  ```

```asm
jmp myIf.label

myIf: .if (true) {
    label: lda #0  // <-- Jumps here
} else {
    label: nop
}
```


```asm
; Nested .label block example
.label mylabel1 = $1000 {
    .label mylabel2 = $1234
}
; Access via: mylabel1.mylabel2

; Example demonstrating access to local labels of .if directives
jmp myIf.label

myIf: .if (true) {
    label: lda #0  // <-- Jumps here
} else {
    label: nop
}

; Example showing printing/output of the nested value via mylabel1.mylabel2
.print "mylabel2=" + mylabel1.mylabel2
```

## Key Registers

- `$D020` - VIC-II - Border color register

## References

- [Kick Assembler Manual: Accessing Local Labels of if's](https://theweb.dk/KickAssembler/webhelp/content/ch09s09.html)
- [Kick Assembler Manual: Label Scopes](https://theweb.dk/KickAssembler/webhelp/content/ch09s06.html)
- [Kick Assembler Manual: Console Output](https://theweb.dk/KickAssembler/webhelp/content/ch03s11.html)