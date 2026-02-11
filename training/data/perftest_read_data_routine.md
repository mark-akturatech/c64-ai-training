# Read-data subroutine (BASIC lines 1980–2060)

**Summary:** BASIC subroutine that verifies file integrity by reading records with INPUT# ch,j, comparing each record to the expected index (FOR i=1000 TO 2000), reporting errors with GOSUB 1850 (I/O status/response handler), and closing the channel with CLOSE ch.

## Description
Prints "reading data" and waits for a keypress (GET a$) to start. Loops i from 1000 to 2000, performing INPUT# ch,j to read each record from the open file channel variable ch. If the read value j does not equal the expected index i it prints a reverse-video "read error:" and calls the I/O status/response routine at line 1850. After completing the loop it calls the same I/O status routine once more, closes the channel (CLOSE ch) and returns. Intended to verify that data written earlier matches expected sequential indices.

## Source Code
```basic
1980 :
1990 PRINT "reading data"
2000 GET A$
2010 FOR I=1000 TO 2000
2020 INPUT# CH,J
2030 IF J<>I THEN PRINT "{reverse on}read error:{reverse off}": GOSUB 1850
2040 NEXT
2050 GOSUB 1850
2060 CLOSE CH: RETURN
```

## References
- "perftest_io_response_handler" — expands on the I/O response display routine called at GOSUB 1850
- "perftest_mechanical_file_test" — expands on the higher-level file test that invokes this read step (GOSUB 1990)