# Free Memory: The Dangerous Place (EOA vs BOS)

**Summary:** Explains why placing machine language code between EOA (end-of-arrays) and BOS (bottom-of-strings) is unsafe on the C64: dynamic string allocation moves BOS downward, abandoned strings consume space, and garbage collection occurs only when BOS reaches EOA. Mentions safer areas (cassette buffer, top-of-memory, after end-of-BASIC) covered elsewhere.

## Problem and behavior
The memory region between EOA (end-of-arrays) and BOS (bottom-of-strings) is used by BASIC for dynamic string storage. As a program creates dynamic strings, BOS moves downward to allocate space. Strings that are no longer needed are typically abandoned (left dead) and remain occupying memory until a garbage-collection cycle runs.

Garbage collection runs only when BOS touches EOA; at that point dead strings are cleaned up and live strings are repacked. On most BASIC implementations this garbage collection can cause serious program slowdown (exception: BASIC 4.0 and Commodore PLUS/4 systems are not affected in the same way).

If you place machine language code in the free-looking area between EOA and BOS, that code is at risk: as BOS moves down while strings are created, it can overwrite the machine code. The overwrite can occur long before garbage collection reclaims space, so code placed there is unsafe.

## Recommendations (from source)
- Do not place ML code between EOA and BOS; the area is not stable.
- See the cross-reference below ("where_to_put_machine_language_programs") for safer alternatives that the source lists (cassette buffer, top-of-memory, after end-of-BASIC with SOV adjusted).

## References
- "where_to_put_machine_language_programs" — discusses safer areas for ML programs (cassette buffer, top-of-memory, after end-of-BASIC with SOV adjusted)

## Labels
- EOA
- BOS
