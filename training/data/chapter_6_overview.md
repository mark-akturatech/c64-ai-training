# Chapter 6 — Linking BASIC and Machine Language

**Summary:** This chapter details the integration of machine language programs with Commodore 64 BASIC, including memory placement strategies, BASIC memory layout and pointers, variable storage formats, and methods for data exchange between BASIC and machine language.

**Where to Put a Machine Language Program**

To integrate machine language routines with BASIC on the Commodore 64, it's essential to place them in memory locations that do not interfere with BASIC's operation. The recommended areas are:

- **$C000–$CFFF (49152–53247):** A 4 KB RAM segment not utilized by BASIC, suitable for routines up to 4 KB in size. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_309.html?utm_source=openai))

- **$A000–$BFFF (40960–49151):** An 8 KB segment typically occupied by the BASIC ROM. By switching out the ROM, this area becomes available for larger machine language programs. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_262.html?utm_source=openai))

To reserve memory at the top of BASIC's addressable space, adjust the `MEMTOP` pointer:


Where `L` and `H` are the low and high bytes of the new top-of-memory address. For example, to reserve memory from $9000 (36864) to $9FFF (40959):


([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_309.html?utm_source=openai))

**BASIC Memory Layout**

BASIC's memory is organized into distinct areas:

- **Program Area:** Starts at $0801 (2049) and contains the tokenized BASIC program.

- **Variable Storage:**
  - **Simple Variables:** Stored immediately after the program area.
  - **Arrays:** Follow simple variables.
  - **Strings:** Stored in a heap at the top of BASIC memory, growing downward.

Key pointers in zero page manage these areas:

- **TXTTAB (43–44):** Start of BASIC program.
- **VARTAB (45–46):** Start of variable storage.
- **ARYTAB (47–48):** Start of array storage.
- **STREND (49–50):** End of array storage/start of string heap.
- **FRETOP (51–52):** Bottom of string heap (top of available memory).

([c64-wiki.com](https://www.c64-wiki.com/wiki/Memory_%28BASIC%29?utm_source=openai))

**Loading and the SOV Pointer**

The **SOV (String Overflow) Pointer** is located at addresses 51–52 ($33–$34) and points to the bottom of the string heap. When loading machine language programs into memory, it's crucial to ensure they do not overlap with the string heap. If they do, adjust the SOV pointer accordingly to prevent memory conflicts.

**BASIC Variables: Fixed, Floating, String**

BASIC supports three primary variable types, each with a specific memory representation:

- **Integer (Fixed-Point):** Stored as a two-byte signed value in little-endian format.

- **Floating-Point:** Stored as a five-byte value:
  - Byte 1: Exponent (biased by 128)
  - Bytes 2–5: Mantissa (normalized, with the implicit leading bit set)

- **String:** Managed using a descriptor containing:
  - Byte 1: Length of the string
  - Bytes 2–3: Pointer to the string data in the heap

([c64-wiki.com](https://www.c64-wiki.com/wiki/Memory_%28BASIC%29?utm_source=openai))

**Exchanging Data with BASIC**

Data exchange between BASIC and machine language can be achieved through several methods:

- **PEEK and POKE:** Directly read and write memory locations.

- **SYS Command:** Calls a machine language routine at a specified address. Parameters can be passed via specific memory locations or registers.

- **USR Function:** Calls a machine language routine whose address is stored at locations 785–786. The argument is passed in floating-point format, and the return value is expected in the same format.

- **Modifying Vectors:** Change system vectors to redirect BASIC operations to custom machine language routines.

([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_307.html?utm_source=openai))

## Source Code

```basic
10 POKE 51, L: POKE 52, H: POKE 55, 1: POKE 56, H: CLR
```

```basic
10 POKE 51, 0: POKE 52, 144: POKE 55, 1: POKE 56, 144: CLR
```


```assembly
; Example: Machine Language Routine to Increment a Value
; This routine increments the value at memory location $C000

        * = $C000
        INC $C000
        RTS
```

```basic
10 REM Load Machine Language Routine
20 FOR I = 0 TO 2
30 READ A
40 POKE 49152 + I, A
50 NEXT I
60 DATA 238, 0, 192, 96
70 REM Call Machine Language Routine
80 SYS 49152
```

## Key Registers

- **TXTTAB (43–44):** Start of BASIC program.
- **VARTAB (45–46):** Start of variable storage.
- **ARYTAB (47–48):** Start of array storage.
- **STREND (49–50):** End of array storage/start of string heap.
- **FRETOP (51–52):** Bottom of string heap (top of available memory).
- **USR Vector (785–786):** Address of the machine language routine called by the USR function.

## References

- "basic_memory_layout_overview" — expands on BASIC memory layout and important pointers
- Commodore 64 Programmer's Reference Guide, Chapter 5: BASIC to Machine Language
- C64-Wiki: Memory (BASIC)
- C64-Wiki: Memory Map