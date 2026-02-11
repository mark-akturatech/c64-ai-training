# CIA#2 Time-of-Day (TOD) Clock — $DD08-$DD0B

**Summary:** CIA#2 Time-of-Day (TOD) clock registers at $DD08-$DD0B provide tenths, seconds, minutes, and hours in BCD (Binary-Coded Decimal); hours include an AM/PM bit. These registers mirror CIA#1 TOD functionality and are used for additional hardware timing on the C64.

**Time of Day**
CIA#2 exposes a four-register Time-of-Day (TOD) clock at $DD08-$DD0B. The four registers hold BCD counters:

- Tenths of seconds (0–9) at $DD08  
- Seconds (0–59) at $DD09  
- Minutes (0–59) at $DD0A  
- Hours (BCD, with AM/PM bit) at $DD0B

The TOD registers behave like CIA#1's TOD registers. Notably:

- **Read/Write Latching Behavior:** Reading any TOD register latches the current time into an internal buffer, freezing the TOD registers' values for consistent reading. Writing to the TOD registers updates the clock time. ([manualslib.com](https://www.manualslib.com/manual/809983/Commodore-Commodore-64.html?utm_source=openai))

- **Alarm Register Interaction:** The TOD clock can be set to trigger an interrupt upon reaching a specified alarm time. This is configured by writing the desired alarm time to the TOD registers and enabling the corresponding interrupt. ([manualslib.com](https://www.manualslib.com/manual/809983/Commodore-Commodore-64.html?utm_source=openai))

- **12/24-Hour Mode:** The TOD clock operates in a 12-hour format with an AM/PM indicator. Bit 7 of the hours register ($DD0B) signifies AM (0) or PM (1). ([manualslib.com](https://www.manualslib.com/manual/809983/Commodore-Commodore-64.html?utm_source=openai))

## Source Code
```text
$DD08   TOD Tenths              Tenth-seconds counter in BCD (0-9)
$DD09   TOD Seconds             Seconds counter in BCD (0-59)
$DD0A   TOD Minutes             Minutes counter in BCD (0-59)
$DD0B   TOD Hours               Hours counter in BCD with AM/PM bit
```

## Key Registers
- $DD08-$DD0B - CIA 2 - Time-of-Day (TOD) registers: tenths, seconds, minutes, hours (hours include AM/PM bit)

## References
- "cia1_time_of_day" — comparison of CIA1 and CIA2 TOD registers
- Commodore 64 Programmer's Reference Manual ([manualslib.com](https://www.manualslib.com/manual/809983/Commodore-Commodore-64.html?utm_source=openai))

## Labels
- CIA2_TOD_TENTHS
- CIA2_TOD_SECONDS
- CIA2_TOD_MINUTES
- CIA2_TOD_HOURS
