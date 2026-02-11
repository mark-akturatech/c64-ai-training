# IMacro (Kick Assembler) — Macro Plugin Interface

**Summary:** IMacro is the Kick Assembler plugin interface for macros. It extends IPlugin and exposes `getDefinition()` (returns MacroDefinition) and `execute(IValue[] parameters, IEngine engine)`, which returns assembled bytes as a `byte[]`. MacroDefinition contains plugin properties, such as name via `getName()`/`setName()`. Directive format example: `.disk WRITERNAME [...DISK PARAMETERS..] { [..FILE1 PARAMETERS..], ... }`.

**Interface and Behavior**

IMacro is the contract a Kick Assembler macro plugin must implement. Key points:

- **IMacro extends IPlugin.**
- **getDefinition():** Returns a MacroDefinition object that supplies the plugin's properties, including:
  - `getName()`/`setName()`: Accessor and mutator for the macro's name.
- **execute(IValue[] parameters, IEngine engine):** Invoked to perform the macro action. It receives:
  - `parameters`: An array of IValue instances representing the macro's parameters.
  - `engine`: An IEngine instance providing the assembly environment and services.
- **Return Value:** The `execute` method returns a `byte[]` containing the assembled bytes produced by the macro, which are emitted into the output.
- **Directive Usage:** Macros implement directives like `.disk`. The definition properties in MacroDefinition correspond to directive-level configurations (e.g., writer name, disk parameters, file entries).

**.disk Directive Format Example:**

- `.disk WRITERNAME [...DISK PARAMETERS..] { [..FILE1 PARAMETERS..], ... }`

This implies MacroDefinition must expose properties sufficient to describe the writer name and any parameter schema needed by the writer or files.

**IValue Interface**

IValue represents values passed as parameters to macros. Key methods include:

- **getInt():** Retrieves the value as an integer.
- **getDouble():** Retrieves the value as a double.
- **getString():** Retrieves the value as a string.
- **getBoolean():** Retrieves the value as a boolean.
- **getList():** Retrieves the value as a list of IValue instances.
- **hasIntRepresentation():** Checks if the value can be represented as an integer.
- **hasDoubleRepresentation():** Checks if the value can be represented as a double.
- **hasStringRepresentation():** Checks if the value can be represented as a string.
- **hasBooleanRepresentation():** Checks if the value can be represented as a boolean.
- **hasListRepresentation():** Checks if the value can be represented as a list.

These methods allow macros to interpret parameters in various forms, facilitating flexible macro implementations.

**IEngine Interface**

IEngine provides services and context for macro execution. Key methods include:

- **addError(String message, ISourceRange range):** Adds an error to the engine's error list but continues execution.
- **charToByte(char c):** Converts a character to a PETSCII byte (upper case).
- **createMemoryBlock(String name, int startAddr, byte[] bytes):** Creates a memory block, used as a result in some plugins.
- **error(String message):** Prints an error message and stops execution, similar to the `.error` directive.
- **error(String message, ISourceRange range):** Prints an error message with a specified position in the code.
- **getCurrentDirectory():** Gets the current directory.
- **getFile(String filename):** Opens a file with the given filename, searching in the current and library directories.
- **normalizeFileName(String name):** Evaluates parameters in a filename string.
- **openOutputStream(String name):** Creates an output stream for outputting a file.
- **print(String message):** Prints a message to the screen, similar to the `.print` directive.
- **printNow(String message):** Prints a message to the screen immediately, similar to the `.printnow` directive.
- **stringToBytes(String str):** Converts a string to PETSCII bytes (upper case).

These methods provide macros with essential functionalities for interacting with the assembler environment.

**Quick Example**

A simple example of a macro implementation that prints "Hello World from MyMacro!" and returns zero bytes:


To use this macro in Kick Assembler:


This example demonstrates the basic structure of a macro plugin, including defining the macro's properties and implementing its execution behavior.

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
        engine.print("Hello world from mymacro!");
        return new byte[0];
    }
}
```

```assembly
.plugin "test.plugins.macros.MyMacro"
MyMacro()
```


## References

- [Kick Assembler Manual: General Communication Interfaces](https://theweb.dk/KickAssembler/webhelp/content/ch17s04.html)
- [Kick Assembler Manual: A Quick Example (Macros)](https://www.theweb.dk/KickAssembler/webhelp/content/ch17s03.html)
- [Kick Assembler Manual: Modifier Plugins](https://theweb.dk/KickAssembler/webhelp/content/ch17s05s02.html)