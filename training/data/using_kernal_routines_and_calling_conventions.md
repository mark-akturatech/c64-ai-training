# Using the KERNAL (machine language)

**Summary:** Utilize KERNAL routines by preparing the required parameters, invoking the routine with JSR (as they are subroutines ending with RTS), and handling returned values and error codes (status word/carry flag and accumulator).

**How to use the KERNAL**

The KERNAL is a jump table—a collection of JMP instructions to ROM routines—that provides operating system services such as I/O, clock management, and memory handling. Leveraging these routines prevents the need to duplicate common functionalities in your machine code.

Key points:

- **Preparation:** Ensure all required parameters are set before calling a routine. This includes initializing registers, memory locations, and invoking any prerequisite KERNAL routines as documented.

- **Invocation:** Call the routine using the JSR instruction. All accessible KERNAL entries are structured as subroutines and conclude with an RTS instruction.

- **Error Handling:** Many routines indicate errors via the processor status (e.g., carry flag) or the accumulator. It's crucial to inspect these upon return and handle any errors appropriately, as ignoring them can lead to subsequent failures.

Follow this three-step pattern:

1. **Set up:** Initialize parameters in the expected registers/memory and call any prerequisite KERNAL routines.

2. **Call the routine:** Invoke the routine with JSR.

3. **Error handling:** Check the carry flag/status word and accumulator for error codes; implement branching or cleanup as required.

## References

- "kernal_overview_and_jump_table_purpose"—expands on why to use the KERNAL jump table instead of directly JSRing to ROM routines.

- "kernal_routine_documentation_conventions_and_routine_list_intro"—details the conventions used to document each KERNAL routine and introduces the routine list.
