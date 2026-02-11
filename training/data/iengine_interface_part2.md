# Kick Assembler — IEngine methods (part 2), value-representation flags, ISourceRange, IMemoryBlock

**Summary:** Describes IEngine methods getCurrentDirectory, getFile, normalizeFileName, openOutputStream, print/printNow, stringToBytes (PETSCII uppercase conversion), the value-representation boolean queries (hasBooleanRepresentation, hasListRepresentation, hasStringRepresentation), and the empty ISourceRange and IMemoryBlock semantics used by plugins.

**IEngine methods**
- `error(String message, ISourceRange range)`: Report an error message associated with a specific source range (`ISourceRange`) so the assembler can point to the offending code.
- `getCurrentDirectory()`: Return the assembler's current working directory (used for resolving relative paths).
- `getFile(String filename)`: Search library/include directories and return a `File` (or equivalent) for `filename`; returns `null` if not found.
- `normalizeFileName(String name)`: Normalize a filename and evaluate `%o` substitutions, where `%o` is replaced with the root filename without the extension. For example, if the assembler is called with a file named `Source27.asm`, `%o.d64` would be replaced with `Source27.d64`. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch11s03.html?utm_source=openai))
- `openOutputStream(String name) throws Exception`: Create and return an output stream for writing an output file; throws `Exception` on failure.
- `print(String message)`: Print a message to the assembler's normal output during the output pass. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch03s11.html?utm_source=openai))
- `printNow(String message)`: Print a message immediately during each pass, which is useful for debugging scripts where errors prevent the execution of the output pass. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch03s11.html?utm_source=openai))
- `stringToBytes(String str)`: Convert a Java string to PETSCII bytes, converting letters to uppercase as part of the conversion.

**Value representation flags**
These boolean queries tell callers whether a "value" object supports conversions to particular representations:

- `boolean hasStringRepresentation()`: Tells if you can get a string from the value.
- `boolean hasBooleanRepresentation()`: Tells if you can get a boolean from the value.
- `boolean hasListRepresentation()`: Tells if you can get a list from the value.

(If present, corresponding getters would be used only when the `has*Representation()` returns true.)

**The ISourceRange interface**
- **Purpose:** Represents a location or span in source code (for example: line 17, column 3 to line 17, column 10). Plugins receive these to indicate where a call was made or where parameters are defined; plugins should return ranges when reporting errors so the assembler can point at the offending code.
- **Interface (from plugin viewpoint):** Empty marker interface
  - `public interface ISourceRange { }`

**The IMemoryBlock interface**
- **Purpose:** Represents a memory block produced by the assembler: a start address and a sequence of byte data. Memory blocks are the usual output units the assembler exposes to plugins or downstream tools.
- **Example assembler output that corresponds to two memory blocks (start addresses and data shown):**

## Source Code
```text
// ISourceRange marker from source
public interface ISourceRange {
}
```

```asm
*=$1000 "Block 1"
.byte 1,2,3

*=$2000 "Block 2"
lda #1
sta $d020
rts
```

```text
// Reference-style signatures (source listed method names; exact Java interface not provided)
error(String message, ISourceRange range)
getCurrentDirectory()
getFile(String filename)        // searches library dirs, returns null if not found
normalizeFileName(String name)  // evaluates %o substitutions
openOutputStream(String name) throws Exception   // creates outputs, throws Exception
print(String message)
printNow(String message)
stringToBytes(String str)       // converts to PETSCII upper-case bytes

hasStringRepresentation()
hasBooleanRepresentation()
hasListRepresentation()
```

## References
- "general_communication_interfaces" — expands on overview of the engine interface