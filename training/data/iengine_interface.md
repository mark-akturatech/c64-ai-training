# Kick Assembler — IEngine Interface (Part 1)

**Summary:** The `IEngine` interface in Kick Assembler provides methods for error reporting, PETSCII conversion, memory block creation, and value accessors. Key methods include `addError(String, ISourceRange)`, `error(String)`, `charToByte(char)`, `createMemoryBlock(String, int, byte[])`, and various value-access helpers. Relevant interfaces referenced are `IMemoryBlock`, `ISourceRange`, and `AsmException`. Searchable terms: IEngine, IMemoryBlock, ISourceRange, AsmException, PETSCII, getInt, addError.

**Methods and Behavior**

- **addError(String message, ISourceRange range)**
  - Adds an error to the engine's error list without halting assembly, allowing for the collection and reporting of non-fatal issues.

- **error(String message)**
  - Reports a fatal error and stops execution. This method throws an `AsmException`, which must be handled appropriately.

- **charToByte(char c)**
  - Converts a Java `char` to a PETSCII byte value suitable for use in assembled data.

- **IMemoryBlock createMemoryBlock(String name, int startAddr, byte[] bytes)**
  - Creates and returns an `IMemoryBlock` with the specified name, start address, and raw byte contents.

- **Value Accessors** (likely on an `IValue`-like object; included here in source fragment):
  - **int getInt()**
    - Returns an integer representation of the value if possible; otherwise, produces an error message.
  - **Double getDouble()**
    - Returns a double representation if possible; otherwise, produces an error message.
  - **String getString()**
    - Returns a string representation if possible; otherwise, produces an error message.
  - **Boolean getBoolean()**
    - Returns a Boolean representation if possible; otherwise, produces an error message.
  - **List<IValue> getList()**
    - Returns a list of values if possible; otherwise, produces an error message. The returned list implements `size()`, `get(i)`, `isEmpty()`, and `iterator()`.
  - **Boolean hasIntRepresentation()**
    - Returns whether an integer representation is available.
  - **boolean hasDoubleRepresentation()**
    - Returns whether a double representation is available.
  - **boolean hasStringRepresentation()**
    - Returns whether a string representation is available.

## Source Code

```java
// Interface snippets extracted from source fragment

void addError(String message, ISourceRange range);

void error(String message) throws AsmException;

byte charToByte(char c);

IMemoryBlock createMemoryBlock(String name, int startAddr, byte[] bytes);

// Value accessors (IValue-like)
int getInt();
Double getDouble();
String getString();
Boolean getBoolean();
List<IValue> getList();

Boolean hasIntRepresentation();
boolean hasDoubleRepresentation();
boolean hasStringRepresentation();
```

## References

- [Kick Assembler Manual: General Communication Interfaces](https://theweb.dk/KickAssembler/webhelp/content/ch17s04.html)
- [Kick Assembler Manual: The IEngine Interface](https://theweb.dk/KickAssembler/webhelp/content/ch17s04.html#ch17s04s01)
- [Kick Assembler Manual: The IMemoryBlock Interface](https://theweb.dk/KickAssembler/webhelp/content/ch17s04.html#ch17s04s04)
- [Kick Assembler Manual: The ISourceRange Interface](https://theweb.dk/KickAssembler/webhelp/content/ch17s04.html#ch17s04s03)
- [Kick Assembler Manual: A Quick Example (Macros)](https://theweb.dk/KickAssembler/webhelp/content/ch17s03.html)
