# Kick Assembler IMacro / Engine Plugin Snippets

**Summary:** This document details the implementation of the `IMacro` interface for creating macros in Kick Assembler, including the `MacroDefinition` class, `IMemoryBlock` interface, `IEngine` interface, `IValue` interface, and the `AsmException` class.

**IMacro Interface**

The `IMacro` interface is used to define macros in Kick Assembler. It includes:

- `MacroDefinition getDefinition()`: Returns the macro's definition, encapsulated in a `MacroDefinition` object.
- `byte[] execute(IValue[] parameters, IEngine engine)`: Executes the macro with the provided parameters and engine interface, returning a byte array as the result.

The `MacroDefinition` class is a simple wrapper containing the macro's name.

**MacroDefinition Class**

The `MacroDefinition` class defines the properties of a macro. It includes:

- `private String name`: The name of the macro.
- Getter and setter methods: `getName()` and `setName(String name)`.

**IMemoryBlock Interface**

The `IMemoryBlock` interface represents a block of memory. It includes:

- `int getStartAddress()`: Returns the start address of the memory block.
- `byte[] getBytes()`: Returns the byte array contained in the memory block.
- `String getName()`: Returns the name of the memory block.

**IEngine Interface**

The `IEngine` interface provides methods for interacting with the Kick Assembler engine. It includes:

- `void addError(String message, ISourceRange range)`: Adds an error to the engine's error list without stopping execution.
- `byte charToByte(char c)`: Converts a character to a PETSCII byte (upper case).
- `IMemoryBlock createMemoryBlock(String name, int startAddr, byte[] bytes)`: Creates a memory block with the specified name, start address, and byte array.
- `void error(String message)`: Prints an error message and stops execution. This method throws an `AsmException`.
- `void error(String message, ISourceRange sourceRange)`: Similar to the above method but associates the error with a specific source position.
- `File getCurrentDirectory()`: Returns the current directory.
- `File getFile(String filename)`: Opens a file with the given filename, searching in the current directory and library directories. Returns `null` if the file can't be found.
- `String normalizeFileName(String name)`: Evaluates parameters in a filename string.
- `OutputStream openOutputStream(String name) throws Exception`: Creates an output stream for outputting a file.
- `void print(String message)`: Prints a message to the screen, similar to the `.print` directive.
- `void printNow(String message)`: Prints a message to the screen immediately, similar to the `.printnow` directive.
- `byte[] stringToBytes(String str)`: Converts a string to PETSCII bytes (upper case).

**IValue Interface**

The `IValue` interface represents values in Kick Assembler, such as numbers, strings, and booleans. It includes:

- `int getInt()`: Returns the integer representation of the value, if possible.
- `Double getDouble()`: Returns the double representation of the value, if possible.
- `String getString()`: Returns the string representation of the value, if possible.
- `Boolean getBoolean()`: Returns the boolean representation of the value, if possible.
- `List<IValue> getList()`: Returns the list representation of the value, if possible.
- `Boolean hasIntRepresentation()`: Indicates if the value can be represented as an integer.
- `boolean hasDoubleRepresentation()`: Indicates if the value can be represented as a double.
- `boolean hasStringRepresentation()`: Indicates if the value can be represented as a string.
- `boolean hasBooleanRepresentation()`: Indicates if the value can be represented as a boolean.
- `boolean hasListRepresentation()`: Indicates if the value can be represented as a list.

**AsmException Class**

The `AsmException` class is used to signal errors during assembly. It is a checked exception, requiring handling in the code. The class includes constructors for creating exceptions with a message and/or cause.

**Example Implementation**

Below is an example implementation of an `IMacro` plugin:


To use this macro in Kick Assembler:


This will print "Hello world from MyMacro!" during assembly.

## Source Code

```java
package test.plugins.macros;

import kickass.plugins.interf.general.IEngine;
import kickass.plugins.interf.general.IValue;
import kickass.plugins.interf.macro.IMacro;
import kickass.plugins.interf.macro.MacroDefinition;

public class MyMacro implements IMacro {
    private MacroDefinition definition;

    public MyMacro() {
        definition = new MacroDefinition();
        definition.setName("MyMacro");
    }

    @Override
    public MacroDefinition getDefinition() {
        return definition;
    }

    @Override
    public byte[] execute(IValue[] parameters, IEngine engine) {
        engine.print("Hello world from MyMacro!");
        return new byte[0];
    }
}
```

```assembly
.plugin "test.plugins.macros.MyMacro"
MyMacro()
```


## References

- [Kick Assembler Manual: 3rd Party Java Plugins](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_Plugins.html)
- [Kick Assembler Manual: General Communication Interfaces](https://www.theweb.dk/KickAssembler/webhelp/content/ch17s04.html)
- [Kick Assembler Manual: A Quick Example (Macros)](https://www.theweb.dk/KickAssembler/webhelp/content/ch17s03.html)