# byRiclianll - Assembler directives and program origin

**Summary:** Shows assembler directives (.OPT P,02), inline comment markers (;), and a location-counter origin assignment (* = *0400). Contains the comment heading that marks the start of the initialization section.

## Directives and meaning
- .OPT P,02 — an assembler option directive (assembler-specific). The source sets an option named P with parameter 02; consult the specific assembler manual for the option semantics.
- *= *0400 — sets the assembler location counter (origin) to $0400. The '*' symbol is the current location counter; assigning it relocates the following assembled code to that address.
- Semicolon (;) — line comment marker: the remainder of the line is a comment.

## File layout / intent
- Lines shown form a minimal directive block and a comment heading for an initialization section; actual initialization code and zero-page setup begin after this heading (see referenced chunks).
- This chunk does not contain executable instructions — only assembler setup and a placeholder comment heading.

## Source Code
```asm
150  ; 

160  .OPT  P,02 
170  ; 

180  *=  *0400 
190  ; 
```

## References
- "source_listing_and_basic_bootstrap" — expands on BASIC bootstrap that invokes the assembled code
- "initialization_code_and_zero_page_setup" — expands on Initialization code (zero-page/register setup) begins after these directives