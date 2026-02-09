# Commodore 64 Keycodes (Appendix H)

**Summary:** List of keyboard keycodes read from memory location 197 (decimal = $00C5) on the Commodore 64; includes mappings for A–Z, 0–9, function and control keys and a BASIC PEEK(197) example.

## Keycode mapping
This table lists the numeric keycode returned at location 197 (PEEK(197) / PEEK($C5)) for the currently pressed key. The value 64 indicates no key pressed. Codes correspond to physical keys (letters, digits, cursor keys, function keys, and special keys) as listed in the source.

## Source Code
```text
Key          Keycode                   Key          Keycode
A            10                        6            19
B            28                        7            24
C            20                        8            27
D            18                        9            32
E            14                        0            35
F            21                        +            40
G            26                        -            43
H            29                        LIRA         48
I            33                        CLR/HOME     51
J            34                        INST/DEL      0
K            37                        LEFT ARROW   57
L            42                        @            46
M            36                        *            49
N            39                        ^            54
O            38                        :            45
P            41                        ;            50
Q            62                        =            53
R            17                        RETURN        1
S            13                        ,            47
T            22                        .            44
U            30                        /            55
V            31                        CRSR UP/DN    7
W             9                        CRSR LF/RT    2
X            23                        F1            4
Y            25                        F3            5
Z            12                        F5            6
1            56                        F7            3
2            59                        SPACE        60
3             8                        RUN/STOP     63
4            11                        NO KEY
5            16                        PRESSED      64
```

```basic
10 PRINT PEEK(197):GOTO 10
```

## Key Registers
- $00C5 - System RAM - Current keyboard keycode (PEEK(197))