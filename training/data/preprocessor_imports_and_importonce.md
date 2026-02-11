# Kick Assembler: #import, #importif, and #importonce

**Summary:** Kick Assembler preprocessor directives #import and #importif include other source files; use #importif with a defined symbol for conditional inclusion. To prevent multiple inclusions of the same file (library pattern), put #importonce inside the imported file.

## Import directives
- #import "File.asm" — unconditionally includes the named source file.
- #importif SYMBOL "File.asm" — includes the named file only if SYMBOL is defined (symbol definition comes from earlier source or build-time defines; see preprocessor documentation).
- #importonce placed inside an imported file causes that file to be imported only once, even if multiple #import lines reference it. This is the recommended pattern for library files to avoid duplicate definitions or repeated initialization.

## Source Code
```asm
; Basic import examples
#import "MyLibrary.asm"
#importif STAND_ALONE "UpstartCode.asm"    ; Only imported if STAND_ALONE is defined
```

```asm
; File1.asm (library or shared module)
#importonce
.print "This will only be printed once!"
; ...rest of File1.asm...
```

```asm
; File2.asm (consuming file)
#import "File1.asm"   ; This will import File1
#import "File1.asm"   ; This will not import again because File1.asm contains #importonce
```

## References
- "preprocessor_intro_and_symbol_definitions" — expands on how symbols control conditional imports (#importif)