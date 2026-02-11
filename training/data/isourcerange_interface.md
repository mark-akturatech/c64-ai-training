# Kick Assembler: ISourceRange and Plugin Pattern

**Summary:** ISourceRange is a marker interface representing a position in source code (line/column ranges). Typical Kick Assembler plugins implement IPlugin and follow a two-method pattern: getDefinition() (returns a Definition object with setters) and execute(...); see IParameterMap.getSourceRange for how source ranges are passed.

## ISourceRange
ISourceRange is an empty (marker) interface used to represent a position or range in source code (for example, line/column ranges). Plugins receive ISourceRange instances to indicate where parameters or calls originate and can return them when reporting errors or diagnostics. The interface contains no methods — its presence encodes positional information that other APIs (e.g., IParameterMap) expose.

## Plugin pattern
Most Kick Assembler plugins follow a consistent pattern:

- Plugins implement IPlugin (or extend an existing plugin base).
- Each plugin exposes a definition method and an execution method:
  - getDefinition() returns a Definition object (e.g., XYZDefinition) whose fields are populated using setters.
  - execute(...) performs the plugin action; parameters typically include context objects and may include source ranges (ISourceRange) obtained from parameter maps.
- Definition classes (XYZDefinition) are simple POJOs containing getters and setters for name, required parameters, default values, etc. getDefinition() should construct and return such a Definition instance with all appropriate setters called.

Note: IParameterMap.getSourceRange returns an ISourceRange (see References).

## Source Code
```java
// Marker interface: no methods
public interface ISourceRange { /* marker */ }

// Typical plugin interface pattern (example)
public interface XYZPlugin extends IPlugin {
    XYZDefinition getDefinition();
    void execute(IPluginContext context, IParameterMap params) throws PluginException;
}

// Example definition POJO (simplified)
public class XYZDefinition {
    private String name;
    private List<ParameterDefinition> parameters;
    // setters/getters
    public void setName(String name) { this.name = name; }
    public String getName() { return name; }
    public void setParameters(List<ParameterDefinition> p) { this.parameters = p; }
    public List<ParameterDefinition> getParameters() { return parameters; }
}

// Example usage: parameter map exposes source range
// IParameterMap.getSourceRange(...) -> ISourceRange
```

## References
- "i_parameter_map_interface" — expands on IParameterMap.getSourceRange returns ISourceRange
