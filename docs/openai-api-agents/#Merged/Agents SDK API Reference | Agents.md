# Agents SDK API Reference | Agents

---

## Agents Module

### set_default_openai_key

```python
set_default_openai_key(
    key: str, use_for_tracing: bool = True
) -> None
```

Set the default OpenAI API key to use for LLM requests (and optionally tracing). This is only necessary if the `OPENAI_API_KEY` environment variable is not already set.

If provided, this key will be used instead of the `OPENAI_API_KEY` environment variable.

**Parameters:**

| Name             | Type    | Description                                                                                                                                                                                                 | Default |
|------------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| key              | str     | The OpenAI key to use.                                                                                                                                                                                      | required|
| use_for_tracing  | bool    | Whether to also use this key to send traces to OpenAI. Defaults to True. If False, you'll either need to set the `OPENAI_API_KEY` environment variable or call `set_tracing_export_api_key()` for tracing.   | True    |

_Source code in src/agents/__init__.py_

---

### set_default_openai_client

```python
set_default_openai_client(
    client: AsyncOpenAI, use_for_tracing: bool = True
) -> None
```

Set the default OpenAI client to use for LLM requests and/or tracing. If provided, this client will be used instead of the default OpenAI client.

**Parameters:**

| Name             | Type        | Description                                                                                                                                                                                                 | Default |
|------------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| client           | AsyncOpenAI | The OpenAI client to use.                                                                                                                                                                                   | required|
| use_for_tracing  | bool        | Whether to use the API key from this client for uploading traces. If False, you'll either need to set the `OPENAI_API_KEY` environment variable or call `set_tracing_export_api_key()` for tracing.           | True    |

_Source code in src/agents/__init__.py_

---

### set_default_openai_api

```python
set_default_openai_api(
    api: Literal["chat_completions", "responses"],
) -> None
```

Set the default API to use for OpenAI LLM requests. By default, we will use the responses API but you can set this to use the chat completions API instead.

_Source code in src/agents/__init__.py_

---

### set_tracing_export_api_key

```python
set_tracing_export_api_key(api_key: str) -> None
```

Set the OpenAI API key for the backend exporter.

_Source code in src/agents/tracing/__init__.py_

---

### set_tracing_disabled

```python
set_tracing_disabled(disabled: bool) -> None
```

Set whether tracing is globally disabled.

_Source code in src/agents/tracing/__init__.py_

---

### set_trace_processors

```python
set_trace_processors(
    processors: list[TracingProcessor],
) -> None
```

Set the list of trace processors. This will replace the current list of processors.

_Source code in src/agents/tracing/__init__.py_

---

### enable_verbose_stdout_logging

```python
enable_verbose_stdout_logging()
```

Enables verbose logging to stdout. This is useful for debugging.

_Source code in src/agents/__init__.py_

---

## Agents

### ToolsToFinalOutputFunction

```python
ToolsToFinalOutputFunction: TypeAlias = Callable[
    [RunContextWrapper[TContext], list[FunctionToolResult]],
    MaybeAwaitable[ToolsToFinalOutputResult],
]
```

A function that takes a run context and a list of tool results, and returns a ToolsToFinalOutputResult.

---

### ToolsToFinalOutputResult dataclass

_Source code in src/agents/agent.py_

#### is_final_output

```python
is_final_output: bool
```
Whether this is the final output. If False, the LLM will run again and receive the tool call output.

#### final_output

```python
final_output: Any | None = None
```
The final output. Can be None if is_final_output is False, otherwise must match the output_type of the agent.

---

### StopAtTools

Bases: TypedDict

_Source code in src/agents/agent.py_

#### stop_at_tool_names

```python
stop_at_tool_names: list[str]
```
A list of tool names, any of which will stop the agent from running further.

---

### MCPConfig

Bases: TypedDict

Configuration for MCP servers.

_Source code in src/agents/agent.py_

#### convert_schemas_to_strict

```python
convert_schemas_to_strict: NotRequired[bool]
```
If True, we will attempt to convert the MCP schemas to strict-mode schemas. This is a best-effort conversion, so some schemas may not be convertible. Defaults to False.

---

### AgentBase dataclass

Bases: Generic[TContext]

Base class for Agent and RealtimeAgent.

_Source code in src/agents/agent.py_

#### name

```python
name: str
```
The name of the agent.

#### handoff_description

```python
handoff_description: str | None = None
```
A description of the agent. This is used when the agent is used as a handoff, so that an LLM knows what it does and when to invoke it.

#### tools

```python
tools: list[Tool] = field(default_factory=list)
```
A list of tools that the agent can use.

#### mcp_servers

```python
mcp_servers: list[MCPServer] = field(default_factory=list)
```
A list of Model Context Protocol servers that the agent can use. Every time the agent runs, it will include tools from these servers in the list of available tools.

_NOTE: You are expected to manage the lifecycle of these servers. Specifically, you must call server.connect() before passing it to the agent, and server.cleanup() when the server is no longer needed._

#### mcp_config

```python
mcp_config: MCPConfig = field(
    default_factory=lambda: MCPConfig()
)
```
Configuration for MCP servers.

---

#### get_mcp_tools (async)

```python
get_mcp_tools(
    run_context: RunContextWrapper[TContext],
) -> list[Tool]
```
Fetches the available tools from the MCP servers.

_Source code in src/agents/agent.py_

---

#### get_all_tools (async)

```python
get_all_tools(
    run_context: RunContextWrapper[Any],
) -> list[Tool]
```
All agent tools, including MCP tools and function tools.

_Source code in src/agents/agent.py_

---

### Agent dataclass

Bases: AgentBase, Generic[TContext]

An agent is an AI model configured with instructions, tools, guardrails, handoffs and more.

We strongly recommend passing instructions, which is the "system prompt" for the agent. In addition, you can pass handoff_description, which is a human-readable description of the agent, used when the agent is used inside tools/handoffs.

Agents are generic on the context type. The context is a (mutable) object you create. It is passed to tool functions, handoffs, guardrails, etc.

See AgentBase for base parameters that are shared with RealtimeAgents.

_Source code in src/agents/agent.py_

#### instructions

```python
instructions: (
    str
    | Callable[
        [RunContextWrapper[TContext], Agent[TContext]],
        MaybeAwaitable[str],
    ]
    | None
) = None
```
The instructions for the agent. Will be used as the "system prompt" when this agent is invoked. Describes what the agent should do, and how it responds.

Can either be a string, or a function that dynamically generates instructions for the agent. If you provide a function, it will be called with the context and the agent instance. It must return a string.

#### prompt

```python
prompt: Prompt | DynamicPromptFunction | None = None
```
A prompt object (or a function that returns a Prompt). Prompts allow you to dynamically configure the instructions, tools and other config for an agent outside of your code. Only usable with OpenAI models, using the Responses API.

#### handoffs

```python
handoffs: list[Agent[Any] | Handoff[TContext, Any]] = field(
    default_factory=list
)
```
Handoffs are sub-agents that the agent can delegate to. You can provide a list of handoffs, and the agent can choose to delegate to them if relevant. Allows for separation of concerns and modularity.

#### model

```python
model: str | Model | None = None
```
The model implementation to use when invoking the LLM.

By default, if not set, the agent will use the default model configured in openai_provider.DEFAULT_MODEL (currently "gpt-4o").

#### model_settings

```python
model_settings: ModelSettings = field(
    default_factory=ModelSettings
)
```
Configures model-specific tuning parameters (e.g. temperature, top_p).

#### input_guardrails

```python
input_guardrails: list[InputGuardrail[TContext]] = field(
    default_factory=list
)
```
A list of checks that run in parallel to the agent's execution, before generating a response. Runs only if the agent is the first agent in the chain.

#### output_guardrails

```python
output_guardrails: list[OutputGuardrail[TContext]] = field(
    default_factory=list
)
```
A list of checks that run on the final output of the agent, after generating a response. Runs only if the agent produces a final output.

#### output_type

```python
output_type: type[Any] | AgentOutputSchemaBase | None = None
```
The type of the output object. If not provided, the output will be str. In most cases, you should pass a regular Python type (e.g. a dataclass, Pydantic model, TypedDict, etc). You can customize this in two ways: 1. If you want non-strict schemas, pass AgentOutputSchema(MyClass, strict_json_schema=False). 2. If you want to use a custom JSON schema (i.e. without using the SDK's automatic schema) creation, subclass and pass an AgentOutputSchemaBase subclass.

#### hooks

```python
hooks: AgentHooks[TContext] | None = None
```
A class that receives callbacks on various lifecycle events for this agent.

#### tool_use_behavior

```python
tool_use_behavior: (
    Literal["run_llm_again", "stop_on_first_tool"]
    | StopAtTools
    | ToolsToFinalOutputFunction
) = "run_llm_again"
```
This lets you configure how tool use is handled.  
- "run_llm_again": The default behavior. Tools are run, and then the LLM receives the results and gets to respond.  
- "stop_on_first_tool": The output of the first tool call is used as the final output. This means that the LLM does not process the result of the tool call.  
- A list of tool names: The agent will stop running if any of the tools in the list are called. The final output will be the output of the first matching tool call. The LLM does not process the result of the tool call.  
- A function: If you pass a function, it will be called with the run context and the list of tool results. It must return a ToolsToFinalOutputResult, which determines whether the tool calls result in a final output.

_NOTE: This configuration is specific to FunctionTools. Hosted tools, such as file search, web search, etc. are always processed by the LLM._

#### reset_tool_choice

```python
reset_tool_choice: bool = True
```
Whether to reset the tool choice to the default value after a tool has been called. Defaults to True. This ensures that the agent doesn't enter an infinite loop of tool usage.

---

#### clone

```python
clone(**kwargs: Any) -> Agent[TContext]
```
Make a copy of the agent, with the given arguments changed. For example, you could do:

```python
new_agent = agent.clone(instructions="New instructions")
```

_Source code in src/agents/agent.py_

---

#### as_tool

```python
as_tool(
    tool_name: str | None,
    tool_description: str | None,
    custom_output_extractor: Callable[
        [RunResult], Awaitable[str]
    ]
    | None = None,
) -> Tool
```
Transform this agent into a tool, callable by other agents.

This is different from handoffs in two ways:  
1. In handoffs, the new agent receives the conversation history. In this tool, the new agent receives generated input.  
2. In handoffs, the new agent takes over the conversation. In this tool, the new agent is called as a tool, and the conversation is continued by the original agent.

**Parameters:**

| Name                   | Type                                         | Description                                                                                                   | Default |
|------------------------|----------------------------------------------|---------------------------------------------------------------------------------------------------------------|---------|
| tool_name              | str \| None                                 | The name of the tool. If not provided, the agent's name will be used.                                         | required|
| tool_description       | str \| None                                 | The description of the tool, which should indicate what it does and when to use it.                           | required|
| custom_output_extractor| Callable[[RunResult], Awaitable[str]] \| None| A function that extracts the output from the agent. If not provided, the last message from the agent is used. | None    |

_Source code in src/agents/agent.py_

---

#### get_system_prompt (async)

```python
get_system_prompt(
    run_context: RunContextWrapper[TContext],
) -> str | None
```
Get the system prompt for the agent.

_Source code in src/agents/agent.py_

---

#### get_prompt (async)

```python
get_prompt(
    run_context: RunContextWrapper[TContext],
) -> ResponsePromptParam | None
```
Get the prompt for the agent.

_Source code in src/agents/agent.py_

---

#### get_mcp_tools (async)

```python
get_mcp_tools(
    run_context: RunContextWrapper[TContext],
) -> list[Tool]
```
Fetches the available tools from the MCP servers.

_Source code in src/agents/agent.py_

---

#### get_all_tools (async)

```python
get_all_tools(
    run_context: RunContextWrapper[Any],
) -> list[Tool]
```
All agent tools, including MCP tools and function tools.

_Source code in src/agents/agent.py_

---

## Runner

### Runner

_Source code in src/agents/run.py_

#### run (async classmethod)

```python
run(
    starting_agent: Agent[TContext],
    input: str | list[TResponseInputItem],
    *,
    context: TContext | None = None,
    max_turns: int = DEFAULT_MAX_TURNS,
    hooks: RunHooks[TContext] | None = None,
    run_config: RunConfig | None = None,
    previous_response_id: str | None = None,
    session: Session | None = None,
) -> RunResult
```

Run a workflow starting at the given agent. The agent will run in a loop until a final output is generated. The loop runs like so:  
1. The agent is invoked with the given input.  
2. If there is a final output (i.e. the agent produces something of type agent.output_type, the loop terminates.  
3. If there's a handoff, we run the loop again, with the new agent.  
4. Else, we run tool calls (if any), and re-run the loop.

In two cases, the agent may raise an exception:  
1. If the max_turns is exceeded, a MaxTurnsExceeded exception is raised.  
2. If a guardrail tripwire is triggered, a GuardrailTripwireTriggered exception is raised.

Note that only the first agent's input guardrails are run.

**Args:**
- starting_agent: The starting agent to run.
- input: The initial input to the agent. You can pass a single string for a user message, or a list of input items.
- context: The context to run the agent with.
- max_turns: The maximum number of turns to run the agent for. A turn is defined as one AI invocation (including any tool calls that might occur).
- hooks: An object that receives callbacks on various lifecycle events.
- run_config: Global settings for the entire agent run.
- previous_response_id: The ID of the previous response, if using OpenAI models via the Responses API, this allows you to skip passing in input from the previous turn.

**Returns:**  
A run result containing all the inputs, guardrail results and the output of the last agent. Agents may perform handoffs, so we don't know the specific type of the output.

_Source code in src/agents/run.py_

---

#### run_sync (classmethod)

```python
run_sync(
    starting_agent: Agent[TContext],
    input: str | list[TResponseInputItem],
    *,
    context: TContext | None = None,
    max_turns: int = DEFAULT_MAX_TURNS,
    hooks: RunHooks[TContext] | None = None,
    run_config: RunConfig | None = None,
    previous_response_id: str | None = None,
    session: Session | None = None,
) -> RunResult
```

Run a workflow synchronously, starting at the given agent. Note that this just wraps the run method, so it will not work if there's already an event loop (e.g. inside an async function, or in a Jupyter notebook or async context like FastAPI). For those cases, use the run method instead. The agent will run in a loop until a final output is generated. The loop runs like so:  
1. The agent is invoked with the given input.  
2. If there is a final output (i.e. the agent produces something of type agent.output_type, the loop terminates.  
3. If there's a handoff, we run the loop again, with the new agent.  
4. Else, we run tool calls (if any), and re-run the loop.

In two cases, the agent may raise an exception:  
1. If the max_turns is exceeded, a MaxTurnsExceeded exception is raised.  
2. If a guardrail tripwire is triggered, a GuardrailTripwireTriggered exception is raised.

Note that only the first agent's input guardrails are run.

**Args:**  
Same as `run`.

**Returns:**  
A run result containing all the inputs, guardrail results and the output of the last agent. Agents may perform handoffs, so we don't know the specific type of the output.

_Source code in src/agents/run.py_

---

#### run_streamed (classmethod)

```python
run_streamed(
    starting_agent: Agent[TContext],
    input: str | list[TResponseInputItem],
    context: TContext | None = None,
    max_turns: int = DEFAULT_MAX_TURNS,
    hooks: RunHooks[TContext] | None = None,
    run_config: RunConfig | None = None,
    previous_response_id: str | None = None,
    session: Session | None = None,
) -> RunResultStreaming
```

Run a workflow starting at the given agent in streaming mode. The returned result object contains a method you can use to stream semantic events as they are generated. The agent will run in a loop until a final output is generated. The loop runs like so:  
1. The agent is invoked with the given input.  
2. If there is a final output (i.e. the agent produces something of type agent.output_type, the loop terminates.  
3. If there's a handoff, we run the loop again, with the new agent.  
4. Else, we run tool calls (if any), and re-run the loop.

In two cases, the agent may raise an exception:  
1. If the max_turns is exceeded, a MaxTurnsExceeded exception is raised.  
2. If a guardrail tripwire is triggered, a GuardrailTripwireTriggered exception is raised.

Note that only the first agent's input guardrails are run.

**Args:**  
Same as `run`.

**Returns:**  
A result object that contains data about the run, as well as a method to stream events.

_Source code in src/agents/run.py_

---

### RunConfig dataclass

Configures settings for the entire agent run.

_Source code in src/agents/run.py_

#### model

```python
model: str | Model | None = None
```
The model to use for the entire agent run. If set, will override the model set on every agent. The model_provider passed in below must be able to resolve this model name.

#### model_provider

```python
model_provider: ModelProvider = field(
    default_factory=MultiProvider
)
```
The model provider to use when looking up string model names. Defaults to OpenAI.

#### model_settings

```python
model_settings: ModelSettings | None = None
```
Configure global model settings. Any non-null values will override the agent-specific model settings.

#### handoff_input_filter

```python
handoff_input_filter: HandoffInputFilter | None = None
```
A global input filter to apply to all handoffs. If Handoff.input_filter is set, then that will take precedence. The input filter allows you to edit the inputs that are sent to the new agent. See the documentation in Handoff.input_filter for more details.

#### input_guardrails

```python
input_guardrails: list[InputGuardrail[Any]] | None = None
```
A list of input guardrails to run on the initial run input.

#### output_guardrails

```python
output_guardrails: list[OutputGuardrail[Any]] | None = None
```
A list of output guardrails to run on the final output of the run.

#### tracing_disabled

```python
tracing_disabled: bool = False
```
Whether tracing is disabled for the agent run. If disabled, we will not trace the agent run.

#### trace_include_sensitive_data

```python
trace_include_sensitive_data: bool = True
```
Whether we include potentially sensitive data (for example: inputs/outputs of tool calls or LLM generations) in traces. If False, we'll still create spans for these events, but the sensitive data will not be included.

#### workflow_name

```python
workflow_name: str = 'Agent workflow'
```
The name of the run, used for tracing. Should be a logical name for the run, like "Code generation workflow" or "Customer support agent".

#### trace_id

```python
trace_id: str | None = None
```
A custom trace ID to use for tracing. If not provided, we will generate a new trace ID.

#### group_id

```python
group_id: str | None = None
```
A grouping identifier to use for tracing, to link multiple traces from the same conversation or process. For example, you might use a chat thread ID.

#### trace_metadata

```python
trace_metadata: dict[str, Any] | None = None
```
An optional dictionary of additional metadata to include with the trace.

---

## Memory

### Session

Bases: Protocol

Protocol for session implementations.

Session stores conversation history for a specific session, allowing agents to maintain context without requiring explicit manual memory management.

_Source code in src/agents/memory/session.py_

#### get_items (async)

```python
get_items(
    limit: int | None = None,
) -> list[TResponseInputItem]
```
Retrieve the conversation history for this session.

**Parameters:**

| Name | Type         | Description                                                                                  | Default |
|------|--------------|----------------------------------------------------------------------------------------------|---------|
| limit| int \| None  | Maximum number of items to retrieve. If None, retrieves all items. Returns latest N items.   | None    |

**Returns:**  
list[TResponseInputItem]: List of input items representing the conversation history

_Source code in src/agents/memory/session.py_

---

#### add_items (async)

```python
add_items(items: list[TResponseInputItem]) -> None
```
Add new items to the conversation history.

**Parameters:**

| Name  | Type                  | Description                              | Default |
|-------|-----------------------|------------------------------------------|---------|
| items | list[TResponseInputItem] | List of input items to add to the history | required|

_Source code in src/agents/memory/session.py_

---

#### pop_item (async)

```python
pop_item() -> TResponseInputItem | None
```
Remove and return the most recent item from the session.

**Returns:**  
TResponseInputItem \| None: The most recent item if it exists, None if the session is empty

_Source code in src/agents/memory/session.py_

---

#### clear_session (async)

```python
clear_session() -> None
```
Clear all items for this session.

_Source code in src/agents/memory/session.py_

---

### SQLiteSession

Bases: SessionABC

SQLite-based implementation of session storage.

This implementation stores conversation history in a SQLite database. By default, uses an in-memory database that is lost when the process ends. For persistent storage, provide a file path.

_Source code in src/agents/memory/session.py_

#### __init__

```python
__init__(
    session_id: str,
    db_path: str | Path = ":memory:",
    sessions_table: str = "agent_sessions",
    messages_table: str = "agent_messages",
)
```
Initialize the SQLite session.

**Parameters:**

| Name           | Type         | Description                                                      | Default         |
|----------------|--------------|------------------------------------------------------------------|-----------------|
| session_id     | str          | Unique identifier for the conversation session                   | required        |
| db_path        | str \| Path  | Path to the SQLite database file. Defaults to ':memory:'         | ':memory:'      |
| sessions_table | str          | Name of the table to store session metadata. Defaults to 'agent_sessions' | 'agent_sessions'|
| messages_table | str          | Name of the table to store message data. Defaults to 'agent_messages'     | 'agent_messages'|

_Source code in src/agents/memory/session.py_

---

#### get_items (async)

See above.

---

#### add_items (async)

See above.

---

#### pop_item (async)

See above.

---

#### clear_session (async)

See above.

---

#### close

```python
close() -> None
```
Close the database connection.

_Source code in src/agents/memory/session.py_

---

## repl

### run_demo_loop (async)

```python
run_demo_loop(
    agent: Agent[Any], *, stream: bool = True
) -> None
```
Run a simple REPL loop with the given agent.

This utility allows quick manual testing and debugging of an agent from the command line. Conversation state is preserved across turns. Enter exit or quit to stop the loop.

**Parameters:**

| Name   | Type         | Description                    | Default |
|--------|--------------|--------------------------------|---------|
| agent  | Agent[Any]   | The starting agent to run.     | required|
| stream | bool         | Whether to stream the agent output. | True    |

_Source code in src/agents/repl.py_

---

## Tools

### MCPToolApprovalFunction

```python
MCPToolApprovalFunction = Callable[
    [MCPToolApprovalRequest],
    MaybeAwaitable[MCPToolApprovalFunctionResult],
]
```
A function that approves or rejects a tool call.

---

### LocalShellExecutor

```python
LocalShellExecutor = Callable[
    [LocalShellCommandRequest], MaybeAwaitable[str]
]
```
A function that executes a command on a shell.

---

### Tool

```python
Tool = Union[
    FunctionTool,
    FileSearchTool,
    WebSearchTool,
    ComputerTool,
    HostedMCPTool,
    LocalShellTool,
    ImageGenerationTool,
    CodeInterpreterTool,
]
```
A tool that can be used in an agent.

---

### FunctionToolResult dataclass

_Source code in src/agents/tool.py_

#### tool

```python
tool: FunctionTool
```
The tool that was run.

#### output

```python
output: Any
```
The output of the tool.

#### run_item

```python
run_item: RunItem
```
The run item that was produced as a result of the tool call.

---

### FunctionTool dataclass

A tool that wraps a function. In most cases, you should use the function_tool helpers to create a FunctionTool, as they let you easily wrap a Python function.

_Source code in src/agents/tool.py_

#### name

```python
name: str
```
The name of the tool, as shown to the LLM. Generally the name of the function.

#### description

```python
description: str
```
A description of the tool, as shown to the LLM.

#### params_json_schema

```python
params_json_schema: dict[str, Any]
```
The JSON schema for the tool's parameters.

#### on_invoke_tool

```python
on_invoke_tool: Callable[
    [ToolContext[Any], str], Awaitable[Any]
]
```
A function that invokes the tool with the given context and parameters. The params passed are: 1. The tool run context. 2. The arguments from the LLM, as a JSON string.

You must return a string representation of the tool output, or something we can call str() on. In case of errors, you can either raise an Exception (which will cause the run to fail) or return a string error message (which will be sent back to the LLM).

#### strict_json_schema

```python
strict_json_schema: bool = True
```
Whether the JSON schema is in strict mode. We strongly recommend setting this to True, as it increases the likelihood of correct JSON input.

#### is_enabled

```python
is_enabled: (
    bool
    | Callable[
        [RunContextWrapper[Any], AgentBase],
        MaybeAwaitable[bool],
    ]
) = True
```
Whether the tool is enabled. Either a bool or a Callable that takes the run context and agent and returns whether the tool is enabled. You can use this to dynamically enable/disable a tool based on your context/state.

---

### FileSearchTool dataclass

A hosted tool that lets the LLM search through a vector store. Currently only supported with OpenAI models, using the Responses API.

_Source code in src/agents/tool.py_

#### vector_store_ids

```python
vector_store_ids: list[str]
```
The IDs of the vector stores to search.

#### max_num_results

```python
max_num_results: int | None = None
```
The maximum number of results to return.

#### include_search_results

```python
include_search_results: bool = False
```
Whether to include the search results in the output produced by the LLM.

#### ranking_options

```python
ranking_options: RankingOptions | None = None
```
Ranking options for search.

#### filters

```python
filters: Filters | None = None
```
A filter to apply based on file attributes.

---

### WebSearchTool dataclass

A hosted tool that lets the LLM search the web. Currently only supported with OpenAI models, using the Responses API.

_Source code in src/agents/tool.py_

#### user_location

```python
user_location: UserLocation | None = None
```
Optional location for the search. Lets you customize results to be relevant to a location.

#### search_context_size

```python
search_context_size: Literal["low", "medium", "high"] = (
    "medium"
)
```
The amount of context to use for the search.

---

### ComputerTool dataclass

A hosted tool that lets the LLM control a computer.

_Source code in src/agents/tool.py_

#### computer

```python
computer: Computer | AsyncComputer
```
The computer implementation, which describes the environment and dimensions of the computer, as well as implements the computer actions like click, screenshot, etc.

#### on_safety_check

```python
on_safety_check: (
    Callable[
        [ComputerToolSafetyCheckData], MaybeAwaitable[bool]
    ]
    | None
) = None
```
Optional callback to acknowledge computer tool safety checks.

---

### ComputerToolSafetyCheckData dataclass

Information about a computer tool safety check.

_Source code in src/agents/tool.py_

#### ctx_wrapper

```python
ctx_wrapper: RunContextWrapper[Any]
```
The run context.

#### agent

```python
agent: Agent[Any]
```
The agent performing the computer action.

#### tool_call

```python
tool_call: ResponseComputerToolCall
```
The computer tool call.

#### safety_check

```python
safety_check: PendingSafetyCheck
```
The pending safety check to acknowledge.

---

### MCPToolApprovalRequest dataclass

A request to approve a tool call.

_Source code in src/agents/tool.py_

#### ctx_wrapper

```python
ctx_wrapper: RunContextWrapper[Any]
```
The run context.

#### data

```python
data: McpApprovalRequest
```
The data from the MCP tool approval request.

---

### MCPToolApprovalFunctionResult

Bases: TypedDict

The result of an MCP tool approval function.

_Source code in src/agents/tool.py_

#### approve

```python
approve: bool
```
Whether to approve the tool call.

#### reason

```python
reason: NotRequired[str]
```
An optional reason, if rejected.

---

### HostedMCPTool dataclass

A tool that allows the LLM to use a remote MCP server. The LLM will automatically list and call tools, without requiring a round trip back to your code. If you want to run MCP servers locally via stdio, in a VPC or other non-publicly-accessible environment, or you just prefer to run tool calls locally, then you can instead use the servers in agents.mcp and pass Agent(mcp_servers=[...]) to the agent.

_Source code in src/agents/tool.py_

#### tool_config

```python
tool_config: Mcp
```
The MCP tool config, which includes the server URL and other settings.

#### on_approval_request

```python
on_approval_request: MCPToolApprovalFunction | None = None
```
An optional function that will be called if approval is requested for an MCP tool. If not provided, you will need to manually add approvals/rejections to the input and call Runner.run(...) again.

---

### CodeInterpreterTool dataclass

A tool that allows the LLM to execute code in a sandboxed environment.

_Source code in src/agents/tool.py_

#### tool_config

```python
tool_config: CodeInterpreter
```
The tool config, which includes the container and other settings.

---

### ImageGenerationTool dataclass

A tool that allows the LLM to generate images.

_Source code in src/agents/tool.py_

#### tool_config

```python
tool_config: ImageGeneration
```
The tool config, which image generation settings.

---

### LocalShellCommandRequest dataclass

A request to execute a command on a shell.

_Source code in src/agents/tool.py_

#### ctx_wrapper

```python
ctx_wrapper: RunContextWrapper[Any]
```
The run context.

#### data

```python
data: LocalShellCall
```
The data from the local shell tool call.

---

### LocalShellTool dataclass

A tool that allows the LLM to execute commands on a shell.

_Source code in src/agents/tool.py_

#### executor

```python
executor: LocalShellExecutor
```
A function that executes a command on a shell.

---

### default_tool_error_function

```python
default_tool_error_function(
    ctx: RunContextWrapper[Any], error: Exception
) -> str
```
The default tool error function, which just returns a generic error message.

_Source code in src/agents/tool.py_

---

### function_tool

```python
function_tool(
    func: ToolFunction[...],
    *,
    name_override: str | None = None,
    description_override: str | None = None,
    docstring_style: DocstringStyle | None = None,
    use_docstring_info: bool = True,
    failure_error_function: ToolErrorFunction | None = None,
    strict_mode: bool = True,
    is_enabled: bool
    | Callable[
        [RunContextWrapper[Any], AgentBase],
        MaybeAwaitable[bool],
    ] = True,
) -> FunctionTool

function_tool(
    *,
    name_override: str | None = None,
    description_override: str | None = None,
    docstring_style: DocstringStyle | None = None,
    use_docstring_info: bool = True,
    failure_error_function: ToolErrorFunction | None = None,
    strict_mode: bool = True,
    is_enabled: bool
    | Callable[
        [RunContextWrapper[Any], AgentBase],
        MaybeAwaitable[bool],
    ] = True,
) -> Callable[[ToolFunction[...]], FunctionTool]

function_tool(
    func: ToolFunction[...] | None = None,
    *,
    name_override: str | None = None,
    description_override: str | None = None,
    docstring_style: DocstringStyle | None = None,
    use_docstring_info: bool = True,
    failure_error_function: ToolErrorFunction
    | None = default_tool_error_function,
    strict_mode: bool = True,
    is_enabled: bool
    | Callable[
        [RunContextWrapper[Any], AgentBase],
        MaybeAwaitable[bool],
    ] = True,
) -> (
    FunctionTool
    | Callable[[ToolFunction[...]], FunctionTool]
)
```

Decorator to create a FunctionTool from a function. By default, we will:  
1. Parse the function signature to create a JSON schema for the tool's parameters.  
2. Use the function's docstring to populate the tool's description.  
3. Use the function's docstring to populate argument descriptions. The docstring style is detected automatically, but you can override it.

If the function takes a RunContextWrapper as the first argument, it must match the context type of the agent that uses the tool.

**Parameters:**

| Name                  | Type                                                                                                   | Description                                                                                                                     | Default                    |
|-----------------------|--------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------------------------|
| func                  | ToolFunction[...] \| None                                                                              | The function to wrap.                                                                                                           | None                       |
| name_override         | str \| None                                                                                            | If provided, use this name for the tool instead of the function's name.                                                         | None                       |
| description_override  | str \| None                                                                                            | If provided, use this description for the tool instead of the function's docstring.                                             | None                       |
| docstring_style       | DocstringStyle \| None                                                                                 | If provided, use this style for the tool's docstring. If not provided, we will attempt to auto-detect the style.                | None                       |
| use_docstring_info    | bool                                                                                                   | If True, use the function's docstring to populate the tool's description and argument descriptions.                             | True                       |
| failure_error_function| ToolErrorFunction \| None                                                                              | If provided, use this function to generate an error message when the tool call fails. The error message is sent to the LLM.     | default_tool_error_function|
| strict_mode           | bool                                                                                                   | Whether to enable strict mode for the tool's JSON schema. We strongly recommend setting this to True.                           | True                       |
| is_enabled            | bool \| Callable[[RunContextWrapper[Any], AgentBase], MaybeAwaitable[bool]]                            | Whether the tool is enabled. Can be a bool or a callable that takes the run context and agent and returns whether enabled.      | True                       |

_Source code in src/agents/tool.py_

---

## Tool Context

### ToolContext dataclass

Bases: RunContextWrapper[TContext]

The context of a tool call.

_Source code in src/agents/tool_context.py_

#### tool_name

```python
tool_name: str = field(
    default_factory=_assert_must_pass_tool_name
)
```
The name of the tool being invoked.

#### tool_call_id

```python
tool_call_id: str = field(
    default_factory=_assert_must_pass_tool_call_id
)
```
The ID of the tool call.

#### context

```python
context: TContext
```
The context object (or None), passed by you to Runner.run()

#### usage

```python
usage: Usage = field(default_factory=Usage)
```
The usage of the agent run so far. For streamed responses, the usage will be stale until the last chunk of the stream is processed.

#### from_agent_context (classmethod)

```python
from_agent_context(
    context: RunContextWrapper[TContext],
    tool_call_id: str,
    tool_call: Optional[ResponseFunctionToolCall] = None,
) -> ToolContext
```
Create a ToolContext from a RunContextWrapper.

_Source code in src/agents/tool_context.py_

---

## Results

When you call the Runner.run methods, you either get a:

- **RunResult** if you call `run` or `run_sync`
- **RunResultStreaming** if you call `run_streamed`

Both of these inherit from RunResultBase, which is where most useful information is present.

### Final output

The `final_output` property contains the final output of the last agent that ran. This is either:

- a `str`, if the last agent didn't have an `output_type` defined
- an object of type `last_agent.output_type`, if the agent had an output type defined.

> **Note:**  
> `final_output` is of type `Any`. We can't statically type this, because of handoffs. If handoffs occur, that means any Agent might be the last agent, so we don't statically know the set of possible output types.

---

### Inputs for the next turn

You can use `result.to_input_list()` to turn the result into an input list that concatenates the original input you provided, to the items generated during the agent run. This makes it convenient to take the outputs of one agent run and pass them into another run, or to run it in a loop and append new user inputs each time.

---

### Last agent

The `last_agent` property contains the last agent that ran. Depending on your application, this is often useful for the next time the user inputs something. For example, if you have a frontline triage agent that hands off to a language-specific agent, you can store the last agent, and re-use it the next time the user messages the agent.

---

### New items

The `new_items` property contains the new items generated during the run. The items are RunItems. A run item wraps the raw item generated by the LLM.

- **MessageOutputItem** indicates a message from the LLM. The raw item is the message generated.
- **HandoffCallItem** indicates that the LLM called the handoff tool. The raw item is the tool call item from the LLM.
- **HandoffOutputItem** indicates that a handoff occurred. The raw item is the tool response to the handoff tool call. You can also access the source/target agents from the item.
- **ToolCallItem** indicates that the LLM invoked a tool.
- **ToolCallOutputItem** indicates that a tool was called. The raw item is the tool response. You can also access the tool output from the item.
- **ReasoningItem** indicates a reasoning item from the LLM. The raw item is the reasoning generated.

---

### Other information

- **Guardrail results**: The `input_guardrail_results` and `output_guardrail_results` properties contain the results of the guardrails, if any. Guardrail results can sometimes contain useful information you want to log or store, so we make these available to you.
- **Raw responses**: The `raw_responses` property contains the ModelResponses generated by the LLM.
- **Original input**: The `input` property contains the original input you provided to the run method. In most cases you won't need this, but it's available in case you do.

# Streaming Events

## StreamEvent

```python
StreamEvent: TypeAlias = Union[
    RawResponsesStreamEvent,
    RunItemStreamEvent,
    AgentUpdatedStreamEvent,
]
```
A streaming event from an agent.

---

### RawResponsesStreamEvent (dataclass)
Streaming event from the LLM. These are 'raw' events, i.e. they are directly passed through from the LLM.

**Source code:** `src/agents/stream_events.py`

- **data** (instance-attribute):  
  `data: TResponseStreamEvent`  
  The raw responses streaming event from the LLM.

- **type** (class-attribute, instance-attribute):  
  `type: Literal['raw_response_event'] = 'raw_response_event'`  
  The type of the event.

---

### RunItemStreamEvent (dataclass)
Streaming events that wrap a RunItem. As the agent processes the LLM response, it will generate these events for new messages, tool calls, tool outputs, handoffs, etc.

**Source code:** `src/agents/stream_events.py`

- **name** (instance-attribute):  
  ```python
  name: Literal[
      "message_output_created",
      "handoff_requested",
      "handoff_occured",
      "tool_called",
      "tool_output",
      "reasoning_item_created",
      "mcp_approval_requested",
      "mcp_list_tools",
  ]
  ```
  The name of the event.

- **item** (instance-attribute):  
  `item: RunItem`  
  The item that was created.

---

### AgentUpdatedStreamEvent (dataclass)
Event that notifies that there is a new agent running.

**Source code:** `src/agents/stream_events.py`

- **new_agent** (instance-attribute):  
  `new_agent: Agent[Any]`  
  The new agent.

---

# Handoffs

## HandoffInputFilter

```python
HandoffInputFilter: TypeAlias = Callable[
    [HandoffInputData], HandoffInputData
]
```
A function that filters the input data passed to the next agent.

---

### HandoffInputData (dataclass)

**Source code:** `src/agents/handoffs.py`

- **input_history** (instance-attribute):  
  `input_history: str | tuple[TResponseInputItem, ...]`  
  The input history before Runner.run() was called.

- **pre_handoff_items** (instance-attribute):  
  `pre_handoff_items: tuple[RunItem, ...]`  
  The items generated before the agent turn where the handoff was invoked.

- **new_items** (instance-attribute):  
  `new_items: tuple[RunItem, ...]`  
  The new items generated during the current agent turn, including the item that triggered the handoff and the tool output message representing the response from the handoff output.

---

### Handoff (dataclass)
Bases: `Generic[TContext, TAgent]`

A handoff is when an agent delegates a task to another agent. For example, in a customer support scenario you might have a "triage agent" that determines which agent should handle the user's request, and sub-agents that specialize in different areas like billing, account management, etc.

**Source code:** `src/agents/handoffs.py`

- **tool_name** (instance-attribute):  
  `tool_name: str`  
  The name of the tool that represents the handoff.

- **tool_description** (instance-attribute):  
  `tool_description: str`  
  The description of the tool that represents the handoff.

- **input_json_schema** (instance-attribute):  
  `input_json_schema: dict[str, Any]`  
  The JSON schema for the handoff input. Can be empty if the handoff does not take an input.

- **on_invoke_handoff** (instance-attribute):  
  ```python
  on_invoke_handoff: Callable[
      [RunContextWrapper[Any], str], Awaitable[TAgent]
  ]
  ```
  The function that invokes the handoff. The parameters passed are: 1. The handoff run context 2. The arguments from the LLM, as a JSON string. Empty string if input_json_schema is empty.  
  Must return an agent.

- **agent_name** (instance-attribute):  
  `agent_name: str`  
  The name of the agent that is being handed off to.

- **input_filter** (class-attribute, instance-attribute):  
  `input_filter: HandoffInputFilter | None = None`  
  A function that filters the inputs that are passed to the next agent. By default, the new agent sees the entire conversation history. In some cases, you may want to filter inputs e.g. to remove older inputs, or remove tools from existing inputs.

  The function will receive the entire conversation history so far, including the input item that triggered the handoff and a tool call output item representing the handoff tool's output.

  You are free to modify the input history or new items as you see fit. The next agent that runs will receive handoff_input_data.all_items.

  **IMPORTANT:** in streaming mode, we will not stream anything as a result of this function. The items generated before will already have been streamed.

- **strict_json_schema** (class-attribute, instance-attribute):  
  `strict_json_schema: bool = True`  
  Whether the input JSON schema is in strict mode. We strongly recommend setting this to True, as it increases the likelihood of correct JSON input.

- **is_enabled** (class-attribute, instance-attribute):  
  ```python
  is_enabled: (
      bool
      | Callable[
          [RunContextWrapper[Any], AgentBase[Any]],
          MaybeAwaitable[bool],
      ]
  ) = True
  ```
  Whether the handoff is enabled. Either a bool or a Callable that takes the run context and agent and returns whether the handoff is enabled. You can use this to dynamically enable/disable a handoff based on your context/state.

---

#### `handoff` function

```python
handoff(
    agent: Agent[TContext],
    *,
    tool_name_override: str | None = None,
    tool_description_override: str | None = None,
    input_filter: Callable[
        [HandoffInputData], HandoffInputData
    ]
    | None = None,
    is_enabled: bool
    | Callable[
        [RunContextWrapper[Any], Agent[Any]],
        MaybeAwaitable[bool],
    ] = True,
) -> Handoff[TContext, Agent[TContext]]
```

Other overloads exist for `on_handoff`, `input_type`, etc.

Create a handoff from an agent.

**Parameters:**

| Name                     | Type                                                                 | Description                                                                                                              | Default |
|--------------------------|----------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|---------|
| agent                    | Agent[TContext]                                                      | The agent to handoff to, or a function that returns an agent.                                                            | required|
| tool_name_override       | str \| None                                                          | Optional override for the name of the tool that represents the handoff.                                                  | None    |
| tool_description_override| str \| None                                                          | Optional override for the description of the tool that represents the handoff.                                           | None    |
| on_handoff               | OnHandoffWithInput[THandoffInput] \| OnHandoffWithoutInput \| None   | A function that runs when the handoff is invoked.                                                                        | None    |
| input_type               | type[THandoffInput] \| None                                          | the type of the input to the handoff. If provided, the input will be validated against this type.                        | None    |
| input_filter             | Callable[[HandoffInputData], HandoffInputData] \| None               | a function that filters the inputs that are passed to the next agent.                                                    | None    |
| is_enabled               | bool \| Callable[[RunContextWrapper[Any], Agent[TContext]], MaybeAwaitable[bool]] | Whether the handoff is enabled. Can be a bool or a callable that takes the run context and agent and returns whether the handoff is enabled. Disabled handoffs are hidden from the LLM at runtime. | True    |

**Source code:** `src/agents/handoffs.py`

---

# Lifecycle

## RunHooks

```python
RunHooks = RunHooksBase[TContext, Agent]
```
Run hooks when using Agent.

---

## AgentHooks

```python
AgentHooks = AgentHooksBase[TContext, Agent]
```
Agent hooks for Agents.

---

### RunHooksBase
Bases: `Generic[TContext, TAgent]`

A class that receives callbacks on various lifecycle events in an agent run. Subclass and override the methods you need.

- **on_agent_start** (async)
  ```python
  on_agent_start(
      context: RunContextWrapper[TContext], agent: TAgent
  ) -> None
  ```
  Called before the agent is invoked. Called each time the current agent changes.

- **on_agent_end** (async)
  ```python
  on_agent_end(
      context: RunContextWrapper[TContext],
      agent: TAgent,
      output: Any,
  ) -> None
  ```
  Called when the agent produces a final output.

- **on_handoff** (async)
  ```python
  on_handoff(
      context: RunContextWrapper[TContext],
      from_agent: TAgent,
      to_agent: TAgent,
  ) -> None
  ```
  Called when a handoff occurs.

- **on_tool_start** (async)
  ```python
  on_tool_start(
      context: RunContextWrapper[TContext],
      agent: TAgent,
      tool: Tool,
  ) -> None
  ```
  Called before a tool is invoked.

- **on_tool_end** (async)
  ```python
  on_tool_end(
      context: RunContextWrapper[TContext],
      agent: TAgent,
      tool: Tool,
      result: str,
  ) -> None
  ```
  Called after a tool is invoked.

---

### AgentHooksBase
Bases: `Generic[TContext, TAgent]`

A class that receives callbacks on various lifecycle events for a specific agent. You can set this on agent.hooks to receive events for that specific agent.

Subclass and override the methods you need.

- **on_start** (async)
  ```python
  on_start(
      context: RunContextWrapper[TContext], agent: TAgent
  ) -> None
  ```
  Called before the agent is invoked. Called each time the running agent is changed to this agent.

- **on_end** (async)
  ```python
  on_end(
      context: RunContextWrapper[TContext],
      agent: TAgent,
      output: Any,
  ) -> None
  ```
  Called when the agent produces a final output.

- **on_handoff** (async)
  ```python
  on_handoff(
      context: RunContextWrapper[TContext],
      agent: TAgent,
      source: TAgent,
  ) -> None
  ```
  Called when the agent is being handed off to. The source is the agent that is handing off to this agent.

- **on_tool_start** (async)
  ```python
  on_tool_start(
      context: RunContextWrapper[TContext],
      agent: TAgent,
      tool: Tool,
  ) -> None
  ```
  Called before a tool is invoked.

- **on_tool_end** (async)
  ```python
  on_tool_end(
      context: RunContextWrapper[TContext],
      agent: TAgent,
      tool: Tool,
      result: str,
  ) -> None
  ```
  Called after a tool is invoked.

---

# Items

## Type Aliases

- `TResponse = Response`  
  A type alias for the Response type from the OpenAI SDK.

- `TResponseInputItem = ResponseInputItemParam`  
  A type alias for the ResponseInputItemParam type from the OpenAI SDK.

- `TResponseOutputItem = ResponseOutputItem`  
  A type alias for the ResponseOutputItem type from the OpenAI SDK.

- `TResponseStreamEvent = ResponseStreamEvent`  
  A type alias for the ResponseStreamEvent type from the OpenAI SDK.

- `ToolCallItemTypes: TypeAlias = Union[
    ResponseFunctionToolCall,
    ResponseComputerToolCall,
    ResponseFileSearchToolCall,
    ResponseFunctionWebSearch,
    McpCall,
    ResponseCodeInterpreterToolCall,
    ImageGenerationCall,
    LocalShellCall,
  ]`  
  A type that represents a tool call item.

- `RunItem: TypeAlias = Union[
    MessageOutputItem,
    HandoffCallItem,
    HandoffOutputItem,
    ToolCallItem,
    ToolCallOutputItem,
    ReasoningItem,
    MCPListToolsItem,
    MCPApprovalRequestItem,
    MCPApprovalResponseItem,
  ]`  
  An item generated by an agent.

---

### RunItemBase (dataclass)
Bases: `Generic[T], ABC`

**Source code:** `src/agents/items.py`

- **agent** (instance-attribute):  
  `agent: Agent[Any]`  
  The agent whose run caused this item to be generated.

- **raw_item** (instance-attribute):  
  `raw_item: T`  
  The raw Responses item from the run. This will always be a either an output item (i.e. openai.types.responses.ResponseOutputItem or an input item (i.e. openai.types.responses.ResponseInputItemParam).

- **to_input_item**:  
  `to_input_item() -> TResponseInputItem`  
  Converts this item into an input item suitable for passing to the model.

---

### MessageOutputItem (dataclass)
Bases: `RunItemBase[ResponseOutputMessage]`

Represents a message from the LLM.

**Source code:** `src/agents/items.py`

- **raw_item** (instance-attribute):  
  `raw_item: ResponseOutputMessage`  
  The raw response output message.

- **agent** (instance-attribute):  
  `agent: Agent[Any]`  
  The agent whose run caused this item to be generated.

- **to_input_item**:  
  `to_input_item() -> TResponseInputItem`  
  Converts this item into an input item suitable for passing to the model.

---

### HandoffCallItem (dataclass)
Bases: `RunItemBase[ResponseFunctionToolCall]`

Represents a tool call for a handoff from one agent to another.

**Source code:** `src/agents/items.py`

- **raw_item** (instance-attribute):  
  `raw_item: ResponseFunctionToolCall`  
  The raw response function tool call that represents the handoff.

- **agent** (instance-attribute):  
  `agent: Agent[Any]`  
  The agent whose run caused this item to be generated.

- **to_input_item**:  
  `to_input_item() -> TResponseInputItem`  
  Converts this item into an input item suitable for passing to the model.

---

### HandoffOutputItem (dataclass)
Bases: `RunItemBase[TResponseInputItem]`

Represents the output of a handoff.

**Source code:** `src/agents/items.py`

- **raw_item** (instance-attribute):  
  `raw_item: TResponseInputItem`  
  The raw input item that represents the handoff taking place.

- **source_agent** (instance-attribute):  
  `source_agent: Agent[Any]`  
  The agent that made the handoff.

- **target_agent** (instance-attribute):  
  `target_agent: Agent[Any]`  
  The agent that is being handed off to.

- **agent** (instance-attribute):  
  `agent: Agent[Any]`  
  The agent whose run caused this item to be generated.

- **to_input_item**:  
  `to_input_item() -> TResponseInputItem`  
  Converts this item into an input item suitable for passing to the model.

---

### ToolCallItem (dataclass)
Bases: `RunItemBase[ToolCallItemTypes]`

Represents a tool call e.g. a function call or computer action call.

**Source code:** `src/agents/items.py`

- **raw_item** (instance-attribute):  
  `raw_item: ToolCallItemTypes`  
  The raw tool call item.

- **agent** (instance-attribute):  
  `agent: Agent[Any]`  
  The agent whose run caused this item to be generated.

- **to_input_item**:  
  `to_input_item() -> TResponseInputItem`  
  Converts this item into an input item suitable for passing to the model.

---

### ToolCallOutputItem (dataclass)
Bases: `RunItemBase[Union[FunctionCallOutput, ComputerCallOutput, LocalShellCallOutput]]`

Represents the output of a tool call.

**Source code:** `src/agents/items.py`

- **raw_item** (instance-attribute):  
  ```python
  raw_item: (
      FunctionCallOutput
      | ComputerCallOutput
      | LocalShellCallOutput
  )
  ```
  The raw item from the model.

- **output** (instance-attribute):  
  `output: Any`  
  The output of the tool call. This is whatever the tool call returned; the raw_item contains a string representation of the output.

- **agent** (instance-attribute):  
  `agent: Agent[Any]`  
  The agent whose run caused this item to be generated.

- **to_input_item**:  
  `to_input_item() -> TResponseInputItem`  
  Converts this item into an input item suitable for passing to the model.

---

### ReasoningItem (dataclass)
Bases: `RunItemBase[ResponseReasoningItem]`

Represents a reasoning item.

**Source code:** `src/agents/items.py`

- **raw_item** (instance-attribute):  
  `raw_item: ResponseReasoningItem`  
  The raw reasoning item.

- **agent** (instance-attribute):  
  `agent: Agent[Any]`  
  The agent whose run caused this item to be generated.

- **to_input_item**:  
  `to_input_item() -> TResponseInputItem`  
  Converts this item into an input item suitable for passing to the model.

---

### MCPListToolsItem (dataclass)
Bases: `RunItemBase[McpListTools]`

Represents a call to an MCP server to list tools.

**Source code:** `src/agents/items.py`

- **raw_item** (instance-attribute):  
  `raw_item: McpListTools`  
  The raw MCP list tools call.

- **agent** (instance-attribute):  
  `agent: Agent[Any]`  
  The agent whose run caused this item to be generated.

- **to_input_item**:  
  `to_input_item() -> TResponseInputItem`  
  Converts this item into an input item suitable for passing to the model.

---

### MCPApprovalRequestItem (dataclass)
Bases: `RunItemBase[McpApprovalRequest]`

Represents a request for MCP approval.

**Source code:** `src/agents/items.py`

- **raw_item** (instance-attribute):  
  `raw_item: McpApprovalRequest`  
  The raw MCP approval request.

- **agent** (instance-attribute):  
  `agent: Agent[Any]`  
  The agent whose run caused this item to be generated.

- **to_input_item**:  
  `to_input_item() -> TResponseInputItem`  
  Converts this item into an input item suitable for passing to the model.

---

### MCPApprovalResponseItem (dataclass)
Bases: `RunItemBase[McpApprovalResponse]`

Represents a response to an MCP approval request.

**Source code:** `src/agents/items.py`

- **raw_item** (instance-attribute):  
  `raw_item: McpApprovalResponse`  
  The raw MCP approval response.

- **agent** (instance-attribute):  
  `agent: Agent[Any]`  
  The agent whose run caused this item to be generated.

- **to_input_item**:  
  `to_input_item() -> TResponseInputItem`  
  Converts this item into an input item suitable for passing to the model.

---

### ModelResponse

**Source code:** `src/agents/items.py`

- **output** (instance-attribute):  
  `output: list[TResponseOutputItem]`  
  A list of outputs (messages, tool calls, etc) generated by the model

- **usage** (instance-attribute):  
  `usage: Usage`  
  The usage information for the response.

- **response_id** (instance-attribute):  
  `response_id: str | None`  
  An ID for the response which can be used to refer to the response in subsequent calls to the model. Not supported by all model providers. If using OpenAI models via the Responses API, this is the response_id parameter, and it can be passed to Runner.run.

- **to_input_items**:  
  `to_input_items() -> list[TResponseInputItem]`  
  Convert the output into a list of input items suitable for passing to the model.

---

### ItemHelpers

**Source code:** `src/agents/items.py`

- **extract_last_content** (classmethod):  
  `extract_last_content(message: TResponseOutputItem) -> str`  
  Extracts the last text content or refusal from a message.

- **extract_last_text** (classmethod):  
  `extract_last_text(message: TResponseOutputItem,) -> str | None`  
  Extracts the last text content from a message, if any. Ignores refusals.

- **input_to_new_input_list** (classmethod):  
  `input_to_new_input_list(input: str | list[TResponseInputItem],) -> list[TResponseInputItem]`  
  Converts a string or list of input items into a list of input items.

- **text_message_outputs** (classmethod):  
  `text_message_outputs(items: list[RunItem]) -> str`  
  Concatenates all the text content from a list of message output items.

- **text_message_output** (classmethod):  
  `text_message_output(message: MessageOutputItem) -> str`  
  Extracts all the text content from a single message output item.

- **tool_call_output_item** (classmethod):  
  `tool_call_output_item(tool_call: ResponseFunctionToolCall, output: str) -> FunctionCallOutput`  
  Creates a tool call output item from a tool call and its output.

---

# Run Context

## RunContextWrapper (dataclass)
Bases: `Generic[TContext]`

This wraps the context object that you passed to Runner.run(). It also contains information about the usage of the agent run so far.

**NOTE:** Contexts are not passed to the LLM. They're a way to pass dependencies and data to code you implement, like tool functions, callbacks, hooks, etc.

**Source code:** `src/agents/run_context.py`

- **context** (instance-attribute):  
  `context: TContext`  
  The context object (or None), passed by you to Runner.run()

- **usage** (class-attribute, instance-attribute):  
  `usage: Usage = field(default_factory=Usage)`  
  The usage of the agent run so far. For streamed responses, the usage will be stale until the last chunk of the stream is processed.

---

# Tool Context

## ToolContext (dataclass)
Bases: `RunContextWrapper[TContext]`

The context of a tool call.

**Source code:** `src/agents/tool_context.py`

- **tool_name** (class-attribute, instance-attribute):  
  `tool_name: str = field(default_factory=_assert_must_pass_tool_name)`  
  The name of the tool being invoked.

- **tool_call_id** (class-attribute, instance-attribute):  
  `tool_call_id: str = field(default_factory=_assert_must_pass_tool_call_id)`  
  The ID of the tool call.

- **context** (instance-attribute):  
  `context: TContext`  
  The context object (or None), passed by you to Runner.run()

- **usage** (class-attribute, instance-attribute):  
  `usage: Usage = field(default_factory=Usage)`  
  The usage of the agent run so far. For streamed responses, the usage will be stale until the last chunk of the stream is processed.

- **from_agent_context** (classmethod):  
  ```python
  from_agent_context(
      context: RunContextWrapper[TContext],
      tool_call_id: str,
      tool_call: Optional[ResponseFunctionToolCall] = None,
  ) -> ToolContext
  ```
  Create a ToolContext from a RunContextWrapper.

---

# Usage

## Usage

**Source code:** `src/agents/usage.py`

- **requests** (class-attribute, instance-attribute):  
  `requests: int = 0`  
  Total requests made to the LLM API.

- **input_tokens** (class-attribute, instance-attribute):  
  `input_tokens: int = 0`  
  Total input tokens sent, across all requests.

- **input_tokens_details** (class-attribute, instance-attribute):  
  `input_tokens_details: InputTokensDetails = field(default_factory=lambda: InputTokensDetails(cached_tokens=0))`  
  Details about the input tokens, matching responses API usage details.

- **output_tokens** (class-attribute, instance-attribute):  
  `output_tokens: int = 0`  
  Total output tokens received, across all requests.

- **output_tokens_details** (class-attribute, instance-attribute):  
  `output_tokens_details: OutputTokensDetails = field(default_factory=lambda: OutputTokensDetails(reasoning_tokens=0))`  
  Details about the output tokens, matching responses API usage details.

- **total_tokens** (class-attribute, instance-attribute):  
  `total_tokens: int = 0`  
  Total tokens sent and received, across all requests.

---

# Exceptions

## RunErrorDetails (dataclass)
Data collected from an agent run when an exception occurs.

**Source code:** `src/agents/exceptions.py`

---

## AgentsException
Bases: `Exception`

Base class for all exceptions in the Agents SDK.

**Source code:** `src/agents/exceptions.py`

---

## MaxTurnsExceeded
Bases: `AgentsException`

Exception raised when the maximum number of turns is exceeded.

**Source code:** `src/agents/exceptions.py`

---

## ModelBehaviorError
Bases: `AgentsException`

Exception raised when the model does something unexpected, e.g. calling a tool that doesn't exist, or providing malformed JSON.

**Source code:** `src/agents/exceptions.py`

---

## UserError
Bases: `AgentsException`

Exception raised when the user makes an error using the SDK.

**Source code:** `src/agents/exceptions.py`

---

## InputGuardrailTripwireTriggered
Bases: `AgentsException`

Exception raised when a guardrail tripwire is triggered.

**Source code:** `src/agents/exceptions.py`

- **guardrail_result** (instance-attribute):  
  `guardrail_result: InputGuardrailResult = guardrail_result`  
  The result data of the guardrail that was triggered.

---

## OutputGuardrailTripwireTriggered
Bases: `AgentsException`

Exception raised when a guardrail tripwire is triggered.

**Source code:** `src/agents/exceptions.py`

- **guardrail_result** (instance-attribute):  
  `guardrail_result: OutputGuardrailResult = guardrail_result`  
  The result data of the guardrail that was triggered.

---

# Guardrails

## GuardrailFunctionOutput (dataclass)
The output of a guardrail function.

**Source code:** `src/agents/guardrail.py`

- **output_info** (instance-attribute):  
  `output_info: Any`  
  Optional information about the guardrail's output. For example, the guardrail could include information about the checks it performed and granular results.

- **tripwire_triggered** (instance-attribute):  
  `tripwire_triggered: bool`  
  Whether the tripwire was triggered. If triggered, the agent's execution will be halted.

---

## InputGuardrailResult (dataclass)
The result of a guardrail run.

**Source code:** `src/agents/guardrail.py`

- **guardrail** (instance-attribute):  
  `guardrail: InputGuardrail[Any]`  
  The guardrail that was run.

- **output** (instance-attribute):  
  `output: GuardrailFunctionOutput`  
  The output of the guardrail function.

---

## OutputGuardrailResult (dataclass)
The result of a guardrail run.

**Source code:** `src/agents/guardrail.py`

- **guardrail** (instance-attribute):  
  `guardrail: OutputGuardrail[Any]`  
  The guardrail that was run.

- **agent_output** (instance-attribute):  
  `agent_output: Any`  
  The output of the agent that was checked by the guardrail.

- **agent** (instance-attribute):  
  `agent: Agent[Any]`  
  The agent that was checked by the guardrail.

- **output** (instance-attribute):  
  `output: GuardrailFunctionOutput`  
  The output of the guardrail function.

---

## InputGuardrail (dataclass)
Bases: `Generic[TContext]`

Input guardrails are checks that run in parallel to the agent's execution. They can be used to do things like:  
- Check if input messages are off-topic  
- Take over control of the agent's execution if an unexpected input is detected

You can use the `@input_guardrail()` decorator to turn a function into an InputGuardrail, or create an InputGuardrail manually.

Guardrails return a GuardrailResult. If result.tripwire_triggered is True, the agent's execution will immediately stop, and an InputGuardrailTripwireTriggered exception will be raised

**Source code:** `src/agents/guardrail.py`

- **guardrail_function** (instance-attribute):  
  ```python
  guardrail_function: Callable[
      [
          RunContextWrapper[TContext],
          Agent[Any],
          str | list[TResponseInputItem],
      ],
      MaybeAwaitable[GuardrailFunctionOutput],
  ]
  ```
  A function that receives the agent input and the context, and returns a GuardrailResult. The result marks whether the tripwire was triggered, and can optionally include information about the guardrail's output.

- **name** (class-attribute, instance-attribute):  
  `name: str | None = None`  
  The name of the guardrail, used for tracing. If not provided, we'll use the guardrail function's name.

---

## OutputGuardrail (dataclass)
Bases: `Generic[TContext]`

Output guardrails are checks that run on the final output of an agent. They can be used to do check if the output passes certain validation criteria

You can use the `@output_guardrail()` decorator to turn a function into an OutputGuardrail, or create an OutputGuardrail manually.

Guardrails return a GuardrailResult. If result.tripwire_triggered is True, an OutputGuardrailTripwireTriggered exception will be raised.

**Source code:** `src/agents/guardrail.py`

- **guardrail_function** (instance-attribute):  
  ```python
  guardrail_function: Callable[
      [RunContextWrapper[TContext], Agent[Any], Any],
      MaybeAwaitable[GuardrailFunctionOutput],
  ]
  ```
  A function that receives the final agent, its output, and the context, and returns a GuardrailResult. The result marks whether the tripwire was triggered, and can optionally include information about the guardrail's output.

- **name** (class-attribute, instance-attribute):  
  `name: str | None = None`  
  The name of the guardrail, used for tracing. If not provided, we'll use the guardrail function's name.

---

### input_guardrail

```python
input_guardrail(
    func: _InputGuardrailFuncSync[TContext_co],
) -> InputGuardrail[TContext_co]

input_guardrail(
    func: _InputGuardrailFuncAsync[TContext_co],
) -> InputGuardrail[TContext_co]

input_guardrail(
    *, name: str | None = None
) -> Callable[
    [
        _InputGuardrailFuncSync[TContext_co]
        | _InputGuardrailFuncAsync[TContext_co]
    ],
    InputGuardrail[TContext_co],
]

input_guardrail(
    func: _InputGuardrailFuncSync[TContext_co]
    | _InputGuardrailFuncAsync[TContext_co]
    | None = None,
    *,
    name: str | None = None,
) -> (
    InputGuardrail[TContext_co]
    | Callable[
        [
            _InputGuardrailFuncSync[TContext_co]
            | _InputGuardrailFuncAsync[TContext_co]
        ],
        InputGuardrail[TContext_co],
    ]
)
```
Decorator that transforms a sync or async function into an InputGuardrail. It can be used directly (no parentheses) or with keyword args, e.g.:

```python
@input_guardrail
def my_sync_guardrail(...): ...

@input_guardrail(name="guardrail_name")
async def my_async_guardrail(...): ...
```

**Source code:** `src/agents/guardrail.py`

---

### output_guardrail

```python
output_guardrail(
    func: _OutputGuardrailFuncSync[TContext_co],
) -> OutputGuardrail[TContext_co]

output_guardrail(
    func: _OutputGuardrailFuncAsync[TContext_co],
) -> OutputGuardrail[TContext_co]

output_guardrail(
    *, name: str | None = None
) -> Callable[
    [
        _OutputGuardrailFuncSync[TContext_co]
        | _OutputGuardrailFuncAsync[TContext_co]
    ],
    OutputGuardrail[TContext_co],
]

output_guardrail(
    func: _OutputGuardrailFuncSync[TContext_co]
    | _OutputGuardrailFuncAsync[TContext_co]
    | None = None,
    *,
    name: str | None = None,
) -> (
    OutputGuardrail[TContext_co]
    | Callable[
        [
            _OutputGuardrailFuncSync[TContext_co]
            | _OutputGuardrailFuncAsync[TContext_co]
        ],
        OutputGuardrail[TContext_co],
    ]
)
```
Decorator that transforms a sync or async function into an OutputGuardrail. It can be used directly (no parentheses) or with keyword args, e.g.:

```python
@output_guardrail
def my_sync_guardrail(...): ...

@output_guardrail(name="guardrail_name")
async def my_async_guardrail(...): ...
```

**Source code:** `src/agents/guardrail.py`

---

# Model Settings

## ModelSettings

Settings to use when calling an LLM.

This class holds optional model configuration parameters (e.g. temperature, top_p, penalties, truncation, etc.).

Not all models/providers support all of these parameters, so please check the API documentation for the specific model and provider you are using.

**Source code:** `src/agents/model_settings.py`

- **temperature** (class-attribute, instance-attribute):  
  `temperature: float | None = None`  
  The temperature to use when calling the model.

- **top_p** (class-attribute, instance-attribute):  
  `top_p: float | None = None`  
  The top_p to use when calling the model.

- **frequency_penalty** (class-attribute, instance-attribute):  
  `frequency_penalty: float | None = None`  
  The frequency penalty to use when calling the model.

- **presence_penalty** (class-attribute, instance-attribute):  
  `presence_penalty: float | None = None`  
  The presence penalty to use when calling the model.

- **tool_choice** (class-attribute, instance-attribute):  
  `tool_choice: ToolChoice | None = None`  
  The tool choice to use when calling the model.

- **parallel_tool_calls** (class-attribute, instance-attribute):  
  `parallel_tool_calls: bool | None = None`  
  Controls whether the model can make multiple parallel tool calls in a single turn. If not provided (i.e., set to None), this behavior defers to the underlying model provider's default. For most current providers (e.g., OpenAI), this typically means parallel tool calls are enabled (True). Set to True to explicitly enable parallel tool calls, or False to restrict the model to at most one tool call per turn.

- **truncation** (class-attribute, instance-attribute):  
  `truncation: Literal['auto', 'disabled'] | None = None`  
  The truncation strategy to use when calling the model.

- **max_tokens** (class-attribute, instance-attribute):  
  `max_tokens: int | None = None`  
  The maximum number of output tokens to generate.

- **reasoning** (class-attribute, instance-attribute):  
  `reasoning: Reasoning | None = None`  
  Configuration options for reasoning models.

- **metadata** (class-attribute, instance-attribute):  
  `metadata: dict[str, str] | None = None`  
  Metadata to include with the model response call.

- **store** (class-attribute, instance-attribute):  
  `store: bool | None = None`  
  Whether to store the generated model response for later retrieval. Defaults to True if not provided.

- **include_usage** (class-attribute, instance-attribute):  
  `include_usage: bool | None = None`  
  Whether to include usage chunk. Defaults to True if not provided.

- **response_include** (class-attribute, instance-attribute):  
  `response_include: list[ResponseIncludable] | None = None`  
  Additional output data to include in the model response. include parameter

- **extra_query** (class-attribute, instance-attribute):  
  `extra_query: Query | None = None`  
  Additional query fields to provide with the request. Defaults to None if not provided.

- **extra_body** (class-attribute, instance-attribute):  
  `extra_body: Body | None = None`  
  Additional body fields to provide with the request. Defaults to None if not provided.

- **extra_headers** (class-attribute, instance-attribute):  
  `extra_headers: Headers | None = None`  
  Additional headers to provide with the request. Defaults to None if not provided.

- **extra_args** (class-attribute, instance-attribute):  
  `extra_args: dict[str, Any] | None = None`  
  Arbitrary keyword arguments to pass to the model API call. These will be passed directly to the underlying model provider's API. Use with caution as not all models support all parameters.

- **resolve**:  
  `resolve(override: ModelSettings | None) -> ModelSettings`  
  Produce a new ModelSettings by overlaying any non-None values from the override on top of this instance.

---

# Agent Output

## AgentOutputSchemaBase
Bases: `ABC`

An object that captures the JSON schema of the output, as well as validating/parsing JSON produced by the LLM into the output type.

**Source code:** `src/agents/agent_output.py`

- **is_plain_text** (abstractmethod):  
  `is_plain_text() -> bool`  
  Whether the output type is plain text (versus a JSON object).

- **name** (abstractmethod):  
  `name() -> str`  
  The name of the output type.

- **json_schema** (abstractmethod):  
  `json_schema() -> dict[str, Any]`  
  Returns the JSON schema of the output. Will only be called if the output type is not plain text.

- **is_strict_json_schema** (abstractmethod):  
  `is_strict_json_schema() -> bool`  
  Whether the JSON schema is in strict mode. Strict mode constrains the JSON schema features, but guarantees valid JSON. See here for details: https://platform.openai.com/docs/guides/structured-outputs#supported-schemas

- **validate_json** (abstractmethod):  
  `validate_json(json_str: str) -> Any`  
  Validate a JSON string against the output type. You must return the validated object, or raise a ModelBehaviorError if the JSON is invalid.

---

## AgentOutputSchema (dataclass)
Bases: `AgentOutputSchemaBase`

An object that captures the JSON schema of the output, as well as validating/parsing JSON produced by the LLM into the output type.

**Source code:** `src/agents/agent_output.py`

- **output_type** (instance-attribute):  
  `output_type: type[Any] = output_type`  
  The type of the output.

- **__init__**:  
  ```python
  __init__(
      output_type: type[Any], strict_json_schema: bool = True
  )
  ```
  | Name             | Type      | Description                                                                 | Default |
  |------------------|-----------|-----------------------------------------------------------------------------|---------|
  | output_type      | type[Any] | The type of the output.                                                     | required|
  | strict_json_schema | bool    | Whether the JSON schema is in strict mode. We strongly recommend setting this to True, as it increases the likelihood of correct JSON input. | True    |

- **is_plain_text**:  
  `is_plain_text() -> bool`  
  Whether the output type is plain text (versus a JSON object).

- **is_strict_json_schema**:  
  `is_strict_json_schema() -> bool`  
  Whether the JSON schema is in strict mode.

- **json_schema**:  
  `json_schema() -> dict[str, Any]`  
  The JSON schema of the output type.

- **validate_json**:  
  `validate_json(json_str: str) -> Any`  
  Validate a JSON string against the output type. Returns the validated object, or raises a ModelBehaviorError if the JSON is invalid.

- **name**:  
  `name() -> str`  
  The name of the output type.

---

# Function Schema

## FuncSchema (dataclass)
Captures the schema for a python function, in preparation for sending it to an LLM as a tool.

**Source code:** `src/agents/function_schema.py`

- **name** (instance-attribute):  
  `name: str`  
  The name of the function.

- **description** (instance-attribute):  
  `description: str | None`  
  The description of the function.

- **params_pydantic_model** (instance-attribute):  
  `params_pydantic_model: type[BaseModel]`  
  A Pydantic model that represents the function's parameters.

- **params_json_schema** (instance-attribute):  
  `params_json_schema: dict[str, Any]`  
  The JSON schema for the function's parameters, derived from the Pydantic model.

- **signature** (instance-attribute):  
  `signature: Signature`  
  The signature of the function.

- **takes_context** (class-attribute, instance-attribute):  
  `takes_context: bool = False`  
  Whether the function takes a RunContextWrapper argument (must be the first argument).

- **strict_json_schema** (class-attribute, instance-attribute):  
  `strict_json_schema: bool = True`  
  Whether the JSON schema is in strict mode. We strongly recommend setting this to True, as it increases the likelihood of correct JSON input.

- **to_call_args**:  
  `to_call_args(data: BaseModel,) -> tuple[list[Any], dict[str, Any]]`  
  Converts validated data from the Pydantic model into (args, kwargs), suitable for calling the original function.

---

## FuncDocumentation (dataclass)
Contains metadata about a Python function, extracted from its docstring.

**Source code:** `src/agents/function_schema.py`

- **name** (instance-attribute):  
  `name: str`  
  The name of the function, via __name__.

- **description** (instance-attribute):  
  `description: str | None`  
  The description of the function, derived from the docstring.

- **param_descriptions** (instance-attribute):  
  `param_descriptions: dict[str, str] | None`  
  The parameter descriptions of the function, derived from the docstring.

---

### generate_func_documentation

```python
generate_func_documentation(
    func: Callable[..., Any],
    style: DocstringStyle | None = None,
) -> FuncDocumentation
```
Extracts metadata from a function docstring, in preparation for sending it to an LLM as a tool.

| Name  | Type                  | Description                                                                 | Default |
|-------|-----------------------|-----------------------------------------------------------------------------|---------|
| func  | Callable[..., Any]    | The function to extract documentation from.                                 | required|
| style | DocstringStyle \| None| The style of the docstring to use for parsing. If not provided, we will attempt to auto-detect the style. | None    |

**Returns:**  
- `FuncDocumentation` — A FuncDocumentation object containing the function's name, description, and parameter descriptions.

**Source code:** `src/agents/function_schema.py`

---

### function_schema

```python
function_schema(
    func: Callable[..., Any],
    docstring_style: DocstringStyle | None = None,
    name_override: str | None = None,
    description_override: str | None = None,
    use_docstring_info: bool = True,
    strict_json_schema: bool = True,
) -> FuncSchema
```
Given a Python function, extracts a FuncSchema from it, capturing the name, description, parameter descriptions, and other metadata.

| Name                | Type                  | Description                                                                 | Default |
|---------------------|-----------------------|-----------------------------------------------------------------------------|---------|
| func                | Callable[..., Any]    | The function to extract the schema from.                                    | required|
| docstring_style     | DocstringStyle \| None| The style of the docstring to use for parsing. If not provided, we will attempt to auto-detect the style. | None    |
| name_override       | str \| None           | If provided, use this name instead of the function's __name__.              | None    |
| description_override| str \| None           | If provided, use this description instead of the one derived from the docstring. | None    |
| use_docstring_info  | bool                  | If True, uses the docstring to generate the description and parameter descriptions. | True    |
| strict_json_schema  | bool                  | Whether the JSON schema is in strict mode. If True, we'll ensure that the schema adheres to the "strict" standard the OpenAI API expects. We strongly recommend setting this to True, as it increases the likelihood of the LLM producing correct JSON input. | True    |

**Returns:**  
- `FuncSchema` — A FuncSchema object containing the function's name, description, parameter descriptions, and other metadata.

**Source code:** `src/agents/function_schema.py`

---

# Model Interface

## ModelTracing
Bases: `Enum`

**Source code:** `src/agents/models/interface.py`

- **DISABLED** (class-attribute, instance-attribute):  
  `DISABLED = 0`  
  Tracing is disabled entirely.

- **ENABLED** (class-attribute, instance-attribute):  
  `ENABLED = 1`  
  Tracing is enabled, and all data is included.

- **ENABLED_WITHOUT_DATA** (class-attribute, instance-attribute):  
  `ENABLED_WITHOUT_DATA = 2`  
  Tracing is enabled, but inputs/outputs are not included.

---

## Model
Bases: `ABC`

The base interface for calling an LLM.

**Source code:** `src/agents/models/interface.py`

- **get_response** (abstractmethod, async)
  ```python
  get_response(
      system_instructions: str | None,
      input: str | list[TResponseInputItem],
      model_settings: ModelSettings,
      tools: list[Tool],
      output_schema: AgentOutputSchemaBase | None,
      handoffs: list[Handoff],
      tracing: ModelTracing,
      *,
      previous_response_id: str | None,
      prompt: ResponsePromptParam | None,
  ) -> ModelResponse
  ```
  Get a response from the model.

  | Name                  | Type                                         | Description                                                                 | Default |
  |-----------------------|----------------------------------------------|-----------------------------------------------------------------------------|---------|
  | system_instructions   | str \| None                                 | The system instructions to use.                                             | required|
  | input                 | str \| list[TResponseInputItem]             | The input items to the model, in OpenAI Responses format.                   | required|
  | model_settings        | ModelSettings                               | The model settings to use.                                                  | required|
  | tools                 | list[Tool]                                  | The tools available to the model.                                           | required|
  | output_schema         | AgentOutputSchemaBase \| None               | The output schema to use.                                                   | required|
  | handoffs              | list[Handoff]                               | The handoffs available to the model.                                        | required|
  | tracing               | ModelTracing                                | Tracing configuration.                                                      | required|
  | previous_response_id  | str \| None                                 | the ID of the previous response. Generally not used by the model, except for the OpenAI Responses API. | required|
  | prompt                | ResponsePromptParam \| None                 | The prompt config to use for the model.                                     | required|

  **Returns:**  
  - `ModelResponse` — The full model response.

- **stream_response** (abstractmethod)
  ```python
  stream_response(
      system_instructions: str | None,
      input: str | list[TResponseInputItem],
      model_settings: ModelSettings,
      tools: list[Tool],
      output_schema: AgentOutputSchemaBase | None,
      handoffs: list[Handoff],
      tracing: ModelTracing,
      *,
      previous_response_id: str | None,
      prompt: ResponsePromptParam | None,
  ) -> AsyncIterator[TResponseStreamEvent]
  ```
  Stream a response from the model.

  | Name                  | Type                                         | Description                                                                 | Default |
  |-----------------------|----------------------------------------------|-----------------------------------------------------------------------------|---------|
  | system_instructions   | str \| None                                 | The system instructions to use.                                             | required|
  | input                 | str \| list[TResponseInputItem]             | The input items to the model, in OpenAI Responses format.                   | required|
  | model_settings        | ModelSettings                               | The model settings to use.                                                  | required|
  | tools                 | list[Tool]                                  | The tools available to the model.                                           | required|
  | output_schema         | AgentOutputSchemaBase \| None               | The output schema to use.                                                   | required|
  | handoffs              | list[Handoff]                               | The handoffs available to the model.                                        | required|
  | tracing               | ModelTracing                                | Tracing configuration.                                                      | required|
  | previous_response_id  | str \| None                                 | the ID of the previous response. Generally not used by the model, except for the OpenAI Responses API. | required|
  | prompt                | ResponsePromptParam \| None                 | The prompt config to use for the model.                                     | required|

  **Returns:**  
  - `AsyncIterator[TResponseStreamEvent]` — An iterator of response stream events, in OpenAI Responses format.

---

## ModelProvider
Bases: `ABC`

The base interface for a model provider.

Model provider is responsible for looking up Models by name.

**Source code:** `src/agents/models/interface.py`

- **get_model** (abstractmethod)
  ```python
  get_model(model_name: str | None) -> Model
  ```
  Get a model by name.

  | Name      | Type         | Description                       | Default |
  |-----------|--------------|-----------------------------------|---------|
  | model_name| str \| None  | The name of the model to get.     | required|

  **Returns:**  
  - `Model` — The model.

---

# OpenAI Chat Completions Model

## OpenAIChatCompletionsModel
Bases: `Model`

**Source code:** `src/agents/models/openai_chatcompletions.py`

- **stream_response** (async)
  ```python
  stream_response(
      system_instructions: str | None,
      input: str | list[TResponseInputItem],
      model_settings: ModelSettings,
      tools: list[Tool],
      output_schema: AgentOutputSchemaBase | None,
      handoffs: list[Handoff],
      tracing: ModelTracing,
      previous_response_id: str | None,
      prompt: ResponsePromptParam | None = None,
  ) -> AsyncIterator[TResponseStreamEvent]
  ```
  Yields a partial message as it is generated, as well as the usage information.

---

# OpenAI Responses Model

## OpenAIResponsesModel
Bases: `Model`

Implementation of Model that uses the OpenAI Responses API.

**Source code:** `src/agents/models/openai_responses.py`

- **stream_response** (async)
  ```python
  stream_response(
      system_instructions: str | None,
      input: str | list[TResponseInputItem],
      model_settings: ModelSettings,
      tools: list[Tool],
      output_schema: AgentOutputSchemaBase | None,
      handoffs: list[Handoff],
      tracing: ModelTracing,
      previous_response_id: str | None,
      prompt: ResponsePromptParam | None = None,
  ) -> AsyncIterator[ResponseStreamEvent]
  ```
  Yields a partial message as it is generated, as well as the usage information.

---

# MCP Servers

## MCPServer
Bases: `ABC`

Base class for Model Context Protocol servers.

**Source code:** `src/agents/mcp/server.py`

- **name** (abstractmethod, property):  
  `name: str`  
  A readable name for the server.

- **__init__**:  
  ```python
  __init__(use_structured_content: bool = False)
  ```
  | Name                 | Type   | Description                                                                 | Default |
  |----------------------|--------|-----------------------------------------------------------------------------|---------|
  | use_structured_content| bool  | Whether to use tool_result.structured_content when calling an MCP tool. Defaults to False for backwards compatibility - most MCP servers still include the structured content in the tool_result.content, and using it by default will cause duplicate content. You can set this to True if you know the server will not duplicate the structured content in the tool_result.content. | False    |

- **connect** (abstractmethod, async):  
  `connect()`  
  Connect to the server. For example, this might mean spawning a subprocess or opening a network connection. The server is expected to remain connected until cleanup() is called.

- **cleanup** (abstractmethod, async):  
  `cleanup()`  
  Cleanup the server. For example, this might mean closing a subprocess or closing a network connection.

- **list_tools** (abstractmethod, async):  
  ```python
  list_tools(
      run_context: RunContextWrapper[Any] | None = None,
      agent: AgentBase | None = None,
  ) -> list[Tool]
  ```
  List the tools available on the server.

- **call_tool** (abstractmethod, async):  
  ```python
  call_tool(
      tool_name: str, arguments: dict[str, Any] | None
  ) -> CallToolResult
  ```
  Invoke a tool on the server.

- **list_prompts** (abstractmethod, async):  
  `list_prompts() -> ListPromptsResult`  
  List the prompts available on the server.

- **get_prompt** (abstractmethod, async):  
  ```python
  get_prompt(
      name: str, arguments: dict[str, Any] | None = None
  ) -> GetPromptResult
  ```
  Get a specific prompt from the server.

---

## MCPServerStdioParams
Bases: `TypedDict`

Mirrors mcp.client.stdio.StdioServerParameters, but lets you pass params without another import.

**Source code:** `src/agents/mcp/server.py`

- **command** (instance-attribute):  
  `command: str`  
  The executable to run to start the server. For example, python or node.

- **args** (instance-attribute):  
  `args: NotRequired[list[str]]`  
  Command line args to pass to the command executable. For example, ['foo.py'] or ['server.js', '--port', '8080'].

- **env** (instance-attribute):  
  `env: NotRequired[dict[str, str]]`  
  The environment variables to set for the server.

- **cwd** (instance-attribute):  
  `cwd: NotRequired[str | Path]`  
  The working directory to use when spawning the process.

- **encoding** (instance-attribute):  
  `encoding: NotRequired[str]`  
  The text encoding used when sending/receiving messages to the server. Defaults to utf-8.

- **encoding_error_handler** (instance-attribute):  
  ```python
  encoding_error_handler: NotRequired[
      Literal["strict", "ignore", "replace"]
  ]
  ```
  The text encoding error handler. Defaults to strict.

  See https://docs.python.org/3/library/codecs.html#codec-base-classes for explanations of possible values.

---

## MCPServerStdio
Bases: `_MCPServerWithClientSession`

MCP server implementation that uses the stdio transport. See the [spec](https://spec.modelcontextprotocol.io/specification/2024-11-05/basic/transports/#stdio) for details.

**Source code:** `src/agents/mcp/server.py`

- **name** (property):  
  `name: str`  
  A readable name for the server.

- **__init__**:  
  ```python
  __init__(
      params: MCPServerStdioParams,
      cache_tools_list: bool = False,
      name: str | None = None,
      client_session_timeout_seconds: float | None = 5,
      tool_filter: ToolFilter = None,
      use_structured_content: bool = False,
  )
  ```
  Create a new MCP server based on the stdio transport.

  | Name                        | Type                   | Description                                                                 | Default |
  |-----------------------------|------------------------|-----------------------------------------------------------------------------|---------|
  | params                      | MCPServerStdioParams   | The params that configure the server. This includes the command to run to start the server, the args to pass to the command, the environment variables to set for the server, the working directory to use when spawning the process, and the text encoding used when sending/receiving messages to the server. | required|
  | cache_tools_list            | bool                   | Whether to cache the tools list. If True, the tools list will be cached and only fetched from the server once. If False, the tools list will be fetched from the server on each call to list_tools(). The cache can be invalidated by calling invalidate_tools_cache(). You should set this to True if you know the server will not change its tools list, because it can drastically improve latency (by avoiding a round-trip to the server every time). | False    |
  | name                        | str \| None            | A readable name for the server. If not provided, we'll create one from the command. | None    |
  | client_session_timeout_seconds| float \| None         | the read timeout passed to the MCP ClientSession.                            | 5       |
  | tool_filter                 | ToolFilter             | The tool filter to use for filtering tools.                                  | None    |
  | use_structured_content      | bool                   | Whether to use tool_result.structured_content when calling an MCP tool. Defaults to False for backwards compatibility - most MCP servers still include the structured content in the tool_result.content, and using it by default will cause duplicate content. You can set this to True if you know the server will not duplicate the structured content in the tool_result.content. | False    |

- **create_streams**:  
  ```python
  create_streams() -> AbstractAsyncContextManager[
      tuple[
          MemoryObjectReceiveStream[
              SessionMessage | Exception
          ],
          MemoryObjectSendStream[SessionMessage],
          GetSessionIdCallback | None,
      ]
  ]
  ```
  Create the streams for the server.

- **connect** (async):  
  `connect()`  
  Connect to the server.

- **cleanup** (async):  
  `cleanup()`  
  Cleanup the server.

- **list_tools** (async):  
  ```python
  list_tools(
      run_context: RunContextWrapper[Any] | None = None,
      agent: AgentBase | None = None,
  ) -> list[Tool]
  ```
  List the tools available on the server.

- **call_tool** (async):  
  ```python
  call_tool(
      tool_name: str, arguments: dict[str, Any] | None
  ) -> CallToolResult
  ```
  Invoke a tool on the server.

- **list_prompts** (async):  
  `list_prompts() -> ListPromptsResult`  
  List the prompts available on the server.

- **get_prompt** (async):  
  ```python
  get_prompt(
      name: str, arguments: dict[str, Any] | None = None
  ) -> GetPromptResult
  ```
  Get a specific prompt from the server.

- **invalidate_tools_cache**:  
  `invalidate_tools_cache()`  
  Invalidate the tools cache.

---

## MCPServerSseParams
Bases: `TypedDict`

Mirrors the params in `mcp.client.sse.sse_client`.

**Source code:** `src/agents/mcp/server.py`

- **url** (instance-attribute):  
  `url: str`  
  The URL of the server.

- **headers** (instance-attribute):  
  `headers: NotRequired[dict[str, str]]`  
  The headers to send to the server.

- **timeout** (instance-attribute):  
  `timeout: NotRequired[float]`  
  The timeout for the HTTP request. Defaults to 5 seconds.

- **sse_read_timeout** (instance-attribute):  
  `sse_read_timeout: NotRequired[float]`  
  The timeout for the SSE connection, in seconds. Defaults to 5 minutes.

---

## MCPServerSse
Bases: `_MCPServerWithClientSession`

MCP server implementation that uses the HTTP with SSE transport. See the [spec](https://spec.modelcontextprotocol.io/specification/2024-11-05/basic/transports/#http-with-sse) for details.

**Source code:** `src/agents/mcp/server.py`

- **name** (property):  
  `name: str`  
  A readable name for the server.

- **__init__**:  
  ```python
  __init__(
      params: MCPServerSseParams,
      cache_tools_list: bool = False,
      name: str | None = None,
      client_session_timeout_seconds: float | None = 5,
      tool_filter: ToolFilter = None,
      use_structured_content: bool = False,
  )
  ```
  Create a new MCP server based on the HTTP with SSE transport.

  | Name                        | Type                   | Description                                                                 | Default |
  |-----------------------------|------------------------|-----------------------------------------------------------------------------|---------|
  | params                      | MCPServerSseParams     | The params that configure the server. This includes the URL of the server, the headers to send to the server, the timeout for the HTTP request, and the timeout for the SSE connection. | required|
  | cache_tools_list            | bool                   | Whether to cache the tools list. If True, the tools list will be cached and only fetched from the server once. If False, the tools list will be fetched from the server on each call to list_tools(). The cache can be invalidated by calling invalidate_tools_cache(). You should set this to True if you know the server will not change its tools list, because it can drastically improve latency (by avoiding a round-trip to the server every time). | False    |
  | name                        | str \| None            | A readable name for the server. If not provided, we'll create one from the URL. | None    |
  | client_session_timeout_seconds| float \| None         | the read timeout passed to the MCP ClientSession.                            | 5       |
  | tool_filter                 | ToolFilter             | The tool filter to use for filtering tools.                                  | None    |
  | use_structured_content      | bool                   | Whether to use tool_result.structured_content when calling an MCP tool. Defaults to False for backwards compatibility - most MCP servers still include the structured content in the tool_result.content, and using it by default will cause duplicate content. You can set this to True if you know the server will not duplicate the structured content in the tool_result.content. | False    |

- **create_streams**:  
  (see above for signature)

- **connect** (async):  
  `connect()`  
  Connect to the server.

- **cleanup** (async):  
  `cleanup()`  
  Cleanup the server.

- **list_tools** (async):  
  (see above for signature)

- **call_tool** (async):  
  (see above for signature)

- **list_prompts** (async):  
  (see above for signature)

- **get_prompt** (async):  
  (see above for signature)

- **invalidate_tools_cache**:  
  (see above for signature)

---

## MCPServerStreamableHttpParams
Bases: `TypedDict`

Mirrors the params in `mcp.client.streamable_http.streamablehttp_client`.

**Source code:** `src/agents/mcp/server.py`

- **url** (instance-attribute):  
  `url: str`  
  The URL of the server.

- **headers** (instance-attribute):  
  `headers: NotRequired[dict[str, str]]`  
  The headers to send to the server.

- **timeout** (instance-attribute):  
  `timeout: NotRequired[timedelta | float]`  
  The timeout for the HTTP request. Defaults to 5 seconds.

- **sse_read_timeout** (instance-attribute):  
  `sse_read_timeout: NotRequired[timedelta | float]`  
  The timeout for the SSE connection, in seconds. Defaults to 5 minutes.

- **terminate_on_close** (instance-attribute):  
  `terminate_on_close: NotRequired[bool]`  
  Terminate on close

---

## MCPServerStreamableHttp
Bases: `_MCPServerWithClientSession`

MCP server implementation that uses the Streamable HTTP transport. See the [spec](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) for details.

**Source code:** `src/agents/mcp/server.py`

- **name** (property):  
  `name: str`  
  A readable name for the server.

- **__init__**:  
  (see above for signature)

- **create_streams**:  
  (see above for signature)

- **connect** (async):  
  (see above for signature)

- **cleanup** (async):  
  (see above for signature)

- **list_tools** (async):  
  (see above for signature)

- **call_tool** (async):  
  (see above for signature)

- **list_prompts** (async):  
  (see above for signature)

- **get_prompt** (async):  
  (see above for signature)

- **invalidate_tools_cache**:  
  (see above for signature)

---

# MCP Util

## ToolFilterCallable

```python
ToolFilterCallable = Callable[
    ["ToolFilterContext", "MCPTool"], MaybeAwaitable[bool]
]
```
A function that determines whether a tool should be available.

| Name    | Type | Description | Default |
|---------|------|-------------|---------|
| context |      | The context information including run context, agent, and server name. | required |
| tool    |      | The MCP tool to filter. | required |

**Returns:**  
- Whether the tool should be available (True) or filtered out (False).

---

## ToolFilter

```python
ToolFilter = Union[
    ToolFilterCallable, ToolFilterStatic, None
]
```
A tool filter that can be either a function, static configuration, or None (no filtering).

---

## ToolFilterContext (dataclass)
Context information available to tool filter functions.

**Source code:** `src/agents/mcp/util.py`

- **run_context** (instance-attribute):  
  `run_context: RunContextWrapper[Any]`  
  The current run context.

- **agent** (instance-attribute):  
  `agent: AgentBase`  
  The agent that is requesting the tool list.

- **server_name** (instance-attribute):  
  `server_name: str`  
  The name of the MCP server.

---

## ToolFilterStatic
Bases: `TypedDict`

Static tool filter configuration using allowlists and blocklists.

**Source code:** `src/agents/mcp/util.py`

- **allowed_tool_names** (instance-attribute):  
  `allowed_tool_names: NotRequired[list[str]]`  
  Optional list of tool names to allow (whitelist). If set, only these tools will be available.

- **blocked_tool_names** (instance-attribute):  
  `blocked_tool_names: NotRequired[list[str]]`  
  Optional list of tool names to exclude (blacklist). If set, these tools will be filtered out.

---

## MCPUtil
Set of utilities for interop between MCP and Agents SDK tools.

**Source code:** `src/agents/mcp/util.py`

- **get_all_function_tools** (async, classmethod):  
  ```python
  get_all_function_tools(
      servers: list[MCPServer],
      convert_schemas_to_strict: bool,
      run_context: RunContextWrapper[Any],
      agent: AgentBase,
  ) -> list[Tool]
  ```
  Get all function tools from a list of MCP servers.

- **get_function_tools** (async, classmethod):  
  ```python
  get_function_tools(
      server: MCPServer,
      convert_schemas_to_strict: bool,
      run_context: RunContextWrapper[Any],
      agent: AgentBase,
  ) -> list[Tool]
  ```
  Get all function tools from a single MCP server.

- **to_function_tool** (classmethod):  
  ```python
  to_function_tool(
      tool: Tool,
      server: MCPServer,
      convert_schemas_to_strict: bool,
  ) -> FunctionTool
  ```
  Convert an MCP tool to an Agents SDK function tool.

- **invoke_mcp_tool** (async, classmethod):  
  ```python
  invoke_mcp_tool(
      server: MCPServer,
      tool: Tool,
      context: RunContextWrapper[Any],
      input_json: str,
  ) -> str
  ```
  Invoke an MCP tool and return the result as a string.

- **create_static_tool_filter**:  
  ```python
  create_static_tool_filter(
      allowed_tool_names: Optional[list[str]] = None,
      blocked_tool_names: Optional[list[str]] = None,
  ) -> Optional[ToolFilterStatic]
  ```
  Create a static tool filter from allowlist and blocklist parameters.

  This is a convenience function for creating a ToolFilterStatic.

  | Name              | Type                | Description                                         | Default |
  |-------------------|---------------------|-----------------------------------------------------|---------|
  | allowed_tool_names| Optional[list[str]] | Optional list of tool names to allow (whitelist).   | None    |
  | blocked_tool_names| Optional[list[str]] | Optional list of tool names to exclude (blacklist). | None    |

  **Returns:**  
  - `Optional[ToolFilterStatic]` — A ToolFilterStatic if any filtering is specified, None otherwise.

**Source code:** `src/agents/mcp/util.py`
```