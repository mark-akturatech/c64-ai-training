# Verify ML placement so SAVE includes machine code

**Summary:** Verify a machine-language (ML) routine placed while in a monitor is correctly located so SAVE will include it with the BASIC program; use a disassembler/monitor, return to BASIC, LIST, SAVE, and RUN to confirm behavior (inputs multiplied by ten).

## Procedure
- While in the monitor, disassemble the target ML address range to confirm the code is present and located where you expect (check start/end addresses and any vectors or SOV pointer adjustments).
- Exit the monitor and return to BASIC.
- Use LIST to display the BASIC program; the ML will not appear in the BASIC listing (it is stored separately in RAM).
- Use SAVE to write the BASIC program to tape/disk — if the ML was placed correctly and the SOV/save-pointer was adjusted appropriately, SAVE will include the ML code along with the BASIC program.
- RUN the BASIC program. When prompted, enter test numbers and confirm the program multiplies each entered number by ten (verifies the ML routine executed correctly when invoked from BASIC).

## References
- "store_ordering_and_adjust_sov_pointer" — adjusting the SOV pointer so SAVE includes ML safely  
- "overflow_testing_and_project_extension" — testing numeric limits and adding overflow handling