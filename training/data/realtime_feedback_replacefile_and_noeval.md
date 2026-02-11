# Kick Assembler — asminfo sections and realtime editor options

**Summary:** Explains Kick Assembler realtime editor options (`replaceFile`, `-noeval`) and the asminfo file section formats: `[version]`, `[libraries]`, `[directives]`, `[ppdirectives]`, and `[files]`. Includes example entries and command-line usage.

**Realtime editor options**

- **replaceFile**: Substitute an unsaved/temporary file for an original filename when invoking Kick Assembler from an editor. Usage replaces paths so diagnostics and output reference the original filename while assembly uses the temporary file contents.

- **-noeval**: Run parsing and an initial pass without evaluation (quick syntax check). This parses and checks without performing full evaluation or overwriting outputs.

Command-line example:


**asminfo file sections (formats)**

- **[version]**: Single-line version number.

- **[libraries]**: One entry per line, format `libraryname;entrytype;typedata`. `entrytype` is `function` or `constant`. For functions, `typedata` is `functionname;numberOfArguments`. For constants, `typedata` is `constantname`.

- **[directives]**: Lines of `directive;example;description`.

- **[ppdirectives]**: Preprocessor directives, same format `directive;example;description`.

- **[files]**: The file list section contains the involved files. The fields are `index;filepath`. Important: The file path might contain semicolons.

## Source Code

```text
java -jar KickAss.jar mysource.asm -replacefile original temp
java -jar KickAss.jar mysource.asm -noeval
```


```text
# asminfo examples

[version]
5.12

[libraries]
Math;constant;PI
Math;constant;E
Math;function;abs;1
Math;function;acos;1

[directives]
.text;.text "hello";Dumps text bytes to memory.

[ppdirectives]
#define;#define DEBUG;Defines a preprocessor symbol.

[files]
0;KickAss.jar:/include/autoinclude.asm
1;test1.asm
```

## References

- [Kick Assembler Manual: Assemble Information](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_AsmInfo.html)