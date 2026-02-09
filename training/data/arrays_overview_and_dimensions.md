# Commodore 64 BASIC — Arrays (INTEGER, FLOATING-POINT, STRING)

**Summary:** Description of arrays in C64 BASIC: supported types (INTEGER, FLOATING-POINT, STRING), dimensions and theoretical limits (up to 255 dimensions, 32767 elements per dimension), automatic creation rule for small one-dimensional arrays (<=10 elements), subscript rules, and the memory-calculation formula for array storage.

## Definition and element types
An array is a table (sequence) of elements accessible under a single variable name with one or more subscripts (indexes). All elements in an array share the array’s data type: INTEGER, FLOATING-POINT, or STRING. Subscripts are written in parentheses after the name, separated by commas for multiple dimensions.

## Dimensions, ranges and limits
- Theoretical maximum dimensions: 255.
- Theoretical maximum elements per dimension: 32,767.
- Practical limits are determined by available memory and the 80-character logical screen line.
- Subscript values may be integer constants, variables, or arithmetic expressions that evaluate to an integer.
- Valid subscript range: 0 up to the declared upper bound for that dimension (e.g., DIM A(10) yields valid subscripts 0..10).
- Out-of-range subscripts cause the BASIC runtime error ?BAD SUBSCRIPT.

## Automatic creation rule
If an array has only one dimension and every referenced subscript value will never exceed 10 (i.e., the highest subscript used is <=10), the BASIC interpreter will implicitly create the array on first reference and fill it with zeros (for numeric arrays) or nulls (for string arrays). Otherwise the program must declare the array shape explicitly with DIM before use.

## Storage and memory calculation (summary)
Array storage overhead and per-element sizes determine memory usage. The interpreter uses fixed overhead for the array name and per-dimension bookkeeping plus type-dependent per-element storage. See the exact memory-calculation layout in the Source Code section.

## Subscript syntax and examples
- Separate subscripts with commas for multiple dimensions (e.g., A(2,3)).
- Subscripts may be expressions evaluating to integers (e.g., A(I+1)).
- Example (string array element assignment): A$(0)="GROSS SALES"

## Source Code
```text
Memory calculation formula for arrays:

  5 bytes   = array name overhead
+ 2 bytes   = per-dimension overhead (multiply by number of dimensions)
+ per-element storage:

    INTEGER:       2 bytes per element
    FLOATING-POINT:5 bytes per element
    STRING:        3 bytes per element + 1 byte per character stored in each string element

Example BASIC assignment:
```basic
A$(0)="GROSS SALES"
```
```

## References
- "dim_statement_and_memory_calculation" — DIM statement syntax and memory calculation examples