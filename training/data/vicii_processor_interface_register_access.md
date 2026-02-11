# VIC-II Processor Interface and Register Access Rules

**Summary:** VIC-II processor interface signals and rules for register access: DATA BUS (DB7-DB0) bidirectional only when AEC and Phase 0 are high and /CS is low; CHIP SELECT (/CS) recognized only while AEC and Phase 0 are high; READ/WRITE (R/W) defines transfer direction; ADDRESS BUS (A5-A0) low-order address pins select device registers. Terms: VIC-II, AEC, PH0, /CS, R/W, DB7-DB0, A5-A0.

## Processor interface
Aside from special memory accesses, the VIC-II registers are accessed like any other peripheral device using the processor interface signals described below. These signals control when and how the CPU can read from and write to the VIC-II register set.

## DATA BUS (DB7-DB0)
The eight data-bus pins are a bidirectional data port controlled by /CS, R/W, and Phase 0. The data bus is available to the processor only while AEC and Phase 0 (PH0) are high and /CS is low. Outside of those conditions the device does not drive the bus for processor register accesses.

## CHIP SELECT (/CS)
The chip-select input (/CS) is driven low to enable access to the device registers in conjunction with the address and R/W pins. A /CS low is recognized only while AEC and Phase 0 are high; /CS asserted at other times does not enable register access.

## READ/WRITE (R/W)
R/W is used to determine the direction of data transfer on the data bus (in conjunction with /CS):
- R/W = 1: Read — data is transferred from the selected VIC-II register onto the data bus (device drives DB7-DB0).
- R/W = 0: Write — data presented on DB7-DB0 is loaded into the selected VIC-II register (processor drives the bus).

## ADDRESS BUS (A5-A0)
The lower six address pins (A5–A0) are bidirectional signals. During a processor read or write of the video device these pins function as inputs. The value presented on A5–A0 selects which VIC-II register is read or written, according to the VIC-II register map.

## References
- "vicii_system_interface_bus_sharing_and_phases" — expands on bus sharing and the conditions (AEC/PH0) that permit processor accesses  
- "vicii_bus_activity_summary_table" — table summarizing allowed actions for combinations of AEC, PH0, /CS and R/W  
- "vicii_clock_out_ph0" — details PH0 (Phase 0) timing and generation used for register access timing
