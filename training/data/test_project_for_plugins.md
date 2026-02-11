# Kick Assembler - Plugin development test Eclipse project

**Summary:** Instructions for using the Kick Assembler plugin development test Eclipse project: create a workspace, import the supplied archive, replace KickAss.jar in the jars folder with the latest KickAssember runtime JAR, and inspect example plugins in src/PluginTest and launch configurations in the launch folder. Mentions plugin communication interfaces in package kickass.plugins.interf.general (IEngine, IValue).

## Setup / Quick usage
- Create an Eclipse workspace for plugin development.
- Import the provided archive (the plugin test project) into the workspace.
- In the imported project, open the jars/ folder and replace KickAss.jar with the current/latest KickAssembler JAR (this ensures the project runs against the current runtime).
- Open src/PluginTest to view example plugin code and implementation patterns.
- Open the launch folder to inspect provided Eclipse launch configurations used to run/test the plugins.

## Project layout (what to inspect)
- jars/ — contains KickAss.jar (replace with latest build).
- src/PluginTest — example plugin source code (use as reference for implementing plugins).
- launch/ — Eclipse launch files demonstrating how to run the test plugin project.
- Package note: general communication interfaces used by multiple plugins are under kickass.plugins.interf.general.

## General communication interfaces
- Location: package kickass.plugins.interf.general
- Key interfaces to review: IEngine and IValue — these are core interfaces used by several plugins; review their API before implementing plugin functionality that interacts with the assembler engine or plugin value objects.
- The chapter recommends reading these interfaces now and returning to the chapter when implementing a particular plugin (they provide the contract for plugin/engine communication).

## References
- "registering_your_plugins" — expands on registering plugins and making them visible to Kick Assembler (search this topic for details).
