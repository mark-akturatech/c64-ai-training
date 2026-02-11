# TI$ (TIME$) — BASIC time string

**Summary:** TI$ is a Commodore 64 BASIC system variable that returns a 6-character string in the format HHMMSS (hours, minutes, seconds), representing the time elapsed since the computer was powered on. This value is derived from the system's jiffy clock, which increments every 1/60th of a second. TI$ can be assigned a specific starting value but may become inaccurate after tape I/O operations.

**Description**

TI$ provides the current system uptime as a six-character string formatted as HHMMSS, where:

- **HH**: Hours (00–23)
- **MM**: Minutes (00–59)
- **SS**: Seconds (00–59)

The time is maintained by the system's jiffy clock, which counts in 1/60th of a second increments. This clock starts at "000000" upon power-up and increments accordingly. The TI$ variable can be set to a specific time by assigning it a string in the HHMMSS format, such as `TI$ = "120000"` to set the time to 12:00:00. Assigning a value to TI$ also sets the numeric timer TI to the corresponding value in jiffies (1/60th of a second). ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_2/page_089.html?utm_source=openai))

**Important Notes:**

- **Accuracy**: The jiffy clock may become inaccurate after tape I/O operations, as the timer is temporarily halted during these processes. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_2/page_089.html?utm_source=openai))
- **Overflow Behavior**: TI$ counts up to "235959" (23:59:59) and then rolls over to "000000" (00:00:00). ([c64-wiki.com](https://www.c64-wiki.com/wiki/TIME%24?utm_source=openai))
- **Variable Naming**: In Commodore BASIC, only the first two characters of variable names are significant. Therefore, TI$ can also be referred to as TIME$ or TIMER$, but using longer names may slightly impact performance due to additional parsing. ([c64-wiki.com](https://www.c64-wiki.com/wiki/TIME%24?utm_source=openai))

## Source Code

```basic
1 TI$ = "000000": FOR J=1 TO 10000: NEXT: PRINT TI$
```

This example sets the system time to "000000" (midnight), performs a loop to simulate a passage of time, and then prints the updated time.

## References

- "time_function" — expands on TI (numeric jiffy clock) and relationship to TI$ (formatted time)

## Labels
- TI$
- TI
