# ca65: .ORG inside .struct (6551 ACIA example)

**Summary:** The .ORG keyword inside a ca65 .struct changes the offset assigned to subsequent member names, useful for mapping hardware registers to their absolute addresses (example uses $031C-$031F for a 6551 ACIA). Access members with the struct tag syntax (ACIA::DATA) from code like LDA.

## Description
.ORG adjusts the current member offset within a .struct so following member names receive offsets starting at the specified value. This is commonly used to define register names at fixed I/O addresses inside a struct that represents a chip. The example maps four consecutive byte-sized registers beginning at $031C; member names are then referenced using the struct tag and the scope operator (::), e.g. ACIA::DATA.

- .struct / .endstruct define the named struct scope.
- .org sets the next member's offset (absolute within the struct).
- Members defined after .org inherit sequential offsets according to their declared size (.byte advances by 1).
- Use TAG::MEMBER to refer to the resolved symbol/address in code (e.g., lda ACIA::DATA).

## Source Code
```asm
; 6551
.struct ACIA            ; Asynchronous Communications Interface Adapter
        .org    $031C
DATA    .byte
STATUS  .byte
CMD     .byte           ; Command register
CTRL    .byte           ; Control register
.endstruct

        lda     ACIA::DATA      ; Get an RS-232 character
```

## References
- "struct_tag_keyword" — expands on struct layout and access using :: and .TAG

## Labels
- ACIA::DATA
- ACIA::STATUS
- ACIA::CMD
- ACIA::CTRL
