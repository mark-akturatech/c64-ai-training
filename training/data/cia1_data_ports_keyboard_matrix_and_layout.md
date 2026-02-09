# CIA #1 Data Ports A and B ($DC00-$DC01) — Keyboard Matrix and Joystick Mapping

**Summary:** CIA #1 Data Ports A and B ($DC00/$DC01) connect the C64 keyboard matrix and joystick inputs to the 6510; Port A is written to select keyboard columns, Port B is read for rows (0 = key pressed). Controller Port 1 is read via Data Port B and Controller Port 2 via Data Port A.

## Keyboard / I/O Overview
CIA #1 Data Ports ($DC00 = Port A, $DC01 = Port B) are the external I/O registers used to communicate with the keyboard matrix and joystick lines.

- The keyboard is arranged as an 8×8 matrix between Port A (columns) and Port B (rows). Port A is driven as outputs to select which column(s) to scan; Port B is read as inputs to observe which row lines are pulled low.
- Typical scan procedure:
  - Configure Data Direction Registers so Port A is outputs and Port B is inputs (Port A DDR = $FF, Port B DDR = $00). This is the default.
  - Write a 0 to the bit in Port A corresponding to the column you want to read; write 1s to other column bits.
  - Read Port B ($DC01). A 0 bit in Port B indicates the key at that row/column intersection is pressed; a 1 indicates not pressed. A read of $FF means no keys in the selected column are pressed.
- The system keyboard scan is normally performed by an interrupt routine at 60 Hz; the Kernal routine SCNKEY at $FF9F (65439) can be used to poll the keyboard when normal IRQ scanning is not suitable.
- Special keys:
  - SHIFT LOCK is mechanical and simply holds left SHIFT closed — it does not appear as a separate matrix key.
  - RESTORE is not read from the matrix; it is tied to the 6510 NMI line and generates an NMI when pressed.
- Joystick mapping (counterintuitive):
  - Controller Port 1 signals are available on CIA Data Port B ($DC01).
  - Controller Port 2 signals are available on CIA Data Port A ($DC00).

See the Source Code section for the full keyboard matrix layout.

## Source Code
```text
$DC00-$DC01               CIA #1 Data Ports A and B

                          These registers are where the actual communication with outside
                          devices takes place.  Bits of data written to these registers can be
                          sent to external devices, while bits of data that those devices send
                          can be read here.

                          The keyboard is so necessary to the computer's operation that you may
                          have a hard time thinking of it as a peripheral device.  Nonetheless,
                          it cannot be directly read by the 6510 microprocessor.  Instead, the
                          keys are connected in a matrix of eight rows by eight columns to CIA
                          #1 Ports A and B.  The layout of this matrix is shown below.

                              WRITE TO PORT A               READ PORT B (56321, $DC01)
                              56320/$DC00
                                       Bit 7   Bit 6   Bit 5   Bit 4   Bit 3   Bit 2   Bit 1   Bit 0

                              Bit 7    STOP    Q       C=      SPACE   2       CTRL    <-      1

                              Bit 6    /       ^       =       RSHIFT  HOME    ;       *       LIRA

                              Bit 5    ,       @       :       .       -       L       P       +

                              Bit 4    N       O       K       M       0       J       I       9

                              Bit 3    V       U       H       B       8       G       Y       7

                              Bit 2    X       T       F       C       6       D       R       5

                              Bit 1    LSHIFT  E       S       Z       4       A       W       3

                              Bit 0    CRSR DN F5      F3      F1      F7      CRSR RT RETURN  DELETE

                          As you can see, there are two keys which do not appear in the matrix.
                          The SHIFT LOCK key is not read as a separate key, but rather is a
                          mechanical device which holds the left SHIFT key switch in a closed
                          position.  The RESTORE key is not read like the other keys either.  It
                          is directly connected to the NMI interrupt line of the 6510
                          microprocessor, and causes an NMI interrupt to occur whenever it is
                          pressed (not just when it is pressed with the STOP key).

                          In order to read the individual keys in the matrix, you must first set
                          Port A for all outputs (255, $FF), and Port B for all inputs (0),
                          using the Data Direction Registers.  Note that this is the default
                          condition.  Next, you must write a 0 in the bit of Data Port A that
                          corresponds to the column that you wish to read, and a 1 to the bits
                          that correspond to columns you wish to ignore.  You will then be able
                          to read Data Port B to see which keys in that column are being pushed.

                          A 0 in any bit position signifies that the key in the corresponding
                          row of the selected column is being pressed, while a 1 indicates that
                          the key is not being pressed.  A value of 255 ($FF) means that no keys
                          in that column are being pressed.

                          Fortunately for us all, an interrupt routine causes the keyboard to be
                          read, and the results are made available to the Operating System
                          automatically every 1/60 second.  And even when the normal interrupt
                          routine cannot be used, you can use the Kernal SCNKEY routine at 65439
                          ($FF9F) to read the keyboard.
```

## Key Registers
- $DC00-$DC01 - CIA #1 - Data Ports A and B (keyboard columns via writes to Port A, rows read from Port B; Controller Port 2 read from Port A, Controller Port 1 read from Port B). Note: 0 = key pressed.

## References
- "cia_data_direction_registers" — expands on Data Direction Registers ($DC02-$DC03) control input/output behavior
- "game_paddle_inputs_and_sid_paddle_reading" — expands on Paddle selection conflicts with keyscan