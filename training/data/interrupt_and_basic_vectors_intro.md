# Interrupt Vectors and BASIC Vectors ($0300-$03FF)

**Summary:** Memory vectors in the $0300-$03FF region for the Commodore 64: warm start and core BASIC entry vectors (addresses $0300-$030B) including Warm Start, BASIC Idle, Tokenizer, Token Decoder, Executor, and Expression Reader with their default targets.

## Description
This block lists the standard BASIC/firmware vectors stored in the $0300-$03FF header area. Each vector is a two-byte vector location containing the address the system jumps to for that service (defaults shown below).

- $0300-$0301 Warm Start — Warm reset execution address (default $E38B)
- $0302-$0303 BASIC Idle — BASIC loop entry point used for the idle/main loop (default $A483)
- $0304-$0305 Tokenizer — Line tokenization routine (default $A57C)
- $0306-$0307 Token Decoder — Token decoding routine (default $A71A)
- $0308-$0309 Executor — Instruction execution routine (default $A7E4)
- $030A-$030B Expression Reader — Expression parsing/reading routine (default $AE86)

These vectors are part of the BASIC header/vector area and are used to redirect or hook into core BASIC functions (tokenizing, decoding, executing, reading expressions) and the warm-start/reset entry. Defaults above are typical ROM entry points on an unmodified C64.

## Source Code
```text
Interrupt Vectors and BASIC Vectors ($0300-$03FF)

$0300-$0301  Warm Start         Warm reset execution address (default: $E38B)
$0302-$0303  BASIC Idle         BASIC loop entry point (default: $A483)
$0304-$0305  Tokenizer          Line tokenization routine (default: $A57C)
$0306-$0307  Token Decoder      Token decoding routine (default: $A71A)
$0308-$0309  Executor           Instruction execution routine (default: $A7E4)
$030A-$030B  Expression Reader  Expression reading routine (default: $AE86)
```

## Key Registers
- $0300-$0301 - Memory Vector - Warm Start (warm reset entry; default $E38B)
- $0302-$0303 - Memory Vector - BASIC Idle (BASIC main loop; default $A483)
- $0304-$0305 - Memory Vector - Tokenizer (line tokenization; default $A57C)
- $0306-$0307 - Memory Vector - Token Decoder (token decoding; default $A71A)
- $0308-$0309 - Memory Vector - Executor (instruction execution; default $A7E4)
- $030A-$030B - Memory Vector - Expression Reader (expression parsing; default $AE86)

## References
- "tokenizer_and_executor_vectors" — expands on tokenizer/executor addresses in $0304-$0309

## Labels
- WARM_START
- BASIC_IDLE
- TOKENIZER
- TOKEN_DECODER
- EXECUTOR
- EXPRESSION_READER
