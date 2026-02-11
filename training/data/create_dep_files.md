# ca65 --create-dep / --create-full-dep

**Summary:** ca65 assembler options to generate makefile-style dependency files: --create-dep writes a dependency file (given filename) excluding files referenced only via debug information; --create-full-dep writes a dependency file including files passed via debug information.

## Options
--create-dep name
Tells ca65 to generate a makefile-syntax dependency list for the assembled module and write it to the specified filename. The dependency list does NOT include files that were only referenced via debug information.

--create-full-dep name
Tells ca65 to generate a makefile-syntax dependency list for the assembled module and write it to the specified filename. The dependency list DOES include files that were passed to the assembler via debug information.

## References
- "debug_info_option" — expands on interaction with debug information and dependency inclusion
