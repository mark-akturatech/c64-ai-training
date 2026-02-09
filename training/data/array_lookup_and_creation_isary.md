# ISARY — Find an array element or create a new array in RAM ($B1D1)

**Summary:** ISARY ($B1D1) locates an array descriptor and element for a given array reference; if the array is not present in RAM it requests creation (uses ARYGET). It validates subscripts (converting floating-point subscripts to positive integers) and computes multidimensional storage size with UMULT when allocating.

## Description
ISARY implements the BASIC V2 array lookup/allocation path for arrays stored in RAM. Behavior:

- Searches the existing array descriptors for the named array.
- If found:
  - Validates the supplied subscript(s) against the array's declared dimensions (checks bounds).
  - Converts floating-point subscripts to positive integers before validation (see intidx_subscript_conversion).
  - On success, sets internal pointers to the array descriptor and to the addressed element.
- If not found:
  - Requests descriptor/allocation via ARYGET (Uses descriptors allocated by ARYGET when creating new arrays).
  - For multidimensional arrays, computes total element count and required storage using UMULT (unsigned multiply) to obtain total byte size.
  - After allocation, sets the same pointers to the newly created array descriptor and element.

## Operation details
- Purpose: Provide a single entry that either locates an existing array element (for read/write) or creates the array and returns pointers for subsequent access.
- Subscript handling:
  - Floating-point subscripts are converted to positive integers prior to bounds checking.
  - Out-of-range or otherwise invalid subscripts may trigger BASIC error conditions (see Error Conditions).
- Allocation:
  - Delegates descriptor allocation and memory reservation to ARYGET.
  - Uses UMULT to multiply dimension sizes for multidimensional arrays to compute storage requirements.
- Pointers:
  - On success (found or created), ISARY sets the array descriptor pointer and the element pointer used by higher-level routines. (The original source documents that pointers are set but does not list their zero-page addresses.)

## Error Conditions
- May signal BASIC runtime errors when validation/allocation fails:
  - BAD SUBSCRIPT — for invalid or out-of-range subscripts.
  - ILLEGAL QUANTITY — for nonsensical dimension/size requests or failed allocation.
- **[Note: Source may contain no explicit list of which internal flags/locations indicate each error; consult referenced routines for exact error generation.]**

## References
- "ary_descriptor_allocation_aryget" — Uses descriptors allocated by ARYGET when creating new arrays  
- "umult_array_size_multiplication" — Uses UMULT to compute total storage size for multidimensional arrays  
- "bad_subscript_and_illegal_quantity_errors" — May trigger BAD SUBSCRIPT or ILLEGAL QUANTITY error messages when validation fails  
- "intidx_subscript_conversion" — Converts floating-point subscripts to positive integers for ISARY's checks