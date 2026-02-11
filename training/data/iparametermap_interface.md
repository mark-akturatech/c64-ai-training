# Kick Assembler — Modifier and SegmentModifier plugin interfaces (Java)

**Summary:** Describes Kick Assembler plugin interfaces IParameterMap, IModifier, and ISegmentModifier plus their related definition classes (ModifierDefinition, SegmentModifierDefinition). Covers method signatures (execute/getDefinition), parameter conventions (IValue, IParameterMap, _-prefixed modifier params), and an example .file directive using modify="MyPacker".

## IParameterMap (name-value parameter collections)
IParameterMap represents a name → IValue parameter collection (values implement IValue). It is used for directive or plugin parameters parsed from square-bracket maps (e.g. .file [ ... ]). Typical methods you can call when reading parameters:

- exist(String) — test presence of a parameter name.
- getBoolValue(String, paramDefault) — read boolean with default.
- getEnumValue(...) — read an enum (signature varies; source lists it as available).
- getIntValue(String, int) — read integer with fallback default.
- getParameterNames() — iterate all parameter names present.
- getSourceRange(String) — get source range/location for a parameter (for error reporting).
- getStringValue(String, String) — read string with default.
- getValue(String) — retrieve raw IValue for further inspection or evaluation.

Use IParameterMap when implementing plugins that accept named parameters. The values are IValue so they may represent constants, expressions, or strings as parsed by the assembler.

## Implementing a simple modifier (IModifier)
IModifier plugins change the final emitted file bytes (e.g. packers, compressors). Key points:

- Implement the interface:
  - public interface IModifier extends IPlugin
  - Required methods:
    - ModifierDefinition getDefinition();
    - byte[] execute(List<IMemoryBlock> memoryBlocks, IValue[] parameters, IEngine engine);

- ModifierDefinition holds metadata:
  - private String name; // the modifier name as used in directives
  - getters and setters for the name

- Usage: the definition.name is the modifier name used in source, e.g. modify="MyPacker". The execute method receives segment memory blocks and an array of ordered IValue parameters (positional parameters), and returns a byte[] containing the final file contents produced by the modifier.

## Segment modifiers (ISegmentModifier)
Segment modifiers operate on the memory blocks of a segment before they are passed to the destination (file, binary output). Use cases: packer applied to a segment, pre-processing, segment-level transformations.

- Interface:
  - public interface ISegmentModifier extends IPlugin
  - Required methods:
    - SegmentModifierDefinition getDefinition();
    - List<IMemoryBlock> execute(List<IMemoryBlock> memoryBlocks, IParameterMap parameters, IEngine engine);

- SegmentModifierDefinition fields:
  - private String name; // modifier name
  - private Set<String> allParameters; // possible parameter names accepted by this modifier
  - private Set<String> nonOptionalParameters; // required parameter names
  - getters and setters

- Conventions:
  - Parameter names belonging to the modifier should be prefixed with '_' (underscore), e.g. _start. This avoids collisions with future or built-in segment parameter names and makes it clear which params are for the modifier.
  - allParameters defines the full set of modifier parameters the modifier recognizes; nonOptionalParameters should list those that are required.
  - The execute method takes the segment's List<IMemoryBlock>, an IParameterMap of parameters (keyed names → IValue), and IEngine for assembler services. It returns a List<IMemoryBlock> (possibly transformed or replaced).

- Example usage in assembly source (modifier applied to file output; shown below in Source Code).

## Source Code
```java
// IModifier interface
public interface IModifier extends IPlugin {
    ModifierDefinition getDefinition();
    byte[] execute(List<IMemoryBlock> memoryBlocks, IValue[] parameters, IEngine engine);
}

// ModifierDefinition class
public class ModifierDefinition {
    private String name;
    // Getters and setters
}
```

```java
// ISegmentModifier interface
public interface ISegmentModifier extends IPlugin {
    SegmentModifierDefinition getDefinition();
    List<IMemoryBlock> execute(List<IMemoryBlock> memoryBlocks, IParameterMap parameters, IEngine engine);
}

// SegmentModifierDefinition class
public class SegmentModifierDefinition {
    private String name;
    private Set<String> allParameters;
    private Set<String> nonOptionalParameters;
    // getters and setters
}
```

```text
; Example .file directive applying a segment modifier and passing a modifier parameter
.file [name="PackedData.prg", segments="Data", modify="MyPacker", _start=$2000]
```

## References
- "modifiers" — chapter on modifiers (plugin usage and examples)
- "segments" — chapter covering segment modifiers and example project implementation
