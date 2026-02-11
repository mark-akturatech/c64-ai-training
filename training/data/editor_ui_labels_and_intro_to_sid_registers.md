# Sound Editor — UI labels and SID register introduction

**Summary:** Contains UI label strings for the Sound Editor and the opening paragraph introducing SID register descriptions; references a hex note list in the COMMON file and pointers to per-voice and global SID register reference chunks. Searchable terms: SID, Sound Editor, hex note list, COMMON file, UI labels.

**Editor UI labels (verbatim)**
- "Allowable numbers for the data fields"
- "Allowable letters for the data fields"
- "Transfers the data from the screen to the SID chip and the software timer."

**Sound Editor — opening paragraph (verbatim)**
"A brief description of the registers used by the Sound Editor follows. For a more detailed description of each register, refer to the section on the SID chip. A listing of hexadecimal values for 6+ octaves is provided in the COMMON file for reference."

**Hexadecimal Note Table (from COMMON file)**

Below is the hexadecimal note table for over six octaves, detailing the frequency values to be POKEd into the SID's frequency registers to produce the corresponding musical notes:

| Note | Octave | Frequency (Decimal) | High Byte (Hex) | Low Byte (Hex) |
|------|--------|---------------------|-----------------|----------------|
| C    | 0      | 268                 | 01              | 0C             |
| C#   | 0      | 284                 | 01              | 1C             |
| D    | 0      | 301                 | 01              | 2D             |
| D#   | 0      | 318                 | 01              | 3E             |
| E    | 0      | 337                 | 01              | 51             |
| F    | 0      | 358                 | 01              | 66             |
| F#   | 0      | 379                 | 01              | 7B             |
| G    | 0      | 401                 | 01              | 91             |
| G#   | 0      | 425                 | 01              | A9             |
| A    | 0      | 451                 | 01              | C3             |
| A#   | 0      | 477                 | 01              | DD             |
| B    | 0      | 506                 | 01              | FA             |
| C    | 1      | 536                 | 02              | 18             |
| C#   | 1      | 568                 | 02              | 38             |
| D    | 1      | 602                 | 02              | 5A             |
| D#   | 1      | 637                 | 02              | 7D             |
| E    | 1      | 675                 | 02              | A3             |
| F    | 1      | 716                 | 02              | CC             |
| F#   | 1      | 758                 | 02              | F6             |
| G    | 1      | 803                 | 03              | 23             |
| G#   | 1      | 851                 | 03              | 53             |
| A    | 1      | 902                 | 03              | 86             |
| A#   | 1      | 955                 | 03              | BB             |
| B    | 1      | 1012                | 03              | F4             |
| C    | 2      | 1072                | 04              | 30             |
| C#   | 2      | 1136                | 04              | 70             |
| D    | 2      | 1204                | 04              | B4             |
| D#   | 2      | 1275                | 04              | FB             |
| E    | 2      | 1351                | 05              | 47             |
| F    | 2      | 1432                | 05              | 98             |
| F#   | 2      | 1517                | 05              | ED             |
| G    | 2      | 1607                | 06              | 47             |
| G#   | 2      | 1703                | 06              | A7             |
| A    | 2      | 1804                | 07              | 0C             |
| A#   | 2      | 1911                | 07              | 77             |
| B    | 2      | 2025                | 07              | E9             |
| C    | 3      | 2145                | 08              | 61             |
| C#   | 3      | 2273                | 08              | E1             |
| D    | 3      | 2408                | 09              | 68             |
| D#   | 3      | 2551                | 09              | F7             |
| E    | 3      | 2703                | 0A              | 8F             |
| F    | 3      | 2864                | 0B              | 30             |
| F#   | 3      | 3034                | 0B              | DB             |
| G    | 3      | 3215                | 0C              | 91             |
| G#   | 3      | 3406                | 0D              | 51             |
| A    | 3      | 3608                | 0E              | 1D             |
| A#   | 3      | 3823                | 0E              | F3             |
| B    | 3      | 4050                | 0F              | D6             |
| C    | 4      | 4291                | 10              | C3             |
| C#   | 4      | 4547                | 11              | B3             |
| D    | 4      | 4817                | 12              | AF             |
| D#   | 4      | 5103                | 13              | B7             |
| E    | 4      | 5407                | 14              | CB             |
| F    | 4      | 5728                | 15              | E3             |
| F#   | 4      | 6069                | 17              | 05             |
| G    | 4      | 6430                | 18              | 2E             |
| G#   | 4      | 6812                | 19              | 62             |
| A    | 4      | 7217                | 1A              | A9             |
| A#   | 4      | 7647                | 1B              | FC             |
| B    | 4      | 8101                | 1D              | 5B             |
| C    | 5      | 8583                | 1E              | C7             |
| C#   | 5      | 9094                | 20              | 38             |
| D    | 5      | 9634                | 21              | B6             |
| D#   | 5      | 10207               | 23              | 42             |
| E    | 5      | 10814               | 24              | D5             |
| F    | 5      | 11457               | 26              | 6F             |
| F#   | 5      | 12138               | 28              | 19             |
| G    | 5      | 12860               | 29              | CB             |
| G#   | 5      | 13624               | 2B              | 86             |
| A    | 5      | 14434               | 2D              | 4B             |
| A#   | 5      | 15383               | 2F              | 1A             |
| B    | 5      | 16383               | 30              | FC             |
| C    | 6      | 17436               | 32              | EA             |
| C#   | 6      | 18547               | 34              | EB             |
| D    | 6      | 19717               | 36              | F9             |
| D#   | 6      | 20950               | 39              | 14             |
| E    | 6      | 22248               | 3B              | 3D             |
| F    | 6      | 23615               | 3D              | 74             |
| F#   | 6      | 25055               | 3F              | B9             |
| G    | 6      | 26571               | 42              | 0D             |
| G#   | 6      | 28168               | 44              | 70             |
| A    | 6      | 29849               | 46              | E3             |
| A#   | 6      | 31619               | 49              | 66             |
| B    | 6      | 33482               | 4B              | F2             |
| C    | 7      | 35441               | 4E              | 88             |
| C#   | 7      | 37502               | 51              | 28             |
| D    | 7      | 39669               | 53              | D2             |
| D#   | 7      | 41947               | 56              | 8E             |
| E    | 7      | 44340               | 59              | 55             |
| F    | 7      | 46853               | 5C              | 2F             |
| F#   | 7      | 49491               | 5F              | 1C             |
| G    | 7      | 52259               | 62              | 1C             |
| G#   | 7      | 55162               | 65              | 2F             |
| A    | 7      | 58106               | 68              | 55             |
| A#   | 7      | 61197               | 6B              | 8F             |
| B