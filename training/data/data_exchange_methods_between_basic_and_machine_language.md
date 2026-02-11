# Exchanging Data: BASIC and Machine Language (POKE/PEEK and BASIC variable table)

**Summary:** Techniques for passing data between BASIC and machine language: simple POKE/PEEK to shared memory, and a machine-language search of the BASIC variable table using the SOV (start-of-variables) pointer, indirect-indexed addressing ((addr),Y), and Y register stepping to extract integer or floating values.

## Methods

- POKE/PEEK (shared memory)
  - Simplest method: BASIC POKE values to an agreed memory location; ML LDA/STA or similar reads them. ML can store values and BASIC reads them with PEEK.
  - Use when the overhead of parsing BASIC’s variable-table format is unnecessary.

- Direct machine-language access to BASIC variables (overview)
  - BASIC variables are stored in a BASIC-managed variable table in memory. A machine-language routine can locate and read or modify these entries.
  - Obtain the address of the first BASIC variable from the SOV (start-of-variables) pointer and use it as an indirect base address.
  - Use indirect-indexed addressing ((addr),Y) and step the Y register to compare characters of the variable name:
    - Step Y = 0..1 (byte-wise) to compare name bytes to find a match.
    - If a name byte does not match, advance the indirect base address to the next variable by adding seven bytes (each CBM BASIC variable entry is 7 bytes: 2 name bytes + 5 value bytes).
    - If the name matches, set Y to values that point into the variable’s value bytes (the source indicates using Y = 2, 3, 4, 5, 6 to extract the whole value).
  - Value extraction:
    - Integer variables: extract the first two bytes (Y = 2 and Y = 3 are sufficient).
    - Floating-point or descriptor-encoded variables: more complex; require parsing the BASIC variable entry format and float descriptor layout.
  - End-of-table detection:
    - If the variable is not in the table, continue advancing the indirect base until it matches the start-of-arrays marker (the start-of-arrays indicates you have passed the variable table and did not find the variable).

- Ordering shortcut (defined-order indexing)
  - BASIC places variables into the variable table in the order they are defined in the BASIC program.
  - If you arrange for your variables to be defined in a known order, machine language can treat them as "first variable", "second variable", etc., avoiding name comparisons.
  - The SOV pointer points at the first variable; by increasing Y (or adjusting the indirect base appropriately) you can reach subsequent variables (second, third, etc.).

## References
- "basic_variable_table_and_types" — expands on the structure of variable entries for ML extraction (entry format, type byte, integer vs. floating representation)
