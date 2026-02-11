# Using READ/DATA and arrays/matrices to pack large amounts of data efficiently; eliminating unnecessary spaces in BASIC for memory savings; using GOSUB routines and TAB/SPC for formatting

**Summary:** Techniques for reducing Commodore 64 BASIC program size: eliminate unnecessary spaces, reuse code with GOSUB, use TAB and SPC for screen positioning, and pack large data sets with DATA/READ into DIM'd arrays/matrices. Detailed DIM memory calculations and byte-size math are provided.

**Eliminating spaces**
BASIC programs on the C64 do not require spaces for correctness; removing all nonessential spaces reduces the tokenized program size and frees memory. Keep only the minimal spacing necessary for readability or where the parser requires separation between tokens.

**Example:**
can be written as:
This reduces the number of characters and tokens, saving memory.

**Using GOSUB routines**
When an operation or sequence of statements is needed from multiple places in the program, place it once on a dedicated line and call it with `GOSUB <line>`. This avoids duplicating identical long statements and saves program memory. Use `RETURN` to continue after the subroutine.

**Example:**
This approach saves memory by reusing the subroutine at line 100.

**Using TAB and SPC**
Positioning output on the screen is often smaller and clearer using `TAB` and `SPC` rather than multiple `PRINT` cursor-control sequences.
- `TAB(n)` — move to column n before printing.
- `SPC(n)` — insert n spaces in `PRINT` output.

**Example:**
This positions "HELLO" at column 10 and inserts 5 spaces before "WORLD", reducing the number of characters and tokens used for formatted output.

**Packing data with READ/DATA and arrays/matrices**
Store large tables or repeated data in `DATA` statements and load them at runtime with `READ` into arrays or matrices created with `DIM`. This lets you keep program logic short while retaining large datasets.

**Example:**
This program reads five data values into the array `A`.

**DIM memory calculations**
The amount of memory required to store an array can be determined as follows:

- **Array descriptor:**
  - 5 bytes for the array name.
  - 2 bytes for each dimension of the array.

- **Data storage:**
  - 2 bytes per element for integer variables.
  - 5 bytes per element for floating-point variables.
  - 3 bytes per element for string variables, plus 1 byte per character in each string element.

**Example Calculation:**
For `DIM A%(10)`, an integer array with 11 elements (0 to 10):

- Array descriptor: 5 bytes (name) + 2 bytes (one dimension) = 7 bytes.
- Data storage: 11 elements × 2 bytes = 22 bytes.
- **Total memory used:** 7 bytes + 22 bytes = 29 bytes.

For `DIM B(10)`, a floating-point array with 11 elements:

- Array descriptor: 5 bytes (name) + 2 bytes (one dimension) = 7 bytes.
- Data storage: 11 elements × 5 bytes = 55 bytes.
- **Total memory used:** 7 bytes + 55 bytes = 62 bytes.

For `DIM C$(10)`, a string array with 11 elements, each capable of holding up to 10 characters:

- Array descriptor: 5 bytes (name) + 2 bytes (one dimension) = 7 bytes.
- Data storage: 11 elements × (3 bytes descriptor + 10 bytes characters) = 143 bytes.
- **Total memory used:** 7 bytes + 143 bytes = 150 bytes.

Understanding these calculations helps in optimizing memory usage when working with arrays in Commodore 64 BASIC.

## Source Code

```basic
10 PRINT "HELLO WORLD"
20 GOTO 10
```

```basic
10PRINT"HELLO WORLD":GOTO10
```

```basic
10 GOSUB 100
20 GOSUB 100
30 END
100 PRINT "SUBROUTINE CALLED"
110 RETURN
```

```basic
10 PRINT TAB(10);"HELLO";SPC(5);"WORLD"
```

```basic
10 DIM A(4)
20 FOR I=0 TO 4
30 READ A(I)
40 NEXT I
50 DATA 10,20,30,40,50
```


## References
- "data_statement" — expands on DATA statements and READ usage.
- "dim_statement_and_memory_calculation" — expands on DIM and array memory calculation.