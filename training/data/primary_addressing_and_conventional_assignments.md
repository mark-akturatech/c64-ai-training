# IEC Serial Bus — Primary Addressing (PA 0–30)

**Summary:** Defines IEC serial-bus Primary Addresses (PA) used to uniquely address devices on the Commodore IEC bus; PAs range 0–30 with conventional assignments (printers, plotters, disk drives, third‑party devices). See "command_codes" and "named_channels" for how LISTEN/TALK and OPEN/CLOSE/SECOND encode and use PAs.

**Primary Addressing**
Each device on the IEC serial bus is assigned a unique Primary Address (PA) in the range 0–30. Primary Addresses identify devices for LISTEN/TALK commands and for file/channel operations (OPEN/CLOSE/SECOND); encoding details are covered in the referenced "command_codes" and "named_channels" documents.

Conventional PA assignments:
- PA 4–5: Printers
- PA 6–7: Plotters
- PA 8–11: Disk drives and hard disks
- PA 12–30: Third‑party devices

Devices must be configured to avoid address collisions (each device on the bus needs a unique PA). The conventions above are common but not mandatory — manufacturers may choose other PAs within 0–30.

**Reserved Addresses:**
- PA 0–3: Reserved for internal devices and not associated with the IEC bus. Specifically:
  - PA 0: Keyboard
  - PA 1: Datasette (cassette port)
  - PA 2: RS-232 on user port or second cassette on older units
  - PA 3: Screen
- PA 31: Reserved as a command to all devices; sending a TALK command to PA 31 means UNTALK, and sending a LISTEN command to PA 31 means UNLISTEN. ([janderogee.com](https://janderogee.com/projects/1541-III/files/pdf/IEC_disected-IEC_1541_info.pdf?utm_source=openai))

## References
- "command_codes" — encoding of LISTEN/TALK using $20/$40 + PA
- "named_channels" — relation of OPEN/CLOSE/SECOND to primary addressing