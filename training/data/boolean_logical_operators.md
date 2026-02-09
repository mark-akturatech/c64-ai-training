# Boolean operators (Kick Assembler — Table 5.2)

**Summary:** Defines Kick Assembler boolean operators: Not (!), And (&&), Or (||). Shows operator tokens, example usage (!a, a&&b, A||b) and the truth conditions for each operator.

## Boolean operators
The language provides three logical operators that operate on Boolean values:

- Not (!): unary operator. Returns true when the operand is false, otherwise false.
- And (&&): binary operator. Returns true only when both operands are true, otherwise false.
- Or (||): binary operator. Returns true when at least one operand is true, otherwise false.

Examples shown in the original table: !a, a&&b, A||b.

## Source Code
```text
Table 5.2. Boolean Operators

Name    Operator    Example    Description
Not     !           !a         Returns true if a is false, otherwise false.
And     &&          a&&b       Returns true if a and b are true, otherwise false.
Or      ||          A||b       Returns true if a or b are true, otherwise false.
```

## References
- "branching_and_looping_intro_and_boolean_examples" — expands on Section 5.1 introduction and simple boolean expression examples
- "boolean_generating_operators" — expands on Comparison operators that generate the Boolean values combined by these logical operators