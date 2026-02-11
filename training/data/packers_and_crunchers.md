# Packers and Crunchers for C-64 Demos

**Summary:** Overview of packers (RLE) and crunchers (dictionary-based compressors) for reducing load size and time on the C-64; mentions tools (PuCrunch, Sledgehammer), REU-accelerated crunching, and the trade-offs between linking packed files vs saving and packing a whole memory area.

## Packers (RLE)
Packers use run-length encoding (RLE): they scan for repeated runs of the same byte and replace each run with a marker (a special markup byte), the repeated value, and a count. RLE is simple, very fast to pack/unpack, and works best on data with frequent long runs (e.g., cleared memory blocks, repeating tiles, long zero or $FF fills). Because RLE relies on run length, it is poor on highly varied data.

(Clarification: RLE stores "value + count" rather than full repeated sequence.)

## Crunchers (dictionary-based compressors)
Crunchers use more advanced, slower algorithms that find repeated sequences (strings) in the data and replace later occurrences with references (pointers/offset+length) to earlier occurrences. These dictionary-style methods (LZ variants and similar) generally produce far smaller outputs than RLE on typical demo data, at the cost of longer packing time and more complex unpackers.

- Crunching is compute-heavy; pack time can be substantial on native C-64 hardware.
- Using extra host-side power (PC/Amiga) or accelerator hardware speeds crunching.

## REU usage to speed crunching
If crunching on a C-64 takes too long, an REU (RAM Expansion Unit) can dramatically improve packing speed when used by a cruncher that supports it. REU lets the cruncher use faster storage/transfer mechanisms and more RAM for buffers or lookback windows, reducing runtime and sometimes improving compression ratios.

## Recommended tools and workflows
- PuCrunch (by Pasi Ojala) — recommended for crunching on a PC or Amiga side before transferring to the C-64. Very fast and offers good results compared to native C-64 crunching.
- Sledgehammer — an example packer/cruncher that supports linking multiple files for packing.

Typical workflow:
1. Prepare files/binary to be transferred to the C-64.
2. Crunch on a fast host (PuCrunch) or on C-64 with REU-enabled cruncher.
3. Transfer packed file(s) to target medium (disk/tape) and use a tiny runtime unpacker on the C-64.

## Linking packed files vs packing memory areas
Two common approaches to what you pack:
- Link/pack individual files: Some packers let you specify multiple input files and link them into a single packed image. Convenient for packaging distinct modules.
- Save and pack a whole memory area: Instead of selecting files, save the actual memory region you use (RAM image) and pack that. This can be preferable if your program relies on a specific runtime layout or contains many small fragments scattered across memory.

Which to use is a matter of taste and build system constraints:
- Linking files can be cleaner for modular builds.
- Packing a single memory area avoids errors when the runtime memory layout differs from the file layout.

## Caveats
- Packing/crunching can expose uninitialized-memory bugs; code that worked before packing may fail when packed because the compressor reorders or removes previously incidental (but required) memory contents. See the referenced writeup for examples.
- Test thoroughly after packing; verify zeroed/initialized regions and all runtime assumptions.

## References
- "everything_works_until_i_pack_it" — discussion of how packing can expose uninitialized memory bugs and related debugging tips