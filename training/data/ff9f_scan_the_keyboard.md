# $FF9F — KERNAL: Scan the keyboard

**Summary:** $FF9F is the KERNAL routine that scans the keyboard matrix (used by the IRQ handler and for polled input); if a key is detected, it places the corresponding ASCII value into the keyboard queue.

**Description**
This routine performs a keyboard matrix scan and checks for pressed keys. It is the same routine invoked by the interrupt (IRQ) handler to detect keypresses during IRQ-driven input processing. When a key is found, the routine converts the key event to its ASCII code and places that ASCII value into the system keyboard queue for later retrieval by higher-level input routines.

Behavior points explicitly stated in the source:
- **Address:** $FF9F
- **Purpose:** Scan keyboard matrix and check for pressed keys
- **Caller:** Same routine called by the IRQ handler (used both in IRQ and polled modes)
- **Result:** ASCII value of pressed key is placed into the keyboard queue

**Keyboard Matrix Mapping and Scan Order**
The Commodore 64 keyboard consists of an 8x8 matrix, with rows connected to Port B and columns to Port A of CIA #1. The scanning process involves setting one column low at a time and reading the rows to detect key presses.

**Keyboard Matrix Layout:**


**Scan Order:**
1. Set one bit low in Port A ($DC00) to select a column.
2. Read Port B ($DC01) to check which keys in that column are pressed.
3. Repeat for each column.

**Keyboard Queue Details**
The keyboard queue is a circular buffer located at memory addresses $0277–$0280. It holds up to 10 keypresses, storing their PETSCII codes. The head and tail pointers manage the queue's state.

**Key Event to ASCII Mapping**
Key events are converted to PETSCII codes using a lookup table. The matrix code of the keypress is stored at location $CB, and the status of the shift keys is stored at location $028D. The routine uses these values to determine the correct PETSCII code.

**Debounce and Key Repeat Behavior**
The KERNAL handles key debounce and repeat by scanning the keyboard approximately every 1/60th of a second during the IRQ routine. If a key remains pressed for a certain number of scans, it is considered held, and the repeat behavior is triggered. The exact timing and thresholds are managed internally by the KERNAL.

**Hardware Interaction**
The keyboard scanning routine interacts with CIA #1 as follows:
- **Port A ($DC00):** Configured as output to select keyboard columns.
- **Port B ($DC01):** Configured as input to read keyboard rows.

**Bit-Level Register Usage:**
- **Port A ($DC00):** Each bit corresponds to a column; setting a bit low selects that column.
- **Port B ($DC01):** Each bit corresponds to a row; reading the bits determines which keys in the selected column are pressed.

**Interaction with Higher-Level KERNAL Input Routines**
The $FF9F routine updates the keyboard buffer and status flags used by higher-level KERNAL input routines. For example, the GETIN routine ($FFE4) retrieves characters from the keyboard buffer populated by SCNKEY.

## Source Code

```
    PA0  PA1  PA2  PA3  PA4  PA5  PA6  PA7
PB0  DEL  RET  CUR  F7   F1   F3   F5   CUR
PB1  3    W    A    4    Z    S    E    LSH
PB2  5    R    D    6    C    F    T    X
PB3  7    Y    G    8    B    H    U    V
PB4  9    I    J    0    M    K    O    N
PB5  +    P    L    -    .    :    @    ,
PB6  £    *    ;    HOME =    ]    ↑    /
PB7  1    ←    CTRL 2    SPC  Q    STOP RSH
```


## References
- "ffe4_get_character_from_input_device" — expands on keyboard input retrieval
- "ffea_increment_realtime_clock" — expands on IRQ vs polled scanning interplay

## Labels
- SCNKEY
