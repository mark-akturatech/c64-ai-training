# NMOS 6510 - ARR flag mapping table (data rows)

**Summary:** Raw data rows (56 entries) for the undocumented ARR opcode on NMOS 6510 showing output bit/flag values as 0/1. Use the companion "arr_flag_mapping_table_header" chunk to interpret each column (column labels and formulas map these bits to flags and output bits).

## Description
This chunk is the data portion only: a list of rows containing single-bit values (0 or 1) in the column order defined by "arr_flag_mapping_table_header". Each row corresponds to one enumerated input combination listed in that header chunk. This file contains 56 rows; it does not include the header, column labels, or formulae—those are in "arr_flag_mapping_table_header" and are required to convert each row into flag states (N, V, Z, C, etc.) and output bit patterns.

Do not interpret these bits without consulting the header chunk. The header provides:
- column labels (which column maps to which flag or output bit),
- any boolean formulas or bitwise relationships,
- the enumeration order of input combinations that these rows correspond to.

## Source Code
```text
0
0
0
0
0
0
0
0
0
1
0
1
0
0
0
1
0
1
1
0
1
0
1
1
1
0
0
1
1
0
0
0
0
1
0
1
0
1
0
1
1
0
1
1
0
1
1
1
1
1
1
1
1
0
1
1
```

## References
- "arr_flag_mapping_table_header" — column labels and formulas required to interpret these rows (maps outputs/flags to columns)

## Mnemonics
- ARR
