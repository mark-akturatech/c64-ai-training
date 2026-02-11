# Wedge install via SYS 862 (ampersand command)

**Summary:** Demonstrates installing a BASIC "wedge" on VIC and Commodore 64 by running a small BASIC program that uses an unsupported '&' command; use SYS 862 to install the wedge so '&' prints ten asterisks. Before SYS 862 the '&' token produces a SYNTAX ERROR; after SYS 862 it prints ten asterisks each invocation.

## Procedure
1. Enter the given BASIC program into the machine (VIC or Commodore 64 only).
2. If you RUN the program before installing the wedge, the interpreter will raise a SYNTAX ERROR because '&' is not yet implemented.
3. Execute the machine code install routine with the command SYS 862 to enable the wedge (this installs the ampersand command handler).
4. RUN the BASIC program again. Each occurrence of the standalone '&' command will now print ten asterisks.
5. Note: modifying/infiltrating BASIC is delicate — proceed carefully.

## Source Code
```basic
100 PRINT 34:&:PRINT 5+6
110 &
120 PRINT "THAT'S ALL"
```

Example interactive steps:
```basic
NEW               : REM create the program above
RUN               : REM -> SYNTAX ERROR (ampersand not implemented)
SYS 862           : REM install wedge that implements '&'
RUN               : REM now '&' prints ********** each time it runs
```

## References
- "ampersand_wedge_command_installation" — expands on SYS 862 installs wedge and implementation details