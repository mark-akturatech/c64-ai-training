# C64 I/O Map: VIC-II Registers POKEd During Raster Interrupts (BASIC lines 49152–49276)

**Summary:** Describes a sample program that uses a table of DATA statements (BASIC lines 49152–49276) to POKE values into VIC‑II registers $D011, $D016, $D018, and $D021 during each of three raster interrupts; notes DATA ordering (values appear reversed relative to the POKE order).

**Interrupt data mapping**

The interrupt routine reads a table of values (stored as DATA statements in a BASIC program) and POKEs entries into four VIC‑II locations during each of the three interrupts. The four target registers are:

- Control Register 1 ($D011)
- Control Register 2 ($D016)
- Memory Control Register ($D018)
- Background Color 0 ($D021)

The DATA items that drive the interrupts are contained in BASIC lines 49152–49276. Each BASIC line in that range is used as a machine‑code/data block: the first DATA byte in the statement is POKEd into the memory address equal to that BASIC line number. Lines 49264–49276 of the BASIC program contain REM statements that explain which VIC‑II registers are affected by the DATA statements in each line.

DATA order vs. POKE order: the numeric order in each DATA statement appears reversed relative to the order in which values are POKEd into the VIC register(s). Example (as described in the source): line 49273 contains the DATA that map to Control Register 2. In that DATA statement, the last number (8) is the value placed into $D016 while the top part of the screen is displayed; the first number (24) is placed into $D016 for the bottom part of the screen (changing that portion to multicolor mode).

## Source Code

The following is a partial listing of the BASIC program, focusing on the DATA statements and corresponding REM statements that define the machine code and data for the raster interrupt routine:

```text
49152 DATA 120, 169, 127, 141, 13, 220
49158 DATA 169, 1, 141, 26, 208, 169
49164 DATA 3, 133, 251, 173, 112, 192
49170 DATA 141, 18, 208, 169, 24, 141
49176 DATA 17, 208, 173, 20, 3, 141
49182 DATA 110, 192, 173, 21, 3, 141
49188 DATA 111, 192, 169, 50, 141, 20
49194 DATA 3, 169, 192, 141, 21, 3
...
49264 REM Scan line numbers for each interrupt
49265 REM Control Register 1 ($D011) values
49266 REM Background Color 0 ($D021) values
49267 REM Memory Control Register ($D018) values
49268 REM Control Register 2 ($D016) values
...
49273 DATA 8, 8, 24 : REM Control Register 2
49276 DATA 20, 22, 20 : REM Memory Control
```

In this listing:

- Lines 49152–49263 contain the machine code for the interrupt routine.
- Lines 49264–49276 contain REM statements that document the purpose of the subsequent DATA statements.
- Lines 49273 and 49276 provide example DATA statements for Control Register 2 and the Memory Control Register, respectively.

The complete program includes additional DATA statements corresponding to each VIC‑II register affected by the interrupts, as indicated by the REM statements.

## Key Registers

- $D011 - VIC-II - Control Register 1 (decimal 53265)
- $D016 - VIC-II - Control Register 2 (decimal 53270)
- $D018 - VIC-II - Memory Control Register (decimal 53272)
- $D021 - VIC-II - Background Color 0 (decimal 53281)

## References

- "two_raster_interrupts_and_program_introduction" — overview of the sample program's purpose
- "data_table_mapping_and_examples" — expands on how DATA items map to interrupts and registers
- "raster_interrupt_example_basic_and_data_listing" — exact BASIC and DATA listing used by the sample program

## Labels
- D011
- D016
- D018
- D021
