# Assembler Listing: Evaluated Expressions in DATA Statements

**Summary:** Most assemblers evaluate expressions in DATA statements and can produce listing printouts that show the calculated data bytes; use these evaluated-data listings to verify the assembler generated the expected values. Once assembler behavior and the data are debugged, such detailed printouts are rarely necessary.

## Description
Many assemblers accept expressions inside data statements (for example, arithmetic, labels, or constant expressions). Configure the assembler to include the calculated-data printout (listing) so the listing shows the actual byte values produced by each DATA statement. Inspecting this evaluated-data portion of the listing lets you verify that expressions expanded to the intended numeric values and that the assembler emitted the correct bytes.

Use this verification step during development or when assembling unfamiliar code or macros. After the data has been validated and you know how your assembler evaluates expressions, you can omit these detailed listing pages to reduce noise.

## References
- "printout_items_and_what_to_look_for" — expands on data expansion listed as a printout feature  
- "macro_expansion_on_listings" — expands on similar role of expanded views for debugging
