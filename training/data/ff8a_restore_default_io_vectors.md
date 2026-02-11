# $FF8A — Restore Default I/O Vectors

**Summary:** KERNAL entry point $FF8A restores the default system and interrupt vectors used by the Commodore 64 KERNAL and BASIC.

**Description**

This KERNAL routine resets system vector values to their default addresses, ensuring that KERNAL, BASIC, and interrupt handling routines use the original handlers. The entry point is at $FF8A, which performs a jump to the routine located at $FD15. ([skoolkid.github.io](https://skoolkid.github.io/sk6502/c64rom/asm/FF8A.html?utm_source=openai))

The routine specifically restores the following system vectors:

- **IRQ Vector**: Located at $0314-$0315, defaulting to $EA31.
- **BRK Vector**: Located at $0316-$0317, defaulting to $FE66.
- **NMI Vector**: Located at $0318-$0319, defaulting to $FE47.
- **OPEN Vector**: Located at $031A-$031B, defaulting to $F34A.
- **CLOSE Vector**: Located at $031C-$031D, defaulting to $F291.
- **CHKIN Vector**: Located at $031E-$031F, defaulting to $F20E.
- **CHKOUT Vector**: Located at $0320-$0321, defaulting to $F250.
- **CLRCHN Vector**: Located at $0322-$0323, defaulting to $F333.
- **BASIN Vector**: Located at $0324-$0325, defaulting to $F1CA.
- **BSOUT Vector**: Located at $0326-$0327, defaulting to $F1CA.
- **STOP Vector**: Located at $0328-$0329, defaulting to $F6ED.
- **GETIN Vector**: Located at $032A-$032B, defaulting to $F13E.
- **CLALL Vector**: Located at $032C-$032D, defaulting to $F300.
- **USRCMD Vector**: Located at $032E-$032F, defaulting to $F3D5.
- **LOAD Vector**: Located at $0330-$0331, defaulting to $F4A5.
- **SAVE Vector**: Located at $0332-$0333, defaulting to $F5DD.

These vectors are initialized to point to the corresponding routines in the KERNAL ROM. Since these addresses are in RAM, any entry in this table may be changed. This enables the user to add to these routines or to replace them completely. ([pagetable.com](https://www.pagetable.com/c64ref/c64mem/?utm_source=openai))

## Source Code

The $FF8A entry point performs a jump to the routine at $FD15, which restores the default system vectors. ([skoolkid.github.io](https://skoolkid.github.io/sk6502/c64rom/asm/FF8A.html?utm_source=openai))

```assembly
FF8A: 4C 15 FD  JMP $FD15
```

The routine at $FD15 sets the system vectors to their default values.

## Key Registers

- **Registers Affected**: A, X, Y.

## References

- ([skoolkid.github.io](https://skoolkid.github.io/sk6502/c64rom/asm/FF8A.html?utm_source=openai))
- ([pagetable.com](https://www.pagetable.com/c64ref/c64mem/?utm_source=openai))