# FACTORS — PET/CBM and V64 (VIC-20, C64, PLUS/4)

**Summary:** Machine-language FACTORS program (relocated to $1300) finds integer factors of decimal inputs up to 19 digits (64-bit). Key techniques: decimal input parsing, division-with-remainder for trial factors, binary-to-decimal output conversion, and a "30-counter" divisor-selection (after testing 2,3,5 use multiples of 30 plus 1,7,11,17,19,23,29).

**Overview**
FACTORS is a relocatable machine-language utility (BASIC relocates it so it begins at $1300) that factors integers up to 19 decimal digits (an 8‑byte/64‑bit value). The program was supplied in two variants: PET/CBM and V64 (VIC-20, C64, PLUS/4). It demonstrates compact, efficient low-level routines for input parsing, division with remainder, and binary-to-decimal conversion for printable output.

**Decimal input and numeric range**
- Accepts decimal input strings up to 19 digits, producing a 64-bit (8-byte) binary value for internal arithmetic.
- Parsing avoids BASIC limits by performing decimal-to-binary conversion in machine code (accumulating and shifting/multiplying as needed) so arbitrary-precision BASIC numeric limits do not apply.

**Factorization algorithm**
- Uses trial division with remainder: for each candidate divisor, performs a machine-language division routine that computes quotient and remainder; a zero remainder reports a factor.
- Initial small-prime checks: divisors 2, 3, and 5 are tested first (fast exits for these common factors).
- 30-counter technique (wheel factorization): after 2,3,5 are tested, the program tests only numbers of the form 30*k + r where r ∈ {1, 7, 11, 17, 19, 23, 29}. This reduces the number of trial divisors by skipping values divisible by 2, 3, or 5.
- The residues used for the wheel are exactly: 1, 7, 11, 17, 19, 23, 29 (tested in that sequence for each 30-step).

**Output: binary-to-decimal conversion**
- To print factors the program converts 64-bit binary values back to decimal text using a decimal conversion routine (same decimal-mode technique referenced in CROSS REF).
- The conversion routine implements repeated division / modulus by 10 (in machine code) to extract decimal digits for display.

**Memory and relocation**
- The machine code is relocated by a BASIC loader so execution starts at $1300 (hex) regardless of original load address. This accommodates systems (notably VIC-20) with variable BASIC start addresses while providing a fixed location for study and disassembly.
- Variable storage used by the program (e.g. addresses in the zero page/main memory) is documented separately (see References).

**Disassembly and study notes**
- The author suggests disassembling the loaded code to study routines (e.g., division, decimal conversion, input parsing). A third-party disassembler (WFDis) is recommended by the author for C64 programs.
- For students: study the division-with-remainder implementation, the decimal parsing and conversion routines, and the 30-counter loop that advances candidate divisors by the wheel residues.

## Key Registers
- **$1300**: Program entry point
- **$0349-$0379**: Variable storage area
- **$1300-$1565**: Program code and subroutines

## References
- "factors_variables" — expands on variables used by FACTORS (addresses like $0349..$0379)
- "factors_program_map" — expands on program entry points and subroutines (addresses $1300..$1565)
