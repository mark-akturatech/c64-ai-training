# Unused ROM Area at $BF52 (Filled with $AA)

**Summary:** Identifies an unused ROM area starting at address $BF52 in the Commodore 64's BASIC ROM, filled with bytes of value $AA (170 in decimal).

**Details**

In the Commodore 64's BASIC ROM, an unused area begins at address $BF52. This region is filled with bytes of value $AA (170 in decimal). The unused block extends from $BF52 to $BF70, encompassing 31 bytes. This area is part of the BASIC ROM, which occupies the memory range from $A000 to $BFFF. Adjacent to this unused block, preceding data includes the "fp_conversion_constants_tables" located at $BF3A.

## Source Code

```text
48978         $BF52
Unused area

This unused area is filled with bytes of 170 ($AA).
```

## References

- "fp_conversion_constants_tables" — Located at $BF3A, preceding the unused block.