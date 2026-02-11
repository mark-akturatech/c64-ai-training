# Kick Assembler — Modifier Plugins and Archive Plugins

**Summary:** Describes Kick Assembler modifier plugin interfaces and behavior: IModifier, ModifierDefinition, IMemoryBlock, IEngine usage for producing output bytes, and the archive plugin interface IArchive (collecting multiple plugins).

**Modifier Plugins (IModifier)**

Modifiers are plugins that transform the output bytes of a code block or memory block. They are declared in source with the `.modify` directive:

- **Syntax example:** `.modify MyModifier(27) { * = $8080 ... }` (modifier receives the assembled bytes for the block and returns replacement bytes)

**Interface contract (key points):**

- Implement `IModifier` (extends `IPlugin`).
- Provide a `ModifierDefinition` via `getDefinition()`. `ModifierDefinition` exposes at least a `name` property used to register the modifier.
- The `execute` method is called with:
  - `List<IMemoryBlock> memoryBlocks` — the memory blocks to transform (each block provides parameter values and the bytes to be stored in files).
  - `IValue[] parameters` — the parameters passed to the modifier in the `.modify` invocation.
  - `IEngine engine` — engine instance; use it to open output streams and perform file writes when creating output files.
- `execute` must return a `byte[]` containing the replacement bytes for the given memory blocks (the assembler will use these bytes instead of the original block bytes).

**Behavior notes:**

- Modifiers operate on the assembled memory blocks and are responsible for producing the final byte content.
- Use the provided `IEngine` for file output operations (open output stream, write bytes).
- The plugin receives all relevant memory blocks as a list; the plugin decides how to merge/transform them and what bytes to return.

**Archive Plugins (IArchive)**

To package multiple plugin objects in one unit (so they can be registered with a single plugin directive), implement `IArchive`:

- Implement `IArchive` (extends `IPlugin`).
- Provide a `List<IPlugin> getPluginObjects()` which returns the plugin instances contained in the archive.

**Typical usage:**

- Create an archive class that returns a list of plugin objects (modifiers, segment modifiers, etc.) so the assembler can register all plugins in one step.

## Source Code

```java
// Modifier plugin interface
public interface IModifier extends IPlugin {
    ModifierDefinition getDefinition();
    byte[] execute(List<IMemoryBlock> memoryBlocks, IValue[] parameters, IEngine engine);
}

// IMemoryBlock provides the bytes and values to store in files
public interface IMemoryBlock {
    String getName();
    int getStartAddress();
    byte[] getBytes();
    IValue getValue(String name);
    List<String> getValueNames();
}

// IValue represents values from Kick Assembler like numbers, strings, and booleans
public interface IValue {
    int getInt();
    double getDouble();
    String getString();
}

// IEngine is the central object for communication with Kick Assembler
public interface IEngine {
    void addError(String message, ISourceRange range);
    byte charToByte(char c);
    IMemoryBlock createMemoryBlock(String name, int startAddr, byte[] bytes);
    void error(String message);
    void error(String message, ISourceRange range);
    File getCurrentDirectory();
    File getFile(String filename);
    String normalizeFileName(String name);
    OutputStream openOutputStream(String name) throws Exception;
    void print(String message);
    void printNow(String message);
    byte[] stringToBytes(String str);
}

// Archive plugin interface
public interface IArchive extends IPlugin {
    List<IPlugin> getPluginObjects();
}

// Example implementation of MyArchive
public class MyArchive implements IArchive {
    @Override
    public List<IPlugin> getPluginObjects() {
        List<IPlugin> list = new ArrayList<>();
        list.add(new MyModifier());
        list.add(new MySegmentModifier());
        // Add other plugins as needed
        return list;
    }
}
```

## References

- [Kick Assembler Manual: General Communication Interfaces](https://theweb.dk/KickAssembler/webhelp/content/ch17s04.html)
- [Kick Assembler Manual: 3rd Party Java Plugins](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_Plugins.html)
- [Kick Assembler Manual: Writing to User Defined Files](https://theweb.dk/KickAssembler/webhelp/content/ch12s05.html)