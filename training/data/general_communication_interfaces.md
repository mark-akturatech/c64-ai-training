# Kick Assembler: IValue / IEngine (plugin interfaces)

**Summary:** Describes Kick Assembler plugin interfaces in package `kickass.plugins.interf.general`, focusing on `IValue` (representation of assembler values: numbers, strings, booleans; used for macro arguments) and `IEngine` (for plugin communication). Useful search terms: Kick Assembler, IValue, IEngine, plugin, macro arguments.

**IValue Interface**

Objects implementing `IValue` represent Kick Assembler values (examples: numeric literals, strings, booleans). `IValue` instances are used where the assembler hands values to plugins and macros (for example, macro arguments and expression results). The interface exposes methods that allow a plugin to query the underlying type and extract the contained value(s) in appropriate forms.

### IValue Interface Methods

The `IValue` interface provides the following methods:

- `Boolean getBoolean()`: Retrieves the value as a Boolean if possible; otherwise, an error is thrown.
- `List<IValue> getList()`: Retrieves the value as a list of `IValue` instances if possible; otherwise, an error is thrown. The returned list supports `size()`, `get(int index)`, `isEmpty()`, and `iterator()`.
- `Boolean hasIntRepresentation()`: Indicates whether the value can be represented as an integer. Every numeric value can produce an integer (e.g., 3.2 will produce 3).
- `boolean hasDoubleRepresentation()`: Indicates whether the value can be represented as a double.
- `boolean hasStringRepresentation()`: Indicates whether the value can be represented as a string.
- `boolean hasBooleanRepresentation()`: Indicates whether the value can be represented as a boolean.
- `boolean hasListRepresentation()`: Indicates whether the value can be represented as a list.

These methods enable plugins to inspect and convert values as needed.

**IEngine Interface**

`IEngine` is the principal interface used to communicate with the assembler from plugins. It provides services such as registering callbacks, querying assembler state, emitting output, and interacting with the assembly process.

### IEngine Interface Methods

The `IEngine` interface includes the following methods:

- `void addError(String message, ISourceRange range)`: Adds an error to the engine's error list but continues execution. This allows reporting multiple errors from a plugin.
- `byte charToByte(char c)`: Converts a character to a PETSCII byte (upper case).
- `IMemoryBlock createMemoryBlock(String name, int startAddr, byte[] bytes)`: Creates a memory block, used as a result in some plugins.
- `void error(String message)`: Prints an error message and stops execution, similar to the `.error` directive. This method throws an `AsmException` that must be propagated through any try-catch blocks.
- `void error(String message, ISourceRange range)`: Similar to `error(String message)`, but with a specified position in the code (`ISourceRange`).
- `File getCurrentDirectory()`: Retrieves the current directory.
- `File getFile(String filename)`: Opens a file with the given filename. The assembler searches for the file as it would for a source code file, including in library directories. Returns `null` if the file can't be found.
- `String normalizeFileName(String name)`: Evaluates any parameters in a filename string. For example, if a filename for a disk is given as `%o.d64` and assembled from `MyDemo.asm`, `%o` is replaced, and `MyDemo.d64` is returned.
- `OutputStream openOutputStream(String name) throws Exception`: Creates an output stream for outputting a file from the assembler (e.g., a disk file for a disk writer).
- `void print(String message)`: Prints a message to the screen, similar to the `.print` directive.
- `void printNow(String message)`: Prints a message to the screen immediately, similar to the `.printnow` directive.
- `byte[] stringToBytes(String str)`: Converts a string to PETSCII bytes (upper case).

These methods facilitate various interactions between plugins and the assembler.

**Example Plugin Snippets**

Below are example snippets demonstrating typical `IValue` usage, including conversion and inspection patterns.

### Example 1: Macro Plugin Using IValue


In this example, the `MyMacro` class implements the `IMacro` interface. The `execute` method uses the `IEngine` interface to print a message. The `parameters` array contains `IValue` instances representing the macro's arguments.

### Example 2: Modifier Plugin Using IValue


In this example, the `MyModifier` class implements the `IModifier` interface. The `execute` method processes a list of `IMemoryBlock` instances and an array of `IValue` parameters. It demonstrates how to access and modify the bytes of a memory block.

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

```java
package test.plugins.modifiers;

import kickass.plugins.interf.general.IEngine;
import kickass.plugins.interf.general.IValue;
import kickass.plugins.interf.general.IMemoryBlock;
import kickass.plugins.interf.modifier.IModifier;
import kickass.plugins.interf.modifier.ModifierDefinition;

import java.util.List;

public class MyModifier implements IModifier {
    private ModifierDefinition definition;

    public MyModifier() {
        definition = new ModifierDefinition();
        definition.setName("MyModifier");
    }

    @Override
    public ModifierDefinition getDefinition() {
        return definition;
    }

    @Override
    public byte[] execute(List<IMemoryBlock> memoryBlocks, IValue[] parameters, IEngine engine) {
        // Example: Modify the bytes of the first memory block
        if (!memoryBlocks.isEmpty()) {
            IMemoryBlock block = memoryBlocks.get(0);
            byte[] bytes = block.getBytes();
            // Perform modifications on bytes
            // ...
            return bytes;
        }
        return new byte[0];
    }
}
```


## References

- [Kick Assembler Manual: General Communication Interfaces](https://theweb.dk/KickAssembler/webhelp/content/ch17s04.html)
- [Kick Assembler Manual: Macro Plugins](https://theweb.dk/KickAssembler/webhelp/content/ch17s03.html)
- [Kick Assembler Manual: Modifier Plugins](https://theweb.dk/KickAssembler/webhelp/content/ch17s05s02.html)