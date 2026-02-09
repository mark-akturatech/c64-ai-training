# Single-Sector 21 Error — Destructive Routine (annotation)

**Summary:** Annotated behavior of a destructive disk routine that syncs to the preceding sector’s data block, skips ~325 GCR bytes, flips the drive to write and emits 256 non-sync bytes to overwrite sync marks; normally produces a 20 error on a single sector but can produce 21 errors when two consecutive sectors are destroyed (FDC timeout). Searchable terms: GCR, sync marks, FDC, 20 error, 21 error, sector 0, sectors 18-20.

## Operation
- The routine locates the preceding sector and synchronizes to its data block (source lines referenced 200–210).
- It then waits out roughly 325 GCR bytes (source lines referenced 250–350) to position the head so that subsequent writes will overlap the target sector’s sync marks.
- The code flips the disk drive to write (source lines referenced 370–420) and writes 256 non-sync bytes. These non-sync bytes overwrite both sync marks of the target sector that had been input.
- On a single-sector target this overwrite causes a normal 20 error (CRC/format error or unreadable data) for that sector.
- A side effect: if two consecutive sectors are destroyed with this method, the FDC (floppy disk controller) times out while searching for one or the other (or both), producing a 21 error on both sectors.

## Observed behavior and caveats
- The routine as-written will not produce a 21 error for a single isolated sector; two consecutive sectors must be destroyed to trigger the 21 timeout behavior in this scheme.
- Caution is required when spanning sector ranges because the 21 error arises from FDC timeouts searching neighboring sectors affected by the overwrite.
- To reproduce the observed pattern reliably, destroy sector 0 first, then destroy sectors 20, 19, and 18 in that order (the pattern repeats across tracks as noted).

## Source Code
```text
Sector Error Number

0    21
1-17 OK
18-20 21

(Repeat)
```

## References
- "basic_destroy_a_sector_program" — BASIC driver preparation and execution of the destructive routine
- "assembly_source_single_sector_21_error" — low-level implementation: exact lines that perform sync, wait (~325 GCR bytes), write flip, and the 256-byte overwrite