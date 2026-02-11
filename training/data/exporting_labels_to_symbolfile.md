# Kick Assembler: .sym export/import and BasicUpstart macro

**Summary:** Explains Kick Assembler's --symbolfile option that exports assembled symbols to a .sym namespace file (.namespace/.label), how to import that file via .import to reference labels from another source (jsr namespace.label), and the BasicUpstart / BasicUpstart2 macros that generate a BASIC stub (10 SYS ...) and optionally set memory blocks for running code in a C64 or emulator (VICE, --execute). Mentions example VIC-II registers $D020/$D021 used in the examples.

## Symbol export (.sym) and import (.import)
Kick Assembler can emit a .sym file containing a namespace and label declarations for the assembled symbols. Use the command-line option --symbolfile when assembling:

java -jar KickAss.jar source1.asm --symbolfile

This produces source1.sym containing declarations such as:
.namespace source1 {
  .label clearColor = $2000
}

To use those symbols from another assembly file, import the .sym file and reference labels using the namespace:

.import source "source1.sym"
jsr source1.clearColor

The .sym file mirrors symbol names and addresses in a namespaced form so labels from different modules don't collide.

## Basic Upstart Program (BasicUpstart / BasicUpstart2)
Kick Assembler includes a standard macro BasicUpstart that inserts a small BASIC program at $0801 to start the assembled machine code (a 10 SYS ... line). Typical usage:

*= $0801 "Basic Upstart"
BasicUpstart(start)

start:

*= $0810 "Program"
inc $d020
inc $d021
jmp start

This produces a BASIC line (10 SYS $0810) that you can use to run the code on a real C64 or in an emulator. The assembler also provides BasicUpstart2(start) which additionally sets up memory blocks for you:

BasicUpstart2(start)
start: inc $d020
       inc $d021
       jmp start

Tip: Insert the BasicUpstart program at the start of your builds and use Kick Ass's --execute option (and Vice) to automatically load and run the assembled program in VICE after assembling. The macro implementations are in autoinclude.asm inside KickAss.jar if you need to inspect the macro source.

## Source Code
```asm
; Example: produce a .sym file and import it from another file

; source1.asm
*= $2000
clearColor:
    .byte $00  ; example label at $2000

; Assemble with:
; java -jar KickAss.jar source1.asm --symbolfile
; Produces source1.sym containing:
; .namespace source1 {
;   .label clearColor = $2000
; }

; other.asm
.import source "source1.sym"
jsr source1.clearColor

; Basic Upstart example
*= $0801 "Basic Upstart"
BasicUpstart(start)
; assembler emits: 10 SYS $0810

start:
*= $0810 "Program"
inc $d020
inc $d021
jmp start

; BasicUpstart2 variant
BasicUpstart2(start)
start:
    inc $d020
    inc $d021
    jmp start
```

## Key Registers
- $D020-$D021 - VIC-II - border color ($D020) and background (screen) color / background palette ($D021)

## References
- "autoinclude.asm" — contains the BasicUpstart / BasicUpstart2 macro definitions (inside KickAss.jar)

## Labels
- $D020
- $D021
