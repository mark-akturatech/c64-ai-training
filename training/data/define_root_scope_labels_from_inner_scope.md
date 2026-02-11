# Kick Assembler: @ (root-scope) and label-scoped namespaces

**Summary:** Describes Kick Assembler's usage of the `@` prefix to place labels defined inside a nested scope into the root scope, and the pattern of declaring a scope after a label so inner labels are accessible as fields (e.g., `clearScreen.fillbyte`). Searchable terms: Kick Assembler, `@`, root scope, label scope, namespace, label fields.

**Usage**

- **Root Scope Labels:** Prefix a label with `@` when defining it inside a nested scope to force the label into the root/global scope instead of the current local scope. This is useful for making labels accessible globally even when defined within a local scope. ([theweb.dk](https://www.theweb.dk/KickAssembler/KickAssembler.pdf?utm_source=openai))

- **Label-Scoped Namespaces:** Declare a scope after a label (`label: { ... }`) to create a namespace; labels inside that scope are then referenced as fields on the outer label (`label.inner_label`). This pattern is useful to keep labels local to a function-like namespace while still allowing selected labels to be visible globally by using `@`. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch09s06.html?utm_source=openai))

**Examples**

- **Example 1: Define inside a scope but place into root scope with `@`**


  In this example, `outside_label` is defined within a local scope but is placed into the root scope using the `@` prefix, allowing it to be called globally.

- **Example 2: Namespace after a label; inner labels are fields accessed as `clearScreen.fillbyte`**


  Here, `clearScreen` is a label with an associated scope. Inside this scope, `fillbyte` is defined. The `clearScreen.fillbyte` notation allows access to `fillbyte` from outside the scope, treating it as a field of `clearScreen`. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch09s06.html?utm_source=openai))

- **Example 3: Using `@` with functions, macros, and pseudocommands**


  In this example, functions, macros, and pseudocommands are defined within the `MyLibrary` namespace but are placed into the root namespace using the `@` prefix. This allows them to be accessed globally without the namespace prefix. ([theweb.dk](https://www.theweb.dk/KickAssembler/KickAssembler.pdf?utm_source=openai))

## Source Code

  ```asm
          jsr outside_label
          rts

  {
  @outside_label:
          lda #$00
          sta $D020
          rts
  }
  ```

  ```asm
          lda #' '          ; load ASCII space (single-quoted char literal)
          sta clearScreen.fillbyte+1
          jsr clearScreen
          rts

  clearScreen: {
  fillbyte:
          lda #$00
          ldx #$00
  loop:
          sta $0400,x
          sta $0500,x
          sta $0600,x
          sta $0700,x
          inx
          bne loop
          rts
  }
  ```

  ```asm
  .namespace MyLibrary {
      .function @myFunction() {
          .return 1
      }

      .macro @MyMacro() {
          .print "Macro Called"
      }

      .pseudocommand @MyPseudoCommand {
          .print "PseudoCommand Called"
      }
  }

  .print myFunction()
  MyMacro()
  MyPseudoCommand
  ```


## References

- [Kick Assembler Manual: Label Scopes](https://www.theweb.dk/KickAssembler/webhelp/content/ch09s06.html)
- [Kick Assembler Manual: Scoping Hierarchy](https://www.theweb.dk/KickAssembler/webhelp/content/ch09s03.html)
- [Kick Assembler Manual: Functions and Macros](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_FunctionsAndMacros.html)
- [Kick Assembler Manual: Pseudo Commands](https://www.theweb.dk/KickAssembler/webhelp/content/ch07s03.html)
- [Kick Assembler Manual: Namespaces](https://www.theweb.dk/KickAssembler/webhelp/content/ch09s02.html)