# Kick Assembler — Segment Modifier & AutoIncludeFile Plugins

**Summary:** Describes Kick Assembler SegmentModifier plugins (ISegmentModifier, SegmentModifierDefinition, IMemoryBlock, modifier parameters like _start) and AutoIncludeFile plugins for bundling source files in archives; includes .plugin registration and example snippets.

**Segment Modifier Plugins**

SegmentModifier plugins allow an archive to modify memory blocks of a named segment before output, which is useful for tasks such as packing, compressing, or patching. A SegmentModifier is a Java class that implements the `ISegmentModifier` interface and must provide:

- `SegmentModifierDefinition getDefinition();`
- `List<IMemoryBlock> execute(List<IMemoryBlock> memoryBlocks, IParameterMap parameters, IEngine engine);`

The `SegmentModifierDefinition` contains:

- `name`
- `allParameters`
- `nonOptionalParameters`

Conventionally, modifier parameters are prefixed with an underscore ('_') to avoid collisions with assembler parameters. For example, use `_start` for an address parameter.

Example usage in Kick Assembler source directive syntax, applying the modifier "MyPacker" with parameter `_start=$2000` to segment "A":


A plugin archive registers plugin objects by returning a list of `IPlugin` implementations from its `getPluginObjects()` method, as shown in the example below.

**AutoIncludeFile Plugins**

AutoIncludeFile plugins automatically include source files (e.g., macros) when an archive is imported. The Kick Assembler JAR provides a standard `AutoIncludeFile` implementation commonly used for this purpose.

For example, to include `MyAutoInclude.asm` located in your JAR under the `/include/` package, add an `AutoIncludeFile` object to your archive. This ensures the assembler auto-includes that file when the archive is imported.

The example source file `MyAutoInclude.asm` can contain macros, as demonstrated below.

## Source Code

```asm
.file [modify="MyPacker", _start=$2000] A
```


```asm
; Example segment modifier usage in Kick Assembler source:
.file [modify="MyPacker", _start=$2000] A
```

```java
// Example: plugin registration inside an IArchive implementation
public class MyArchive implements IArchive {
    @Override
    public List<IPlugin> getPluginObjects() {
        List<IPlugin> plugins = new ArrayList<>();
        plugins.add(new MyMacro());
        plugins.add(new MyModifier());
        plugins.add(new AutoIncludeFile("MyArchive.jar", getClass(), "/include/MyAutoInclude.asm"));
        return plugins;
    }
}
```

```text
; Registering the archive from Kick Assembler source:
.plugin "test.plugins.archives.MyArchive"
```

```asm
// FILE: MyAutoInclude.asm
.macro SetColor(color) {
    lda #color
    sta $d020
}
```

```java
// ISegmentModifier required methods (descriptive form)
public interface ISegmentModifier extends IPlugin {
    SegmentModifierDefinition getDefinition();
    List<IMemoryBlock> execute(List<IMemoryBlock> memoryBlocks, IParameterMap parameters, IEngine engine);
}
```

## References

- [Kick Assembler Manual: 3rd Party Java Plugins](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_Plugins.html)
- [Kick Assembler Manual: Modifier Plugins](https://www.theweb.dk/KickAssembler/webhelp/content/ch17s05s02.html)
- [Kick Assembler Manual: General Communication Interfaces](https://www.theweb.dk/KickAssembler/webhelp/content/ch17s04.html)