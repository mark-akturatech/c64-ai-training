# Kick Assembler: sidFiles .sid Import via .segment

**Summary:** Demonstrates how to use Kick Assembler's `.segment` directive with the `sidFiles` parameter to import `.sid` files as memory blocks. The example includes setting up a BASIC program header, defining labels, and invoking the `BasicUpstart` macro to initialize the program.

**Description**

This example illustrates the process of importing a SID music file into a Kick Assembler project using the `sidFiles` parameter within the `.segment` directive. Key steps include:

- **Importing the SID File:** Utilizing the `sidFiles` parameter in the `.segment` directive to import `data/music.sid` into the assembly project.
- **Output Configuration:** Specifying `outPrg="out.prg"` to define the output PRG file.
- **Memory Label Definition:** Defining a label `CHARSET` at memory address `$3000`.
- **Program Origin and BASIC Header:** Setting the assembly origin to `$0801` and including a BASIC header to facilitate program execution.
- **Program Initialization:** Invoking the `BasicUpstart` macro with the `ch2` label to set up the program's entry point.

## Source Code

```asm
.segment Main [sidFiles="data/music.sid", outPrg="out.prg"]

.label CHARSET = $3000
*=$0801 "Basic"
BasicUpstart(ch2)

ch4:
    // Implementation for channel 4 routine
    // Example: Initialize and play channel 4
    lda #$00
    sta $d400  // SID register for channel 4 frequency low byte
    sta $d401  // SID register for channel 4 frequency high byte
    // Additional setup as needed
    rts

ch2:
    // Implementation for channel 2 routine
    // Example: Initialize and play channel 2
    lda #$00
    sta $d404  // SID register for channel 2 frequency low byte
    sta $d405  // SID register for channel 2 frequency high byte
    // Additional setup as needed
    rts
```

## Key Registers

- **$D400-$D401:** SID registers for channel 4 frequency control.
- **$D404-$D405:** SID registers for channel 2 frequency control.

## References

- [Kick Assembler Manual: Basic Upstart Program](https://theweb.dk/KickAssembler/webhelp/content/ch14s02.html)
- [Kick Assembler Manual: Macros](https://theweb.dk/KickAssembler/webhelp/content/ch07s02.html)
- [Kick Assembler Manual: Memory Directives](https://theweb.dk/KickAssembler/webhelp/content/ch03s05.html)
- [Kick Assembler Manual: Segments](https://theweb.dk/KickAssembler/webhelp/content/ch10s03.html)
- [Kick Assembler Manual: Segment Modifiers](https://theweb.dk/KickAssembler/webhelp/content/ch10s13.html)
- [Kick Assembler Manual: The File Directive](https://theweb.dk/KickAssembler/webhelp/content/ch11s03.html)

**Notes**

- **BasicUpstart Macro:** The `BasicUpstart` macro generates a BASIC program header that automatically starts the machine code at the specified label. In this example, `BasicUpstart(ch2)` creates a BASIC program that executes a `SYS` command to jump to the `ch2` label upon loading. The macro is defined in Kick Assembler's standard library and can be found in the `autoinclude.asm` file within the KickAss.jar archive. [Source](https://theweb.dk/KickAssembler/webhelp/content/ch14s02.html)

- **SID File Import and Memory Mapping:** When using the `sidFiles` parameter, Kick Assembler imports the SID file into the specified segment. The memory placement of the SID data depends on the SID file's internal load address. To determine the exact memory mapping, you can use the `-showmem` command-line option during assembly, which provides a memory map of the assembled program. [Source](https://theweb.dk/KickAssembler/webhelp/content/ch02s03.html)

- **Channel Routine Implementations:** The `ch4` and `ch2` labels represent routines for SID channels 4 and 2, respectively. These routines should include the necessary code to initialize and play the corresponding SID channels. The provided implementations are placeholders and should be replaced with the actual code required for your specific application.