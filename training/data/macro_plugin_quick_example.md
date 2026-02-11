# Kick Assembler: IMacro plugin example (Java)

**Summary:** Example Kick Assembler plugin implementing IMacro in Java. Shows a minimal class (MacroDefinition name "MyMacro"), an execute() that prints "Hello world from mymacro!" and returns zero bytes, plus example assembly usage (.plugin + MyMacro()). Lists IEngine helper methods used by plugins and notes on IValue arguments.

## Implementation notes
This chunk shows a minimal, complete macro plugin for Kick Assembler that:

- Declares a MacroDefinition with the name "MyMacro".
- Implements IMacro.execute(...) to receive IValue[] arguments and an IEngine for communication with the assembler.
- Uses IEngine.print(...) to emit a message to the assembler console.
- Returns an empty byte[] (zero bytes) from execute to indicate no assembled output.

IValue objects (one per macro parameter) are passed into execute; they represent evaluated macro arguments (see referenced "general_communication_interfaces" for details). IEngine is the host API available to plugin code and provides file access, output streams, console printing and utility conversions (listed in Source Code).

Example assembly usage (loads plugin and invokes macro):
- .plugin "test.plugins.macros.MyMacro"
- MyMacro()

No C64 hardware registers are involved in this chunk.

## Source Code
```java
// file: test/plugins/macros/MyMacro.java
package test.plugins.macros;

import java.io.*;

// Note: IMacro, MacroDefinition, IValue, IEngine are provided by Kick Assembler's plugin API.
public class MyMacro implements IMacro {
    // Return the macro name used in assembly code
    public MacroDefinition getDefinition() {
        return new MacroDefinition("MyMacro");
    }

    // Called when the macro is invoked from assembly.
    // args: evaluated macro arguments (IValue[])
    // engine: communication interface to the assembler (IEngine)
    // Returns assembled bytes for this macro (byte[]). Here we return zero bytes.
    public byte[] execute(IValue[] args, IEngine engine) throws Exception {
        engine.print("Hello world from mymacro!");
        return new byte[0]; // no bytes emitted
    }
}
```

```asm
; Assembly usage example
.plugin "test.plugins.macros.MyMacro"
MyMacro()
```

```text
IEngine helper methods (available to plugins; signatures shown/fixed)
- File getCurrentDirectory();
  Gets the current directory.

- File getFile(String filename);
  Opens a file with the given filename. The assembler will search current dir then library dirs.
  Returns null if the file can't be found.

- String normalizeFileName(String name);
  Evaluates any parameters in a filename string. Example: "%o.d64" assembled from MyDemo.asm
  with %o replaced will return "MyDemo.d64".

- OutputStream openOutputStream(String name) throws Exception;
  Use to create output (e.g., disk file) from the assembler.

- void print(String message);
  Prints a message to the assembler console (same as .print directive).

- void printNow(String message);
  Prints immediately to the assembler console (same as .printnow directive).

- byte[] stringToBytes(String str);
  Converts a Java String to PETSCII bytes (upper case).
```

## References
- "imacro_interface_definition" — expands on the IMacro interface used by this example
- "general_communication_interfaces" — expands on IEngine and IValue used by plugins
