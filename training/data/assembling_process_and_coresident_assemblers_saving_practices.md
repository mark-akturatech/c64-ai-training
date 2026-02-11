# Assembler — Coresident vs Loaded, and Saving Source

**Summary:** Explains that source must be assembled after editing, defines a coresident assembler (assembler and editor loaded together), and advises saving source frequently to avoid losing work when running or testing assembled code.

## Overview
- After entering program text in the editor, it must be assembled before it can be executed or tested.
- Some assembler packages require you to load the assembler at assemble-time; a coresident assembler has the assembler and all required tools already loaded simultaneously.
- Coresident assemblers speed up the edit → assemble → test cycle, which is useful when you iteratively write small code sections and immediately assemble to check for errors.
- Regardless of assembler type, save your source frequently while editing. Running newly-assembled code can lock up the machine (forcing a power-cycle), which risks losing unsaved source—this risk applies whether using a coresident package or loading the assembler on demand.

## References
- "text_editor_role_and_selection" — expands on what you do with source entered in the editor  
- "assembly_speed_and_printouts_intro" — expands on performance and output considerations after assembly  
- "monitor_functions_and_relocatability_warning" — expands on saving before running and monitor-related crash risks
