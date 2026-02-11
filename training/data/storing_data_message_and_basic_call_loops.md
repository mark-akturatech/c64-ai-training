# Placing "HELLO" into memory and calling it from BASIC (store bytes at $034A-$034F; SYS 828)

**Summary:** Show how to enter data bytes into memory with the monitor (.M 034A 034F), place ASCII "HELLO" bytes (48 45 4C 4C 4F 0D) at $034A-$034F, return to BASIC (.X) and run the machine routine with SYS 828; includes a sample BASIC loop calling SYS 828 multiple times.

## Procedure
Use the machine monitor to edit memory rather than assembling — these are data bytes, not instructions. Enter the memory-edit command for the target range and type the hex byte values for the characters:

- Command: .M 034A 034F
- Overwrite the display so the bytes at $034A become: 48 45 4C 4C 4F 0D

Notes:
- 48 45 4C 4C 4F are ASCII for "H E L L O"; 0D is a carriage return.
- These bytes live directly after the machine-language program, which is why they "fit exactly behind our program".
- Because these bytes are data, a disassembler run at $033C will show garbage for those addresses — that is expected.
- After editing, return to BASIC with the monitor exit command (.X) and call the machine routine with SYS 828 to print HELLO.
- Example BASIC loop to call the routine multiple times is included below.

## Source Code
```text
.:034A  48 45 4C 4C 4F 0D xx xx
```

```basic
100 FOR J=1 TO 3
110 SYS 828
120 NEXT J
```

(Use the monitor to disassemble/check the program at $033C before returning to BASIC if desired.)

## References
- "loop_implementation_inx_cpx_bne_full_code" — expands on the loop and expects the character data at $034A-$034F
- "save_cassette_disk_pointer_issues" — expands on issues with saving programs stored in cassette buffer area
