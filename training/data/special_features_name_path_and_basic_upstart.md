# Kick Assembler — getPath(), getFilename(), BasicUpstart / BasicUpstart2

**Summary:** Describes Kick Assembler helpers `getPath()` and `getFilename()` (returning the source file path and filename) and the `BasicUpstart` / `BasicUpstart2` macros (emit a tiny BASIC stub that SYSs into assembled machine code). Shows example usage lines (`*= $0801 BasicUpstart(start)`), mentions `autoinclude.asm` inside `KickAss.jar` where the macros are defined.

**Overview**

Kick Assembler provides two file-inspection functions:

- `getPath()` — Returns the full path of the current source file, including the filename.
- `getFilename()` — Returns only the filename of the current source file.

These functions are useful for debugging or generating output files relative to the source file's location.

Kick Assembler includes macros to generate a minimal BASIC program stub that initiates the execution of assembled machine code:

- `BasicUpstart` — Emits a BASIC program at the standard BASIC program load address ($0801) that performs a `SYS` to a specified start label or address. Example usage:

  This generates a BASIC line equivalent to `10 SYS 2064`, where 2064 ($0810) is the address of the `start` label.

- `BasicUpstart2` — A variant that also sets up memory blocks. Example usage:

  This similarly generates a `SYS` command to the `start` label.

The macro definitions for `BasicUpstart` and `BasicUpstart2` are located in `autoinclude.asm` inside `KickAss.jar`. Projects using these macros can include this file or copy the macro definitions into their project.

## Source Code

  ```asm
  *= $0801
  BasicUpstart(start)
  ```

  ```asm
  BasicUpstart2(start)
  ```

```asm
// Example BasicUpstart usage
*= $0801
BasicUpstart(start)

// Example BasicUpstart2 usage
BasicUpstart2(start)

// Example assembly mnemonics / addressing modes:
lda #$30       // Immediate
lda $30        // Zeropage
lda $30,x      // Zeropage,X
ldx $30,y      // Zeropage,Y
lda ($30,x)    // Indirect Zeropage,X
```

## References

- [Kick Assembler Manual: Basic Upstart Program](https://www.theweb.dk/KickAssembler/webhelp/content/ch14s02.html)
- [Kick Assembler Manual: Macros](https://theweb.dk/KickAssembler/webhelp/content/ch07s02.html)
- [Kick Assembler Manual: Name and Path of the Sourcefile](https://theweb.dk/KickAssembler/webhelp/content/ch14s01.html)
