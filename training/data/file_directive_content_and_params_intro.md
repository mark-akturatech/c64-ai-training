# Kick Assembler .file / .disk directive (parameters and %o notation)

**Summary:** Describes Kick Assembler's .file directive behavior (uses an intermediate segment for content; name parameter mandatory, others optional) and the .disk directive parameter syntax including use of %o notation to insert the source filename. Shows example usage with filename/name/id parameters.

**Overview**
- The .file directive in Kick Assembler places file content into an intermediate segment, making its content placement flexible. The name parameter is mandatory; other parameters are optional.
- Extra parameters are specified as a comma-separated list (key="value").
- The same %o notation available in the .file directive (expands to the source filename) can be used in parameter values.
- The .disk directive accepts parameters such as filename, name, and id. The id appears in the top of the directory (directory header) when creating a disk image.

**File Directive Parameters**
The .file directive supports the following parameters:

| Parameter | Default | Example                 | Description                                                                                   |
|-----------|---------|-------------------------|-----------------------------------------------------------------------------------------------|
| name      |         | name="MyFile.prg"       | The name of the file. (%o will be replaced with the root filename.)                           |
| type      | "prg"   | type="bin"              | Sets the file type. Valid types are "prg" and "bin".                                          |
| mbfiles   | false   | mbfiles                 | If set to true, a file is created for each memory block.                                      |
| segments  |         | segments="Code,Data"    | Specifies which segments to include in the file.                                              |

**Example**
- Syntax style: .directive [param="value", other="value"] { ... }
- Example shown in source (creates a .d64 image named MyDisk.d64 with disk name and id shown in the directory header):

## Source Code
```text
.disk [filename="MyDisk.d64", name="THE DISK", id="2021!" ]
{
}
```

## References
- "file_directive_examples" — expands on example usage