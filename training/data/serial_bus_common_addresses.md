# Common Serial Bus Device Addresses (Commodore 64)

**Summary:** Common Commodore serial bus device addresses and example mappings: VIC-1525 graphic printer commonly uses address 4 or 5, and the VIC-1541 disk drive commonly uses address 8. Other device addresses are possible and some devices allow selecting between multiple addresses.

## Common Serial Bus Addresses
This chunk lists frequently used IEC/serial-bus device addresses and the devices that commonly use them. It explicitly notes that these are examples only — the serial bus supports other addresses and some devices can be configured to use one of several addresses.

- VIC-1525 graphic printer — commonly 4 or 5
- VIC-1541 disk drive — commonly 8

Do not assume these are exclusive; check the device documentation or use device-specific configuration (secondary address or firmware switches) when multiple devices are present.

## Source Code
```text
                         COMMON SERIAL BUS ADDRESSES
                    +--------+--------------------------+
                    | NUMBER |        DEVICE            |
                    +--------+--------------------------+
                    | 4 or 5 | VIC-1525 GRAPHIC PRINTER |
                    | 8      | VIC-1541 DISK DRIVE      |
                    +--------+--------------------------+
```

## References
- "serial_bus_overview" — expands on context for address ranges and bus roles
- "serial_bus_secondary_address_and_open_syntax" — expands on secondary address usage for device configuration (OPEN command example)