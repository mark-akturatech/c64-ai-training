# Kick Assembler — Getting Started (Chapter 2)

**Summary:** Kick Assembler runs on any platform with Java 8 (Java 1.8.0) or higher; basic command-line usage is `java -jar kickass.jar myCode.asm`. Verify Java availability with `java -version` and ensure Java is on your PATH (Windows may require manually adding it).

## Running the Assembler
Kick Assembler requires Java 8.0 or higher. To assemble a source file (for example myCode.asm) run the assembler from a command prompt or terminal with the Java runtime on your PATH:

- Primary assemble command: java -jar kickass.jar myCode.asm
- If the java executable is not found (common on some Windows installs), add Java's bin directory to your PATH environment variable.
- Test Java installation: java -version — Java prints its version when available.

Java download: http://java.com/en/download/index.jsp

## Source Code
```text
# Assemble a file
java -jar kickass.jar myCode.asm

# Test Java installation
java -version
```

## References
- "getting_started_example_interrupt" — expands on a practical interrupt example demonstrating assembler features  
- "getting_started_configuring_assembler" — expands on configuring default options via KickAss.cfg