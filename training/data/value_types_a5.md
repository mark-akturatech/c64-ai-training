# Kick Assembler — Appendix A.5 Value Types

**Summary:** Lists Kick Assembler script-level value types (Vector, Number, String, List, Hashtable, Matrix, Struct, 65xxArgument, BinaryFile, OutputFile, Picture, SidFile, Char, Boolean, Null). Provides examples and descriptions for each type, along with related technical notes on the assembler's pass algorithm, side-effect recording, execution modes, and invalid-value propagation (B.1–B.4).

**Recognized Value Types**

Kick Assembler recognizes the following script-level types:

- **65xxArgument**: Represents an argument given to a mnemonic.
  - *Example*: `($10),y`
- **BinaryFile**: Contains byte data loaded from a file.
  - *Example*: `LoadBinary("file.bin", "")`
- **Boolean**: Represents a boolean value, either `true` or `false`.
  - *Example*: `true`
- **Char**: Represents a single character.
  - *Example*: `'x'`
- **Hashtable**: Represents an associative map object.
  - *Example*: `Hashtable()`
- **List**: Represents an ordered collection.
  - *Example*: `List()`
- **Matrix**: Represents a 4x4 matrix.
  - *Example*: `Matrix()`
- **Null**: Represents a null value.
  - *Example*: `null`
- **Number**: Represents a floating-point numeric value.
  - *Example*: `27.4`
- **OutputFile**: Represents an output file created by the assembler.
  - *Example*: `createFile("breakpoints.txt")`
- **Picture**: Represents the contents of a loaded picture file.
  - *Example*: `LoadPicture("blob.gif")`
- **SidFile**: Represents the contents of a loaded SID file.
  - *Example*: `LoadSid("music.sid")`
- **String**: Represents a string value.
  - *Example*: `"Hello"`
- **Struct**: Represents a user-defined structure.
  - *Example*: `MyStruct(1,2)`
- **Vector**: Represents a 3D vector value.
  - *Example*: `Vector(1,2,3)`

**Appendix B — Technical Details (B.1–B.4)**

These sections describe internal assembler behavior useful for understanding how values and directives are processed.

- **B.1 The Flexible Parse Algorithm**  
  Kick Assembler 3 uses a flexible multi-pass algorithm: each command/directive is parsed as fully as possible in each pass. Commands that depend on not-yet-known information (e.g., jumps to undefined labels) cause additional passes. The assembler repeats passes until assembly completes or no progress is made.

- **B.2 Recording of Side Effects**  
  Directive side effects are recorded during passes and replayed in subsequent passes. Example: `.eval a=[5+8/2+1]*10` — the calculation runs once; the numeric result is recorded and the assignment (`a=100`) is replayed in later passes without re-evaluating the expression. This optimizes heavy scripting.

- **B.3 Function Mode and Asm Mode**  
  Two execution modes for directives:
  - **Function Mode**: Used inside functions or `.define`, fast but limited to script commands (`.var`, `.const`, `.for`, etc.).
  - **Asm Mode**: Used elsewhere; can handle all directives and records side effects. Evaluation starts in Asm Mode and enters Function Mode when inside a function/.define body.

- **B.4 Invalid Value Calculations**  
  When a value depends on missing information (unresolved label etc.), the assembler represents it as an invalid typed value rather than aborting. Arithmetic or comparisons with invalid values produce invalid results of the corresponding type; operations on containers with invalid indices/values propagate invalidation to the container. Example transformations:
  - `4 + InvalidNumber -> InvalidNumber`
  - `InvalidNumber != 5 -> InvalidBoolean`
  - `myList.set(3, InvalidNumber) -> [?,?,InvalidNumber]`
  - `myList.set(InvalidNumber, "Hello") -> InvalidList`
  - `myList.set(4+4*InvalidNumber, "Hello") -> InvalidList`

## Source Code

```text
Type           Example                         Description
65xxArgument   ($10),y                         A value that defines an argument given to a mnemonic.
BinaryFile     LoadBinary("file.bin", "")      A value containing byte data.
Boolean        true                            Either true or false.
Char           'x'                             A character.
Hashtable      Hashtable()                     A value representing a hashtable.
List           List()                          A list value.
Matrix         Matrix()                        Represents a 4x4 matrix.
Null           null                            A null value.
Number         27.4                            A floating point number.
OutputFile     createFile("breakpoints.txt")   A value representing an output file.
Picture        LoadPicture("blob.gif")         The contents of a loaded picture.
SidFile        LoadSid("music.sid")            The contents of a SID file.
String         "Hello"                         A string value.
Struct         MyStruct(1,2)                   Represents a user-defined structure.
Vector         Vector(1,2,3)                   A 3D vector value.
```

## References

- "ivalue_interface_methods_and_representations" — expands on IValue representations for script-level types
- "assembler_directives_a4_part4" — expands on directives accepting these types as arguments