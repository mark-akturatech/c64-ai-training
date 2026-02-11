# Kick Assembler — Chapter 16: Testing (.assert) and Plugin Setup

**Summary:** Describes Kick Assembler's `.assert` directives, which count assertions and failed assertions, reporting results at the end of assembly. Provides steps to set up Kick Assembler inside an Eclipse workspace, including replacing `KickAss.jar` and inspecting example plugins. Details the process for registering plugins, including classpath requirements and how Kick Assembler discovers and loads plugins.

**.assert Testing in Kick Assembler**

Kick Assembler provides `.assert` directives useful for testing assembler features, macros, pseudo-commands, and functions. When you assemble a source that contains `.assert` directives, the assembler:

- Evaluates each `.assert`
- Counts total assertions and failed assertions
- Reports the counts (and failures) at the end of the assembly run

### Asserting Expressions

The `.assert` directive tests the value of expressions. It takes three arguments: a description, an expression, and an expected result. For example:


When assembling this code, the assembler prints the description, the result of the expression, and the expected result. If these don’t match, an error message is appended:


### Asserting Errors in Expressions

To ensure that an expression produces an error when given incorrect parameters, use the `.asserterror` directive:


In the above example, `Test1` will fail since it's legal to divide 20 by 10. `Test2` will produce the expected error, so this assertion is okay. The output will be:


### Asserting Code

The `.assert` directive can also compare pieces of assembled code:


The assembler will output whether the assertions passed or failed, along with the assembled result:


### Asserting Errors in Code

Similarly, the `.asserterror` directive can assert that a block of code produces an error:


Output:


**Setting Up Kick Assembler in Eclipse**

To use Kick Assembler with the supplied Eclipse project:

1. Create an Eclipse workspace.
2. Import the provided project archive: `Import -> Existing Projects into Workspace -> Select archive file`.
3. If necessary, replace the `KickAss.jar` file inside the project's `jars` folder with the newest `KickAss.jar` release.
4. Open the `src` folder to view example plugin code. The `PluginTest` folder contains examples showing how plugins are made.
5. In the `launch` folder, there are launch configurations for running the examples (`Right‑click -> Run As`).

These steps prepare the Eclipse project and let you run the example plugins included in the archive.

**Registering Your Plugins**

To work with plugins in Kick Assembler, follow these steps:

1. **Ensure the Compiled Java Class is Accessible:**
   - **Eclipse Users:** If you're using Eclipse to run Kick Assembler, the compiled Java class should be accessible from the Java classpath by default.
   - **Command Line Users:** If you're using the command line, set the classpath environment variable or use the `-classpath` option of the `java` command to include the directory containing your compiled Java class.

2. **Inform Kick Assembler About Your Plugin:**
   - **Project-Specific Plugins:** If your plugin is only used in one of your projects, use the `.plugin` directive in your assembly source code to register it. For example:
   - **Global Plugins:** If the plugin should be available every time you use Kick Assembler, add the class name to a line in the `KickAss.plugin` file, which should be placed in the same location as the `KickAss.jar` file. Lines starting with `//` are treated as comments. Example `KickAss.plugin` file:

By following these steps, you can ensure that your plugins are properly registered and accessible to Kick Assembler during assembly.

## Source Code

```assembly
.assert "2+5*10/2", 2+5*10/2, 27
.assert "2+2", 2+2, 5
.assert "Vector(1,2,3)+Vector(1,1,1)", Vector(1,2,3)+Vector(1,1,1), Vector(2,3,4)
```

```
2+5*10/2=27.0 (27.0)
2+2=4.0 (5.0) – ERROR IN ASSERTION!!!
Vector(1,2,3)+Vector(1,1,1)=(2.0,3.0,4.0) ((2.0,3.0,4.0))
```

```assembly
.asserterror "Test1", 20/10
.asserterror "Test2", 20/false
```

```
Test1 – ERROR IN ASSERTION!
Test2 – OK. | Can't get a numeric representation from a value of type boolean
```

```assembly
.assert "Test1", { lda $1000 }, { ldx $1000 }

.assert "Test2", {
    .for (var i=0; i<4; i++)
        sta $0400+i
}, {
    sta $0400
    sta $0401
    sta $0402
    sta $0403
}
```

```
Test1 – FAILED! | 2000:ad,00,10  -- 2000:ae,00,10
Test2 – OK. | 2000:8d,00,04,8d,01,04,8d,02,04,8d,03,04
```

```assembly
.asserterror "Test", { lda #"This must fail" }
```

```
Test – OK. | The value of a Command Argument Value must be an integer. Can't get an integer from a value of type 'string'
```

     ```assembly
     .plugin "test.plugins.macros.MyMacro"
     ```

     ```
     // My macro plugins
     test.plugins.macros.MyMacro1
     test.plugins.macros.MyMacro2
     test.plugins.macros.MyMacro3
     ```


## References

- [Kick Assembler Manual: Chapter 16. Testing](https://theweb.dk/KickAssembler/webhelp/content/cpt_Testing.html)
- [Kick Assembler Manual: Chapter 17. 3rd Party Java Plugins](https://theweb.dk/KickAssembler/KickAssembler.pdf)