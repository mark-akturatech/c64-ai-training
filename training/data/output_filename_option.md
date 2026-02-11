# ca65: -o name (set output file name)

**Summary:** ca65 option -o sets the output file name/path (default: input filename with extension replaced by .o). Searchable terms: -o, output file, .o, ca65, create_dep_files.

## Description
-o name

The default output name is the input file's name with its extension replaced by ".o", placed in the same directory as the source file. If you supply -o, the supplied name (including any path) is used as the full output path/name instead of the default location.

(See create_dep_files for where dependency files are written relative to the output.)

## References
- "create_dep_files" — expands on where dependency files are written relative to the output file name/path
