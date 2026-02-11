# ca65 --no-utf8 option

**Summary:** The `--no-utf8` option for ca65 disables UTF-8 characters in diagnostic messages. Use when auto-detection fails or when output will be consumed by tools that are not UTF-8 capable.

## Description
`--no-utf8`  
Disable the use of UTF-8 characters in diagnostics. This may be necessary if automatic UTF-8 detection fails or if diagnostic output is captured and processed by a tool that cannot handle UTF-8 text.

## References
- "color_output" — expands on other diagnostics output formatting options
