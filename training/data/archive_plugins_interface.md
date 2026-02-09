# Kick Assembler: Archive plugins (IArchive), .plugin registration, asminfo flags, overlapping memory blocks

**Summary:** Describes the IArchive plugin API (IArchive extends IPlugin with List<IPlugin> getPluginObjects()), how to register an archive with the .plugin directive, the option to allow overlapping memory blocks (warning instead of error), and asminfo export flags (-asminfo, -asminfo all, -asminfofile, -asminfotostdout / -asminfoToStdOut). Includes code examples showing returning multiple plugin instances from an archive.

## Archive plugin API
IArchive is an extension of IPlugin that lets one bundle multiple plugin objects in a single archive class. Implementors must provide a method returning the plugin instances contained in the archive:

- API contract: IArchive extends IPlugin
- Required method: List<IPlugin> getPluginObjects()
- Typical usage: return a list of plugin instances (macros, modifiers, AutoIncludeFile objects, etc.)
- AutoIncludeFile objects can be provided from archives (see referenced "auto_include_file_plugins" for details).

Example semantics: the assembler calls getPluginObjects() on the archive class, then registers each returned IPlugin instance as if they were provided individually.

## Registering an archive
Register an archive class with the .plugin directive using the fully-qualified class name. The assembler will instantiate the archive, call getPluginObjects(), and register each returned plugin object.

Example registration directive:
.plugin "test.plugins.archives.MyArchive"

## Allow overlapping memory blocks
An assembler option (unnamed in this excerpt) can be enabled so that overlapping MEMORY blocks produce a warning instead of an error. Behavior:
- Default: overlapping MEMORY blocks trigger an error (assembler abort).
- With this option: overlapping MEMORY definitions will emit a warning and continue assembly.

(No flag name was included in the source excerpt.)

## Asminfo export options
Flags to control exporting of assemble info (asminfo):

- -asminfo
  - Turns on exporting of assemble info (basic enable).
- -asminfo all
  - Enable asminfo with maximum/more detailed output (all sections).
- -asminfofile
  - Specify output filename for asminfo; usage requires a following filename argument.
- -asminfofile myAsmInfo.txt
  - Example: writes asminfo to myAsmInfo.txt.
- -asminfotostdout / -asminfoToStdOut
  - Direct asminfo output to stdout instead of a file. Parameter names are case-insensitive (both forms accepted).
- -binfile
  - [Note: source excerpt truncated; description for -binfile not present.]

## Source Code
```java
// Java example: archive plugin returning multiple plugin objects
package test.plugins.archives;

import java.util.Arrays;
import java.util.List;

public class MyArchive implements IArchive {
    @Override
    public List<IPlugin> getPluginObjects() {
        return Arrays.asList(
            new MyMacro(),     // example plugin: macro
            new MyModifier()   // example plugin: modifier
        );
    }

    // IPlugin methods would be implemented here as required by IArchive
}
```

```text
; Kick Assembler registration example (assembler source)
.plugin "test.plugins.archives.MyArchive"
```

```text
; Assembler command-line examples
; enable asminfo (default output file)
-asminfo

; enable detailed asminfo
-asminfo all

; write asminfo to specific file
-asminfofile myAsmInfo.txt

; direct asminfo to stdout (case-insensitive flag)
-asminfotostdout
-asminfoToStdOut
```

## References
- "auto_include_file_plugins" — expands on AutoIncludeFile objects being includable in archives
- "plugins_overview" — expands on plugin registration via .plugin