# Kick Assembler — AutoIncludeFile plugins and selected command-line flags

**Summary:** Describes Kick Assembler's AutoIncludeFile plugin mechanism (AutoIncludeFile entries bundled in JARs; interfaces IAutoIncludeFile and AutoIncludeFileDefinition with getDefinition and openStream) and documents command-line flags: -binfile, -bytedump / -bytebump, -bytedumpfile / -bytebumpfile, -cfgfile, -debug, -debugdump.

## AutoIncludeFile plugin
AutoIncludeFile lets you bundle assembler source (macros, include files) inside an archive (JAR) and have Kick Assembler automatically include them at assembly time. Typical arrangement:
- Place the source file inside the JAR at a resource path (for example "/include/MyAutoInclude.asm").
- Add an AutoIncludeFile entry to the archive that supplies:
  - jar-name (the archive filename),
  - a Class reference used to open the resource (used as a Class#getResourceAsStream base),
  - the resource path (absolute path inside the JAR).

The assembler will open the archive/resource via the provided class reference and read the source text as if it were an external include. This is commonly used to bundle reusable macros or utility includes inside plugin JARs.

## IAutoIncludeFile and AutoIncludeFileDefinition
The AutoIncludeFile provider implements the IAutoIncludeFile interface. The interface exposes two operations:
- getDefinition() — returns an AutoIncludeFileDefinition describing the include (filePath and jarName).
- openStream() — opens and returns an InputStream to the embedded resource.

AutoIncludeFileDefinition contains at least:
- filePath — resource path inside the JAR (e.g. "/include/MyAutoInclude.asm"),
- jarName — archive filename or identifier.

(These fields are the minimal metadata required by the assembler to locate and open the bundled include.)

## Command-line flags
- -binfile  
  Sets the output to be a .bin file instead of a .prg file. A .bin omits the two-byte load/start address header present in .prg files.

- -bytedump  
  Dumps the assembled bytes in ByteDump.txt together with the assembly source that generated them.

- -bytebump  
  (Listed alongside -bytedump in source.) Also present in documentation; behavior presented in source groups it with byte-dump output.

- -bytedumpfile / -bytebumpfile <file>  
  Same as -bytedump but allows specifying the output filename. Example: -bytebumpfile myfile.txt

- -cfgfile <path>  
  Use an additional configuration file (like KickAss.cfg). Supply the file as an absolute path or a path relative to the source file. Multiple -cfgfile entries are allowed. Example: -cfgfile "../../MyConfig.Cfg"

- -debug  
  For development use. Adds additional debug information (stack traces and extra diagnostics) to the output.

- -debugdump  
  Listed in source with no description. **[Note: Source provides no description for -debugdump.]**

## Source Code
```asm
; Example macro placed inside JAR resource /include/MyAutoInclude.asm
.macro SetColor(color) {
    ; ... macro body ...
}
```

```java
// Interface sketch from source (names and methods preserved)
public interface IAutoIncludeFile {
    AutoIncludeFileDefinition getDefinition();
    java.io.InputStream openStream();
}
```

```java
// AutoIncludeFileDefinition (fields noted in source)
public class AutoIncludeFileDefinition {
    public final String filePath; // e.g. "/include/MyAutoInclude.asm"
    public final String jarName;  // archive name
    // constructors/getters as appropriate
}
```

```text
; Example AutoIncludeFile entry usage noted in documentation:
AutoIncludeFile("MyArchive.jar", getClass(), "/include/MyAutoInclude.asm")
```

```text
; Example flag usages
-binfile
-bytedump
-bytedumpfile myfile.txt
-cfgfile "../../MyConfig.Cfg"
-debug
-debugdump
```

## References
- "archive_plugins_interface" — expands on how AutoIncludeFile entries are added to archives and the plugin interface details.