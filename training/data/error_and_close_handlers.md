# Error and Close Handler Routines (byRiclianll)

**Summary:** BASIC failure/cleanup handlers that print returned status codes (EN%, EM%, ET%, ES%), display a visual "FAILED" message with emphasis markers, close the relevant channel (15 or 2), and end execution; also includes a branch that reads final status via INPUT#15 before closing.

**Overview**

This chunk contains three failure branches (identified by line numbers) used by various failure paths:

- **890–930:** Print the status codes EN%, EM%, ET%, ES%, emit a visually emphasized "FAILED" line, CLOSE 15, END.
- **940–960:** Same print/message sequence but closes channel 2. No explicit END shown in the original for this branch.
- **970–990:** Read final status from channel 15 with INPUT#15 into EN%, EM%, ET%, ES%, then CLOSE 15 and END.

Notes:

- The code prints the returned status values (EN%, EM%, ET%, ES%) and uses PETSCII control codes to draw attention to the "FAILED" message.
- INPUT#15 reads the device/driver status from channel 15 before closing in the final branch.
- The source contained OCR/transcription artifacts (typos, garbled characters, missing punctuation) that have been corrected.

## Source Code

```basic
890  REM  CLOSE 

900  PRINT"  {DOWN}  ";EN%;", ";EM%;", ";ET%;", ";ES%
910  PRINT"  {DOWN}  {RVS ON}FAILED{RVS OFF} "
920  CLOSE 15
930  END

940  PRINT"  {DOWN}  ";EN%;", ";EM%;", ";ET%;", ";ES%
950  PRINT"  {DOWN}  {RVS ON}FAILED{RVS OFF} "
960  CLOSE 2
970  INPUT#15,EN%,EM%,ET%,ES%
980  CLOSE 15
990  END
```

## Key Registers

- **EN%**: Error number
- **EM%**: Error message code
- **ET%**: Error type
- **ES%**: Error source

## References

- "write_modified_bytes_back_and_commit" — expands on usage when the write or device response indicates failure
- "finalize_success" — contrasts the success cleanup path