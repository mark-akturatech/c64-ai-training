# What an Assembler Can Do For You

**Summary:** Describes assembler benefits: removes the need to memorize machine opcodes and automatically computes branch distances/label offsets; enables use of symbolic names for memory and program locations.

## What an Assembler Can Do For You
An assembler frees you from memorizing the actual machine code bytes for each instruction and lets you write using mnemonics and labels. It also automatically calculates distances (branch displacements/label offsets) when one instruction must branch to another. For very small programs (under ~50 lines) calculating these by hand is possible, but as program size and complexity grow, performing these calculations manually becomes impractical. Hand-encoding opcodes and branches remains possible for hobbyist work, but assemblers remove the tedium and reduce error-proneness for larger projects.

## References
- "symbolic_names_and_program_readability" — expands on how assemblers let you assign meaningful names to memory and program locations