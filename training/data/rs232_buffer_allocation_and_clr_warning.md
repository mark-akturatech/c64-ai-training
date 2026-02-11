# Opening RS-232 device (device 2) reallocates 512 bytes for I/O buffers

**Summary:** Opening the RS-232 device (device 2) in BASIC lowers the pointer to the current data area and the pointer to the end-of-user-RAM (address 643 / $0283), allocating two 256-byte buffers (input and output). BASIC issues a CLR when device 2 is opened, so open device 2 before defining variables or reserving machine-code safe areas.

## Behavior
When the RS-232 device (device number 2) is opened, BASIC moves two internal pointers downward by 512 bytes total to create two contiguous 256-byte buffers: one for input, one for output. The pointer to the end of user RAM (location 643 decimal, $0283 hex in BASIC memory) is lowered accordingly. BASIC performs a CLR at the time device 2 is opened.

## Memory impact
- Two 256-byte buffers are created at the top of BASIC user memory; their contents occupy the high end of the BASIC variable/array space.
- Any variables, arrays, or machine-code placed at the top of user RAM prior to opening device 2 will be overwritten by these buffers when the device is opened.
- Because BASIC issues a CLR when device 2 is opened, previously defined variables may be cleared or relocated by that CLR.

## Recommendation
Open the RS-232 device (device 2) before:
- Defining any BASIC variables or arrays that must survive,
- Reserving top-of-memory safe areas for machine-language code or data.

If machine code must be kept in a fixed high memory area, allocate or protect that area after opening the RS-232 device (or place code below the resulting buffer region).

## Key Registers
- $0283 - BASIC - pointer to end of user RAM (lowered by 512 bytes when device 2 is opened)

## References
- "datptr_pointer_to_current_data_item_and_sample_program" — expands on pointer manipulation examples in BASIC memory (DATA pointer example)
- "inpptr_input_source_pointer_for_get_read_input" — expands on the related input-source pointer used by GET/READ/INPUT to locate input sources
