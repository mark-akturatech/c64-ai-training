# Turbo Assembler (C-64) — usage notes

**Summary:** Start the Turbo Assembler editor with SYS $9000; assemble with C=3; assemble-to-disk with C=5; save source with C=s; load source with C=l; exit to BASIC with C=1; press RESTORE to return to the assembler (or RESET + SYS $9000). Versions vary (macros, undocumented opcodes).

**Using Turbo Assembler**

After loading Turbo Assembler, enter the editor by typing:

- SYS $9000

In the editor, you write assembly source using the assembler's expected syntax. Most Turbo Assembler commands are invoked by pressing the Commodore (C=) key followed by another key (written here as "C=X"). (C= denotes the Commodore modifier key printed on the keyboard.)

Common commands documented in this source:

- C=3 — assemble the current source (assemble/compile)
  - If you press s immediately after assembly, the assembled program is started automatically.
- C=5 — assemble and write an object file to disk (assemble to object file)
- C=s — save source to disk
- C=l — load source from disk
- C=1 — exit to BASIC

Recovering control:

- While the assembled program is running, press RESTORE to return to Turbo Assembler. If RESTORE fails, RESET and then repeat SYS $9000 to re-enter the assembler, unless TA's memory has been overwritten by your program.

Version differences:

- Multiple Turbo Assembler versions exist; some implement macros and/or accept undocumented opcodes. Try different versions if you need those features.

External documentation:

- Additional, more detailed documentation and usage guides are available online.

## References

- "tools_intro" — expands on why assemblers are preferred by many demo coders