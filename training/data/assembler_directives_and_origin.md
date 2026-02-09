# .OPT P,02 and assembly origin *= $0500

**Summary:** Assembler directive .OPT P,02 and the assembly origin directive (* = $0500) shown with surrounding semicolon comment lines; line-numbered listing of directives (comment-only lines) and the assembly start address used for a BASIC SYS entry and initial JSRs.

## Description
This chunk is a short assembler listing showing comment-only lines (semicolon-prefixed) surrounding two assembler directives:

- A single .OPT directive: `.OPT  P,02` (assembler option present in the listing).
- An assembly origin directive setting the start address: `* = $0500`.

The semicolon lines are comment-only separators in the source listing. The line numbers (150, 160, ...) appear to be listing numbers from the source file and are not assembler tokens. The origin `$0500` is the linked assembly start used by a BASIC SYS entry and by routines assembled at that address (see References).

**[Note: Source contained an unusual character at the origin line ("«=  *0500"); this has been normalized to the standard origin syntax `* = $0500`. If the raw source intentionally used a nonstandard marker, verify against the original file.]**

## Source Code
```asm
150  ; 
160   .OPT  P,02 
170  ; 
180  * = $0500
190  ; 
```

## References
- "basic_loader_and_sys_entry" — expands on BASIC SYS entry that jumps to this origin
- "find_header_and_wait_loops" — expands on initial JSRs and search routines assembled at the origin