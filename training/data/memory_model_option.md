# ca65: -mm / --memory-model

**Summary:** The `-mm` or `--memory-model` option sets the assembler's default memory model. Valid model specifiers are: `near`, `far`, and `huge`.

**Description**

This option defines the default memory model used by `ca65` for symbol/address resolution and code/data placement. It accepts a single parameter (`model`) with one of three values: `near`, `far`, or `huge`. This selection establishes how the assembler treats addresses and accesses by default.

- Short form: `-mm model`
- Long form: `--memory-model model`

The memory model influences the default address size for segments and symbols:

- **near**: Default address size is 16 bits (absolute addressing).
- **far**: Default address size is 24 bits (far addressing).
- **huge**: Default address size is 32 bits (long addressing).

For more details on how memory models interact with CPU targets, see "cpu_type_and_supported_cpus".

## References

- "cpu_type_and_supported_cpus" — discusses CPU targets and how memory models may interact with addressing modes and supported CPUs.
