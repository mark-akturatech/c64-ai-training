# Kick Assembler: Namespaces and .filenamespace (namespace field access)

**Summary:** Kick Assembler's namespace fields and the .filenamespace directive; demonstrates dot-notation field access (e.g., vic.backgroundColor0, vic.borderColor), function name shadowing across namespaces, and a call using the @ prefix.

**Description**

This chunk documents two related features in Kick Assembler:

- **Namespace field access:** Identifiers can be referenced with dot notation (namespace.field). This is commonly used to group related symbols or to provide readable names that map to hardware fields (e.g., using a "vic" namespace for VIC-II-related fields).

- **.filenamespace directive:** This directive places all definitions within a file into a specified namespace, helping to avoid global name collisions.

The included function snippet demonstrates scoping and name resolution: two functions with the same name are defined in different namespaces (root vs. mySpace). A call inside the mySpace block using @myFunction() resolves to the mySpace version, illustrating how an inner namespace can shadow an outer symbol.

The @ prefix is used to call functions within the current namespace, allowing for explicit resolution of function names.

## Source Code

```asm
; Example: namespace field access to VIC-related fields
.filenamespace vic

.label backgroundColor0 = $d021
.label borderColor = $d020

; Usage
lda #0
sta vic.backgroundColor0
sta vic.borderColor
```

```text
.function myFunction() { .return "root" }
.namespace mySpace {
  .function myFunction() { .return "mySpace" }
  .print @myFunction()
}
```

## Key Registers

- **vic.backgroundColor0**: $d021
- **vic.borderColor**: $d020

## References

- "namespace_directive_and_namespace_field_access" — expands on namespace field access examples
- "filenamespace_example_files" — expands on detailed file examples using .filenamespace

## Labels
- VIC.BACKGROUNDCOLOR0
- VIC.BORDERCOLOR
