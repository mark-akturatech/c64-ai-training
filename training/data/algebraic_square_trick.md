# Multiplication via Square-Table Identity (Binomial Trick)

**Summary:** Use the binomial identity to compute multiplication with two square-table lookups, one addition and one subtraction, and a divide-by-4 (shift). Searchable terms: square table, table lookup, (a+b)^2, (a-b)^2, divide-by-4, multiplication algorithm.

## Derivation
Starting from the binomial expansions:

(a + b)^2 = a^2 + 2ab + b^2  
(a - b)^2 = a^2 - 2ab + b^2

Subtracting the second from the first:

(a + b)^2 - (a - b)^2 = 4ab

Rearrange to solve for the product:

ab = ((a + b)^2 - (a - b)^2) / 4
   = (a + b)^2/4 - (a - b)^2/4

## Algorithm
1. Compute s = a + b and d = a - b (arithmetic in the operand width; handle signedness/range as required).  
2. Lookup S = SquareTable[s] and D = SquareTable[d], where SquareTable[x] stores x^2/4 (predivided by 4) or stores x^2 (in which case divide by 4 after subtraction).  
3. Compute product: ab = S - D (if Table stores x^2/4) or ab = (S - D) >> 2 (if Table stores full squares).  

Notes:
- Using tables of x^2/4 halves the post-lookup work (no extra divide/shift) at the cost of building the table with predivided values.  
- This method replaces an explicit multiply with two table lookups and a small amount of integer arithmetic (adds/subtracts/shifts), trading memory layout for CPU operations.  
- Ensure the table covers the full index range required for s and d (s can be as large as a+b; d can be negative — handle indexing or offset appropriately).

## References
- "table_method_implementation_tricks" — expands implementation details to make square-table method practical  
- "pointer_setup_for_square_tables" — expands on how to set table pointers for efficient lookup