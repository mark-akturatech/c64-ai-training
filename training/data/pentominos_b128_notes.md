# MACHINE — B128 variant: PENTOMINOS boot-loading behavior

**Summary:** Describes the PENTOMINOS B128 variant boot process: the B128 images do not align to the same load addresses as other variants and require a bootstrap loader that automatically loads files whose names begin with '+'. Searchable terms: B128, bootstrap, relocation, + filenames, boot loader.

**Description**
The B128 variant of PENTOMINOS is laid out differently from other machine variants: its program/data blocks do not align to the same load addresses used by the non-B128 versions. This chunk documents that behavior and the intended bootstrap mechanism rather than explicit addresses.

- The B128 release is provided to illustrate the "boot" loading system required on that computer.
- Files whose filenames begin with a leading '+' character are intended to be loaded by the bootstrap program; they must not be loaded directly by the user or a manual loader.
- The bootstrap handles (implicit) relocation and sequencing required for the B128 image to run correctly. (bootstrap = the small loader that reads and chains disk/tape files)

## References
- "pentominos_program_overview" — expands on differences in B128 variant relocation and boot handling
