# Kick Assembler - IParameterMap (name -> IValue parameter map)

**Summary:** Kick Assembler IParameterMap is an interface mapping parameter names to IValue objects (used for source-code parameters in square brackets). Contains query methods (exists, getValue, getParameterNames), source-location lookup (getSourceRange returns an ISourceRange), and convenience getters such as getBoolValue, getEnumValue, getIntValue, getStringValue; example assembly uses mnemonics INC/JMP and address $D020.

## Description
IParameterMap is a read-only name -> IValue collection intended to represent parameters supplied in source-code (typically in square-bracket parameter lists). Use it to check for and retrieve parameter values and to locate where a parameter was written in the source.

Main methods and behavior (names provided by source):
- exists(String name)  
  - Check whether a parameter with the given name is present.
- IValue getValue(String name)  
  - Return the IValue associated with name (use exists() first). Implementation may return null if absent.
- ISourceRange getSourceRange(String name)  
  - Return an ISourceRange describing the source location (start/end offsets or token range) where the parameter was specified. See "isourcerange_interface" for ISourceRange details.
- Collection<String> getParameterNames()  
  - Return the collection of parameter names present in the map.

Convenience getters (shorthand accessors that convert/unwrap IValue):
- getBoolValue(String name, boolean defaultValue)  
- getEnumValue(String name, Class<T> enumType, T defaultValue)  (signature implied)  
- getIntValue(String name, int defaultValue)  
- getStringValue(String name, String defaultValue)

These convenience getters return the parameter converted to the requested Java type when present and convertible; otherwise they return the supplied default. For exact semantics of conversion and IValue representations, see "ivalue_interface_methods_and_representations".

Notes:
- The interface is oriented toward compile-time/source-processing use (parameter parsing, macros, conditional assembly).
- Use getSourceRange(name) to map parameter uses back to source tokens for diagnostics, highlighting, or error messages.

## Source Code
```asm
; example usage fragment (assembly stored as reference)
        inc $d020
        jmp main
```

## Key Registers
- $D020 - VIC-II - Border color register (example assembly increments $D020)

## References
- "isourcerange_interface" — expands on the ISourceRange returned by getSourceRange
- "ivalue_interface_methods_and_representations" — expands on IValue representations and conversion behavior