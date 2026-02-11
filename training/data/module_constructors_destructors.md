# ca65: Module constructors/destructors (.CONSTRUCTOR / .DESTRUCTOR / .INTERRUPTOR / .CONDES)

**Summary:** Explains the .CONSTRUCTOR, .DESTRUCTOR, .INTERRUPTOR, and generic .CONDES directives that export functions so the linker can generate per-type function tables (constructors, destructors, interruptors). Covers FEATURE CONDES, linker table generation, priorities, and caveats for C and assembler modules.

**Overview**
- `.CONSTRUCTOR`, `.DESTRUCTOR`, and `.INTERRUPTOR` mark/export functions so the linker can build tables of those functions. `.CONDES` is a generic form allowing additional types (predefined: 0 = constructor, 1 = destructor, 2 = interruptor).
- The linker-generated tables include only addresses from object files that are actually linked into the final executable. This is useful for module-local runtime initialization (e.g., heap start/end and free-list initialization) and for collecting IRQ handlers.
- Typical use in C: a module that needs runtime initialization exports an init function with `.CONSTRUCTOR`; if that module is linked, the function address is added to the constructors table, and the C startup code calls it before `main`. Destructors are similarly called after `main`.

**Calling order**
- The linker sorts symbols for a given table in increasing priority order (lower priority values first, higher values later).
- The C runtime routine that walks the generated tables calls the functions in the table in an order that results in higher-priority functions being invoked before lower-priority ones.
**[Note: Source may contain a wording/ordering contradiction — the text states the linker sorts increasing priority (low→high) but also states the runtime walks the table “starting from the top” causing high-priority-first. Verify the runtime traversal direction in your C runtime implementation if exact ordering is critical.]**

**Pitfalls and important caveats**
- The linker only creates the tables; it does not emit code to call the functions. If you are not using the standard C runtime, you must implement the code that walks the table and calls each entry yourself (see `condes` and `callirq` modules in the C runtime for examples).
- Tables are only produced when enabled explicitly with `FEATURE CONDES` in the linker configuration. Each table/type must be requested separately.
- Only functions from modules that are actually linked get their addresses placed in the tables. Place initialization/IRQ setup functions in modules that will always be linked when needed; otherwise, their addresses will not appear.
- Priorities determine ordering. If initialization/cleanup depends on other modules, choose priorities to ensure correct ordering.
- The table entries are compact (typically two bytes per function pointer in these environments), making the approach memory-efficient compared to hard-coded startup lists.

**Linker Configuration Example**
To enable the generation of constructor, destructor, and interruptor tables, include the following `FEATURES` section in your linker configuration file:


In this configuration:
- `segment` specifies where the table will be placed (commonly `RODATA`).
- `type` indicates the type of table (`constructor`, `destructor`, or `interruptor`).
- `label` is the symbol name for the start of the table.
- `count` is the symbol name for the number of entries in the table.

This setup instructs the linker to generate tables for constructors, destructors, and interruptors, which can then be traversed at runtime. ([cc65.github.io](https://cc65.github.io/doc/ld65.html?utm_source=openai))

**Example: Walking the Constructor Table**
The `condes` module in the C runtime provides an example of how to walk the constructor table and call each function. Below is a simplified version of such a routine:


In this example:
- `_call_ctors` initializes a pointer to the start of the constructor table and retrieves the count of constructors.
- `call_table_entries` is a helper routine that iterates over the table and calls each function.

This approach ensures that all constructor functions are called during program initialization. ([cc65.github.io](https://cc65.github.io/doc/ca65.html?utm_source=openai))

## Source Code

```text
FEATURES {
    CONDES: segment = RODATA,
            type = constructor,
            label = __CONSTRUCTOR_TABLE__,
            count = __CONSTRUCTOR_COUNT__;
    CONDES: segment = RODATA,
            type = destructor,
            label = __DESTRUCTOR_TABLE__,
            count = __DESTRUCTOR_COUNT__;
    CONDES: segment = RODATA,
            type = interruptor,
            label = __INTERRUPTOR_TABLE__,
            count = __INTERRUPTOR_COUNT__;
}
```

```text
; condes.s - Walk the constructor table and call each function

    .export _call_ctors

    .segment "CODE"

_call_ctors:
    lda #<__CONSTRUCTOR_TABLE__  ; Load low byte of constructor table address
    sta ptr1
    lda #>__CONSTRUCTOR_TABLE__  ; Load high byte of constructor table address
    sta ptr1+1
    ldx #<__CONSTRUCTOR_COUNT__  ; Load low byte of constructor count
    ldy #>__CONSTRUCTOR_COUNT__  ; Load high byte of constructor count
    jsr call_table_entries
    rts

; Helper routine to call each function in the table
call_table_entries:
    ; Implementation to iterate over the table and call each function
    ; ...
    rts
```


## References
- "condes and callirq modules in the C runtime" — examples of code that walks linker-generated CONDES tables and calls entries
- "macpack_module_header" — expands on module headers and exported module symbols