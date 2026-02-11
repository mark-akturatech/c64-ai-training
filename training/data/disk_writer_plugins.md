# Kick Assembler DiskWriter Plugin API

**Summary:** Describes the Kick Assembler DiskWriter plugin API, including the `IDiskWriter` interface, `DiskWriterDefinition` parameter sets (`allDiskParameters`, `nonOptionalDiskParameters`, `allFileParameters`, `nonOptionalFileParameters`), the `.disk` directive syntax, the `IDiskData` and `IDiskFileData` structures (utilizing `IParameterMap` and `IMemoryBlock` lists), and the usage of `AutoIncludeFile`/`IAutoIncludeFile`. Details on using `IEngine` to open output streams are also provided.

**Overview**

DiskWriter plugins implement the `IDiskWriter` interface and are invoked by the assembler when a `.disk` directive references the writer by name. The `DiskWriterDefinition` declares the parameter schema for disk-level and per-file parameters. The assembler parses a `.disk` directive into an `IDiskData` object (containing disk parameters and a list of file entries) and calls the plugin's `execute` method with that data and an `IEngine` instance to create the output image/stream.

- **`.disk` directive format:**


  (Where `WRITERNAME` must match the plugin's `DiskWriterDefinition` name)

- **`DiskWriterDefinition` must enumerate:**
  - `allDiskParameters`: All disk-level parameters accepted by the writer.
  - `nonOptionalDiskParameters`: Disk-level parameters that are required.
  - `allFileParameters`: All per-file parameters accepted by the writer.
  - `nonOptionalFileParameters`: Per-file parameters that are required.

- **`execute` expectations:**
  - Implement `DiskWriterDefinition getDefinition()`.
  - Implement `void execute(IDiskData disk, IEngine engine)`.
  - The `execute` method reads parameters and memory blocks and uses `IEngine` to open output streams and write the disk image or files.
  - `IDiskData` and `IDiskFileData` provide parameter maps (`IParameterMap`) and lists of memory blocks (`IMemoryBlock`) to source the file bytes.

- **Parameter passing:**
  - `IParameterMap` is used for both disk-level and file-level parameters.
  - `IMemoryBlock` objects contain byte data.

- **Auto-included files in archives:**
  - `AutoIncludeFile` objects allow bundling source files inside plugin JARs so they are compiled with the project's source when the archive is imported.
  - `AutoIncludeFile` constructor parameters:
    1. JAR name (for error messages).
    2. A class object from the JAR (used to open the resource).
    3. The resource path inside the JAR.
  - `IAutoIncludeFile` provides `getDefinition()` and `openStream()` to supply the content.

## Source Code

  ```
  .disk WRITERNAME [..DISK PARAMETERS..] {
      [..FILE PARAMETERS..],
      ...
  }
  ```


```java
// Required IDiskWriter signature
public interface IDiskWriter extends IPlugin {
    DiskWriterDefinition getDefinition();
    void execute(IDiskData disk, IEngine engine);
}

// DiskWriterDefinition class
public class DiskWriterDefinition {
    private String name;
    private Set<String> allDiskParameters;
    private Set<String> nonOptionalDiskParameters;
    private Set<String> allFileParameters;
    private Set<String> nonOptionalFileParameters;

    // Getters and setters for each field
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Set<String> getAllDiskParameters() { return allDiskParameters; }
    public void setAllDiskParameters(Set<String> allDiskParameters) { this.allDiskParameters = allDiskParameters; }

    public Set<String> getNonOptionalDiskParameters() { return nonOptionalDiskParameters; }
    public void setNonOptionalDiskParameters(Set<String> nonOptionalDiskParameters) { this.nonOptionalDiskParameters = nonOptionalDiskParameters; }

    public Set<String> getAllFileParameters() { return allFileParameters; }
    public void setAllFileParameters(Set<String> allFileParameters) { this.allFileParameters = allFileParameters; }

    public Set<String> getNonOptionalFileParameters() { return nonOptionalFileParameters; }
    public void setNonOptionalFileParameters(Set<String> nonOptionalFileParameters) { this.nonOptionalFileParameters = nonOptionalFileParameters; }
}

// Data structures provided to execute():
public interface IDiskData {
    IParameterMap getParameters();
    List<IDiskFileData> getFiles();
}

public interface IDiskFileData {
    IParameterMap getParameters();
    List<IMemoryBlock> getMemoryBlocks();
}

// IEngine interface
public interface IEngine {
    void addError(String message, ISourceRange range);
    OutputStream openOutputStream(String name) throws Exception;
    void print(String message);
    void printNow(String message);
    byte[] stringToBytes(String str);
}

// IParameterMap interface
public interface IParameterMap {
    boolean exist(String paramName);
    boolean getBoolValue(String paramName, boolean defaultValue);
    <T extends Enum<?>> T getEnumValue(Class<T> enumeration, String name, T defaultLiteral);
    int getIntValue(String paramName, int defaultValue);
    Collection<String> getParameterNames();
    ISourceRange getSourceRange(String paramName);
    String getStringValue(String paramName, String defaultValue);
    IValue getValue(String paramName);
}

// IMemoryBlock interface
public interface IMemoryBlock {
    int getStartAddress();
    byte[] getBytes();
    String getName();
}

// Auto-include file interfaces (for bundling source in plugin JARs)
public interface IAutoIncludeFile extends IPlugin {
    AutoIncludeFileDefinition getDefinition();
    InputStream openStream();
}

public class AutoIncludeFileDefinition {
    private String filePath;
    private String jarName;

    // Getters and setters for each field
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getJarName() { return jarName; }
    public void setJarName(String jarName) { this.jarName = jarName; }
}

// Example AutoIncludeFile usage
public class MyArchive implements IArchive {
    @Override
    public List<IPlugin> getPluginObjects() {
        ArrayList<IPlugin> plugins = new ArrayList<>();
        plugins.add(new SomePlugin1());
        plugins.add(new SomePlugin2());
        plugins.add(new AutoIncludeFile("MyArchive.jar", getClass(), "/include/MyAutoInclude.asm"));
        return plugins;
    }
}
```

## References

- [Kick Assembler Manual: 3rd Party Java Plugins](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_Plugins.html)
- [Kick Assembler Manual: The IEngine Interface](https://www.theweb.dk/KickAssembler/webhelp/content/ch17s04s01.html)
- [Kick Assembler Manual: The IParameterMap Interface](https://www.theweb.dk/KickAssembler/webhelp/content/ch17s04s05.html)
- [Kick Assembler Manual: The IMemoryBlock Interface](https://www.theweb.dk/KickAssembler/webhelp/content/ch17s04s04.html)
- [Kick Assembler Manual: Writing to User Defined Files](https://www.theweb.dk/KickAssembler/webhelp/content/ch12s05.html)