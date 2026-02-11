# SOV pointer mistakes — cassette buffer, machine code, and BASIC overwrite

**Summary:** Describes how an incorrect SOV (Start Of Variables) pointer—often after loading machine language into the cassette buffer—causes variables to overwrite BASIC program text, can make SAVE write huge amounts, or cause memory moves to wrap and corrupt the system; includes symptoms (crazy screen, LIST shows nonsense) and the need to verify the SOV pointer.

**Explanation**

The SOV pointer controls where BASIC places its variable table and dynamic data in RAM relative to the BASIC program and any resident machine-language block (for example, a program loaded into the cassette buffer). If SOV is moved (accidentally or by an incorrect ML load), BASIC will allocate variables starting at that new location.

Common failure mode:

- A correct machine-language image is loaded into the cassette buffer and left resident.
- Later, with a BASIC program present, the SOV pointer is inadvertently set to an impossible/incorrect address (for example, by a LOAD/MOVE operation that did not restore the pointer).
- When BASIC runs, variables begin to be written starting at SOV’s (now wrong) location. If that location lies between the machine-language block and the BASIC program text, variables will "creep" into and overwrite the BASIC code.
- Symptoms include a program that runs for a while then halts with a corrupted display or an error reporting a non-existent line; LISTing the program outputs nonsense because the program text itself was overwritten.
- Other consequences: SAVE may attempt to write enormous amounts of memory (because BASIC's idea of program or variable area boundaries are corrupted), and memory block moves or clears can wrap and corrupt system vectors or other critical areas.

Psychological consequence:

- Because the visible program source may now be nonsense, inexperienced users often assume their ML or BASIC code was wrong and may abandon machine-language programming out of loss of confidence.

**Recommended checks**

- Verify the SOV pointer before running BASIC programs after loading or moving machine-language blocks. (SOV = pointer to start of BASIC variables.)
- Understand that an incorrectly placed SOV will not merely crash a routine but can progressively overwrite program text and system data, producing confusing symptoms like spurious LIST output or huge SAVE operations.

## Source Code

To verify and restore the SOV pointer, you can use the following BASIC commands:

```basic
PRINT PEEK(45) + 256 * PEEK(46)
POKE 45, <low byte of correct SOV>
POKE 46, <high byte of correct SOV>
```

Replace `<low byte of correct SOV>` and `<high byte of correct SOV>` with the appropriate values for your system configuration.

Alternatively, using a machine language monitor like TEDMON, you can inspect and modify the SOV pointer:

```text
M 002D 002E
>002D 00 08
```

This command displays the contents of memory locations $002D and $002E, which hold the SOV pointer. To modify the SOV pointer:

```text
>002D 00 08
```

This sets the SOV pointer to $0800. Adjust the values as needed for your system configuration.

## References

- "sov_pointer_dangers_and_effects" — expands on practical consequences and debugging approach

## Labels
- SOV
