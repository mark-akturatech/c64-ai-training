# CLOCK TIMING (Appendix L)

**Summary:** This section details the clock timing of the Commodore 64's 6510 CPU, focusing on bus timing for memory and peripheral read/write operations. It includes diagrams illustrating the relationships between clock phases (Φ1 and Φ2), control signals (R/W, RDY), address/data bus activity, and interactions with the VIC-II's DMA and BA signals. Numeric AC timing values are provided in separate tables.

**Clock Timing Overview**

The following diagram illustrates the general clock timing of the 6510 CPU, highlighting the relationships between the clock phases, control signals, and bus activities:

## Source Code

```text
General Clock Timing Diagram:

        ┌───────┐       ┌───────┐       ┌───────┐       ┌───────┐
Φ2      │       │       │       │       │       │       │       │
        │       │       │       │       │       │       │       │
────────┘       └───────┘       └───────┘       └───────┘       └──

        ┌───────────────────────────────────────────────────────┐
Address │                       Valid                           │
        └───────────────────────────────────────────────────────┘

        ┌───────────────────────────────────────────────────────┐
Data    │                       Valid                           │
        └───────────────────────────────────────────────────────┘

        ┌───────────────────────────────────────────────────────┐
R/W     │                                                       │
        └───────────────────────────────────────────────────────┘

        ┌───────────────────────────────────────────────────────┐
RDY     │                                                       │
        └───────────────────────────────────────────────────────┘

        ┌───────────────────────────────────────────────────────┐
BA      │                                                       │
        └───────────────────────────────────────────────────────┘
```
In this diagram:

- **Φ2**: The primary clock phase driving the CPU operations.
- **Address**: The period during which the address bus holds valid data.
- **Data**: The period during which the data bus holds valid data.
- **R/W**: Indicates whether the operation is a read (high) or write (low).
- **RDY**: When low, it inserts wait states, delaying the CPU cycle.
- **BA**: Bus Available signal; when low, the VIC-II is accessing the bus, causing the CPU to wait.

This diagram provides a visual representation of the timing relationships between these signals during CPU operations.

**Timing for Reading Data from Memory or Peripherals**

The following diagram illustrates the timing for reading data from memory or peripherals:

In this diagram:

- **Φ2**: The primary clock phase.
- **Address**: The address bus holds the valid address during this period.
- **Data**: The data bus holds the valid data read from memory or peripherals.
- **R/W**: Set high to indicate a read operation.
- **RDY**: If low, it inserts wait states, extending the read cycle.
- **BA**: When low, indicates the VIC-II is accessing the bus, causing the CPU to wait.

This diagram provides a visual representation of the timing relationships during a read cycle.

**Timing for Writing Data to Memory or Peripherals**

The following diagram illustrates the timing for writing data to memory or peripherals:

In this diagram:

- **Φ2**: The primary clock phase.
- **Address**: The address bus holds the valid address during this period.
- **Data**: The data bus holds the valid data to be written to memory or peripherals.
- **R/W**: Set low to indicate a write operation.
- **RDY**: If low, it inserts wait states, extending the write cycle.
- **BA**: When low, indicates the VIC-II is accessing the bus, causing the CPU to wait.

This diagram provides a visual representation of the timing relationships during a write cycle.

**AC Timing Parameters**

The following table provides the AC timing parameters for the 6510 CPU:

| Parameter                     | Symbol | Min   | Max   | Unit |
|-------------------------------|--------|-------|-------|------|
| Address Valid to Φ2 Rise      | t1     | 10    | -     | ns   |
| Φ2 Rise to Address Hold       | t2     | 0     | -     | ns   |
| Φ2 Rise to R/W Valid          | t3     | 10    | -     | ns   |
| R/W Valid to Φ2 Rise          | t4     | 0     | -     | ns   |
| Data Valid from Φ2 Rise       | t5     | 40    | -     | ns   |
| Data Hold after Φ2 Rise       | t6     | 10    | -     | ns   |
| Φ2 Rise to Data Valid (Write) | t7     | 10    | 100   | ns   |
| Data Hold after Φ2 Rise (Write)| t8    | 10    | -     | ns   |

These parameters define the setup and hold times required for proper operation of the CPU during read and write cycles.

## Source Code

```text
Read Cycle Timing Diagram:

        ┌───────┐       ┌───────┐       ┌───────┐       ┌───────┐
Φ2      │       │       │       │       │       │       │       │
        │       │       │       │       │       │       │       │
────────┘       └───────┘       └───────┘       └───────┘       └──

        ┌───────────────────────────────────────────────────────┐
Address │                       Valid                           │
        └───────────────────────────────────────────────────────┘

        ┌───────────────────────────────────────────────────────┐
Data    │                       Valid                           │
        └───────────────────────────────────────────────────────┘

        ┌───────────────────────────────────────────────────────┐
R/W     │                                                       │
        └───────────────────────────────────────────────────────┘

        ┌───────────────────────────────────────────────────────┐
RDY     │                                                       │
        └───────────────────────────────────────────────────────┘

        ┌───────────────────────────────────────────────────────┐
BA      │                                                       │
        └───────────────────────────────────────────────────────┘
```

```text
Write Cycle Timing Diagram:

        ┌───────┐       ┌───────┐       ┌───────┐       ┌───────┐
Φ2      │       │       │       │       │       │       │       │
        │       │       │       │       │       │       │       │
────────┘       └───────┘       └───────┘       └───────┘       └──

        ┌───────────────────────────────────────────────────────┐
Address │                       Valid                           │
        └───────────────────────────────────────────────────────┘

        ┌───────────────────────────────────────────────────────┐
Data    │                       Valid                           │
        └───────────────────────────────────────────────────────┘

        ┌───────────────────────────────────────────────────────┐
R/W     │                                                       │
        └───────────────────────────────────────────────────────┘

        ┌───────────────────────────────────────────────────────┐
RDY     │                                                       │
        └───────────────────────────────────────────────────────┘

        ┌───────────────────────────────────────────────────────┐
BA      │                                                       │
        └───────────────────────────────────────────────────────┘
```


## References

- "6510_characteristics_maximum_ratings" — DC electrical characteristics and capacitances referenced by timing specs
- "ac_characteristics_and_read_write_timing_tables" — AC tables that provide numeric timing values corresponding to the timing diagrams