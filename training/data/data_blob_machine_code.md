# Full Track 27 — BASIC DATA byte blobs (two DATA lines)

**Summary:** Two BASIC DATA statement lines containing raw machine-code byte literals (assembly byte lists) used by the Full Track 27 routines; includes the blank lines immediately following each DATA statement as part of the blob listing. Searchable terms: DATA, machine-code, byte literals, Full Track 27, BASIC bootstrap.

## Description
These are literal DATA lines from a Commodore 64 BASIC listing that contain machine-code bytes for the Full Track 27 routines. The lines are raw decimal byte lists intended to be READ/POKEed into memory by a BASIC bootstrap (loader) and then executed. The blob includes the blank lines immediately following each DATA line — those blank lines are intentionally preserved as part of the stored byte sequence in the original listing.

No load address, labels, or assembler source is present in this fragment — it is a fragment of a BASIC-embedded machine-code blob. For the full loader and execution context, see the referenced bootstrap/source listing.

## Source Code
```basic
1010  DATA169, 224, 133,      3,165,      3,  48,252 


1020  DATA  76,148,193,234,234,234,234,234 

```

## Incomplete
- Missing: Load address (where these bytes are READ/POKEed into memory).
- Missing: Execution entry point / starting address for the machine code.
- Missing: Full assembler source or symbolic labels mapping these bytes to routines.
- Missing: The BASIC bootstrap/loader code in this chunk (see referenced chunk for loader details).
- Missing: Any subsequent DATA lines or continuation of the machine-code blob if this is a fragment.

## References
- "source_listing_and_basic_bootstrap" — Full source listing and BASIC bootstrap that loads/executes the machine code