# Kick Assembler — accessing macro-execution labels; forward-declared macros; macro recursion

**Summary:** Kick Assembler allows accessing labels produced by a macro expansion by placing a label immediately before the macro call. Macros can be invoked before their declaration and may call other macros or recurse, provided a termination condition is supplied to avoid infinite recursion.

**Behavior**

- **Label capture:** Placing a label before a macro invocation enables that label to refer to labels generated during that specific macro expansion. This is achieved by creating a label scope, allowing access to the macro's internal labels through the prefixed label. For example:

  In this example, `c1` and `c2` are labels placed before the `setColor` macro calls. This setup allows `c1.color` and `c2.color` to access the `color` label defined within each macro expansion. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch09s07.html?utm_source=openai))

- **Forward declaration:** Kick Assembler permits calling a macro before its declaration. The assembler resolves the macro at expansion time, allowing for flexible code organization. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch07s02.html?utm_source=openai))

- **Macro composition and recursion:** Macros can call other macros or themselves. Recursive macro use is allowed but must include a termination condition (e.g., a depth/count parameter or conditional branch) to prevent infinite expansion loops. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch07s02.html?utm_source=openai))

- **Pseudo-commands:** Pseudo-commands, a special kind of macro, follow the same behavior rules as macros. They can be used to encapsulate common patterns and can access internal labels similarly by placing a label before their invocation. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch09s07.html?utm_source=openai))

## Source Code

  ```assembly
  *=$1000
  start:  inc c1.color
          dec c2.color
  c1:     :setColor()
  c2:     :setColor()
          jmp start

  .macro setColor() {
          .label color = *+1
          lda #0
          sta $d020
  }
  ```

```assembly
*=$1000
start:  inc c1.color
        dec c2.color
c1:     :setColor()
c2:     :setColor()
        jmp start

.macro setColor() {
        .label color = *+1
        lda #0
        sta $d020
}
```

## References

- "pseudocommand_intro_and_simple_mov_examples" — expands on pseudo-commands and builds on macro behavior (contains examples).
