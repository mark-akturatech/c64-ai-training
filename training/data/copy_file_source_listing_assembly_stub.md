# COPY A FILE SOURCE LISTING

**Summary:** Assembler/source listing header and small PAL stub for the "COPY" utility; contains BASIC REM header and an example OPEN call, a SYS 40960 invocation, assembler directives (.OPT P,02) and an origin directive (* = $C000) — assembler-side companion to the BASIC/DATA machine-code pieces.

**Description**

This chunk is the assembler-side companion header/stub for a COPY utility. It contains the BASIC listing header and the minimal assembler directives and origin for the machine-code routine the BASIC program calls (via SYS 40960). Items present:

- BASIC program header lines and REM comments.
- An example OPEN statement intended to create the output file on the 1541 drive.
- A SYS 40960 call (decimal), which invokes the machine-code routine.
- Assembler directives: `.OPT P,02` and an origin assignment that designates the code load address (`* = $C000`).
- Marked as "PAL" (COPY.PAL), indicating the target TV timing/format for the accompanying machine-code.

This listing is only the header/stub; the full machine-code DATA bytes and the full assembler routines are not present here and are covered by related chunks (see References).

## Source Code

```basic
100  REM  COPY.PAL
110  REM

120  OPEN 2,8,2,"0:COPY.B,P,W"

130  REM

140  SYS 40960

150  ;
```

```asm
160   .OPT  P,02
170  ;

180  * = $C000
```

## Key Registers

(omitted — this chunk does not document hardware registers or addresses beyond the code origin)

## References

- "initialization_and_error_handling_and_mldata" — contains/expands on the machine-code DATA bytes the assembler stub would reference.
- "1541_copy_basic_main_program" — contains the BASIC program that issues SYS calls into the machine-code routines implemented by this assembly listing.