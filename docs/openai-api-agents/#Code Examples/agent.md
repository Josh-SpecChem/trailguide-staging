agent.py — Core Agent Abstractions for OpenAI Agent Creation
File Overview
This file defines the foundational classes and utilities for building modular, prompt-driven, tool-using AI agents, compatible with OpenAI's tool-calling and prompt APIs. It includes the base agent class, the main Agent class, configuration types, and mechanisms for integrating tools, handoffs, guardrails, and model settings. The design supports both synchronous and asynchronous workflows and is intended for use in systems that create, configure, or orchestrate OpenAI-style agents.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
AgentBase	Base class for all agents, managing tools and MCP server integration.
Agent	Main agent class, supporting prompts, tools, handoffs, guardrails, and model settings.
ToolsToFinalOutputResult	Result type for custom tool-to-output logic.
ToolsToFinalOutputFunction	Type alias for functions that determine when tool output is final.
StopAtTools	TypedDict for specifying tool names that stop agent execution.
MCPConfig	TypedDict for configuring MCP server behavior.
Annotated Code Snippets
1. Tools to Final Output Result
@dataclass
class ToolsToFinalOutputResult:
    is_final_output: bool
    final_output: Any | None = None
Explanation:
This dataclass is used to indicate whether the output from tools should be treated as the agent's final output. If is_final_output is False, the agent continues processing (e.g., running the LLM again). If True, final_output is returned.

2. AgentBase: Core Tool and MCP Management
@dataclass
class AgentBase(Generic[TContext]):
    name: str
    handoff_description: str | None = None
    tools: list[Tool] = field(default_factory=list)
    mcp_servers: list[MCPServer] = field(default_factory=list)
    mcp_config: MCPConfig = field(default_factory=lambda: MCPConfig())

    async def get_mcp_tools(self, run_context: RunContextWrapper[TContext]) -> list[Tool]:
        ...
    async def get_all_tools(self, run_context: RunContextWrapper[Any]) -> list[Tool]:
        ...
Explanation:

AgentBase manages the agent's name, tools, and integration with MCP servers (for dynamic tool discovery).
get_mcp_tools fetches tools from MCP servers.
get_all_tools returns all enabled tools, both static and MCP-provided.
3. Agent: Prompt, Tool, and Handoff Configuration
@dataclass
class Agent(AgentBase, Generic[TContext]):
    instructions: str | Callable | None = None
    prompt: Prompt | DynamicPromptFunction | None = None
    handoffs: list[Agent[Any] | Handoff[TContext, Any]] = field(default_factory=list)
    model: str | Model | None = None
    model_settings: ModelSettings = field(default_factory=ModelSettings)
    input_guardrails: list[InputGuardrail[TContext]] = field(default_factory=list)
    output_guardrails: list[OutputGuardrail[TContext]] = field(default_factory=list)
    output_type: type[Any] | AgentOutputSchemaBase | None = None
    hooks: AgentHooks[TContext] | None = None
    tool_use_behavior: Literal[...] | StopAtTools | ToolsToFinalOutputFunction = "run_llm_again"
    reset_tool_choice: bool = True

    def clone(self, **kwargs: Any) -> Agent[TContext]:
        ...
    def as_tool(self, tool_name: str | None, tool_description: str | None, ...) -> Tool:
        ...
    async def get_system_prompt(self, run_context: RunContextWrapper[TContext]) -> str | None:
        ...
    async def get_prompt(self, run_context: RunContextWrapper[TContext]) -> ResponsePromptParam | None:
        ...
Explanation:

Agent extends AgentBase with prompt, handoff, guardrail, and model configuration.
Supports dynamic instructions (string or function), prompt objects, and tool-use customization.
Provides methods for cloning, transforming into a tool, and fetching prompts.
Function/Class Reference
ToolsToFinalOutputResult
@dataclass
class ToolsToFinalOutputResult:
    is_final_output: bool
    final_output: Any | None = None
Parameters:
is_final_output (bool): If True, the agent stops and returns final_output.
final_output (Any | None): The output value, or None if not final.
Purpose: Used by custom tool-to-output logic to control agent flow.
AgentBase
@dataclass
class AgentBase(Generic[TContext]):
    name: str
    handoff_description: str | None = None
    tools: list[Tool] = field(default_factory=list)
    mcp_servers: list[MCPServer] = field(default_factory=list)
    mcp_config: MCPConfig = field(default_factory=lambda: MCPConfig())

    async def get_mcp_tools(self, run_context: RunContextWrapper[TContext]) -> list[Tool]
    async def get_all_tools(self, run_context: RunContextWrapper[Any]) -> list[Tool]
Parameters:
name: Agent's name.
handoff_description: Description for handoff scenarios.
tools: List of static tools.
mcp_servers: List of MCP servers for dynamic tools.
mcp_config: MCP server configuration.
Purpose: Base for all agents, managing tools and MCP integration.
Agent
@dataclass
class Agent(AgentBase, Generic[TContext]):
    instructions: str | Callable | None = None
    prompt: Prompt | DynamicPromptFunction | None = None
    handoffs: list[Agent[Any] | Handoff[TContext, Any]] = field(default_factory=list)
    model: str | Model | None = None
    model_settings: ModelSettings = field(default_factory=ModelSettings)
    input_guardrails: list[InputGuardrail[TContext]] = field(default_factory=list)
    output_guardrails: list[OutputGuardrail[TContext]] = field(default_factory=list)
    output_type: type[Any] | AgentOutputSchemaBase | None = None
    hooks: AgentHooks[TContext] | None = None
    tool_use_behavior: Literal[...] | StopAtTools | ToolsToFinalOutputFunction = "run_llm_again"
    reset_tool_choice: bool = True

    def clone(self, **kwargs: Any) -> Agent[TContext]
    def as_tool(self, tool_name: str | None, tool_description: str | None, ...) -> Tool
    async def get_system_prompt(self, run_context: RunContextWrapper[TContext]) -> str | None
    async def get_prompt(self, run_context: RunContextWrapper[TContext]) -> ResponsePromptParam | None
Parameters: (see above)
Purpose: Main agent class for prompt-driven, tool-using, modular AI agents.
Key Methods:
clone: Returns a copy of the agent with updated fields.
as_tool: Wraps the agent as a callable tool for other agents.
get_system_prompt: Resolves the agent's system prompt (instructions).
get_prompt: Resolves the agent's prompt object for OpenAI APIs.
Example Usage
1. Creating and Cloning an Agent
agent = Agent(
    name="MathAgent",
    instructions="You are a helpful math assistant.",
    tools=[calculator_tool],
    model="gpt-4o"
)

# Clone with new instructions
new_agent = agent.clone(instructions="You are now a science assistant.")
2. Using an Agent as a Tool
math_tool = agent.as_tool(
    tool_name="math_solver",
    tool_description="Solves math problems."
)
3. Fetching All Tools (including MCP)
all_tools = await agent.get_all_tools(run_context)
4. Custom Tool-to-Output Logic
def custom_tool_behavior(context, tool_results):
    # Stop if any tool result is from 'special_tool'
    for result in tool_results:
        if result.tool_name == "special_tool":
            return ToolsToFinalOutputResult(is_final_output=True, final_output=result.output)
    return ToolsToFinalOutputResult(is_final_output=False)

agent.tool_use_behavior = custom_tool_behavior
Tips, Gotchas, and FAQ
Tool Enablement:
Only tools whose is_enabled property returns True (can be async) are included in get_all_tools.

Prompt Flexibility:
instructions can be a string or a function (sync or async) for dynamic prompt generation.

MCP Server Lifecycle:
You must manually manage MCP server connections (call connect() before use and cleanup() when done).

Tool Use Behavior:
The tool_use_behavior field allows fine-grained control over when tool output is considered final. Hosted tools (like file search) are always processed by the LLM.

Output Type:
Set output_type to a dataclass, TypedDict, or Pydantic model for structured outputs. For custom JSON schema, subclass AgentOutputSchemaBase.

Related Files
tool.py
: Tool and FunctionTool definitions.
run_context.py
: Run context and context wrapper types.
prompts.py
: Prompt and prompt utility definitions.
guardrail.py
: Input and output guardrails.
handoffs.py
: Handoff logic for agent delegation.
model_settings.py
: Model parameter tuning.
For further details, see the source code and related modules.