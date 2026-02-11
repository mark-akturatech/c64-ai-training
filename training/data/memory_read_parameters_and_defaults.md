# M-R memory-read command parameters (Commodore BASIC)

**Summary:** Describes the parameters of the M-R memory-read command: file# (logical command-channel number), lo-byte and hi-byte (low/high bytes of the memory address), and number-of-bytes (1–255). Notes the undocumented, optional CHR$(# of bytes) parameter which defaults to CHR$(1).

**Parameters**
- **file#** — the logical file number of the command channel used for the memory-read.
- **lo-byte** — low byte of the target memory address.
- **hi-byte** — high byte of the target memory address.
- **# of bytes** — number of bytes to read; valid range 1 to 255.

**Undocumented CHR$ parameter**
- The command accepts an undocumented, optional CHR$(# of bytes) parameter. Its use is always optional and, if omitted, defaults to CHR$(1) (i.e., 1 byte).
- The source text states "the third parameter of the memory-read command, CHR$(# of bytes)"; this contradicts the explicit parameter list above (which shows four parameters). **[Note: Source may contain an error — CHR$ is described as the third parameter while the parameter list implies it is an additional/optional parameter after the numeric byte count.]**

## References
- "memory_read_overview_and_syntax" — expands on syntax and example M-R command usage  
- "buffer_selection_and_direct_access_open" — describes why buffer selection matters when issuing a memory-read after a block-read