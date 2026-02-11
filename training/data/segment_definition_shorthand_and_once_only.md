# Kick Assembler: .segment shorthand for defining + creating a memory block

**Summary:** Explains Kick Assembler shorthand where `.segment` with a parameter block (e.g., `.segment MySegment [start=$1000]`) both defines the segment and creates a default memory block; also describes the shorthand for naming a memory block by placing a text string after a segment switch (alternative to `memblock`).

**Description**

- `.segment <name> [param-block]` used with a parameter block defines the segment and simultaneously creates a default memory block for that segment.
- The shorthand is equivalent to running `.segmentdef <name> [param-block]` followed immediately by `.segment <name>`.
- A segment may only be defined once; subsequent `.segment` attempts refer to an already-defined segment and do not redefine it.
- When switching segments, instead of issuing a separate `memblock` directive to name a new memory block, you can supply a text string after the `.segment` switch; that string is taken as the memory block name (i.e., a convenient shorthand to name the block created when switching). (text string = memory block name)

## Source Code

```asm
.segment MySegment [start=$1000]
; equivalent to:
.segmentdef MySegment [start=$1000]
.segment MySegment
```

```asm
// This
.segment Code "My Code"

// Is the same as this
.segment Code
.memblock "My Code"
```

## Source Code

  ```asm
  .segment Code "Main"
  jsr colorSetup
  jsr textSetup
  rts
  ```

  ```asm
  .segment Code
  .memblock "Main"
  jsr colorSetup
  jsr textSetup
  rts
  ```

## References

- "defining_segments_and_switching" — expands on defining segments versus switching
- "naming_memory_blocks_while_switching_segment" — details on naming memory blocks during segment switches

**Additional Information**

- **Naming Memory Blocks While Switching Segments:** When switching segments, you can name the new memory block by placing a text string after the `.segment` directive. This shorthand eliminates the need for a separate `.memblock` directive.

  For example:

  This is equivalent to:

  This approach is particularly useful when organizing code and data that are logically related but need to be placed in different memory locations. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s06.html?utm_source=openai))

- **Naming Conventions and Restrictions:** The Kick Assembler manual does not specify explicit restrictions on the characters allowed in memory block names. However, it's advisable to use alphanumeric characters and underscores to avoid potential issues. Avoid using names that differ only by case, as some assemblers are case-insensitive. Additionally, be cautious of naming collisions with existing labels or directives to prevent unexpected behavior. ([ee.torontomu.ca](https://www.ee.torontomu.ca/~kclowes/stand-alone/CodingStandards/CodingStdAsm/?utm_source=openai))
