# Kick Assembler IMacro Interface and MacroDefinition (Writer & Disk/File Parameters)

**Summary:** This document details Kick Assembler's `IMacro` interface, including its methods `getDefinition()` and `execute(IValue[] parameters, IEngine engine)`, the `MacroDefinition` class with its `name` property, the mechanism for writer dispatch based on `WRITERNAME` matching, and the structures for disk and file parameters (`IDiskData`, `IDiskFileData`). It also outlines the validation rules for parameter sets (`allParameters` and `non-optionalParameters`).

**Overview**

This section outlines the contract for Kick Assembler macros and the process for invoking and validating writers during disk image or file creation.

- **IMacro Interface:**
  - `getDefinition()`: Returns a `MacroDefinition` object containing at least a `name` property.
  - `execute(IValue[] parameters, IEngine engine)`: Executes the macro with the provided parameters and engine context.

- **MacroDefinition Class:**
  - `name`: The macro or writer name used for invocation matching (`WRITERNAME`).

- **Writer Dispatch Mechanism:**
  - When a `WRITERNAME` matches the `MacroDefinition.name`, the corresponding macro (writer) is invoked.
  - Writers handle two types of parameters: disk parameters and file parameters.
  - Each parameter group includes:
    - `allParameters`: A set of all possible parameter names for that group.
    - `non-optionalParameters`: A set of parameter names that must be present.
  - **Validation Rules:**
    - If a supplied parameter is not in `allParameters`, Kick Assembler generates an error.
    - If a non-optional parameter is missing, Kick Assembler generates an error.

**Execute Method Parameters (Disk/File Structures)**

The `execute` method utilizes interfaces for disk-related operations:

- **IDiskData Interface:**
  - `IParameterMap getParameters()`: Retrieves disk-level parameters.
  - `List<IDiskFileData> getFiles()`: Retrieves the list of files associated with the disk.

- **IDiskFileData Interface:**
  - `IParameterMap getParameters()`: Retrieves file-level parameters.
  - `String getFileName()`: Retrieves the name of the file.
  - `byte[] getData()`: Retrieves the file data as a byte array.

The `IEngine` and `IValue` types referenced in the `execute` method are defined as follows:

- **IEngine Interface:**
  - Provides methods for interacting with the assembler engine, such as reporting errors, printing messages, and creating output streams.

- **IValue Interface:**
  - Represents a value that can be an integer, string, boolean, list, or other types, with methods to retrieve the value in the desired type.

## Source Code

```java
// IMacro interface
public interface IMacro {
    MacroDefinition getDefinition();
    void execute(IValue[] parameters, IEngine engine);
}

// MacroDefinition class
public class MacroDefinition {
    private String name;

    // Constructor
    public MacroDefinition(String name) {
        this.name = name;
    }

    // Getter
    public String getName() {
        return name;
    }

    // Setter
    public void setName(String name) {
        this.name = name;
    }
}

// IDiskData interface
public interface IDiskData {
    IParameterMap getParameters();
    List<IDiskFileData> getFiles();
}

// IDiskFileData interface
public interface IDiskFileData {
    IParameterMap getParameters();
    String getFileName();
    byte[] getData();
}

// IEngine interface
public interface IEngine {
    void addError(String message, ISourceRange range);
    void error(String message);
    void print(String message);
    OutputStream openOutputStream(String name) throws Exception;
    // Other methods...
}

// IValue interface
public interface IValue {
    int getInt();
    String getString();
    boolean getBoolean();
    List<IValue> getList();
    // Other methods...
}

// IParameterMap interface
public interface IParameterMap {
    boolean exists(String paramName);
    IValue getValue(String paramName);
    Collection<String> getParameterNames();
    // Other methods...
}
```

**Example Implementation:**

```java
package test.plugins.macros;

import kickass.plugins.interf.general.IEngine;
import kickass.plugins.interf.general.IValue;
import kickass.plugins.interf.macro.IMacro;
import kickass.plugins.interf.macro.MacroDefinition;

public class MyMacro implements IMacro {
    private MacroDefinition definition;

    public MyMacro() {
        definition = new MacroDefinition("MyMacro");
    }

    @Override
    public MacroDefinition getDefinition() {
        return definition;
    }

    @Override
    public void execute(IValue[] parameters, IEngine engine) {
        engine.print("Hello world from MyMacro!");
    }
}
```

**Usage in Kick Assembler:**

```assembly
.plugin "test.plugins.macros.MyMacro"
MyMacro()
```

## References

- [Kick Assembler Manual: General Communication Interfaces](https://theweb.dk/KickAssembler/webhelp/content/ch17s04.html)
- [Kick Assembler Manual: A Quick Example (Macros)](https://www.theweb.dk/KickAssembler/webhelp/content/ch17s03.html)
- [Kick Assembler Manual: The Plugins](https://theweb.dk/KickAssembler/webhelp/content/ch17s05.html)
