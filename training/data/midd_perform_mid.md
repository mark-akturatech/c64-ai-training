# MIDD (MID$) — $B737 / 46903

**Summary:** The MID$ routine, labeled MIDD at $B737 (decimal 46903), adjusts string parameters and constructs a temporary string descriptor to reuse the LEFT$ function's tail-end code. This approach efficiently extracts a substring from a specified middle position without duplicating code. Search terms: MID$, LEFT$, temporary string descriptor, $B737, 46903, leftd_perform_left$, pream_pull_string_params.

**Operation**

MIDD implements the BASIC MID$ function by:

- **Fetching string parameters:** Utilizes the `pream_pull_string_params` routine to retrieve the source string, start position, and length.

- **Adjusting parameters:** Modifies these parameters to align with the LEFT$ function's requirements, effectively transforming the MID$ call into an equivalent LEFT$ call.

- **Invoking LEFT$ code:** Calls the `leftd_perform_left$` routine to generate the substring using the adjusted parameters.

- **Creating a temporary string descriptor:** Constructs a descriptor for the resulting substring, facilitating efficient memory management.

This method leverages existing code to perform substring extraction, enhancing efficiency and reducing redundancy.

## Source Code

```assembly
; MIDD routine at $B737
MIDD:
    JSR pream_pull_string_params  ; Fetch source string, start position, and length
    ; Adjust parameters for LEFT$ compatibility
    ; Implementation details of parameter adjustment
    JSR leftd_perform_left$       ; Invoke LEFT$ tail-end code
    ; Construct temporary string descriptor
    ; Implementation details of descriptor construction
    RTS
```

## Key Registers

- **A (Accumulator):** Holds the length of the substring.

- **X:** Contains the low byte of the source string pointer.

- **Y:** Contains the high byte of the source string pointer.

## References

- **leftd_perform_left$:** Details the reuse of LEFT$ tail-end code after parameter adjustment.

- **pream_pull_string_params:** Describes the retrieval of common parameters used by MID$.

## Labels
- MIDD
