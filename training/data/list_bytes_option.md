# ca65 --list-bytes n

**Summary:** ca65 command-line option --list-bytes sets the maximum number of bytes printed in the assembler listing for one input line; a value of zero means unlimited. See the .LISTBYTES directive for the in-assembly equivalent.

## Description
Sets the maximum number of object bytes shown in the textual listing for a single source line when assembling with ca65. When the value is zero the assembler encodes an unlimited number of printed bytes (no per-line cap). The option corresponds to the assembler directive .LISTBYTES for use inside source files.

## References
- "listing_option" — expands on how many bytes are shown per listing line  
- ".LISTBYTES directive" — in-source directive equivalent to the --list-bytes option
