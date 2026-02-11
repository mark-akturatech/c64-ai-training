# ca65 -I dir, --include-dir dir

**Summary:** ca65 option -I / --include-dir specifies additional directories searched for assembler include files; the option may be repeated and the current directory is always searched first. See search paths and binary/text include differences.

## Description
Name a directory to be searched for include files used by ca65. The option may be used more than once to add multiple directories to the include search. The current working directory is always searched first before any directories named with -I / --include-dir are considered. See the assembler's search paths documentation for the full lookup order and behavior.

## References
- "bin_include_dir" — expands on binary include file search vs text include search
