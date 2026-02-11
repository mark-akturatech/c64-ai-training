# Upper RAM ($C000-$CFFF)

**Summary:** Upper RAM at $C000-$CFFF is a 4 KB region (4096 bytes) in the C64 memory map used as general-purpose RAM; it is commonly used by programs and by cartridges when the area is visible (visible = not overridden by cartridge ROM).

## Upper RAM
Upper RAM occupies the address range $C000–$CFFF and provides 4 KB of general-purpose RAM. It is typically available to programs for code/data storage and can also be used by cartridge hardware when that cartridge maps RAM into this region. Visibility of this RAM depends on cartridge/ROM banking that may override or mirror the area.

## Source Code
```text
Upper RAM ($C000-$CFFF)

$C000-$CFFF  Upper RAM          General-purpose RAM (4096 bytes)
```

## References
- "basic_program_area_and_cartridge_space" — expands on upper RAM placement relative to cartridge ROM