# .VERSION (ca65)

**Summary:**  
The ca65 pseudo-variable `.VERSION` returns the assembler version encoded as `(VER_MAJOR * 0x100) + VER_MINOR`, with the major version in the upper 8 bits and the minor version in the lower 8 bits. This value is considered informal and should not be relied upon for exact version checks.

**Description**

Reading the pseudo-variable `.VERSION` yields the assembler version encoded as a 16-bit value:

- **Upper 8 bits:** `VER_MAJOR`
- **Lower 8 bits:** `VER_MINOR`

For example, assembler version 47.11 is represented as `0x2F0B`.

**Compatibility Note:**  
Until version 2.19, the pseudo-variable used a broken formula: `(VER_MAJOR * 0x100) + VER_MINOR * 0x10`, which produced incorrect values starting at assembler version 2.16. Due to this, `.VERSION` is considered informal—do not rely on it for exact version detection. Instead, update your code to work with recent assembler versions.

## References

- [ca65 Users Guide](https://cc65.github.io/doc/ca65.html)
