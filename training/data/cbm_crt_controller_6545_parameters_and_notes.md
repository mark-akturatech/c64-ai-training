# CBM 8032 / FAT-40 6545 CRT controller — typical register values and notes

**Summary:** Typical 6545 (CRT controller) register values (registers 0–13) as found at $E880/$E881 on the CBM 8032 / FAT-40; fields include Horizontal Total, Characters Displayed, Sync positions, Vertical Total and Adjustment, Scan Lines, Cursor registers, and Register 12 bits (video invert, alternate character set). Registers are write-only; changing Register 0 can damage the CRT.

## Register descriptions
This chunk lists the 6545/CRT controller register indices 0–13 and their typical decimal values for Text and Graphics modes (as provided for the CBM 8032 / FAT-40). Fields shown are common 6545 names: Horizontal Total, Horizontal Characters Displayed, Horizontal Sync Position, V/H Sync widths, Vertical Total, Vertical Total Adjustment, Vertical Displayed, Vertical Sync Position, Mode, Scan Lines, Cursor Start/End (unused here), Display control bits (Register 12), and Address (Register 13).

Important notes from source:
- Registers are write-only.
- Avoid extreme changes to Register 0 — CRT damage could result. Register 0 affects horizontal scan timing and can be used to adjust scan for an external monitor.
- Register 12 bit meanings:
  - Bit 4 = invert video signal.
  - Bit 5 = switch to an alternate character set (rarely implemented; SuperPET is an exception).
- The table values are given in decimal.

(See the Source Code section for the original tabular listing and the numbered notes.)

## Source Code
```text
CBM 8032 and FAT-40 6545 CRT Controller

                                                    Typical Values
                                                       (decimal)

            $E880   $E881                           Text  Graphics
           +------+-------------------------------+
           |   0  |       Horizontal Total        |  49      49
           +------+-------------------------------+
           |   1  |Horizontal Characters Displayed|  40      40
           +------+-------------------------------+
           |   2  |   Horizontal Sync Position    |  41      41
           +------+---+---+---+---+---+---+---+---+
           |   3  | V Sync Width  | H Sync Width  |  15      15
           +------+---+---+---+---+---+---+---+---+
           |   4  |///|      Vertical Total       |  32      40
           +------+---+---+---+---+---+---+---+---+
           |   5  |///////////|V Total Adjustment |   3       5
           +------+---+---+---+---+---+---+---+---+
           |   6  |///|    Vertical Displayed     |  25      25
           +------+---+---+---+---+---+---+---+---+
           |   7  |///|  Vertical Sync Position   |  29      33
           +------+---+---+---+---+---+---+---+---+
           |   8  |///////|         Mode          |   0       0
           +------+---+---+---+---+---+---+---+---+
           |   9  |          Scan Lines           |   9       7
           +------+-------------------------------+
           |  10  |                               |   0       0
           +------+- -  Cursor Start (unused)  - -+
           |  11  |                               |   0       0
           +------+---+---+---+---+---+---+---+---+
           |  12  |///////| C | R |    Display    |  16      16
           +------+---+---+---+---+- -         - -+
           |  13  |                    Address    |   0       0
           +------+-------------------------------+

 NOTES:  1.  Registers are write-only.
         2.  Avoid extreme changes in Register 0.  CRT damage could result.
         3.  Register 0 will adjust scan to allow interfacing to an external
             monitor.
         4.  Register 12, Bit 4, will "invert" the video signal.
         5.  Register 12, Bit 5, switches to an alternate character set.  The
             character set is not implemented on most machines except
             SuperPET.

 Figure C.4
```

## Key Registers
- $E880-$E881 - 6545 CRT controller - write-only CRT controller registers (indices 0–13 listed in table); typical values for Text and Graphics modes and control bits (e.g., Register 12 bits for invert/alternate charset).

## References
- "via_chart_and_timers" — expands on CRT controller interaction with VIA/PIA timers and control