# $0300-$030B — BASIC Indirect Vector Table

**Summary:** RAM vectors at $0300-$030B point to key BASIC ROM routines (error handler, tokenizer/CRUNCH, token executor, token-to-ASCII listing/QPLOP, etc.). On power-up each vector is set to the instruction immediately past the ROM JMP, allowing software to find or intercept BASIC routines via PEEK/POKE (example: QP=PEEK(774)+256*PEEK(775)).

## Description
Several important BASIC routines are entered indirectly through a table of two‑byte vectors stored in RAM at $0300-$030B (12 bytes total). ROM routines begin with instructions like JMP ($0300), so the vector in RAM is initialized at power-up to point to the address immediately after that JMP. This lets code call the routine without hardcoding its ROM address and allows the vector to be changed to intercept or extend BASIC behavior.

Key points:
- Vectors are two‑byte little‑endian addresses stored in RAM ($0300..$030B). They are initialized on power-up to point past the JMP in the corresponding BASIC ROM entry point.
- Example (from ROM): the BASIC error message routine begins at 42039 ($A437) with the instruction JMP ($0300). The indirect vector at $0300 contains the address 42042 ($A43A), which is the instruction immediately after the JMP ($0300).
- Example use to obtain a vector address in BASIC: QP = PEEK(774) + 256 * PEEK(775) — the two bytes at 774/775 (decimal) are the low/high bytes of the vector at $0306/$0307.
- Benefits of vectored entry:
  - Hides ROM addresses: programs can find routine addresses via RAM vectors instead of hardcoding ROM offsets.
  - Cross‑machine compatibility: the same RAM vector location yields the correct ROM target on different Commodore models.
  - Extensibility: by changing the RAM vectors you can redirect BASIC routines to custom code (e.g., preprocess input, add new keywords, alter tokenization, extend token execution, change LIST output or error messages).
- Typical modifications required to add new BASIC keywords:
  - Replace/augment the tokenizer (CRUNCH) so new keywords are tokenized on input.
  - Replace/augment the token executor so the interpreter handles new tokens at runtime.
  - Replace/augment the token‑to‑ASCII routine so LIST and other outputs render the new tokens correctly.
  - Optionally replace/augment the error message routine to provide messages for new keywords.
- Using these vectors to alter BASIC behavior is cleaner and more efficient than older wedge techniques (see location $0073 for the wedge example referenced in original source).

**[Note: Source lists several specific vectors (error, CRUNCH, QPLOP, etc.) but does not enumerate each vector name/address pair in this excerpt.]**

## Key Registers
- $0300-$030B - RAM - BASIC Indirect Vector Table (two‑byte little‑endian vectors to BASIC ROM routines: error handler, tokenizer/CRUNCH, token execution, token-to-ASCII listing/QPLOP, and related routines)

## References
- "ierror_vector" — expands on vector to BASIC error routine
- "icrnch_vector" — expands on vector to CRUNCH/tokenizing routine
- "iqplop_vector" — expands on vector to QPLOP token-listing routine