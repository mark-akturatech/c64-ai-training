# Kick Assembler — Plugin Registration and IEngine Interface

**Summary:** This document provides instructions on registering Java plugin classes with Kick Assembler using the `.plugin` directive and the `KickAss.plugin` file. It also details the `IEngine` interface methods and the `ISourceRange` interface.

**Registering Plugins**

To use Java plugins in Kick Assembler, ensure your compiled Java plugin class is accessible on the Java classpath. There are two methods to inform Kick Assembler about a plugin:

- **Project-Specific Registration:** Use the `.plugin` directive within your assembly project to load a specific plugin class for that project.

  Example directive:


- **Global Registration:** Add the fully qualified class names to the `KickAss.plugin` file, making the plugin available globally to Kick Assembler. This file should be located in the same directory as `KickAss.jar`.

  Example `KickAss.plugin` file contents:


  Lines starting with `//` are treated as comments.

**The IEngine Interface**

The `IEngine` interface facilitates communication between your plugin and Kick Assembler. It provides methods to report errors, print messages, create output streams, and more.

Complete list of `IEngine` methods:

- `void addError(String message, ISourceRange range);`
  - Adds an error to the engine's error list but continues execution, allowing multiple errors to be reported from a plugin. The `ISourceRange` parameter specifies the source code location of the error.

- `byte charToByte(char c);`
  - Converts a Java `char` to a PETSCII byte, applying uppercase conversion.

- `IMemoryBlock createMemoryBlock(String name, int startAddr, byte[] bytes);`
  - Creates a memory block, used as a result in some plugins.

- `void error(String message);`
  - Prints an error message and stops execution, similar to the `.error` directive. This method throws an `AsmException` that must be propagated through any try-catch blocks in your code.

- `void error(String message, ISourceRange range);`
  - Similar to `error(String message)`, but with a specified position in the code (`ISourceRange`).

- `File getCurrentDirectory();`
  - Retrieves the current directory.

- `File getFile(String filename);`
  - Opens a file with the given filename. The assembler searches for the file as it would for a source code file, including library directories. Returns `null` if the file can't be found.

- `String normalizeFileName(String name);`
  - Evaluates parameters in a filename string. For example, if a filename for a disk is given as `%o.d64` and assembled from `MyDemo.asm`, `%o` is replaced, and `MyDemo.d64` is returned.

- `OutputStream openOutputStream(String name) throws Exception;`
  - Creates an output stream for writing files, such as a disk file for a disk writer.

- `void print(String message);`
  - Prints a message to the screen, similar to the `.print` directive.

- `void printNow(String message);`
  - Prints a message to the screen immediately, similar to the `.printnow` directive.

- `byte[] stringToBytes(String str);`
  - Converts a string to PETSCII bytes, applying uppercase conversion.

**The ISourceRange Interface**

The `ISourceRange` interface represents a span of source code, typically used to specify the location of errors or other significant points in the code. It includes methods to retrieve the start and end positions of the range.

**Making the Compiled Java Class Visible on the Java Classpath**

To ensure your compiled Java plugin class is accessible to Kick Assembler, it must be included in the Java classpath. This can be achieved in two ways:

1. **Using the Command Line:**

   When running Kick Assembler from the command line, use the `-cp` (classpath) option to include your plugin's directory or JAR file. For example:


   Replace `path/to/KickAss.jar` with the actual path to `KickAss.jar`, and `path/to/your/plugin/directory` with the path to your compiled plugin classes.

2. **Setting the CLASSPATH Environment Variable:**

   Alternatively, set the `CLASSPATH` environment variable to include your plugin's directory or JAR file. On Unix-like systems:


   On Windows:


   After setting the `CLASSPATH`, you can run Kick Assembler without specifying the classpath on the command line:


**Test Project for Plugins**

To facilitate plugin development and testing, Kick Assembler provides a test project. Follow these steps to set it up:

1. **Download the Test Project:**

   Obtain the plugin development test Eclipse project from the Kick Assembler website.

2. **Set Up the Project:**

   - Create an Eclipse workspace.
   - Import the downloaded project:
     - Go to `File` > `Import` > `Existing Projects into Workspace`.
     - Select the downloaded archive file.
   - Replace the `KickAss.jar` file in the `jars` folder with the latest version, if necessary.

3. **Explore and Run Examples:**

   - In the `src` folder, examine examples of how plugins are implemented.
   - The `PluginTest` files demonstrate how to use the plugins.
   - Launch files for running the examples are located in the `launch` folder. Right-click on a launch file and select `Run As` to execute it.

By following these steps, you can develop and test your plugins effectively within the provided framework.

## Source Code

  ```text
  .plugin "test.plugins.macros.MyMacro"
  ```

  ```text
  // My macro plugins
  test.plugins.macros.MyMacro1
  test.plugins.macros.MyMacro2
  test.plugins.macros.MyMacro3
  ```

   ```sh
   java -cp "path/to/KickAss.jar:path/to/your/plugin/directory" kickass.KickAssembler yourAssemblyFile.asm
   ```

   ```sh
   export CLASSPATH="path/to/KickAss.jar:path/to/your/plugin/directory"
   ```

   ```cmd
   set CLASSPATH=path\to\KickAss.jar;path\to\your\plugin\directory
   ```

   ```sh
   java kickass.KickAssembler yourAssemblyFile.asm
   ```


## References

- [Kick Assembler Manual: 3rd Party Java Plugins](https://theweb.dk/KickAssembler/webhelp/content/cpt_Plugins.html)
- [Kick Assembler Manual: General Communication Interfaces](https://theweb.dk/KickAssembler/webhelp/content/ch17s04.html)
- [Kick Assembler Manual: Configuring the Assembler](https://www.theweb.dk/KickAssembler/webhelp/content/ch02s03.html)