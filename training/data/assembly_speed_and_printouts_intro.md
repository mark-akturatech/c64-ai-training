# Choosing an Assembler: Speed and Printouts

**Summary:** When evaluating assemblers, check assemble speed (often limited by disk I/O) and verify that assembler-generated printouts contain the specific information you require (listings, symbol data, relocation/object details).  

## Assembler speed
Assemble throughput is often bound by how fast the target disk subsystem can write files; the assembler cannot reliably outpace physical disk I/O. When comparing assemblers, measure full end-to-end time required to assemble your source and write the resulting files (listings, object, and intermediate files) to disk under realistic project sizes and build workflows.

## Printout contents
Ensure any assembler printouts include every piece of information you rely on (for example: source listings, addresses, symbol tables, cross-references, relocation/object output). Different assemblers vary in what they produce and in formatting; confirm the assembler’s printout options and defaults produce the formats and fields you need.

**[Note: Source references a list of specific items that differ between assemblers but that list is not included in this chunk. See References for the detailed expansion.]**

## References
- "assembling_and_coresident_assemblers_saving_practices" — expands on context for assembling frequency and testing  
- "printout_items_and_what_to_look_for" — expands on specific printout features to check