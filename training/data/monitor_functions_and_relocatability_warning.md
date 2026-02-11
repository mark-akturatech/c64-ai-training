# Monitor (development system)

**Summary:** Describes the monitor program: examine/modify memory, load/save memory areas to disk ($disk$), and provide a small disassembler view of memory as assembly language. Covers the problem of monitors fixed at a single memory location (cartridge monitors) and recommends relocatable monitors or multiple fixed-location builds (high-RAM and low-RAM).

## Role
A monitor is the final piece of an assembly-language development system. Core functions:
- Examine and modify memory contents.
- Move memory blocks.
- Load and save memory areas to/from the disk drive.
- Provide a small disassembler to view memory as assembly language commands.

## Behavior and caveats
- Cartridge monitors reside at a permanently fixed memory location. If a program requires that memory area, the cartridge monitor prevents use of that memory and can make the monitor unusable for developing or running the program.
- To avoid conflicts, use a relocatable monitor (one that can be loaded to different memory addresses) or provide multiple fixed-location versions (commonly a high-RAM and a low-RAM build). Having at least two versions typically allows one to be used without preventing the program from using needed memory.

## References
- "importance_of_an_assembler_and_package_components" — expands on monitor listed as a core package component  
- "assembling_and_coresident_assemblers_saving_practices" — expands on monitor use during testing and the need to save before running  
- "loader_relocation_options" — expands on relocatable monitors complementing loaders that relocate programs
