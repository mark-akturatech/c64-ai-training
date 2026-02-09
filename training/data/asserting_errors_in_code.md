# Kick Assembler: .asserterror (assert assembler error)

**Summary:** Demonstrates Kick Assembler's .asserterror directive which runs a code block and asserts that assembling it produces an assembler error (e.g. a type error). Searchable terms: .asserterror, Kick Assembler, assembler error, code block.

## Description
.asserterror is a test/assertion directive used to verify that a given block of assembler source produces an assembler error when assembled. It takes a message (identifier for the test) and a code block; the assembler should report an error for the enclosed code. The directive is useful for unit-testing assembler behaviors and error conditions.

Basic behavior (from source): the directive is used like a message plus a code block; the example demonstrates asserting a type error when attempting to assemble an obviously invalid instruction operand.

## Source Code
```asm
; Example usage (Kick Assembler)
.asserterror "Test", { lda #"This must fail" }
; Expected output: assembling the block should produce an assembler error (type error)
```

```text
; Fragment of Java macro-class source included in original chunk
definition = new MacroDefinition();
definition.setName("MyMacro");
}
@Override
public MacroDefinition getDefinition() {
    return definition;
}
@Override
```

## Key Registers
(omitted — this chunk documents an assembler directive, not hardware registers)

## References
(none)