# Kick Assembler — String Values (Table 4.3)

**Summary:** Lists Kick Assembler string functions and the string concatenation operator: + (append), asBoolean(), asNumber(), asNumber(radix) for parsing with a specified base, charAt(n), size(), substring(i1,i2) (end exclusive), toLowerCase(), and toUpperCase().

## Functions and operators
- +  
  Appends two strings (concatenation).

- asBoolean()  
  Converts the string to a boolean value. Example usage: "true".asBoolean().

- asNumber()  
  Converts the string to a numeric value. Example usage: "35".asNumber().

- asNumber(radix)  
  Converts the string to a numeric value using the specified radix (e.g., 16 for hexadecimal, 2 for binary). Example: "f".asNumber(16) returns 15.

- charAt(n)  
  Returns the character at position n.

- size()  
  Returns the number of characters in the string.

- substring(i1,i2)  
  Returns the substring beginning at i1 and ending at i2 (character at i2 not included).

- toLowerCase()  
  Returns the lowercase version of the string.

- toUpperCase()  
  Returns the uppercase version of the string.

## Source Code
```text
Table 4.3. String Values
Function/Operator    Description

+                    Appends two strings.

asBoolean()          Converts the string to a boolean value (eg,
                     “true”.asBoolean()).

asNumber()           Converts the string to a number value. Ex, “35”.asNumber().

asNumber(radix)      Converts the string to a number value with the
                     given radix (16=hexadecimal, 2=binary etc.). Ex,
                     “f”.asNumber(16) will return 15.

charAt(n)            Returns the character at position n.

size()               Returns the number of characters in the string.

substring(i1,i2)     Returns the substring beginning at i1 and ending at i2
                     (char at i2 not included).

toLowerCase()        Return the lower version of the string.

toUpperCase()        Return the uppercase version of the string.
```

## References
- "string_concatenation_printing_and_examples" — expands on using these methods when assembling and printing values  
- "generic_stringification_string_function" — expands on using .string() to obtain a string representation before calling methods like charAt  
- "numeric_to_string_functions" — expands on functions to convert numeric values into formatted strings for concatenation/printing