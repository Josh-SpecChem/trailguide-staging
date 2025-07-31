tool.py — Tool Abstractions and Function Tool Decorators for OpenAI Agents
File Overview
This file defines the core abstractions for agent tools, including function tools, hosted tools (file search, web search, computer control, image generation, code interpreter, etc.), and the unified Tool type. It provides the function_tool decorator for exposing Python functions as LLM-callable tools, with automatic schema generation, docstring extraction, error handling, and context support. The design supports both synchronous and asynchronous tools, strict schema enforcement, and advanced error handling, making it foundational for OpenAI-style agent systems.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
FunctionTool	Wraps a Python function as an LLM-callable tool with schema and invocation logic.
function_tool	Decorator for exposing Python functions as tools.
FileSearchTool	Hosted tool for vector store search.
WebSearchTool	Hosted tool for web search.
ComputerTool	Hosted tool for computer control (sync or async).
HostedMCPTool	Hosted tool for remote MCP server integration.
CodeInterpreterTool	Hosted tool for code execution.
ImageGenerationTool	Hosted tool for image generation.
LocalShellTool	Hosted tool for shell command execution.
Tool	Union type for all supported tool types.
ToolErrorFunction	Type for custom error handling functions for tools.
FunctionToolResult	Holds the result of a function tool call.
Annotated Code Snippets
1. FunctionTool and Decorator
@dataclass
class FunctionTool:
    name: str
    description: str
    params_json_schema: dict[str, Any]
    on_invoke_tool: Callable[[ToolContext[Any], str], Awaitable[Any]]
    strict_json_schema: bool = True
    is_enabled: bool | Callable[[RunContextWrapper[Any], AgentBase], MaybeAwaitable[bool]] = True

def function_tool(
    func: ToolFunction[...] | None = None,
    *,
    name_override: str | None = None,
    description_override: str | None = None,
    docstring_style: DocstringStyle | None = None,
    use_docstring_info: bool = True,
    failure_error_function: ToolErrorFunction | None = default_tool_error_function,
    strict_mode: bool = True,
    is_enabled: bool | Callable[[RunContextWrapper[Any], AgentBase], MaybeAwaitable[bool]] = True,
) -> FunctionTool | Callable[[ToolFunction[...]], FunctionTool]:
    ...
Explanation:

FunctionTool wraps a Python function as a tool, including schema, description, and invocation logic.
function_tool is a decorator for exposing functions as tools, with options for schema strictness, docstring extraction, error handling, and enable/disable logic.
2. Hosted and Specialized Tools
@dataclass
class FileSearchTool: ...
@dataclass
class WebSearchTool: ...
@dataclass
class ComputerTool: ...
@dataclass
class HostedMCPTool: ...
@dataclass
class CodeInterpreterTool: ...
@dataclass
class ImageGenerationTool: ...
@dataclass
class LocalShellTool: ...
Explanation:

These classes wrap hosted or specialized tools (vector search, web search, computer control, MCP, code execution, image generation, shell).
Each provides a .name property for tool identification.
3. Tool Union Type
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
Explanation:

Tool is a union of all supported tool types, allowing for flexible agent tool lists.
4. Tool Error Handling
def default_tool_error_function(ctx: RunContextWrapper[Any], error: Exception) -> str:
    return f"An error occurred while running the tool. Please try again. Error: {str(error)}"

ToolErrorFunction = Callable[[RunContextWrapper[Any], Exception], MaybeAwaitable[str]]
Explanation:

Provides a default error handler for tool invocation failures, returning a user-friendly message.
Function/Class Reference
FunctionTool
Purpose: Wraps a Python function as a tool for LLMs.
Fields: Name, description, parameter schema, invocation logic, strictness, enable/disable logic.
function_tool Decorator
Purpose: Exposes a Python function as an LLM-callable tool.
Parameters: See above; supports name/description overrides, docstring extraction, error handling, strict schema mode, and enable/disable logic.
Returns: A FunctionTool or a decorator for deferred application.
Hosted/Specialized Tools
Purpose: Wrap hosted or specialized tools for file search, web search, computer control, MCP, code execution, image generation, and shell access.
Fields: Tool-specific configuration and .name property.
Tool Union
Purpose: Represents any supported tool type for agent tool lists.
ToolErrorFunction
Purpose: Type for custom error handling functions for tool invocation failures.
FunctionToolResult
Purpose: Holds the result of a function tool call, including the tool, output, and run item.
Example Usage
1. Exposing a Function as a Tool
@function_tool
def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b

agent = Agent(
    name="Calculator",
    tools=[add]
)
2. Custom Tool Error Handling
def custom_error(ctx, error):
    return f"Custom error: {str(error)}"

@function_tool(failure_error_function=custom_error)
def risky_tool(x: int) -> int:
    return 1 // x
3. Hosted Tool Example
file_search = FileSearchTool(vector_store_ids=["my-store"])
web_search = WebSearchTool(user_location={"country": "US"})
agent = Agent(
    name="Researcher",
    tools=[file_search, web_search]
)
Tips, Gotchas, and FAQ
Strict Schema:
Always use strict_mode=True unless you have a specific reason not to; this ensures OpenAI API compatibility.

Context Parameters:
If your function takes a RunContextWrapper or ToolContext as the first argument, it will be passed automatically.

Error Handling:
By default, tool errors return a user-friendly message to the LLM. Override with failure_error_function if needed.

Enable/Disable Logic:
Use the is_enabled parameter to dynamically enable or disable tools based on context or agent state.

Hosted Tools:
Hosted tools (file search, web search, etc.) are only supported with compatible OpenAI models and APIs.

Related Files
agent.py
: Agent definitions that use tools.
function_schema.py
: Used for schema extraction and docstring parsing.
run_context.py
: Context objects passed to tool functions.
strict_schema.py
: Used for enforcing strict JSON schema for tools.
For further details, see the source code and related modules.