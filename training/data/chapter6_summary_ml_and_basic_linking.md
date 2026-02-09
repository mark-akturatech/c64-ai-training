# MACHINE - Chapter 6: staging machine-language programs

**Summary:** Staging ML programs on 6502/C64 involves choices: cassette buffer, top-of-BASIC memory, or behind the end-of-BASIC (EOB); important concepts include the start-of-variables pointer (SOV), monitor .S/.L save/load usage, and the C64’s unused RAM block $C000-$CFFF. BASIC variable types (integer, real, string) can be accessed from ML (integers are easiest).

## Staging options (cassette buffer, top-of-memory, after EOB)
- Cassette buffer: convenient for small ML test programs and rapid edits; not suitable for large programs or programs you intend to save to tape long-term.
- Top-of-BASIC memory: place ML near the top-of-BASIC memory region (just below BASIC’s workspace). To protect the code you must move the top-of-memory pointer downward (reserve space). Such placements often require a small BASIC “setup” program to adjust pointers and install the ML code.
- Behind End-Of-BASIC (EOB): place code after the BASIC program by using the three consecutive zero bytes that mark EOB. When using this area you must increase the start-of-variables pointer (SOV) so BASIC variables do not overwrite the ML code. After relocating SOV, avoid changing (editing/saving/loading) the BASIC program in ways that would invalidate the arrangement.

## VIC-20 and pointer shifting
- The VIC-20 routinely moves the start-of-BASIC pointer upward (to make room for video data in low memory). If you are moving that pointer anyway, you can shift it a bit further to create space for a machine-code resident area. (This is platform-specific behavior; check the current pointers before placing code.)

## Commodore 64 extra RAM ($C000-$CFFF)
- The C64 has a commonly-unused RAM block at $C000-$CFFF that can be used for ML staging. Always verify no other resident program or ROM mapping is using that area before relying on it.

## Start-of-variables pointer (SOV) and SAVE/LOAD interaction
- The SOV is intimately tied to BASIC’s SAVE and LOAD operations. LOAD sequences (and some monitor operations) can change pointers; it is crucial that any LOAD or monitor-based placement leaves SOV (and related BASIC pointers) in a safe place so that subsequent BASIC variable creation or SAVE won’t overwrite ML code.
- When placing ML behind EOB, explicitly raise SOV past your ML block and ensure any future LOAD does not restore SOV into a destructive position.

## Monitor usage: .S and .L
- The ML monitor commands .S (save) and .L (load) can stage code to arbitrary memory regions. These are useful for moving blocks into place but require the same pointer safety checks as LOAD/SAVE: verify SOV, top-of-memory, and that the targeted region is free and persistent across the operations you will perform.
- After using .L/.S or other memory-writing monitor commands, re-check pointers used by BASIC and any resident routines.

## BASIC variables and ML interfacing
- BASIC variable types: integer, real (floating point), and string.
- ML programs can access all three types; integer variables are the simplest to read and write from ML.
- If you need to find BASIC variables reliably from ML, create them deliberately in a known sequence or layout so the ML routine can locate them predictably.

## Practical cautions
- Do not rely on temporary regions (cassette buffer, transient top-of-memory) for production code.
- Always check memory maps and resident utilities before deciding on $C000-$CFFF or any low/high memory staging area.
- After any LOAD, SAVE, or monitor operation, validate SOV and BASIC pointer integrity before running BASIC or ML code that depends on those pointers.

## Key Registers
- $C000-$CFFF - RAM - C64 commonly-unused RAM block for ML staging (verify it's free)

## References
- "where_to_put_machine_language_programs" — expanded recap of placement strategies
- "example_ml_times_ten_using_basic_variables_and_sov_adjust" — practical ML+BASIC example with SOV adjustments