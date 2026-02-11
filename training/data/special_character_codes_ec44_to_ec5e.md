# Commodore 64 ROM: Special character-code handling and case switching ($EC44-$EC62)

**Summary:** Disassembly of ROM code handling special decoded character codes at $EC44–$EC62. Detects SWITCH TO LOWER CASE ($0E) and SWITCH TO UPPER CASE ($8E) by modifying $D018 (VIC-II memory configuration/character base) and checks the [SHIFT]+[C=] disable/lock code ($08) to set a lock bit ($80). Contains branch to $E6A8 to restore registers and set the quote flag.

## Behavior
This code fragment inspects a decoded character value and implements three special actions:

- If the decoded value equals $0E (SWITCH TO LOWER CASE), set the character-memory selection bit in $D018 so the system uses the lower-case character set (ORA #$02 then store).
  - The ORA #$02 produces a non-zero result, so the following BNE to $EC58 is effectively taken to proceed to save $D018.
  - Comment in source: "mask xxxx xx1x, set lower case characters".
- Otherwise, if the decoded value equals $8E (SWITCH TO UPPER CASE), clear that bit in $D018 (AND #$FD then store) to select the upper-case character set.
  - Comment in source: "mask xxxx xx0x, set upper case characters".
- If neither case-switch code matched, compare with $08 to detect the [SHIFT]+[C=] disable/lock code. If equal, load #$80 (sets a lock bit) to enable locking behavior (the value is later saved/used by the restore routine).

When the character-base byte in $D018 is changed, the code stores the new value to $D018 and jumps to $E6A8, which (per the source comment) restores registers, sets the quote flag and exits.

(All numeric values and addresses are preserved exactly from the disassembly. $D018 is the VIC-II memory configuration / character memory pointer register.)

## Source Code
```asm
.,EC44 C9 0E    CMP #$0E        compare with [SWITCH TO LOWER CASE]
.,EC46 D0 07    BNE $EC4F       if not [SWITCH TO LOWER CASE] skip the switch
.,EC48 AD 18 D0 LDA $D018       get the start of character memory address
.,EC4B 09 02    ORA #$02        mask xxxx xx1x, set lower case characters
.,EC4D D0 09    BNE $EC58       go save the new value, branch always
                                check for special character codes except fro switch to lower case
.,EC4F C9 8E    CMP #$8E        compare with [SWITCH TO UPPER CASE]
.,EC51 D0 0B    BNE $EC5E       if not [SWITCH TO UPPER CASE] go do the [SHIFT]+[C=] key
                                check
.,EC53 AD 18 D0 LDA $D018       get the start of character memory address
.,EC56 29 FD    AND #$FD        mask xxxx xx0x, set upper case characters
.,EC58 8D 18 D0 STA $D018       save the start of character memory address
.,EC5B 4C A8 E6 JMP $E6A8       restore the registers, set the quote flag and exit
                                do the [SHIFT]+[C=] key check
.,EC5E C9 08    CMP #$08        compare with disable [SHIFT][C=]
.,EC60 D0 07    BNE $EC69       if not disable [SHIFT][C=] skip the set
.,EC62 A9 80    LDA #$80        set to lock shift mode switch
```

## Key Registers
- $D018 - VIC-II - memory configuration register (character/screen memory pointer; controls which character set is used)

## References
- "key_decode_tables_eb79_ec43" — expands on special codes produced by the decode tables
- "evaluate_shift_ctrl_c_keys_eb48_to_eb76" — expands on how SHIFT+C= handling interacts with locking/toggling behavior