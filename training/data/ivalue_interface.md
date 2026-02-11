# Kick Assembler: IValue & IMemoryBlock Overview

**Summary:** IValue is the Kick Assembler plugin/macro value interface for numbers, strings, booleans, and lists (List<IValue>); methods include getters (getInt, getDouble, getString, getBoolean, getList) and presence predicates (hasIntRepresentation, hasDoubleRepresentation, hasStringRepresentation, hasBooleanRepresentation, hasListRepresentation). IMemoryBlock exposes methods to retrieve the start address, byte data, and name of a memory block. Use IEngine.createMemoryBlock to create new memory blocks.

**IValue Interface**

IValue represents an assembler-level value that can hold multiple representations and is used when passing arguments to plugins/macros or returning results from them.

**Known Methods:**

- `int getInt()` — Retrieves the integer representation if available; otherwise, an error is generated.
- `double getDouble()` — Retrieves the floating-point representation if available; otherwise, an error is generated.
- `String getString()` — Retrieves the string representation if available; otherwise, an error is generated.
- `boolean getBoolean()` — Retrieves the boolean representation if available; otherwise, an error is generated.
- `List<IValue> getList()` — Retrieves the list representation if available; otherwise, an error is generated.

**Presence/Predicate Methods:**

- `boolean hasIntRepresentation()` — Indicates if an integer representation is available.
- `boolean hasDoubleRepresentation()` — Indicates if a double representation is available.
- `boolean hasStringRepresentation()` — Indicates if a string representation is available.
- `boolean hasBooleanRepresentation()` — Indicates if a boolean representation is available.
- `boolean hasListRepresentation()` — Indicates if a list representation is available.

**Behavior Notes:**

- IValue objects may be supplied to macro/plugin `execute()` methods or may be created by the plugin and returned to the assembler.
- For lists, individual elements are IValue instances, allowing for nested representations.

**IMemoryBlock Interface**

The IMemoryBlock interface represents a memory block, consisting of a start address, byte data, and an optional name.

**Methods:**

- `int getStartAddress()` — Returns the start address of the memory block.
- `byte[] getBytes()` — Returns the assembled bytes of the memory block.
- `String getName()` — Returns the name of the memory block.

**Creation:**

- Use `IEngine.createMemoryBlock(String name, int startAddr, byte[] bytes)` to create new memory blocks from plugin code.

**IEngine Interface**

The IEngine interface provides methods for plugins to interact with the assembler.

**Method:**

- `IMemoryBlock createMemoryBlock(String name, int startAddr, byte[] bytes)` — Creates a memory block with the specified name, start address, and byte data.

## Source Code

```text
IValue Interface Methods:
- int getInt()
- double getDouble()
- String getString()
- boolean getBoolean()
- List<IValue> getList()

Predicate Methods:
- boolean hasIntRepresentation()
- boolean hasDoubleRepresentation()
- boolean hasStringRepresentation()
- boolean hasBooleanRepresentation()
- boolean hasListRepresentation()

IMemoryBlock Interface Methods:
- int getStartAddress()   // Returns the start address of the memory block.
- byte[] getBytes()       // Returns the assembled bytes of the memory block.
- String getName()        // Returns the name of the memory block.

IEngine Interface Method:
- IMemoryBlock createMemoryBlock(String name, int startAddr, byte[] bytes)
  // Creates a memory block with the specified name, start address, and byte data.
```

## References

- [Kick Assembler Manual: General Communication Interfaces](https://theweb.dk/KickAssembler/webhelp/content/ch17s04.html)
- [Kick Assembler Manual: The IMemoryBlock Interface](https://www.theweb.dk/KickAssembler/webhelp/content/ch17s04s04.html)
- [Kick Assembler Manual: A Quick Example (Macros)](https://www.theweb.dk/KickAssembler/webhelp/content/ch17s03.html)