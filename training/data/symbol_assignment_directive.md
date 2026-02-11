# Assign Value to Symbol (Pseudo-Opcode)

**Summary:** Describes assembler directives used to assign values to symbols, creating named constants or equates in assembly language.

**Description**

In assembly language, assigning a value to a symbol allows for the creation of named constants, enhancing code readability and maintainability. Different assemblers use various directives for this purpose, such as `.EQU`, `.SET`, and `=`. The specific directive and its behavior can vary depending on the assembler in use.

**Syntax and Operand Forms**

The syntax for assigning values to symbols differs among assemblers:

- **`=` Directive:** Common in many 6502 assemblers.


  Assigns the evaluated result of `expression` to `SYMBOL`.

- **`.EQU` Directive:** Used in assemblers like the Apple II's assembler.


  Similar in function to `=`, assigns the value of `expression` to `SYMBOL`.

- **`.SET` Directive:** Found in some assemblers, such as IBM's assembler.


  Sets `SYMBOL` to the value of `expression`.

**Behavior Details**

- **Scoping:** Symbols defined using these directives are typically global, accessible throughout the assembly source unless the assembler supports local scoping mechanisms.

- **Redefinition Rules:** Assemblers generally do not allow redefinition of symbols within the same scope. Attempting to redefine a symbol may result in an error.

- **Evaluation Rules:** Expressions assigned to symbols are evaluated at assembly time. The expressions can include constants, previously defined symbols, and arithmetic operations.

- **Constant vs. Relocatable:** Assignments are usually constant and cannot be relocated. The assigned value is fixed at assembly time and does not change during program execution.

**Examples**

Defining constants for various purposes:

- **Memory Addresses:**


  Assigns the address `$0400` to the symbol `SCREEN`.

- **Bit Masks:**


  Defines `MASK` as a bitmask for the lower nibble.

- **Table Sizes:**


  Sets `TABLE_SIZE` to 128, useful for defining array bounds.

**Assembler-Specific Notes**

- **Interaction with Other Directives:** Symbols defined with these directives can be used in conjunction with other assembler directives. For example, they can be employed in `.ORG` directives to set the program counter:


  This sets the origin to the address defined by `SCREEN`.

- **Macros:** Symbols can be utilized within macros to create more readable and maintainable code.

- **Byte-Order Directives:** When defining data structures, symbols can be used to specify sizes and offsets, aiding in the management of byte order and alignment.

## Source Code

  ```
  SYMBOL = expression
  ```

  ```
  SYMBOL EQU expression
  ```

  ```
  .SET SYMBOL, expression
  ```

  ```
  SCREEN = $0400
  ```

  ```
  MASK = %00001111
  ```

  ```
  TABLE_SIZE = 128
  ```

  ```
  ORG SCREEN
  ```


## References

- "Apple 6502 Assembler/DOS Tool Kit" – Discusses the use of the `EQU` directive in the Apple II assembler.
- "IBM Assembler Language Reference" – Details the `.SET` pseudo-op for setting symbol values.
- "6502 Assembly Language Programming" – Provides examples and explanations of symbol assignment in 6502 assembly.