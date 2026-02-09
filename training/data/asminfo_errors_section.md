# Kick Assembler: Error Format and Plugin Types

**Summary:** Describes Kick Assembler's structured error-report format (level;sourcerange;message) for editor integration and lists available plugin types (Macro, Modify, SegmentModifier, Archive, AutoIncludeFile, DiskWriter). Includes an example error line and brief test-project pointer.

## Error reporting format
Kick Assembler emits structured error lines intended for editors/IDEs using this general syntax:

level;sourcerange;message

- level — textual severity (e.g., Error, Warning, Info).
- sourcerange — a comma-separated numeric range (example: 41,2,41,7,1). Fields are (startLine,startColumn,endLine,endColumn,sourceId) (sourceId identifies the file or buffer).
- message — human-readable error text to display in the editor.

This structured form allows editors to parse severity, map the range to the source view, and show the associated message (for example, clicking the error jumps to the range).

**[Note: Source may contain an error — the example message contains “#defin”, likely truncated and intended to be “#define”.]**

## Plugin types
Kick Assembler supports multiple plugin interfaces; each plugin type implements a distinct role:

- Macro Plugins — Implements macros.
- Modify Plugins — Implements modifiers.
- SegmentModifier Plugins — Implements segment modifiers.
- Archive Plugins — Used to group multiple plugins in one unit.
- AutoIncludeFile Plugins — Used to include a source code file in an archive.
- DiskWriter Plugins — Used to write .d64 image disk writers.

## Test project
A plugin-development test project is provided for Eclipse. Download the Kick Assembler plugin development test Eclipse project from the Kick Assembler website or from the Kick Assembler distribution to use as a starting point for implementing and testing plugins.

## Source Code
```text
# Error format example (one line)
Error;41,2,41,7,1;Unknown preprocessor directive #defin.

# Pattern
level;sourcerange;message
# where sourcerange is startLine,startColumn,endLine,endColumn,sourceId
```