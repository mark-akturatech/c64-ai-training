# Kick Assembler — Chapter 17: Supported Plugin Types

**Summary:** Lists Kick Assembler plugin types: Macro Plugins, Modify Plugins, SegmentModifier Plugins, Archive Plugins, AutoIncludeFile Plugins, DiskWriter Plugins. Shows how to invoke a Macro Plugin with .plugin and notes the 'arguments' and 'engine' parameters (see general communication classes).

## Supported Plugin Types
- Macro Plugins
- Modify Plugins
- SegmentModifier Plugins
- Archive Plugins
- AutoIncludeFile Plugins
- DiskWriter Plugins

## Communication parameters
The chapter notes two parameters commonly available to plugins:
- arguments — the arguments parsed to the macro.
- engine — used to communicate with the Kick Assembler engine (see 'general communication classes' for details).

## Source Code
```text
.plugin "test.plugins.macros.MyMacro"
MyMacro()
```

## References
- "test_project_for_plugins" — plugin test project setup