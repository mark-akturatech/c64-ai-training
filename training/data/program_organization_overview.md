# Organizing Your Program — recommended file/layout order (macro library, system definitions, RAM/data, main, subroutines)

**Summary:** Recommended program structure for 6510/6502 assembly: macro library, system definitions (hardware registers, e.g., SYSDEF/MACLIB), RAM definitions, data definitions, main program, and subroutines; macros must be defined before first use, and macro/system files (MACLIB, SYSDEF) are assembled/included early.

**Program structure**

Recommended top-level order for assembled source:

- **Macro library**: Put all macros and `.LIB` includes first. Macros must be defined before use; many macros may define data areas.
- **System definitions**: Constants and hardware register labels (e.g., SYSDEF-style files mapping $D000-$DFFF areas).
- **RAM definitions**: Symbolic equates for workspace, stack, buffers (zero-page usage and fixed RAM locations).
- **Data definitions**: Tables, strings, bitmap/tile data, etc.
- **Main program**: Program entry point, initialization, main loop.
- **Subroutines**: Service routines, interrupt handlers, helpers called from main.

Notes:

- Macros must be defined prior to their first use; include/assemble macro libraries (MACLIB) before source that invokes them.
- System-definition files (SYSDEF) that define hardware registers and constants should be included early so labels are available in macros and code.
- The ordering allows macros to create data areas or constants used later without forward-definition problems.
- This outline reflects assembly-time dependency ordering rather than runtime performance characteristics.

**Macros vs. Subroutines**

There is no penalty in terms of execution speed when using macros instead of subroutines; however, macros increase code size because their code is expanded inline at each invocation. In contrast, subroutines save memory by centralizing code but introduce a slight execution overhead due to the `JSR` (Jump to SubRoutine) and `RTS` (ReTurn from Subroutine) instructions, which together consume additional cycles. Therefore, the choice between macros and subroutines involves a trade-off between execution speed and memory usage. ([nesmaker.nerdboard.nl](https://nesmaker.nerdboard.nl/2024/11/28/macros-and-subroutines/?utm_source=openai))

**Including Macro and System Definition Files**

To include macro libraries (MACLIB) and system definition files (SYSDEF) in your assembly source, use the `.INCLUDE` directive followed by the filename in quotes. This directive tells the assembler to incorporate the contents of the specified file at that point in the source code. For example:


Ensure that the paths to these files are correct relative to your source file or provide absolute paths if necessary. Including these files early in your source ensures that all macros and system definitions are available before they are referenced. ([unfinishedbitness.info](https://unfinishedbitness.info/2014/06/26/6502-including-others/?utm_source=openai))

**Defining Data Areas with Macros**

Macros can be used to define data areas by generating data structures or initializing memory regions. For instance, a macro can define a structure with specific offsets for each field, facilitating organized data management. Here's an example of a macro defining a structure for a person:


In this example, the `memcpy`, `set16`, and `set8` macros facilitate copying data and setting values within a structured data area, promoting code reuse and clarity. ([c64os.com](https://c64os.com/post/ptrsstructsrecursion2?utm_source=openai))

**Mapping C64 Registers with SYSDEF**

System definition files (SYSDEF) map hardware registers to symbolic labels, enhancing code readability and maintainability. For example, a SYSDEF file might include definitions like:


By including such a SYSDEF file in your source code, you can refer to hardware registers by their symbolic names, improving code clarity and reducing the likelihood of errors. ([unfinishedbitness.info](https://unfinishedbitness.info/2014/06/26/6502-including-others/?utm_source=openai))

## Source Code

```assembly
.INCLUDE "maclib.asm"
.INCLUDE "sysdef.asm"
```

```assembly
; Define offsets for the Person structure
pname   = 0
pyear   = 32
pmonth  = 34
pdate   = 35
pheight = 36
pweight = 37
psize   = 38

; Macro to copy memory
.macro memcpy dest, offset, src, len
    ldx #0
    ldy #\offset
next:
    lda \src, x
    sta (\dest), y
    inx
    iny
    cpx #\len
    bne next
.endm

; Macro to set a 16-bit value
.macro set16 dest, offset, value
    ldy #\offset
    lda #<\value
    sta (\dest), y
    iny
    lda #>\value
    sta (\dest), y
.endm

; Macro to set an 8-bit value
.macro set8 dest, offset, value
    ldy #\offset
    lda #\value
    sta (\dest), y
.endm
```

```assembly
; VIC-II (Video Interface Controller) registers
VIC_BASE    = $D000
VIC_CTRL1   = VIC_BASE + $11
VIC_CTRL2   = VIC_BASE + $16
VIC_MEM     = VIC_BASE + $18
VIC_IRQ     = VIC_BASE + $19
VIC_BORDER  = VIC_BASE + $20
VIC_BG      = VIC_BASE + $21

; SID (Sound Interface Device) registers
SID_BASE    = $D400
SID_FREQ1   = SID_BASE + $00
SID_PW1     = SID_BASE + $02
SID_CTRL1   = SID_BASE + $04
SID_AD1     = SID_BASE + $05
SID_SR1     = SID_BASE + $06
```


## References

- "using_an_assembler_pseudo_opcodes" — expands on macros and .LIB directives
- "what_an_assembler_can_do" — expands on macro vs subroutine tradeoffs

## Labels
- VIC_BASE
- VIC_CTRL1
- VIC_CTRL2
- VIC_MEM
- VIC_IRQ
- VIC_BORDER
- VIC_BG
- SID_BASE
- SID_FREQ1
- SID_PW1
- SID_CTRL1
- SID_AD1
- SID_SR1
