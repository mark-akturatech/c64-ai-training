# Kick Assembler: IMemoryBlock, IMacro and Modifier Plugins

**Summary:** Describes the IMemoryBlock interface (getStartAddress, getBytes, getName), the IMacro plugin interface (getDefinition, execute(IValue[], IEngine)), MacroDefinition (name/getName/setName), and modifier plugins (.modify) that receive List<IMemoryBlock> and return modified output bytes. Mentions IEngine.createMemoryBlock and the marker IPlugin.

## IMemoryBlock and plugin usage
IMemoryBlock represents a contiguous block of assembled output with:
- a start address (int getStartAddress()),
- the raw bytes (byte[] getBytes()),
- and a name (String getName()).

Memory blocks are produced by the assembler (the documentation notes an example that produces two memory blocks) and can be:
- passed into plugins (macros, modifiers, disk writers),
- created programmatically via IEngine.createMemoryBlock (API exists; signature not shown).

Many plugin "definition" classes in the API currently contain only a name property; the definition-class pattern is used to allow future extensions without breaking backwards compatibility.

IPlugin is an empty marker interface implemented by all plugin interfaces (used for type safety when checking plugin instances).

## Macro plugins (IMacro)
Macro plugins implement:
- MacroDefinition getDefinition()
- byte[] execute(IValue[] parameters, IEngine engine)

MacroDefinition is a simple holder for macro metadata (currently at least a name with getters/setters). The execute method receives evaluated parameter values and an engine reference, and returns a byte array that the assembler will incorporate.

Signature example (from source):
- IMacro extends IPlugin
- execute returns byte[] and takes (IValue[] parameters, IEngine engine)

MacroDefinition contains:
- private String name;
- getName() and setName(name) accessors

(See Source Code for exact snippets.)

## Modifier plugins
Modifiers transform the output bytes of one or more memory blocks. Typical behavior:
- The assembler passes a List<IMemoryBlock> (the selected memory block(s)) to the modifier.
- The modifier returns replacement bytes that the assembler will use instead of the original bytes for that memory region.

Assembler usage example (passes the memory block starting at $8080 to MyModifier):
```asm
.modify MyModifier(27) {
*=$8080
main:
```
In this example the memory block starting at $8080 is sent to the modifier named "MyModifier" (with argument 27), and the modifier's returned bytes replace the original bytes for that block.

Additional plugin types (e.g., disk writers) also refer to IMemoryBlock bytes when producing their output.

## Source Code
```java
// IMacro interface (from source)
public interface IMacro extends IPlugin {
    MacroDefinition getDefinition();
    byte[] execute(IValue[] parameters, IEngine engine);
}
```

```java
// MacroDefinition (excerpt from source)
public class MacroDefinition {
    // Properties
    private String name;
    // Getters/setters for properties, in this case getName() and setName(name)
    ....
}
```

```asm
; Assembler modifier example (from source)
.modify MyModifier(27) {
*=$8080
main:
```

```text
; Notes from source:
; - Memory blocks can be passed to plugins or created via IEngine.createMemoryBlock
; - Many definitions only contain a name for forward compatibility
; - All plugin interfaces extend IPlugin (empty marker)
```

## References
- "modifier_plugins_interface" — expands on Modifiers receive List<IMemoryBlock> to modify output bytes
- "disk_writer_plugins" — expands on Disk writer files refer to IMemoryBlock bytes
