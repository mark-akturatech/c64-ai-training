# Kick Assembler: syntax-section format and 3rd-party Java plugins

**Summary:** Kick Assembler syntax-section format uses a compact "type;sourcerange" encoding (example: operator;21,20,21,20,0) where sourcerange is startLine,startPos,endLine,endPos,fileIndex. Also lists the six supported 3rd-party Java plugin types: Macro, Modify, SegmentModifier, Archive, AutoIncludeFile, and DiskWriter plugins.

## Syntax section format
Format: type;sourcerange — a semicolon-separated entry where the first field is a token/type and the second is a comma-separated sourcerange. Example from source:
- operator;21,20,21,20,0

The sourcerange consists of 5 comma-separated integer fields:
- Field 1: startLine — the line number where the token begins
- Field 2: startPosition — the character position on the start line
- Field 3: endLine — the line number where the token ends
- Field 4: endPosition — the character position on the end line
- Field 5: fileIndex — index into the asminfo files section identifying the source file

The source notes future plans to add more fields (for example: where a label is defined when the entry is a label reference).

## 3rd Party Java plugins
It's possible to write your own plugins for Kick Assembler. The following types of plugins are supported:
- **Macro Plugins** — custom macro implementations invoked with `.plugin` and called like regular macros
- **Modify Plugins** — byte-stream modifiers used with the `.filemodify` directive to post-process output
- **SegmentModifier Plugins** — modify output at the segment level rather than the whole file
- **Archive Plugins** — bundle multiple plugin objects (macros, modifiers, etc.) in a single class via `IArchive`
- **AutoIncludeFile Plugins** — automatically include files during assembly without explicit `.import`
- **DiskWriter Plugins** — custom disk-image writers (e.g. for `.disk` D64 output)

All plugins are registered using the `.plugin` directive with a fully-qualified Java class name, and receive `arguments` and `engine` parameters for communicating with the assembler.

## Source Code
```text
type;sourcerange, e.g., operator;21,20,21,20,0
sourcerange fields: startLine, startPosition, endLine, endPosition, fileIndex

.plugin "test.plugins.macros.MyMacro"
MyMacro()
```

## References
- "3rd_party_java_plugins_intro" — full list of plugin types with communication parameters
- "archive_plugins_interface" — IArchive plugin API, registration, and asminfo export flags
