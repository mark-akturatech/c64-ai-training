# ********* - RIGHTD (RIGHT$): Manipulates its parameters so that LEFT$'s tail-end code can be reused. Produces a temporary string descriptor for a string containing the specified number of characters taken from the right-hand end of the source string.

**Summary:** RIGHTD at $B72C (46892) implements the BASIC RIGHT$ string function by adjusting its parameters so that LEFT$'s tail-end substring implementation can be reused; it constructs and returns a temporary string descriptor for the requested rightmost N characters of a source string.

## Description
RIGHTD is the BASIC runtime entry that performs the RIGHT$ operation. Rather than containing a separate substring routine, RIGHTD manipulates the parameters it receives (length, source string descriptor/pointer, etc.) so that the existing LEFT$ tail-end code path can be reused to produce the substring. The result is delivered as a temporary string descriptor describing the new string made of the specified number of characters taken from the right-hand end of the source string.

This chunk documents the routine identity and high-level behavior; parameter acquisition and the LEFT$ reuse are described in the referenced chunks.

## References
- "leftd_perform_left$" — expands on RIGHT$ reusing LEFT$'s implementation for producing substrings  
- "pream_pull_string_params" — expands on how RIGHTD obtains the required parameters for RIGHT$
