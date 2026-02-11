# Kick Assembler — .struct (User-defined structures, Chapter 6.1)

**Summary:** Defines Kick Assembler user-defined structures with the .struct directive and shows creating instances via .var and constructor-call syntax (e.g. Point(1,2)). Covers field access (dot notation), use of struct values in expressions, and struct introspection/manipulation functions: getStructName(), getNoOfFields(), getFieldNames(), get(index)/get(name), set(index,value)/set(name,value).

## Defining structures
Use the .struct directive to declare a named structure and its ordered fields:

- Syntax: .struct Name {field1,field2,...}
- Field order is the definition order and defines integer indices used by get(index)/set(index,...).
- You create an instance by calling the struct name like a function:
  - With arguments: Name(val1,val2,...) — initializes fields in order.
  - Without arguments: Name() — default constructor; fields are initially unset (or default values per language rules).

Do not duplicate field definitions; fields are referenced either by dot notation (instance.field) or by name/index via the struct API.

## Field access and usage in expressions
- Dot notation: instance.field (e.g. p1.x, p1.y).
- Struct values can be used like ordinary variables in expressions and addressing calculations. Example usage inside assembler expressions:
  - lda #0
  - ldy #p1.y
  - sta charset + (p1.x >> 3) * height, y

Accessing fields inside expressions is identical to regular variables.

## Introspection and manipulation API
Struct values expose functions for runtime introspection and manipulation:

- getStructName()
  - Returns the name of the structure (string).
- getNoOfFields()
  - Returns the number of defined fields (integer).
- getFieldNames()
  - Returns a list containing the field name strings (list value).
- get(index)
  - Returns the field value for the integer index (0-based).
- get(name)
  - Returns the field value for the field name (string).
- set(index, value)
  - Sets the field value by integer index.
- set(name, value)
  - Sets the field value by field name (string).

Typical uses:
- Generic copying between two structs of the same type by iterating indices 0..getNoOfFields()-1 and using get(i)/set(i,...).
- Printing or logging all field names and values by iterating getFieldNames() and calling get(name) or get(index).

## Source Code
```asm
; Define a simple point structure
.struct Point {x,y}

; Create a point with x=1 and y=2 and print fields
.var p1 = Point(1,2)
.print "p1.x=" + p1.x
.print "p1.y=" + p1.y

; Create a point with default constructor and modify its fields
.var p2 = Point()
.eval p2.x = 3
.eval p2.y = 4

; Using struct values in assembler expressions (example)
; lda #0
; ldy #p1.y
; sta charset + (p1.x >> 3) * height, y

; Define a Person structure and show introspection/manipulation
.struct Person {firstName,lastName}
.var p1 = Person("Peter","Schmeichel")

.print p1.getStructName()          ; Prints "Person"
.print p1.getNoOfFields()          ; Prints "2"
.print p1.getFieldNames().get(0)   ; Prints "firstName"
.eval p1.set(0,"Kasper")          ; Sets firstName to "Kasper"
.print p1.get("lastName")          ; Prints "Schmeichel"

; Copy values from one struct to another
.var p2 = Person()
.for (var i = 0; i < p1.getNoOfFields(); i++)
  .eval p2.set(i, p1.get(i))

; Print the content of a struct
.for (var i = 0; i < p1.getNoOfFields(); i++) {
  .print p1.getFieldNames().get(i) + " = " + p1.get(i)
}
```

## References
- "list_values" — expands on lists as structured data used in struct fields
