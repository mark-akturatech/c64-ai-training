# IEC Serial Bus Talk/Listen Command Opcodes

**Summary:** List of IEC serial-bus command opcodes sent under ATN for LISTEN/TALK/SECOND/OPEN/CLOSE and their encodings (e.g. LISTEN = $20 + PA, TALK = $40 + PA, SECOND = $60 + SA, OPEN = $F0 + SA). Includes address ranges: PA (0–30) and SA (0–15).

## Description
These opcodes are the command-byte encodings used on the Commodore IEC serial bus while ATN (attention) is asserted (sent while ATN is asserted). Commands that target a primary address (PA) are encoded as a base byte plus the PA; commands that target a secondary address (SA, a channel number) are encoded as a base byte plus the SA. UNLISTEN and UNTALK are single-byte global commands that clear the receive/send state.

- Primary Address (PA): 0–30
- Secondary Address (SA): 0–15
- Commands are transmitted while ATN is held (ATN command mode).

Common encodings:
- LISTEN: device becomes a receiver; encoded as $20 + PA
- TALK: device becomes a sender; encoded as $40 + PA
- SECOND: select secondary address (channel); encoded as $60 + SA
- OPEN: associate channel with a filename; encoded as $F0 + SA
- CLOSE: dissociate channel from filename; encoded as $E0 + SA
- UNLISTEN: all devices stop receiving; $3F
- UNTALK: all devices stop sending; $5F

Examples:
- LISTEN for PA = 8 → send $20 + $08 = $28
- TALK for PA = 8 → send $40 + $08 = $48
- SECOND for SA = 2 → send $60 + $02 = $62

## Source Code
```text
Command     Hex Code        Effect
---------   -------------   ----------------------------------------
LISTEN      $20 + PA        Device at PA becomes a receiver
UNLISTEN    $3F             All devices stop receiving
TALK        $40 + PA        Device at PA becomes a sender
UNTALK      $5F             All devices stop sending
SECOND      $60 + SA        Select secondary address (channel)
CLOSE       $E0 + SA        Dissociate channel from filename
OPEN        $F0 + SA        Associate channel with filename

PA = Primary Address (0-30)
SA = Secondary Address (0-15)
```

Additional numeric ranges (derived):
```text
LISTEN range: $20 .. $3E   (PA 0..30)
UNLISTEN:     $3F
TALK range:   $40 .. $5E   (PA 0..30)
UNTALK:       $5F
SECOND range: $60 .. $6F   (SA 0..15)
CLOSE range:  $E0 .. $EF   (SA 0..15)
OPEN range:   $F0 .. $FF   (SA 0..15)
```

## Key Registers
- (none)

## References
- "atn_command_mode" — expands on commands being sent while ATN is held
- "kernal_low_level_calls" — expands on KERNAL routines that issue these commands