# Kick Assembler IMacro plugin interface and MacroDefinition (Java)

**Summary:** Describes the Kick Assembler IMacro plugin interface (methods: getDefinition(), execute(IValue[] parameters, IEngine engine)), the simple MacroDefinition holder (name property with getters/setters), and a minimal MyMacro example that prints "Hello World from MyMacro!" and returns zero bytes.

## Overview
IMacro is the Java plugin interface used by Kick Assembler macros. Implementations provide:
- getDefinition() — returns a MacroDefinition that identifies the macro (name and other metadata).
- execute(IValue[] parameters, IEngine engine) — called during assembly to produce the macro's assembled bytes (returns a byte[]).

IValue and IEngine are engine/plugin runtime types (runtime/context interfaces used by the macro system).

The MacroDefinition class is a simple POJO containing the defining properties of a macro; the only required defining property is the macro name (String).

A minimal macro example prints "Hello World from MyMacro!" and returns an empty byte array (zero assembled bytes).

## Source Code
```text
// Interface methods (IMacro)
MacroDefinition getDefinition();
byte[] execute(IValue[] parameters, IEngine engine);
```

```text
// MacroDefinition skeleton
public class MacroDefinition {
    // Properties
    private String name;
    // Getters/setters for properties, in this case getName() and setName(name)
    ....
}
```

```text
// Example macro skeleton (truncated in source)
package test.plugins.macros;
import kickass.plugins.interf.general.IEngine;
import kickass.plugins.interf.general.IValue;
import kickass.plugins.interf.macro.IMacro;
import kickass.plugins.interf.macro.MacroDefinition;
public class MyMacro implements IMacro {
    MacroDefinition definition;
    public MyMacro() {
```
**[Note: Source truncated — constructor/body and execute implementation are not present in the provided text.]**

## Key Registers
(omitted — this chunk does not describe C64 hardware registers)

## References
(omitted — no cross-chunk references present in source)