# I/O response display and failure handler (label 1840)

**Summary:** BASIC routine at label 1840 that prints a prepared command/status string (cc$), reads device reply bytes via INPUT#1 (en, em$, et, es), displays a compact status line, and branches into an operator "continue?" prompt on errors (en>=2). Used centrally by format/open/write/read/track commands.

## Description
This routine centralizes handling of device replies for disk operations. Behavior:
- Prints the prepared command/status text stored in cc$.
- Performs INPUT#1,en,em$,et,es to read the drive's status/error response into variables:
  - en — numeric error/status code
  - em$ — first text field (error/message)
  - et, es — additional text fields returned by the device
- Prints a compact status line (at column 12) containing en, em$, et and es.
- If en<2 (defined here as the success/OK range) the routine returns immediately.
- On error (en>=2) it prints an error message ("unit is failing" and "performance test"), saves ti$ to a temporary tm$, performs the "continue?" operator prompt via GOSUB 1750, restores ti$ from tm$, and returns.
- This routine is invoked after file- and track-level operations to check status and present the operator with the option to continue on failure.

## Source Code
```basic
1820 :
1830 :
1840 print cc$
1850 input#1,en,em$,et,es
1860 print tab(12)""en;em$;et;es;""
1870 if en<2 then return
1880 print "{down} unit is failing"
1890 print "{down}   performance test"
1900 tm$=ti$:gosub 1750:ti$=tm$:return
1910 :
```

## References
- "perftest_continue_prompt" — expands on prompts asking the operator whether to continue after a failure
- "perftest_mechanical_file_test" — invoked after file open/write/read operations; GOSUB 1840 checks status
- "perftest_track_write_read_test" — invoked after track-level commands; GOSUB 1840 checks status
