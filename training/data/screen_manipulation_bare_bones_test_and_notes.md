# Testing the screen-manipulation routine from BASIC (SYS 828)

**Summary:** This guide explains how to disassemble and test a machine-language screen-manipulation routine by invoking it from BASIC using `SYS 828` (828 decimal = $033C). It includes a BASIC loop to slow down the visual output for better observation.

**Running and testing the routine from BASIC**

- **Clear BASIC memory**: Use the `NEW` command to clear any existing program.

- **Enter the slowdown loop**: Input the following BASIC program to repeatedly call the machine code:

  - **Purpose of loops**:
    - The outer loop (`J`) repeats the machine code call multiple times to make the effect noticeable.
    - The inner loop (`K`) introduces a delay, slowing down the screen updates since machine code executes faster than what is humanly perceptible.
    - If the effect is still too fast, increase the value of `K` or add additional nested loops.

- **Disassemble and inspect the machine code**:
  - Use a machine language monitor or disassembler to examine the code starting at address 828 ($033C). This will help you understand the routine's functionality and its memory footprint.
  - The routine is expected to return control to BASIC upon completion.

- **Practical experiments**:
  - **Modify affected columns**: Adjust the machine code to change which screen columns are manipulated. This typically involves modifying loop counters or memory offsets within the code.
  - **Target specific characters**: Alter the routine to affect only certain characters. For example, you can program it to test each screen byte and only modify those equal to the PETSCII code for "S".

- **VIC-II / C64 color considerations**:
  - When directly modifying screen memory on the VIC-20 or C64, remember that each character on the screen has an associated color stored in color RAM.
  - On the C64, the default screen memory starts at $0400 (1024 decimal), and the color RAM starts at $D800 (55296 decimal). Each screen character corresponds to a byte in color RAM that defines its color.
  - Ensure that both the screen memory and the corresponding color RAM are updated to maintain the correct visual output.

## Source Code

  ```basic
  100 FOR J=1 TO 10
  110 SYS 828
  120 FOR K=1 TO 200
  130 NEXT K,J
  ```

```basic
100 FOR J=1 TO 10
110 SYS 828
120 FOR K=1 TO 200
130 NEXT K,J
```

## References

- "screen_manipulation_loop_and_line_advance" — expands on testing and iteration via BASIC SYS calls
- "vic_c64_color_note" — expands on color-nybble considerations on VIC/C64
