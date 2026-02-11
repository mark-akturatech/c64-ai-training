# Kernal vectors $031A-$0333 — IOPEN..ISAVE (794–819)

**Summary:** Kernal indirect vectors at $031A–$0333 (decimal 794–819) for device/file I/O and control: IOPEN, ICLOSE, ICHKIN, ICKOUT, ICLRCH, IBASIN, IBSOUT, ISTOP (STOP key handling with POKE values), IGETIN, ICLALL, USRCMD (PET holdover), ILOAD, ISAVE. Each vector holds a 16-bit address pointing to the Kernal routine and can be modified.

## Kernal vector descriptions
These memory locations form the standard Kernal indirect-vector table used by BASIC and the Kernal for high-level I/O and related services. Each vector contains a two-byte address (low, high) that the system JSRs to when the service is needed; replacing a vector redirects that service.

Concise list of vectors (name, table slot, functionality, current Kernal target address as listed in source):

- IOPEN ($031A-$031B, bytes 794–795): Vector to Kernal OPEN routine (OPEN). Currently points to $F34A (decimal 62282).
- ICLOSE ($031C-$031D, 796–797): Vector to Kernal CLOSE routine (CLOSE). Currently points to $F291 (decimal 62097).
- ICHKIN ($031E-$031F, 798–799): Vector to Kernal CHKIN routine (CHKIN). Currently points to $F20E (decimal 61966).
- ICKOUT ($0320-$0321, 800–801): Vector to Kernal CKOUT routine (CKOUT). Currently points to $F250 (decimal 62032).
- ICLRCH ($0322-$0323, 802–803): Vector to Kernal CLRCHN routine (CLRCHN). Currently points to $F333 (decimal 62259).
- IBASIN ($0324-$0325, 804–805): Vector to Kernal CHRIN routine (CHRIN). Currently points to $F157 (decimal 61783).
- IBSOUT ($0326-$0327, 806–807): Vector to Kernal CHROUT routine (CHROUT). Currently points to $F1CA (decimal 61898).
- ISTOP ($0328-$0329, 808–809): Vector to Kernal STOP routine (STOP), which tests the STOP key. Currently points to $F6ED (decimal 63213).
  - STOP handling notes (from source): The STOP key test can be altered by poking the low byte of the ISTOP vector (decimal address 808 in many references):
    - POKE 808,239 — disables the STOP key test (leaves STOP/RESTORE still functional).
    - POKE 808,234 — disables both STOP and STOP/RESTORE combinations (but causes LIST to malfunction).
    - POKE 808,237 — restores normal STOP behavior.
- IGETIN ($032A-$032B, 810–811): Vector to Kernal GETIN routine (GETIN). Currently points to $F13E (decimal 61758).
- ICLALL ($032C-$032D, 812–813): Vector to Kernal CLALL routine (CLALL). Currently points to $F32F (decimal 62255).
- USRCMD ($032E-$032F, 814–815): User-defined command vector (historical PET monitor holdover). Currently initialized to BRK handler at $FE66 (decimal 65126). The vector is updated by the Kernal VECTOR routine ($FD1A / decimal 64794) but does not practically add new monitor commands on the C64.
- ILOAD ($0330-$0331, 816–817): Vector to Kernal LOAD routine (LOAD). Currently points to $F49E (decimal 62622).
- ISAVE ($0332-$0333, 818–819): Vector to Kernal SAVE routine (SAVE). Currently points to $F5DD (decimal 62941).

Behavioral notes:
- Changing any of these two-byte vectors redirects the system to your replacement routine (typical technique for device hooks, custom I/O handlers, or trapping operations).
- USRCMD is a compatibility artifact from PET monitors; the C64 Kernal initializes and updates it but it is not commonly used for adding commands.
- The ISTOP vector affects STOP-key handling; altering it can disable STOP but has side effects (e.g., LIST behavior) as noted above.

## Source Code
```text
794-795       $31A-$31B      IOPEN
Vector to Kernal OPEN Routine (Currently at 62282 ($F34A))

796-797       $31C-$31D      ICLOSE
Vector to Kernal CLOSE Routine (Currently at 62097 ($F291))

798-799       $31E-$31F      ICHKIN
Vector to Kernal CHKIN Routine (Currently at 61966 ($F20E))

800-801       $320-$321      ICKOUT
Vector to Kernal CKOUT Routine (Currently at 62032 ($F250))

802-803       $322-$323      ICLRCH
Vector to Kernal CLRCHN Routine (Currently at 62259 ($F333))

804-805       $324-$325      IBASIN
Vector to Kernal CHRIN Routine (Currently at 61783 ($F157))

806-807       $326-$327      IBSOUT
Vector to Kernal CHROUT Routine (Currently at 61898 ($F1CA))

808-809       $328-$329      ISTOP
Vector to Kernal STOP Routine (Currently at 63213 ($F6ED))

This vector points to the address of the routine that tests the STOP
key.  The STOP key can be disabled by changing this with a POKE
808,239.  This will not disable the STOP/RESTORE combination, however.
To disable both STOP and STOP/ RESTORE, POKE 808,234 (POKEing 234 here
will cause the LIST command not to function properly).  To bring
things back to normal in either case, POKE 808, 237.

810-811       $32A-$32B      IGETIN
Vector to Kernal GETIN Routine (Currently at 61758 ($F13E))

812-813       $32C-$32D      ICLALL
Vector to Kernal CLALL Routine (Currently at 62255 ($F32F))

814-815       $32E-$32F      USRCMD
Vector to User-Defined Command (Currently Points to BRK at 65126
($FE66))

This appears to be a holdover from PET days, when the built-in machine
language monitor would JuMP through the USRCMD vector when it
encountered a command that it did not understand, allowing the user to
add new commands to the monitor.

Although this vector is initialized to point to the routine called by
STOP/ RESTORE and the BRK interrupt, and is updated by the Kernal
VECTOR routine (64794, $FD1A), it does not seem to have the function
of aiding in the addition of new commands.

816-817       $330-$331      ILOAD
Vector to Kernal LOAD Routine (Currently at 62622 ($F49E))

818-819       $332-$333      ISAVE
Vector: Kernal SAVE Routine (Currently at 62941 ($F5DD))
```

## Key Registers
- $031A-$031B - Kernal vector - IOPEN: Vector to OPEN routine (points to $F34A)
- $031C-$031D - Kernal vector - ICLOSE: Vector to CLOSE routine (points to $F291)
- $031E-$031F - Kernal vector - ICHKIN: Vector to CHKIN routine (points to $F20E)
- $0320-$0321 - Kernal vector - ICKOUT: Vector to CKOUT routine (points to $F250)
- $0322-$0323 - Kernal vector - ICLRCH: Vector to CLRCHN routine (points to $F333)
- $0324-$0325 - Kernal vector - IBASIN: Vector to CHRIN routine (points to $F157)
- $0326-$0327 - Kernal vector - IBSOUT: Vector to CHROUT routine (points to $F1CA)
- $0328-$0329 - Kernal vector - ISTOP: Vector to STOP routine (points to $F6ED)
- $032A-$032B - Kernal vector - IGETIN: Vector to GETIN routine (points to $F13E)
- $032C-$032D - Kernal vector - ICLALL: Vector to CLALL routine (points to $F32F)
- $032E-$032F - Kernal vector - USRCMD: Vector for user-command hook (points to $FE66)
- $0330-$0331 - Kernal vector - ILOAD: Vector to LOAD routine (points to $F49E)
- $0332-$0333 - Kernal vector - ISAVE: Vector to SAVE routine (points to $F5DD)

## References
- "kernal_indirect_vectors_overview" — expands on how and why these vectors can be changed
- "tbuffer_cassette_io_buffer" — expands on Kernal I/O vectors used when accessing the cassette device which uses TBUFFER

## Labels
- IOPEN
- ICLOSE
- ICHKIN
- ICKOUT
- IBASIN
- IBSOUT
- ILOAD
- ISAVE
