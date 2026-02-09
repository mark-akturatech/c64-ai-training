# VIC-II $D018 Character Memory (Charset) Banking — Bits 3-1 Mapping

**Summary:** VIC-II register $D018 bits 3-1 select the character (charset) memory position within the currently selected bank; there are 8 positions spaced $0800 (2048) bytes apart. Offset = (bits 3-1) * $0800 added to the selected bank base. Assembly mask sequence provided for changing only the character bits.

**Overview**
- Bits 3-1 of $D018 choose one of eight character set positions inside the currently selected bank. Each position is separated by $0800 (2048) bytes.
- Effective character memory address = Bank_Base + (Value(bits3-1) * $0800). Values run %000..%111 mapping to offsets $0000..$3800.
- Examples:
  - Bank 0, bits = %010 → address = $0000 + $1000 = $1000 (this is the ROM charset shadow in banks 0 and 2).
  - Bank 1, bits = %111 → address = $4000 + $3800 = $7800.
- To change only the character bits without disturbing screen-base or unused bits, read-modify-write $D018 with masks (preserve other bits then OR in new bits). The exact read/modify/write assembly is in the Source Code section.

## Source Code
```asm
    lda $D018
    and #%11110001    ; preserve screen and unused bits
    ora #%0000xxx0    ; set desired character offset in bits 3-1
    sta $D018
```

```text
Character Memory Offsets (Bits 3-1)

There are 8 possible character set positions within a bank. Each position
is 2048 bytes ($0800) apart. The offset is added to the bank base address.

  $D018 Bits 3-1  | Offset from Bank Base
  -----------------|------------------------------
  %xxxx000x        | $0000  (0)
  %xxxx001x        | $0800  (2048)
  %xxxx010x        | $1000  (4096)
  %xxxx011x        | $1800  (6144)
  %xxxx100x        | $2000  (8192)
  %xxxx101x        | $2800  (10240)
  %xxxx110x        | $3000  (12288)
  %xxxx111x        | $3800  (14336)
```

## Key Registers
- $D018 - VIC-II - Character (charset) memory position bits (bits 3-1), plus screen/base and unused bits

## References
- "d018_bit_layout_and_defaults" — expands on bits 3-1 meaning
- "rom_charset_shadows" — expands on ROM charset mapping in banks 0 and 2