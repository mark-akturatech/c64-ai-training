# ca65: --bin-include-dir

**Summary:** The ca65 option `--bin-include-dir dir` specifies a directory to search for binary include files. It can be provided multiple times to add multiple search directories; the current directory is always searched first.

**Description**

Use `--bin-include-dir dir` to register a directory that ca65 will search when resolving binary include files. This option can be supplied multiple times to specify more than one directory to search for binary includes. The current working directory is always searched before any directories added with `--bin-include-dir`.

**Search Paths**

ca65 searches for include files in the following order:

1. The current file's directory.
2. Any directory added with the `-I` or `--include-dir` option on the command line.
3. The value of the environment variable `CA65_INC` if it is defined.
4. A subdirectory named `asminc` of the directory defined in the environment variable `CC65_HOME`, if it is defined.
5. An optionally compiled-in directory.

Binary include files are searched in the following order:

1. The current file's directory.
2. Any directory added with the `--bin-include-dir` option on the command line.

([cc65.github.io](https://cc65.github.io/doc/ca65.html?utm_source=openai))

## References

- "include_dir" — expands on text include directory option and search path behavior