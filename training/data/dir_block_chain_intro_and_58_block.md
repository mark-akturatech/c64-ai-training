# DIR forward-chain hex/ASCII dump — start (block '58:' at line 4628)

**Summary:** Hex/ASCII dump of the beginning of a continued directory (DIR) forward-chain, showing the preamble bytes and the first visible DOS block header '58:' (line 4628). Illustrates forward pointers and embedded C64 BASIC/tokenized data, which render much of the block contents non-human-readable.

**Description**

This chunk presents the start of a continued directory (DIR) forward-chain hex/ASCII dump. It includes preamble bytes and the first visible block header labeled "58:" (reported at line 4628 in the original dump). The bytes and ASCII fragments below exhibit the typical mixture of structural DOS block data (forward pointers, headers) and embedded tokenized C64 BASIC/PETSCII fragments, which are not directly readable as plain ASCII text.

Key observations:

- A small preamble of bytes (`04 28 ...`) appears before the visible '58:' block header.
- The visible block header "58:" marks the start of a DOS block in this dump; the bytes and ASCII text immediately following demonstrate the pattern of forward pointers and tokenized BASIC mixed in the block payload.
- ASCII fragments include punctuation and partial words (e.g., "*,B*. X.", "Al", ". ,#1, A*,"), typical of PETSCII/tokenized BASIC fragments appearing in a hex/ASCII dump.
- The dump is truncated here — further chained blocks continue the DIR block chain (see References).

This entry preserves the original raw lines exactly in the Source Code section for retrieval and possible decoding. No register addresses apply to this chunk.

## Source Code

```text
04 28 2A 2C 42 2A 2E 20 58 2E 20 28 50 3A 20 00 41 6C 23 31 2C 41 24 2C 2E 20 2C 23 31 2C 20 41 2A 2C 35 38 3A 20 2E 20 42 24 00 60
```

**Decoded PETSCII/Tokenized BASIC Translation**

The hex dump contains PETSCII characters and tokenized BASIC code. Below is the translation of the PETSCII characters:

- `2A` (`*`)
- `2C` (`,`)
- `42` (`B`)
- `2A` (`*`)
- `2E` (`.`)
- `20` (space)
- `58` (`X`)
- `2E` (`.`)
- `20` (space)
- `28` (`(`)
- `50` (`P`)
- `3A` (`:`)
- `20` (space)
- `00` (null terminator)
- `41` (`A`)
- `6C` (`l`)
- `23` (`#`)
- `31` (`1`)
- `2C` (`,`)
- `41` (`A`)
- `24` (`$`)
- `2C` (`,`)
- `2E` (`.`)
- `20` (space)
- `2C` (`,`)
- `23` (`#`)
- `31` (`1`)
- `2C` (`,`)
- `20` (space)
- `41` (`A`)
- `2A` (`*`)
- `2C` (`,`)
- `35` (`5`)
- `38` (`8`)
- `3A` (`:`)
- `20` (space)
- `2E` (`.`)
- `20` (space)
- `42` (`B`)
- `24` (`$`)
- `00` (null terminator)
- `60` (backtick)

**Full DOS Block Header Field Breakdown**

The DOS block header contains several fields:

- **Forward Pointer:** The first two bytes (`04 28`) represent the track and sector of the next block in the chain. In this case, `04` (track 4) and `28` (sector 40).
- **Block Type Byte:** The third byte (`2A`) indicates the type of block. The value `2A` corresponds to a directory block.
- **File Entries:** The subsequent bytes contain file entries, each consisting of:
  - **File Type:** One byte indicating the file type.
  - **Track/Sector Pointer:** Two bytes pointing to the first data block of the file.
  - **File Name:** 16 bytes for the file name, padded with spaces if necessary.
  - **Other Metadata:** Additional bytes for file size, etc.

## References

- "dir_block_chain_dump_b2_block" — expands on the next chained block in the dump (continues the DIR block chain)
- "dir_block_chain_and_additional_blocks_dump" — expands on the original larger dump this sequence continues from