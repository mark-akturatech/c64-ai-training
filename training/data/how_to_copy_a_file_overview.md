# byRiclianll — Section 7.18: How to Copy a File

**Summary:** Describes constraints and required parameters for the 1541 COPY routine: maximum length (125 blocks), inability to copy REL (relative) files, no wildcard support, and that a file name and file type must be supplied.

## Constraints and Parameters
Limitations:
- Maximum copy length: 125 blocks.
- Will not copy REL (relative) files.
- Wildcards are not permitted in the file spec.

Parameters:
- Required: file name and file type (file type = PRG/SEQ/USR/etc.; specify the type when invoking the copy).

## References
- "1541_copy_basic_main_program" — contains the complete BASIC '1541 COPY' program that implements the described copying procedure
- "1541_backup_source_annotation" — related backup context and rationale for using machine-language transfers