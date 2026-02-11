# KickAssembler Plugin Pattern — DiskWriter (IDiskWriter)

**Summary:** KickAssembler plugins implement `IPlugin` and provide a `Definition` object (via `getDefinition()`) and an `execute(...)` method. DiskWriter plugins implement `IDiskWriter` (with `getDefinition()` and `execute(IDiskData, IEngine)`) and utilize `DiskWriterDefinition` fields (`allDiskParameters`, `nonOptionalDiskParameters`, `allFileParameters`, `nonOptionalFileParameters`).

**Overview**

KickAssembler plugins follow a consistent pattern:

- Each plugin class implements a plugin interface that extends the marker `IPlugin`.
- Plugin interfaces expose a `getDefinition()` method that returns a `Definition` object (concrete `Definition` classes provide getters/setters such as `setName()`) which describes the plugin (name, accepted parameters, required parameters, etc.).
- Plugin interfaces also expose an `execute(...)` method which is invoked by the assembler engine to run the plugin logic; `execute` receives types defined by the KickAssembler runtime (for disk writers, this includes `IDiskData` and `IEngine`).

This document details the `IDiskWriter` interface and the `DiskWriterDefinition` class used in DiskWriter plugins.

**DiskWriter Plugins (`IDiskWriter`)**

- **Interface:** `IDiskWriter` extends `IPlugin`.
- **Required Methods:**
  - `DiskWriterDefinition getDefinition()`: Returns a `DiskWriterDefinition` describing the writer (name and parameter sets).
  - `void execute(IDiskData disk, IEngine engine)`: Called to perform the write operation; receives an `IDiskData` object representing the disk image and the assembler engine runtime (`IEngine`).
- **`DiskWriterDefinition` Class Fields:**
  - `name`: Identifier for the writer.
  - `allDiskParameters`: `Set<String>` listing disk-level parameter names the writer accepts.
  - `nonOptionalDiskParameters`: `Set<String>` listing required disk-level parameter names.
  - `allFileParameters`: `Set<String>` listing per-file parameter names the writer accepts.
  - `nonOptionalFileParameters`: `Set<String>` listing required per-file parameter names.

(Parenthetical clarifications: `IDiskData` — disk image model used by writers; `IEngine` — assembler/host engine interface.)

## Source Code

```java
public interface IDiskWriter extends IPlugin {
    DiskWriterDefinition getDefinition();
    void execute(IDiskData disk, IEngine engine);
}

public class DiskWriterDefinition {
    private String name;
    private Set<String> allDiskParameters;
    private Set<String> nonOptionalDiskParameters;
    private Set<String> allFileParameters;
    private Set<String> nonOptionalFileParameters;

    // Constructor
    public DiskWriterDefinition(String name) {
        this.name = name;
        this.allDiskParameters = new HashSet<>();
        this.nonOptionalDiskParameters = new HashSet<>();
        this.allFileParameters = new HashSet<>();
        this.nonOptionalFileParameters = new HashSet<>();
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<String> getAllDiskParameters() {
        return allDiskParameters;
    }

    public void setAllDiskParameters(Set<String> allDiskParameters) {
        this.allDiskParameters = allDiskParameters;
    }

    public Set<String> getNonOptionalDiskParameters() {
        return nonOptionalDiskParameters;
    }

    public void setNonOptionalDiskParameters(Set<String> nonOptionalDiskParameters) {
        this.nonOptionalDiskParameters = nonOptionalDiskParameters;
    }

    public Set<String> getAllFileParameters() {
        return allFileParameters;
    }

    public void setAllFileParameters(Set<String> allFileParameters) {
        this.allFileParameters = allFileParameters;
    }

    public Set<String> getNonOptionalFileParameters() {
        return nonOptionalFileParameters;
    }

    public void setNonOptionalFileParameters(Set<String> nonOptionalFileParameters) {
        this.nonOptionalFileParameters = nonOptionalFileParameters;
    }
}

public interface IDiskData {
    IParameterMap getParameters();
    List<IDiskFileData> getFiles();
}

public interface IDiskFileData {
    IParameterMap getParameters();
    List<IMemoryBlock> getMemoryBlocks();
}

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
```

## References

- "macro_plugins_interface" — expands on Macro plugin example
- "modifier_plugins_interface" — expands on Modifier plugin example