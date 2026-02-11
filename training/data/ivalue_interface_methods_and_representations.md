# Kick Assembler: IValue and IParameterMap (plugin API)

**Summary:** Describes IValue conversion/accessor methods (getDouble(), getString(), getBoolean(), getList()), representation tests (hasIntRepresentation(), hasDoubleRepresentation(), hasStringRepresentation(), hasBooleanRepresentation(), hasListRepresentation()), behavior when conversions fail (assembly-time error), basic list accessors (size(), get(i), isEmpty(), iterator()), plus memory-block accessors byte[] getBytes() and String getName(). Also documents the IParameterMap methods for plugin parameter retrieval (exists, getValue, getIntValue, getBoolValue, getEnumValue, getStringValue, getParameterNames, getSourceRange).

**IValue interface**

- **Purpose:** Represents a typed value passed to plugins/macros (numeric, string, boolean, or list).
- **Accessors and conversions:**
  - `getDouble()`: Returns the value interpreted as a double (floating-point). If the value cannot be converted, the call triggers an assembly-time error: "Can't get a numeric representation from a value of type [type]" ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch16s02.html?utm_source=openai)).
  - `getString()`: Returns the value as a String. If conversion is impossible, an assembly-time error occurs: "Can't get a string representation from a value of type [type]".
  - `getBoolean()`: Returns the value as a boolean. If conversion is impossible, an assembly-time error occurs: "Can't get a boolean representation from a value of type [type]".
  - `getList()`: Returns the value as a list (collection) of values (`List<IValue>`). The returned list is immutable; attempting to modify it will result in an error.
- **Representation checks (non-mutating tests — use before converting to avoid errors):**
  - `hasIntRepresentation()`
  - `hasDoubleRepresentation()`
  - `hasStringRepresentation()`
  - `hasBooleanRepresentation()`
  - `hasListRepresentation()`
  - These methods allow code to test whether a particular typed conversion is available before calling the corresponding `get*()` method.
- **List behavior (for values that are lists):**
  - `size()`: Number of elements in the list.
  - `get(i)`: Retrieve element at zero-based index `i` (returns an `IValue`).
  - `isEmpty()`: True if the list has no elements.
  - `iterator()`: Obtain an iterator over the contained `IValue` elements.

**Memory block accessors**

- `byte[] getBytes()`: Returns the assembled bytes of the memory block (the binary contents produced for that block).
- `String getName()`: Returns the name of the memory block.

**The IParameterMap interface**

- **Purpose:** Represents a collection of named parameters (name is `String`, value is `IValue`). Typical source syntax: `[name="Kevin", age=27, hacker=true]`.
- **Main methods and behavior:**
  - `boolean exists(String paramName)`: Returns true if a parameter with the given name is defined.
  - `IValue getValue(String paramName)`: Returns the `IValue` for the given parameter name. If the parameter is undefined, it returns `null`. It's recommended to use `exists()` before calling `getValue()` to avoid null values.
  - `int getIntValue(String paramName, int defaultValue)`: Returns the parameter as int; returns `defaultValue` if parameter is undefined.
  - `boolean getBoolValue(String paramName, boolean defaultValue)`: Returns the parameter as boolean; returns `defaultValue` if parameter is undefined.
  - `<T extends Enum<?>> T getEnumValue(Class<T> enumeration, String name, T defaultLiteral)`: Returns the parameter as an enum constant (by name); returns `defaultLiteral` if undefined.
  - `String getStringValue(String paramName, String defaultValue)`: Returns the parameter as String; returns `defaultValue` if undefined.
  - `Collection<String> getParameterNames()`: Returns a collection of defined parameter names.
  - `ISourceRange getSourceRange(String paramName)`: Returns source position (range) where the parameter was defined (useful for error reporting).
- **Convenience:** All typed getters return the provided default when the parameter is undefined; for presence checks, use `exists()`.

## References

- "i_parameter_map_interface" — expands on IParameterMap uses IValue for parameter values
- "macro_plugins_interface" — expands on Macros receive IValue[] parameters