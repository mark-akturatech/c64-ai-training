# ca65 --feature option

**Summary:** Enables an emulation feature for the ca65 assembler (equivalent to the .FEATURE directive). Feature names must be lower case, and each feature must be specified with a separate --feature option (comma-separated lists are not allowed).

**Description**

`--feature name`

Enable an emulation feature for the assembler. This command-line option is functionally identical to using the `.FEATURE` directive in source code, with two exceptions:

- Feature names must be lower case.
- Each feature must be provided using a separate `--feature` option; comma-separated lists of features are not supported.

The option causes ca65 to enable emulation behaviors described by the corresponding `.FEATURE` entries (for example, CPU-specific quirks). See the `.FEATURE` documentation for the list of available emulation features and exact behavioral effects.

**Supported Features**

The following features are available:

- `at_in_identifiers`: Accept the at character ('@') as a valid character in identifiers. The at character is not allowed to start an identifier, even with this feature enabled.

- `bracket_as_indirect`: Use `[]` instead of `()` for the indirect addressing modes. Example:


  Note: This should not be used in 65816 mode because it conflicts with the 65816 instruction syntax for far addressing.

- `c_comments`: Allow C-like comments using `/*` and `*/` as left and right comment terminators. Note that C comments may not be nested.

- `dollar_in_identifiers`: Accept the dollar sign ('$') as a valid character in identifiers. The dollar sign is not allowed to start an identifier, even with this feature enabled.

- `dollar_is_pc`: Accept the dollar sign ('$') as a synonym for the program counter symbol ('*').

- `force_range`: Force the assembler to check if values fit into the range of the operand size.

- `leading_dot_in_identifiers`: Accept identifiers that start with a dot ('.').

- `labels_without_colons`: Allow labels without a trailing colon.

- `loose_char_term`: Allow character literals to be terminated by any non-alphanumeric character.

- `missing_char_term`: Allow character literals to be terminated by the end of the line.

- `pc_assignment`: Allow assignment to the program counter symbol ('*').

- `smart`: Enable smart mode, which causes `REP` and `SEP` instructions to additionally act like the size-changing directives `.A8`, `.A16`, `.I8`, and `.I16`.

- `underline_in_numbers`: Allow underscores ('_') in numeric literals for readability.

## Source Code

  ```assembly
  lda     [$82]
  lda     [$82,x]
  lda     [$82],y
  jmp     [$fffe]
  jmp     [table,x]
  ```


## References

- [ca65 Users Guide](https://cc65.github.io/doc/ca65.html)