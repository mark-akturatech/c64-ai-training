# ca65 Users Guide — Search paths for include files

**Summary:** Order of ca65 include-file search paths for normal includes and binary include files; mentions CA65_INC, CC65_HOME/asminc, -I, --bin-include-dir, current file directory, and an optionally compiled-in directory.

## Normal include files
Normal (text) include files are searched in this order:
1. The current file's directory.
2. Any directory added with the -I option on the command line.
3. The value of the environment variable CA65_INC, if defined.
4. A subdirectory named asminc of the directory defined in the environment variable CC65_HOME, if defined.
5. An optionally compiled-in directory.

## Binary include files
Binary include files are searched in this order:
1. The current file's directory.
2. Any directory added with the --bin-include-dir option on the command line.

## References
- "detailed_command_line_options" — expands on options that affect search paths (-I, --bin-include-dir)