# COMMODORE 64 — SCREEN CODES (SET 1 & SET 2, POKE 0–127)

**Summary:** PETSCII / C64 screen-code table mapping SET 1 and SET 2 glyphs to POKE values (0–127). Includes the boxed NOTE listing POKE values that render the same in both sets, the three-column printed table, and the final note that codes 128–255 are reversed images of 0–127.

**Overview**
This chunk reproduces the Commodore 64 manual's SCREEN CODES table (SET 1 / SET 2) and the boxed NOTE about identical glyphs between sets. The table is a three-column print of the mappings for POKE codes 0–127 (as presented in the manual), showing the character displayed for SET 1 and SET 2 at each POKE value. The manual also states that codes 128–255 are the reversed (inverse) bitmaps of codes 0–127.

Do not assume graphics inversion vs. PETSCII semantics beyond what's shown here — the printed table is a presentational reference for screen memory byte values.

## Source Code
```text
+-----------------------------------------------------------------------+
| NOTE: The following POKEs display the same symbol in set 1 and 2: 1,  |
| 27-64, 91-93, 96-104, 106-121, 123-127.                               |
+-----------------------------------------------------------------------+

SCREEN CODES

  SET 1   SET 2   POKE  |  SET 1   SET 2   POKE  |  SET 1   SET 2   POKE
------------------------+------------------------+-----------------------
    @       @       0   |    C       c       3   |    F       f       6
    A       a       1   |    D       d       4   |    G       g       7
    B       b       2   |    E       e       5   |    H       h       8
    I       i       9   |    %       %      37   |    A       A      65
    J       j      10   |    &       &      38   |    B       B      66
    K       k      11   |    '       '      39   |    C       C      67
    L       l      12   |    (       (      40   |    D       D      68
    M       m      13   |    )       )      41   |    E       E      69
    N       n      14   |    *       *      42   |    F       F      70
    O       o      15   |    +       +      43   |    G       G      71
    P       p      16   |    ,       ,      44   |    H       H      72
    Q       q      17   |    -       -      45   |    I       I      73
    R       r      18   |    .       .      46   |    J       J      74
    S       s      19   |    /       /      47   |    K       K      75
    T       t      20   |    0       0      48   |    L       L      76
    U       u      21   |    1       1      49   |    M       M      77
    V       v      22   |    2       2      50   |    N       N      78
    W       w      23   |    3       3      51   |    O       O      79
    X       x      24   |    4       4      52   |    P       P      80
    Y       y      25   |    5       5      53   |    Q       Q      81
    Z       z      26   |    6       6      54   |    R       R      82
    [       [      27   |    7       7      55   |    S       S      83
  pound   pound    28   |    8       8      56   |    T       T      84
    ]       ]      29   |    9       9      57   |    U       U      85
    ↑       ↑      30   |    :       :      58   |    V       V      86
    ←       ←      31   |    ;       ;      59   |    W       W      87
  SPACE   SPACE    32   |    <       <      60   |    X       X      88
    !       !      33   |    =       =      61   |    Y       Y      89
    "       "      34   |    >       >      62   |    Z       Z      90
    #       #      35   |    ?       ?      63   |    [       [      91
    $       $      36   |    @       @      64   |    £       £      92
    *       *      93   |    *       *      105  |    *       *      117
    +       +      94   |    +       +      106  |    +       +      118
    ,       ,      95   |    ,       ,      107  |    ,       ,      119
  SPACE   SPACE    96   |  SPACE   SPACE    108  |  SPACE   SPACE    120
    a       A      97   |    k       K      109  |    u       U      121
    b       B      98   |    l       L      110  |    v       V      122
    c       C      99   |    m       M      111  |    w       W      123
    d       D     100   |    n       N      112  |    x       X      124
    e       E     101   |    o       O      113  |    y       Y      125
    f       F     102   |    p       P      114  |    z       Z      126
    g       G     103   |    q       Q      115  |    0       0      127
    h       H     104   |    r       R      116  |
```

Codes from 128–255 are reversed images of codes 0–127.

## References
- "screen_display_codes_overview" — expands on overview and usage examples (how to POKE codes into screen memory, switching character sets, reversing characters, and color memory references)