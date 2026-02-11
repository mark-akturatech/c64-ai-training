# Initialization sequence: zero-page setup, JSR, JMP vector install, drive/LED

**Summary:** Initializes zero-page ($007F), calls a routine at $C100 (JSR $C100), installs a three-byte JMP vector at $0600-$0602 ($4C $C7 $FA → JMP $FAC7), and sets drive/LED state via $0003. Includes inline comments marking DRIVE NUMBER, LED, and the jump target.

## Initialization sequence
This code performs a small startup sequence:
- Clears a zero-page byte at $007F (LDA #$00 / STA $007F).
- Calls a subroutine at $C100 (JSR $C100).
- Patches a three-byte JMP vector into $0600..$0602: opcode $4C (JMP absolute), low byte $C7, high byte $FA — producing JMP $FAC7 when executed.
- Writes $E0 to $0003 to set drive/LED state (commented in source as DRIVE NUMBER / LED).

Byte ordering note: the vector is written as [opcode $4C] [low-byte $C7] [high-byte $FA], forming a 6502 absolute JMP to $FAC7.

## Source Code
```asm
        ; Initialization sequence

        LDA  #$00
        STA  $007F

        JSR  $C100

        LDA  #$4C        ; JMP opcode (JMP absolute)
        STA  $0600
        LDA  #$C7        ; low byte of $FAC7
        STA  $0601
        LDA  #$FA        ; high byte of $FAC7
        STA  $0602

        LDA  #$E0
        STA  $0003       ; DRIVE NUMBER / LED

        ;   DRIVE  NUMBER
        ;  LED

        ;    JUMP  TO  $FAC7
```

## Key Registers
- $007F - Memory - zero-page byte cleared by initialization
- $C100 - Memory - JSR target (subroutine call)
- $0600-$0602 - Memory - three-byte JMP vector written ($4C,$C7,$FA → JMP $FAC7)
- $0003 - Memory - drive/LED control byte written ($E0)

## References
- "assembler_directives_origin_equates" — expands on Equates and ORG/origin used by the code being initialized
- "table_load_id_bytes_loop" — expands on the main TABLE loop that follows initialization and uses this initialized state