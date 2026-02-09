# ARYGET ($B194)

**Summary:** Assembly routine at $B194 (decimal 45460) that allocates space for array descriptors; it reserves five bytes plus two bytes per array dimension when creating array descriptors.

## Description
45460         $B194          ARYGET

Allocate Space for Array Descriptors

This routine allocates five bytes plus two bytes for every dimension
specified for the array descriptor.

 

## References
- "array_lookup_and_creation_isary" — Uses array descriptors when searching for or creating arrays
- "umult_array_size_multiplication" — Computes multidimensional sizes used when allocating descriptors