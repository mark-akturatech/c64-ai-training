# DFLTN ($99): Default Input Device

**Summary:** DFLTN at $99 is the RAM byte holding the default input device number (0 = keyboard). The Kernal routine CHKIN (61966, $F20E) writes the device number here when opening an input channel; BASIC uses CHKIN for INPUT# and GET# and clears the channel after the operation.

## Description
DFLTN ($99) contains the device number that represents the current default input device. Its power-up/default value is 0, which designates the keyboard as the input source.

The Kernal entry CHKIN (decimal 61966, hex $F20E) updates DFLTN when it establishes an input channel for a device or file; the value CHKIN stores is the device number that defines that input channel. BASIC invokes CHKIN whenever INPUT# or GET# is executed to set up the channel, and BASIC clears the channel entry after the input operation completes.

Practical implications:
- Reading $99 yields the device number of the last input channel set by CHKIN (0 normally for keyboard).
- Programs that inspect or manipulate device/channel state can consult $99 to detect the current default input device until CHKIN or BASIC clears/changes it.

## Key Registers
- $0099 - RAM - Default input device number (0 = keyboard); updated by Kernal CHKIN ($F20E)

## References
- "dflto_default_output_device_0x9a" — complementary default output device handling
- "ldtnd_open_files_count_and_index_0x98" — file/device table indexing used by CHKIN/CHKOUT

## Labels
- DFLTN
