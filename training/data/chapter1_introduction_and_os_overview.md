# Commodore 64 — Chapter 1: BASIC Data and Operating System Overview

**Summary:** Overview of how BASIC stores and manipulates data and the C64 ROM Operating System components: the BASIC Interpreter (65 keywords, tokenization, character set), the KERNAL (interrupt-level processing and I/O), and the Screen Editor (video output, program editing, keyboard interception).

**Introduction**

This chapter describes the topics covered in Chapter 1:

1. A brief mention of the operating system components and functions as well as the Commodore 64 BASIC character set.
2. The formation of constants and variables: types of variables, and how constants and variables are stored in memory.
3. Rules for arithmetic calculations, relationship tests, string handling, and logical operations; rules for forming expressions; and data conversions required when BASIC operates on mixed data types.

**The Operating System (OS)**

The C64 Operating System is stored in ROM and is divided into three interrelated modules:

- **BASIC Interpreter**
  - Responsible for parsing BASIC statement syntax (tokenization) and executing required calculations and data manipulations.
  - Has a vocabulary of 65 keywords that the interpreter recognizes as special tokens.
  - Keywords, variable names, and numeric literals are formed from the upper- and lower-case alphabet and digits 0–9; certain punctuation characters and special symbols are also significant (see Table 1-1 below).

- **KERNAL**
  - Implements most interrupt-level processing and low-level I/O services (device-independent I/O entry points).
  - Provides the system routines for serial I/O (disk, cassette), keyboard scanning hooks, and other low-level services. (See Chapter 5 for detailed interrupt-level processing and KERNAL routine usage.)

- **Screen Editor**
  - Manages output to the video display (TV/monitor) and editing of BASIC program text.
  - Intercepts keyboard input to decide whether characters should be acted on immediately (editor control) or passed to the BASIC Interpreter for tokenization/execution.

**Table 1-1: Special Characters and Their Uses in the BASIC Interpreter**

| Character | ASCII Code | Description                                                                 |
|-----------|------------|-----------------------------------------------------------------------------|
| `"`       | 34         | Used to delimit string literals.                                            |
| `:`       | 58         | Separates multiple statements on a single line.                             |
| `,`       | 44         | Separates items in PRINT statements; controls cursor positioning.           |
| `;`       | 59         | Separates items in PRINT statements; suppresses newline.                    |
| `?`       | 63         | Abbreviation for the PRINT command.                                         |
| `=`       | 61         | Assignment operator; also used in expressions for comparison.               |
| `+`       | 43         | Addition operator; also used for string concatenation.                      |
| `-`       | 45         | Subtraction operator; also used to denote negative numbers.                 |
| `*`       | 42         | Multiplication operator.                                                    |
| `/`       | 47         | Division operator.                                                          |
| `^`       | 94         | Exponentiation operator.                                                    |
| `(` `)`   | 40, 41     | Used to group expressions; also for array indexing.                         |
| `<` `>`   | 60, 62     | Comparison operators (less than, greater than).                             |
| `≤` `≥`   | 163, 242   | Comparison operators (less than or equal to, greater than or equal to).     |
| `≠`       | 161        | Not equal to operator.                                                      |
| `AND`     | 128        | Logical AND operator.                                                       |
| `OR`      | 129        | Logical OR operator.                                                        |
| `NOT`     | 130        | Logical NOT operator.                                                       |

*Note: The characters `≤`, `≥`, and `≠` are represented in PETSCII with codes 163, 242, and 161, respectively.*

**SCREEN DISPLAY CODES (BASIC CHARACTER SET)**

The Commodore 64 uses the PETSCII character set, which includes both standard ASCII characters and additional graphical symbols. The screen codes correspond to the PETSCII codes used to display characters on the screen. Below is a partial mapping of screen codes to characters:

| Screen Code | Character | Description             |
|-------------|-----------|-------------------------|
| 0           | @         | At symbol               |
| 1–26        | A–Z       | Uppercase letters       |
| 27–31       | [\]^_     | Special characters      |
| 32          | (space)   | Space                   |
| 33–47       | !"#$%&'()*+,-./ | Punctuation marks |
| 48–57       | 0–9       | Digits                  |
| 58–64       | :;<=>?    | Punctuation marks       |
| 65–90       | a–z       | Lowercase letters       |
| 91–96       | [\]^_     | Special characters      |
| 97–122      | A–Z       | Uppercase letters (duplicate) |
| 123–127     | {|}~      | Special characters      |
| 128–255     | Graphics  | Graphical symbols       |

*Note: The screen codes above are in decimal. The PETSCII character set includes both uppercase and lowercase letters, as well as a variety of graphical symbols used for creating simple graphics on the screen.*

**BASIC Programming Rules (Overview)**

- The chapter will define how constants and variables are formed and stored, the variable types BASIC recognizes, and memory representation for variable storage.
- It will specify expression syntax and evaluation rules for arithmetic, relational, string, and logical operations, including conversion rules when mixing numeric and string types.

**Memory Layout and Storage of Constants and Variables**

In the Commodore 64, BASIC programs and their associated data are stored in RAM, organized into several distinct areas:

1. **BASIC Program Storage**: Begins at address 2049 ($0801) and contains the tokenized BASIC program code.

2. **Variable Storage**:
   - **Simple Variables**: Stored immediately after the BASIC program code. Each simple variable (numeric or string) occupies 7 bytes:
     - **Bytes 1–2**: Variable name (two ASCII characters).
     - **Byte 3**: Type indicator and flags.
     - **Bytes 4–7**: Data storage (format depends on variable type).
   - **Arrays**: Stored after simple variables. Each array has a descriptor that includes:
     - **Bytes 1–2**: Array name (two ASCII characters).
     - **Byte 3**: Type indicator and flags.
     - **Bytes 4–5**: Number of dimensions.
     - **Bytes 6–7**: Total number of elements.
     - **Following Bytes**: Dimension sizes and data pointers.

3. **String Storage (String Heap)**: Located at the top of BASIC memory, just below the BASIC ROM at address 40960 ($A000). Strings are stored in a heap that grows downward. Each string variable points to its location in the heap.

4. **Free Memory**: The area between the end of the array storage and the start of the string heap is available for dynamic memory allocation.

*Note: The memory layout is dynamic; as variables and arrays are created or modified, the boundaries between these areas shift accordingly.*

## References

- "basic_keywords_table" — expands on the Interpreter's vocabulary of BASIC keywords.
- "kernal_overview" — expands on KERNAL routines and interrupt-level processing (Chapter 5).