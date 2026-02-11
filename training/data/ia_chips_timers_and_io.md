# MACHINE - IA chip functions (timers and I/O latching)

**Summary:** Describes IA-chip timers (countdown behavior and interrupt-flag generation) and external input/output ports (latched outputs set by stores). Searchable terms: timers, interrupt flag, IRQ enable/mask, ports, latching, store.

**Timers**

Certain addresses in an IA chip are assigned as timers. Writing a value (for example $97) loads the timer, and subsequent reads will show the value counting down (for example $93 after some elapsed cycles). Timers vary by chip in resolution, prescaling, and decrement behavior—consult the chip reference for exact semantics. Most IA-chip timers set an interrupt flag when they underflow (reach zero). Whether that flag produces a CPU interrupt (IRQ) depends on the chip/system interrupt enable/mask configuration (the flag can be set without forcing an interrupt until enabled).

For example, in the MOS Technology 6526 Complex Interface Adapter (CIA), there are two 16-bit timers:

- **Timer A**: Registers at addresses $04 (low byte) and $05 (high byte).
- **Timer B**: Registers at addresses $06 (low byte) and $07 (high byte).

Each timer has a corresponding control register:

- **Control Register A**: Address $0E
- **Control Register B**: Address $0F

These timers can operate in various modes, including one-shot and continuous modes, and can generate interrupts upon underflow. ([bitsavers.org](https://www.bitsavers.org/components/mosTechnology/_dataBooks/1982_MOS_Technology_Data_Catalog.pdf?utm_source=openai))

**Input/output ports**

Some IA-chip addresses map to external ports used to sample inputs or drive devices. Output writes are typically latched: a store to the port sets the output state and it remains until changed by a later store. Ports can be used for sensing external events or controlling peripherals; exact direction control (input vs output), open-drain vs totem-pole behavior, and pull-up/pull-down arrangements are chip-specific—see the chip datasheet for details.

In the 6526 CIA, there are two 8-bit bidirectional I/O ports:

- **Port A Data Register**: Address $00
- **Port B Data Register**: Address $01

Each port has a corresponding Data Direction Register (DDR):

- **Port A DDR**: Address $02
- **Port B DDR**: Address $03

Setting a bit in the DDR to 1 configures the corresponding pin as an output; setting it to 0 configures it as an input. ([bitsavers.org](https://www.bitsavers.org/components/mosTechnology/_dataBooks/1982_MOS_Technology_Data_Catalog.pdf?utm_source=openai))

## References

- "ia_chips_overview_and_latching" — expands on interrupt latching and complementary behavior
- ([bitsavers.org](https://www.bitsavers.org/components/mosTechnology/_dataBooks/1982_MOS_Technology_Data_Catalog.pdf?utm_source=openai))

## Labels
- TIMER_A
- TIMER_B
- CONTROL_REGISTER_A
- CONTROL_REGISTER_B
- PORT_A_DATA_REGISTER
- PORT_B_DATA_REGISTER
- PORT_A_DDR
- PORT_B_DDR
