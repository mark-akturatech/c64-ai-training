# Kick Assembler — Disk-writer plugins and example export

**Summary:** Describes Kick Assembler plugin invocation (.plugin, .disk MyDiskWriter) for custom disk writers and provides an assembly export example that writes to the VIC-II via $D018. Includes example parameters like segments="Code,Data" and prgFiles="data/music.prg".

**Import and Export**

Kick Assembler supports third-party disk-writer plugins. Load a plugin class with `.plugin "myplugins.Mydiskwriter"` and invoke a disk writer with `.disk MyDiskWriter` followed by disk-level parameters and a brace-enclosed list of file entries with per-file parameters (e.g., segments, prgFiles). Example parameter forms shown in the source: `segments="Code,Data"` and `prgFiles="data/music.prg"`. The source contains the minimal syntax and an assembly export example that emits a BASIC starter and a small program.

## Source Code

```text
.plugin "myplugins.Mydiskwriter"
.disk MyDiskWriter [.. disk params..] {
    [ ..file params.., segments="Code,Data"],
    [ ..file params.., prgFiles="data/music.prg"]
}
```

```asm
*=$0801 "Basic Program"
BasicUpstart($0810)
*=$0810 "Program"
lda #$38
sta $d018
lda #$d8
sta $d020
```

## Key Registers

- **$D018**: VIC-II Memory Control Register
  - **Bits 4-7**: Screen memory location (multiplied by 1024 and added to the base address of the current VIC bank).
  - **Bits 1-3**: Character memory location (multiplied by 2048 and added to the base address of the current VIC bank).
  - **Bit 0**: Unused.

## References

- "3rd_party_java_plugins_intro" — expands on plugins chapter; covers plugin creation and details.