# DOS Scratch Wildcards — multiple wildcards in one command (example: T?ST*)

**Summary:** Demonstrates using multiple wildcards ('?' and '*') together in a single DOS scratch command (SO:), showing which filenames match (TEST, TASTY, TESTING123) and which do not (TOAST). Shows the BASIC/serial command form (OPEN/PRINT#15/CLOSE) and notes that '*' has priority over '?' — characters after '*' are ignored.

## Explanation
You can use more than one wildcard character within the same scratch (SO:) command. In the example below the pattern T?ST* is sent to the disk device: the pattern matches filenames where a single character replaces '?' and any following sequence is matched by '*'. Because the asterisk has priority, any characters that appear in the pattern after the '*' are ignored, so patterns like "T*ST???" are nonsensical (the '?…' after '*' have no effect).

Practical outcome shown in the example:
- Files that would be scratched: TEST, TASTY, TESTING123
- File that would not be affected: TOAST

The example uses the standard device command channel sequence (OPEN 15,8,15 — PRINT#15,... — CLOSE 15).

## Source Code
```basic
10 OPEN 15,8,15
20 PRINT#15,"SO:T?ST*"
30 CLOSE 15
```

```text
DOS prompt example:
DOS 5.1: >SO:T?ST*

Files that would be scratched by SO:T?ST*:
- TEST
- TASTY
- TESTING123

File that would NOT be scratched:
- TOAST

Note: Pattern "T*ST???" is meaningless because '*' causes all following characters in the pattern to be ignored.
```

## References
- "question_mark_wildcard_usage_and_example" — covers '?' usage and examples
- "asterisk_wildcard_examples_and_dangers" — covers '*' examples including disk-wide scratch and caveats
