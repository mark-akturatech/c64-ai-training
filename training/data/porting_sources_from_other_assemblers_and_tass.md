# ca65: Porting sources from other assemblers (TASS guidance)

**Summary:** Differences in .ORG handling, relocatable code and linker-based placement are key when porting to ca65; use .feature labels_without_colons and .feature loose_char_term to emulate TASS, replace PC assignments with .res, translate conditional assembly to ca65 syntax (.REPEAT), and use cl65 --start-addr (start-addr minus two) -t none to produce CBM .prg files.

## Porting overview
ca65 generates relocatable code and relies on the linker to place code, whereas many older assemblers produce absolute code and place code during assembly. The biggest practical differences when porting are:
- .ORG behaviour and relocation: use .ORG to assemble code at an execution address different from the assembly base; placement is normally done by the linker.
- Program-counter assignments (moving PC backwards) are not possible in ca65; use .res to reserve space forward instead.
- Conditional assembly constructs from other assemblers (.ifeq/.endif/.goto, etc.) must be rewritten in ca65 syntax. ca65 has no .goto; loop-like constructs should be rewritten with .REPEAT.
- Emulation features exist (see .feature) and can allow some sources to assemble unchanged, but using them for new code is not recommended.

## TASS-specific notes
To emulate common TASS behaviours when porting, enable two emulation features:
- .feature labels_without_colons — allows TASS-style labels that lack trailing colons
- .feature loose_char_term — allows character constants like "a" (double quotes) instead of ca65's default

Important porting steps:
- Reserve the two-byte CBM load address at the start of a .prg by emitting a .word *+2 (this is the load address placeholder).
- Replace any program-counter assignments (e.g., "*=$2000") with forward-only reservations using .res, since ca65 cannot move the PC backwards.
- Translate conditional assembly and loop constructs to ca65 equivalents; use .REPEAT for loops that other assemblers expressed with .goto.
- To assemble code that is executed at a different address than assembled, use .ORG and then return to normal (e.g. .reloc) when done.
- To produce a CBM .prg with cl65, pass --start-addr set to (desired start address - 2) because the .prg file reserves two bytes for the load address; use -t none to avoid linking to a target runtime.

## Source Code
```asm
; simulate TASS label and char behaviour
.feature labels_without_colons
.feature loose_char_term

    .word *+2       ; the cbm load address

    ; [your code here]

; Replace backwards PC assignment:
; * = $2000    ; not allowed in ca65
.res $2000-*    ; reserve memory up to $2000

; Assemble to a different execution address:
.org $1800

    ; [floppy code here]

.reloc  ; back to normal

; Example cl65 invocation to build a .prg:
; (use start address minus two because of CBM load address)
cl65 --start-addr 0x0ffe -t none myprog.s -o myprog.prg
```

## References
- "predefined_target_constants" — selecting the correct target when porting platform-specific code