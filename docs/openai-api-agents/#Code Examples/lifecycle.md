lifecycle.py — Agent and Run Lifecycle Hooks for OpenAI Agents
File Overview
This file defines base classes for lifecycle hooks, allowing developers to receive callbacks on key events during agent execution in OpenAI-style agent systems. The RunHooksBase and AgentHooksBase classes provide structured methods for responding to agent start/end, handoffs, and tool invocations. These hooks enable custom logging, analytics, debugging, or integration with external systems. Type aliases are provided for convenient usage with standard agent types.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RunHooksBase	Base class for receiving callbacks on run-level agent events.
AgentHooksBase	Base class for receiving callbacks on agent-specific events.
RunHooks	Type alias for RunHooksBase with standard agent type.
AgentHooks	Type alias for AgentHooksBase with standard agent type.
Annotated Code Snippets
1. RunHooksBase: Run-Level Lifecycle Callbacks
class RunHooksBase(Generic[TContext, TAgent]):
    async def on_agent_start(self, context, agent): ...
    async def on_agent_end(self, context, agent, output): ...
    async def on_handoff(self, context, from_agent, to_agent): ...
    async def on_tool_start(self, context, agent, tool): ...
    async def on_tool_end(self, context, agent, tool, result): ...
Explanation:
Provides async methods that are called at various points in the agent run lifecycle. Subclass and override only the methods you need.

2. AgentHooksBase: Agent-Specific Lifecycle Callbacks
class AgentHooksBase(Generic[TContext, TAgent]):
    async def on_start(self, context, agent): ...
    async def on_end(self, context, agent, output): ...
    async def on_handoff(self, context, agent, source): ...
    async def on_tool_start(self, context, agent, tool): ...
    async def on_tool_end(self, context, agent, tool, result): ...
Explanation:
Similar to RunHooksBase, but focused on events for a specific agent. Attach an instance to agent.hooks to receive these callbacks.

3. Type Aliases for Standard Usage
RunHooks = RunHooksBase[TContext, Agent]
AgentHooks = AgentHooksBase[TContext, Agent]
Explanation:
Convenient type aliases for use with standard agent types.

Function/Class Reference
RunHooksBase
class RunHooksBase(Generic[TContext, TAgent]):
    async def on_agent_start(self, context: RunContextWrapper[TContext], agent: TAgent) -> None
    async def on_agent_end(self, context: RunContextWrapper[TContext], agent: TAgent, output: Any) -> None
    async def on_handoff(self, context: RunContextWrapper[TContext], from_agent: TAgent, to_agent: TAgent) -> None
    async def on_tool_start(self, context: RunContextWrapper[TContext], agent: TAgent, tool: Tool) -> None
    async def on_tool_end(self, context: RunContextWrapper[TContext], agent: TAgent, tool: Tool, result: str) -> None
Purpose: Receive callbacks for run-level events (agent start/end, handoff, tool start/end).
How to use: Subclass and override relevant methods.
AgentHooksBase
class AgentHooksBase(Generic[TContext, TAgent]):
    async def on_start(self, context: RunContextWrapper[TContext], agent: TAgent) -> None
    async def on_end(self, context: RunContextWrapper[TContext], agent: TAgent, output: Any) -> None
    async def on_handoff(self, context: RunContextWrapper[TContext], agent: TAgent, source: TAgent) -> None
    async def on_tool_start(self, context: RunContextWrapper[TContext], agent: TAgent, tool: Tool) -> None
    async def on_tool_end(self, context: RunContextWrapper[TContext], agent: TAgent, tool: Tool, result: str) -> None
Purpose: Receive callbacks for agent-specific events.
How to use: Attach a subclass instance to agent.hooks.
Example Usage
1. Custom Logging Hook
class LoggingRunHooks(RunHooksBase):
    async def on_agent_start(self, context, agent):
        print(f"Agent {agent.name} started.")

    async def on_agent_end(self, context, agent, output):
        print(f"Agent {agent.name} ended with output: {output}")

# Attach to your agent runner or orchestrator
run_hooks = LoggingRunHooks()
2. Agent-Specific Analytics
class AnalyticsAgentHooks(AgentHooksBase):
    async def on_tool_end(self, context, agent, tool, result):
        log_tool_usage(agent.name, tool.name, result)

# Attach to an agent
agent.hooks = AnalyticsAgentHooks()
Tips, Gotchas, and FAQ
Async Methods:
All hook methods are async. Use await as needed for I/O or side effects.

Override Only What You Need:
You can override just the methods relevant to your use case.

Run vs. Agent Hooks:
Use RunHooksBase for global/run-level events, and AgentHooksBase for agent-specific events.

Multiple Hooks:
You can combine multiple hooks by subclassing or composing logic as needed.

Related Files
agent.py
: Agent classes that can use these hooks.
tool.py
: Tool definitions referenced in tool-related hooks.
run_context.py
: Run context wrapper used in hook signatures.
For further details, see the source code and related modules.