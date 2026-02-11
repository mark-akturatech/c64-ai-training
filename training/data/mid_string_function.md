# MID$() implementation (ROM disassembly $B737-$B75F)

**Summary:** Implements MID$() parsing and length/start handling in C64 ROM: sets default length ($FF), scans the input for delimiters (comma/`)`), fetches numeric byte parameter (JSR $B79E) and the string descriptor plus parameters (JSR $B761), validates start/length versus string descriptor, adjusts for zero-based indexing, and branches to LEFT$/RIGHT$ copy/allocation routines.

## Operation
This block implements the MID$(string,start[,length]) high-level behavior and performs parameter parsing, validation, and dispatch to the string-copy routines.

- B737–B739: Set default length to 255 (A=#$FF; STA $65). $65 holds the requested length if none provided.
- B73B–B745: Scan the input token stream (JSR $0079). If next token is “)” (CMP #$29; BEQ $B748) then no second numeric parameter is present and the default length remains. Otherwise, JSR $AEFD scans for a comma (if missing, syntax error/warm start).
- B745–B748: When a comma is found, JSR $B79E parses/evaluates a byte numeric parameter (the requested length) and returns it (A = length).
- B748–B74B: JSR $B761 pulls the string descriptor and the parsed byte parameter from the expression stack. According to the listing, the routine returns a descriptor pointer in the zero-page pair at $50/$51, the byte parameter in A (and X), and sets Y = 0.
- B74B: If the returned string descriptor indicates a null string (BEQ $B798), execution goes to the illegal-quantity error handler then warm start.
- B74D–B74F: The start index (in X) is decremented (DEX), copied to A (TXA), and saved on the stack (PHA) — converting 1-based start to a zero-based offset and preserving the original offset.
- B750–B753: Clear carry (CLC) and zero X (A2 #$00) to prepare to compute remaining length. Then SBC ($50),Y subtracts the string length byte (indirect via descriptor) from 0 (i.e., A := 0 - string_length), leaving A = (256 - string_length) and carry set if string_length <= 0 (standard two's complement subtraction semantics).
- B755: BCS $B70D checks the carry resulting from the SBC: if start > string length (start is greater than available characters) go handle a null result (branch to the code at $B70D).
- B757–B759: EOR #$FF complements A producing the remaining length (two's-complement change to get positive remaining length). CMP $65 compares remaining length to the requested length in $65.
- B75B: BCC $B70E: if requested length > remaining length, branch to the RIGHT$ path (which handles copying only the remaining characters or allocation behavior).
- B75D–B75F: A5 65 loads the requested length into A; BCS $B70E branches based on carry (see note below). This path continues into the string-copy routine (LEFT$/RIGHT$ code paths) depending on earlier comparisons.

**Behavioral notes preserved from the listing:**
- Default length is 255 unless a length parameter is provided.
- Start index is treated as 1-based by the BASIC source and is decremented to a 0-based offset for copying.
- The code clamps the requested length to the remaining length of the source string and branches to the appropriate copy routine (LEFT$/RIGHT$ path).
- JSR $B761 is the centralized pull of string descriptor + byte parameter from the expression stack (descriptor placed at $50/$51, byte in A/X, Y=0).

**[Note: Source may contain an error — the disassembly comment at $B75F says "branch always", but BCS is conditional and the prior LDA does not set the carry flag; the actual branch decision depends on the carry state from earlier operations. This comment appears inconsistent with 6502 semantics.]**

## Source Code
```asm
.,B737 A9 FF    LDA #$FF        set default length = 255
.,B739 85 65    STA $65         save default length
.,B73B 20 79 00 JSR $0079       scan memory
.,B73E C9 29    CMP #$29        compare with ")"
.,B740 F0 06    BEQ $B748       branch if = ")" (skip second byte get)
.,B742 20 FD AE JSR $AEFD       scan for ",", else do syntax error then warm start
.,B745 20 9E B7 JSR $B79E       get byte parameter
.,B748 20 61 B7 JSR $B761       pull string data and byte parameter from stack
                                return pointer in descriptor, byte in A (and X), Y=0
.,B74B F0 4B    BEQ $B798       if null do illegal quantity error then warm start
.,B74D CA       DEX             decrement start index
.,B74E 8A       TXA             copy to A
.,B74F 48       PHA             save string start offset
.,B750 18       CLC             clear carry for sub-1
.,B751 A2 00    LDX #$00        clear output string length
.,B753 F1 50    SBC ($50),Y     subtract string length
.,B755 B0 B6    BCS $B70D       if start>string length go do null string
.,B757 49 FF    EOR #$FF        complement -length
.,B759 C5 65    CMP $65         compare byte parameter
.,B75B 90 B1    BCC $B70E       if length>remaining string go do RIGHT$
.,B75D A5 65    LDA $65         get length byte
.,B75F B0 AD    BCS $B70E       go do string copy, branch always
```

## References
- "pull_string_and_byte_param" — expands on JSR $B761 (how descriptor and byte param are returned)
- "left_string_function" — expands on branches into LEFT$/RIGHT$ copy/allocation path
- "byte_parameter_parsing_and_evaluation" — expands on routines used to parse and evaluate numeric byte parameters (JSR $B79E and related)