# Remove REMs & shorten repeated values (BASIC/POKE, DIM/READ/DATA, arrays)

**Summary:** Advice for Commodore 64 BASIC: remove REM statements to save program space, replace repeated numeric addresses/values with short variables (e.g. V=54296), and use DIM/READ/DATA or arrays/matrices for large datasets; searchable terms: POKE addresses, BASIC, REM, variables, DIM, READ, DATA, arrays, $D400-$D418 (SID).

## Using variables
If a number, word or sentence appears repeatedly, assign it to a short variable to reduce program length. Use single-letter numeric variables for addresses/numbers and single-letter string variables (letter with $) for words/sentences. The example below shows replacing repeated POKE addresses with variables V and F to shorten listings and reduce token count.

Brief notes preserved from source:
- Numeric example variables: V=54296 (decimal address).
- String variables use a trailing $ (e.g. A$="HELLO") — (string variable notation).
- Removing unnecessary REM statements before finalizing frees program memory.

## Using READ and DATA statements
Large lists of numbers are best placed in DATA statements and read by the program with READ... and fetched into variables as needed. This avoids repeating long literal lists in executable code and keeps the program compact.

## Using arrays and matrices
Arrays (DIM) and multi-dimensional arrays let you store large datasets in program memory and access them by index instead of writing many literal constants. This functions like a DATA list but provides indexed access and mutability.

## Source Code
```basic
10 POKE 54296,15
20 POKE 54276,33
30 POKE 54273,10
40 POKE 54273,40
50 POKE 54273,70
60 POKE 54296,0
```

```basic
10 V=54296:F=54273
20 POKEV,15:POKE54276,33
30 POKEF,10:POKEF,40:POKEF,70
40 POKEV,0
```
(Original examples showing BEFORE and AFTER "crunching" — variables used to replace repeated addresses.)

## Key Registers
- $D400-$D414 - SID (Sound Interface Device) — Voice registers (voice 1-3)
- $D415-$D418 - SID filter/control registers

## References
- "using_arrays_and_data_statements" — expands on using DIM/READ/DATA to manage large datasets