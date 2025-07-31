
#####

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


#####

agent_output.py — Output Schema and Validation for OpenAI Agents
File Overview
This file defines the core abstractions and utilities for specifying, validating, and enforcing structured outputs from OpenAI-style agents. It introduces the AgentOutputSchemaBase abstract base class and the AgentOutputSchema implementation, which allow agents to declare their output types, generate JSON schemas, and validate LLM responses. The design supports both plain text and structured outputs (e.g., Pydantic models, TypedDicts), and provides strict schema enforcement for compatibility with OpenAI's structured output APIs.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
AgentOutputSchemaBase	Abstract base for output schema/validation logic.
AgentOutputSchema	Concrete implementation for output type validation and schema generation.
Annotated Code Snippets
1. Abstract Output Schema Base
class AgentOutputSchemaBase(abc.ABC):
    @abc.abstractmethod
    def is_plain_text(self) -> bool: ...
    @abc.abstractmethod
    def name(self) -> str: ...
    @abc.abstractmethod
    def json_schema(self) -> dict[str, Any]: ...
    @abc.abstractmethod
    def is_strict_json_schema(self) -> bool: ...
    @abc.abstractmethod
    def validate_json(self, json_str: str) -> Any: ...
Explanation:
Defines the interface for output schema objects, including methods for checking if the output is plain text, retrieving the schema, validating JSON, and more.

2. AgentOutputSchema: Typed Output Validation
@dataclass(init=False)
class AgentOutputSchema(AgentOutputSchemaBase):
    output_type: type[Any]
    _type_adapter: TypeAdapter[Any]
    _is_wrapped: bool
    _output_schema: dict[str, Any]
    _strict_json_schema: bool

    def __init__(self, output_type: type[Any], strict_json_schema: bool = True):
        ...
Explanation:

Stores the output type, a Pydantic TypeAdapter for validation, and flags for wrapping and strictness.
Handles both plain text and structured types, wrapping non-BaseModel/non-dict types in a dictionary for schema compatibility.
Enforces strict JSON schema if requested, raising errors if the type is not compatible.
3. Validation Logic
def validate_json(self, json_str: str) -> Any:
    validated = _json.validate_json(json_str, self._type_adapter, partial=False)
    if self._is_wrapped:
        if not isinstance(validated, dict):
            ...
            raise ModelBehaviorError(...)
        if _WRAPPER_DICT_KEY not in validated:
            ...
            raise ModelBehaviorError(...)
        return validated[_WRAPPER_DICT_KEY]
    return validated
Explanation:

Validates a JSON string against the declared output type.
If the output type is wrapped (for non-BaseModel/non-dict types), extracts the value from the wrapper dictionary.
Raises detailed errors if validation fails.
Function/Class Reference
AgentOutputSchemaBase
class AgentOutputSchemaBase(abc.ABC):
    def is_plain_text(self) -> bool: ...
    def name(self) -> str: ...
    def json_schema(self) -> dict[str, Any]: ...
    def is_strict_json_schema(self) -> bool: ...
    def validate_json(self, json_str: str) -> Any: ...
Purpose: Abstract interface for output schema/validation logic.
Methods:
is_plain_text(): Returns True if output is plain text.
name(): Returns a string name for the output type.
json_schema(): Returns a JSON schema dict for the output type.
is_strict_json_schema(): Returns True if schema is strict.
validate_json(json_str): Validates a JSON string, returning the parsed object or raising an error.
AgentOutputSchema
@dataclass(init=False)
class AgentOutputSchema(AgentOutputSchemaBase):
    def __init__(self, output_type: type[Any], strict_json_schema: bool = True): ...
    def is_plain_text(self) -> bool: ...
    def is_strict_json_schema(self) -> bool: ...
    def json_schema(self) -> dict[str, Any]: ...
    def validate_json(self, json_str: str) -> Any: ...
    def name(self) -> str: ...
Parameters:
output_type: The Python type for the agent's output (e.g., str, a dataclass, a Pydantic model, a TypedDict).
strict_json_schema: If True, enforces strict JSON schema compatibility.
Purpose: Implements output validation and schema generation for agent outputs.
Key Methods:
validate_json: Validates and parses a JSON string, handling wrapped types as needed.
json_schema: Returns the JSON schema for the output type, raising if plain text.
is_plain_text: Returns True if output is str or None.
name: Returns a string name for the output type.
Example Usage
1. Plain Text Output
schema = AgentOutputSchema(str)
assert schema.is_plain_text() == True
2. Structured Output with Pydantic Model
from pydantic import BaseModel

class MyOutput(BaseModel):
    result: int

schema = AgentOutputSchema(MyOutput)
json_str = '{"result": 42}'
parsed = schema.validate_json(json_str)
assert parsed.result == 42
3. TypedDict Output
from typing_extensions import TypedDict

class MyDict(TypedDict):
    foo: str

schema = AgentOutputSchema(MyDict)
json_str = '{"foo": "bar"}'
parsed = schema.validate_json(json_str)
assert parsed["foo"] == "bar"
4. Non-strict Schema
schema = AgentOutputSchema(MyOutput, strict_json_schema=False)
Tips, Gotchas, and FAQ
Strict Mode:
Enabling strict_json_schema ensures compatibility with OpenAI's structured output requirements, but may require using only supported schema features.

Plain Text vs. Structured:
If your output type is str or None, no JSON schema is available and only plain text output is accepted.

Type Wrapping:
Non-BaseModel and non-dict types are wrapped in a dictionary for schema compatibility. Access the value using the "response" key.

Error Handling:
Validation errors raise ModelBehaviorError with detailed context, and errors are attached to tracing spans for debugging.

Related Files
strict_schema.py
: Utilities for enforcing strict JSON schema.
exceptions.py
: Custom error types for model/validation errors.
util/_json.py
: JSON validation and parsing helpers.
tracing.py
: Error tracing and span management.
For further details, see the source code and related modules.


#####

computer.py — Abstract Interfaces for Computer and Browser Control
File Overview
This file defines abstract base classes for controlling a computer or browser environment, both synchronously (Computer) and asynchronously (AsyncComputer). These interfaces standardize operations such as mouse clicks, keyboard input, screenshots, scrolling, and more. They are designed for use in agent systems that require automation, remote control, or simulation of desktop/browser environments.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
Environment	Type alias for supported environments: "mac", "windows", "ubuntu", "browser".
Button	Type alias for mouse buttons: "left", "right", "wheel", "back", "forward".
Computer	Abstract base class for synchronous computer/browser control.
AsyncComputer	Abstract base class for asynchronous computer/browser control.
Annotated Code Snippets
1. Environment and Button Type Aliases
Environment = Literal["mac", "windows", "ubuntu", "browser"]
Button = Literal["left", "right", "wheel", "back", "forward"]
Explanation:
Defines the allowed values for the environment and mouse button parameters, ensuring type safety and clarity.

2. Synchronous Computer Interface
class Computer(abc.ABC):
    @property
    @abc.abstractmethod
    def environment(self) -> Environment: ...
    @property
    @abc.abstractmethod
    def dimensions(self) -> tuple[int, int]: ...
    @abc.abstractmethod
    def screenshot(self) -> str: ...
    @abc.abstractmethod
    def click(self, x: int, y: int, button: Button) -> None: ...
    # ... other abstract methods ...
Explanation:

Specifies the required methods and properties for a synchronous computer/browser controller.
Includes mouse, keyboard, screenshot, and navigation operations.
3. Asynchronous Computer Interface
class AsyncComputer(abc.ABC):
    @property
    @abc.abstractmethod
    def environment(self) -> Environment: ...
    @property
    @abc.abstractmethod
    def dimensions(self) -> tuple[int, int]: ...
    @abc.abstractmethod
    async def screenshot(self) -> str: ...
    @abc.abstractmethod
    async def click(self, x: int, y: int, button: Button) -> None: ...
    # ... other async abstract methods ...
Explanation:

Mirrors the Computer interface, but all operational methods are asynchronous (async def).
Useful for integration with event loops or async agent frameworks.
Function/Class Reference
Computer
class Computer(abc.ABC):
    @property
    def environment(self) -> Environment: ...
    @property
    def dimensions(self) -> tuple[int, int]: ...
    def screenshot(self) -> str: ...
    def click(self, x: int, y: int, button: Button) -> None: ...
    def double_click(self, x: int, y: int) -> None: ...
    def scroll(self, x: int, y: int, scroll_x: int, scroll_y: int) -> None: ...
    def type(self, text: str) -> None: ...
    def wait(self) -> None: ...
    def move(self, x: int, y: int) -> None: ...
    def keypress(self, keys: list[str]) -> None: ...
    def drag(self, path: list[tuple[int, int]]) -> None: ...
Purpose: Abstracts all necessary operations for controlling a computer or browser synchronously.
Parameters/Returns: See method signatures above.
Summary: Implement this interface to provide a concrete controller for automation or agentic tasks.
AsyncComputer
class AsyncComputer(abc.ABC):
    @property
    def environment(self) -> Environment: ...
    @property
    def dimensions(self) -> tuple[int, int]: ...
    async def screenshot(self) -> str: ...
    async def click(self, x: int, y: int, button: Button) -> None: ...
    async def double_click(self, x: int, y: int) -> None: ...
    async def scroll(self, x: int, y: int, scroll_x: int, scroll_y: int) -> None: ...
    async def type(self, text: str) -> None: ...
    async def wait(self) -> None: ...
    async def move(self, x: int, y: int) -> None: ...
    async def keypress(self, keys: list[str]) -> None: ...
    async def drag(self, path: list[tuple[int, int]]) -> None: ...
Purpose: Same as Computer, but for asynchronous operation.
Summary: Use this interface for async agent frameworks or environments.
Example Usage
1. Implementing a Synchronous Computer Controller
class MyComputer(Computer):
    @property
    def environment(self) -> Environment:
        return "mac"

    @property
    def dimensions(self) -> tuple[int, int]:
        return (1920, 1080)

    def screenshot(self) -> str:
        # Return base64-encoded screenshot
        return "..."

    def click(self, x: int, y: int, button: Button) -> None:
        # Perform click
        pass

    # Implement other methods...
2. Implementing an Asynchronous Computer Controller
class MyAsyncComputer(AsyncComputer):
    @property
    def environment(self) -> Environment:
        return "browser"

    @property
    def dimensions(self) -> tuple[int, int]:
        return (1280, 720)

    async def screenshot(self) -> str:
        # Async screenshot logic
        return "..."

    async def click(self, x: int, y: int, button: Button) -> None:
        # Async click logic
        pass

    # Implement other async methods...
Tips, Gotchas, and FAQ
Sync vs. Async:
Choose the interface (Computer or AsyncComputer) that matches your agent's runtime model. Do not mix sync and async methods in the same implementation.

Environment Values:
Only use the allowed values for environment ("mac", "windows", "ubuntu", "browser").

Button Values:
Only use the allowed values for button ("left", "right", "wheel", "back", "forward").

Not Implemented:
These are abstract base classes; you must implement all methods in a subclass.

Related Files
agent.py
: Agent classes that may use computer/browser controllers for tool actions.
tool.py
: For integrating computer control as agent tools.
For further details, see the source code and related modules.


#####

Should This Code Be Included in an Agent for OpenAI Agent Creation?
Yes, this code is important to include in the file base of an agent that helps with the creation of OpenAI Agents.

Why?
It defines standardized exception classes for agent execution, including errors for exceeding turn limits, model misbehavior, user mistakes, and guardrail violations.
The RunErrorDetails dataclass collects rich diagnostic information when an exception occurs, aiding in debugging and error reporting.
Guardrail-specific exceptions (InputGuardrailTripwireTriggered, OutputGuardrailTripwireTriggered) allow for precise handling of safety and validation failures.
Having a consistent error and exception handling framework is essential for robust agent orchestration, debugging, and user feedback.
In summary:
This file provides foundational error handling and diagnostics for agent systems, which is critical for reliability, maintainability, and developer experience.

I will now generate comprehensive markdown documentation for this file, following the guidelines provided.

exceptions.py — Exception and Error Handling for OpenAI Agents
File Overview
This file defines the core exception classes and error diagnostics for agent execution in OpenAI-style agent systems. It includes custom exceptions for turn limits, model misbehavior, user errors, and guardrail violations, as well as a RunErrorDetails dataclass for collecting rich error context. These constructs enable robust error handling, debugging, and reporting throughout the agent lifecycle.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RunErrorDetails	Collects detailed information about an agent run when an exception occurs.
AgentsException	Base class for all agent-specific exceptions.
MaxTurnsExceeded	Raised when the maximum number of agent turns is exceeded.
ModelBehaviorError	Raised when the model behaves unexpectedly (e.g., invalid tool call, malformed JSON).
UserError	Raised when the user misuses the SDK or provides invalid input.
InputGuardrailTripwireTriggered	Raised when an input guardrail tripwire is triggered.
OutputGuardrailTripwireTriggered	Raised when an output guardrail tripwire is triggered.
Annotated Code Snippets
1. Run Error Details
@dataclass
class RunErrorDetails:
    input: str | list[TResponseInputItem]
    new_items: list[RunItem]
    raw_responses: list[ModelResponse]
    last_agent: Agent[Any]
    context_wrapper: RunContextWrapper[Any]
    input_guardrail_results: list[InputGuardrailResult]
    output_guardrail_results: list[OutputGuardrailResult]

    def __str__(self) -> str:
        return pretty_print_run_error_details(self)
Explanation:
Captures all relevant information about an agent run at the time of an exception, including input, outputs, responses, agent state, context, and guardrail results. The __str__ method provides a human-readable summary for debugging.

2. Base Exception Class
class AgentsException(Exception):
    run_data: RunErrorDetails | None

    def __init__(self, *args: object) -> None:
        super().__init__(*args)
        self.run_data = None
Explanation:
All agent-specific exceptions inherit from this base class. It can optionally store RunErrorDetails for enhanced error reporting.

3. Specific Exception Types
class MaxTurnsExceeded(AgentsException):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

class ModelBehaviorError(AgentsException):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

class UserError(AgentsException):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)
Explanation:

MaxTurnsExceeded: Raised when the agent exceeds a configured turn limit.
ModelBehaviorError: Raised for unexpected model actions (e.g., invalid tool call, malformed output).
UserError: Raised for user mistakes in SDK usage or input.
4. Guardrail Tripwire Exceptions
class InputGuardrailTripwireTriggered(AgentsException):
    guardrail_result: InputGuardrailResult

    def __init__(self, guardrail_result: InputGuardrailResult):
        self.guardrail_result = guardrail_result
        super().__init__(
            f"Guardrail {guardrail_result.guardrail.__class__.__name__} triggered tripwire"
        )

class OutputGuardrailTripwireTriggered(AgentsException):
    guardrail_result: OutputGuardrailResult

    def __init__(self, guardrail_result: OutputGuardrailResult):
        self.guardrail_result = guardrail_result
        super().__init__(
            f"Guardrail {guardrail_result.guardrail.__class__.__name__} triggered tripwire"
        )
Explanation:

Raised when an input or output guardrail detects a violation (tripwire).
The exception carries the guardrail result for further inspection.
Function/Class Reference
RunErrorDetails
@dataclass
class RunErrorDetails:
    input: str | list[TResponseInputItem]
    new_items: list[RunItem]
    raw_responses: list[ModelResponse]
    last_agent: Agent[Any]
    context_wrapper: RunContextWrapper[Any]
    input_guardrail_results: list[InputGuardrailResult]
    output_guardrail_results: list[OutputGuardrailResult]

    def __str__(self) -> str
Purpose: Captures all relevant run context for debugging agent errors.
Parameters: See above.
Returns: Pretty-printed string for diagnostics.
AgentsException and Subclasses
Exception Class	Purpose	Extra Attributes
AgentsException	Base for all agent exceptions	run_data (optional)
MaxTurnsExceeded	Raised when turn limit is hit	message
ModelBehaviorError	Raised for unexpected model behavior	message
UserError	Raised for user mistakes	message
InputGuardrailTripwireTriggered	Raised for input guardrail violations	guardrail_result
OutputGuardrailTripwireTriggered	Raised for output guardrail violations	guardrail_result
Example Usage
1. Raising a Model Behavior Error
if invalid_tool_call:
    raise ModelBehaviorError("The model called a tool that does not exist.")
2. Handling Guardrail Violations
try:
    agent.run(input)
except InputGuardrailTripwireTriggered as e:
    print("Input guardrail tripped:", e.guardrail_result)
3. Attaching Run Data to Exceptions
try:
    agent.run(input)
except AgentsException as e:
    e.run_data = RunErrorDetails(...)
    print(str(e.run_data))
Tips, Gotchas, and FAQ
Always attach RunErrorDetails to exceptions when possible for better diagnostics.
Guardrail exceptions provide direct access to the triggering guardrail's result for custom handling or logging.
Use specific exception types to distinguish between user errors, model errors, and system errors in your agent orchestration code.
Related Files
agent.py
: Agent definitions that may raise these exceptions.
guardrail.py
: Guardrail logic and result types.
items.py
: Model response and run item definitions.
run_context.py
: Run context wrapper for agent execution.
For further details, see the source code and related modules.


#####

function_schema.py — Function Schema Extraction for OpenAI Tool-Calling Agents
File Overview
This file provides utilities for extracting metadata, parameter schemas, and documentation from Python functions, enabling their use as structured, LLM-callable tools. It includes logic for parsing function signatures, generating Pydantic models and strict JSON schemas for parameters, and extracting descriptions from docstrings (supporting Google, NumPy, and Sphinx styles). These features are essential for exposing Python functions as tools in OpenAI agent systems, ensuring compatibility, validation, and usability.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
FuncSchema	Captures the schema and metadata for a Python function as a tool.
FuncDocumentation	Holds extracted docstring documentation for a function.
DocstringStyle	Type alias for supported docstring styles: "google", "numpy", "sphinx".
Annotated Code Snippets
1. FuncSchema: Function Metadata and Schema
@dataclass
class FuncSchema:
    name: str
    description: str | None
    params_pydantic_model: type[BaseModel]
    params_json_schema: dict[str, Any]
    signature: inspect.Signature
    takes_context: bool = False
    strict_json_schema: bool = True

    def to_call_args(self, data: BaseModel) -> tuple[list[Any], dict[str, Any]]:
        # Converts validated data into (args, kwargs) for calling the original function
        ...
Explanation:
Encapsulates all information needed to expose a Python function as an LLM-callable tool, including name, description, parameter schema, and call signature. The to_call_args method transforms validated input into arguments for the original function.

2. Docstring Parsing and Style Detection
def _detect_docstring_style(doc: str) -> DocstringStyle:
    # Heuristically detects Google, NumPy, or Sphinx docstring style
    ...
Explanation:
Automatically determines the docstring style to enable accurate parsing of parameter and return descriptions.

3. Function Documentation Extraction
def generate_func_documentation(
    func: Callable[..., Any], style: DocstringStyle | None = None
) -> FuncDocumentation:
    # Extracts name, description, and parameter descriptions from a function's docstring
    ...
Explanation:
Uses the griffe library to parse the docstring and extract structured documentation for the function and its parameters.

4. Function Schema Generation
def function_schema(
    func: Callable[..., Any],
    docstring_style: DocstringStyle | None = None,
    name_override: str | None = None,
    description_override: str | None = None,
    use_docstring_info: bool = True,
    strict_json_schema: bool = True,
) -> FuncSchema:
    # Main entry point: generates a FuncSchema from a Python function
    ...
Explanation:

Inspects the function's signature and type hints.
Extracts docstring documentation.
Dynamically builds a Pydantic model for parameter validation.
Generates a strict JSON schema for OpenAI compatibility.
Returns a FuncSchema object with all metadata.
Function/Class Reference
FuncSchema
@dataclass
class FuncSchema:
    name: str
    description: str | None
    params_pydantic_model: type[BaseModel]
    params_json_schema: dict[str, Any]
    signature: inspect.Signature
    takes_context: bool = False
    strict_json_schema: bool = True

    def to_call_args(self, data: BaseModel) -> tuple[list[Any], dict[str, Any]]
Purpose: Holds all metadata and schema for exposing a function as a tool.
Parameters:
name: Function/tool name.
description: Human-readable description.
params_pydantic_model: Pydantic model for parameter validation.
params_json_schema: JSON schema for parameters.
signature: Python function signature.
takes_context: Whether the first argument is a context object.
strict_json_schema: If True, enforces strict schema compatibility.
Method:
to_call_args(data): Converts validated Pydantic data to (args, kwargs) for function invocation.
FuncDocumentation
@dataclass
class FuncDocumentation:
    name: str
    description: str | None
    param_descriptions: dict[str, str] | None
Purpose: Holds extracted docstring documentation for a function.
function_schema
def function_schema(
    func: Callable[..., Any],
    docstring_style: DocstringStyle | None = None,
    name_override: str | None = None,
    description_override: str | None = None,
    use_docstring_info: bool = True,
    strict_json_schema: bool = True,
) -> FuncSchema
Purpose: Main utility to generate a FuncSchema from a Python function.
Parameters:
func: The function to process.
docstring_style: Force a docstring style (optional).
name_override: Override the function name.
description_override: Override the description.
use_docstring_info: Use docstring for descriptions if True.
strict_json_schema: Enforce strict schema compatibility if True.
Returns: A FuncSchema object.
Example Usage
1. Exposing a Function as a Tool
def add(a: int, b: int) -> int:
    """Add two numbers.

    Args:
        a: The first number.
        b: The second number.

    Returns:
        The sum.
    """
    return a + b

schema = function_schema(add)
print(schema.name)  # "add"
print(schema.params_json_schema)  # JSON schema for {"a": int, "b": int}
2. Calling the Original Function with Validated Data
validated = schema.params_pydantic_model(a=2, b=3)
args, kwargs = schema.to_call_args(validated)
result = add(*args, **kwargs)  # 5
3. Handling Context Parameters
def my_tool(context: RunContextWrapper, x: int) -> str:
    ...

schema = function_schema(my_tool)
assert schema.takes_context is True
Tips, Gotchas, and FAQ
Docstring Style:
Supports Google, NumPy, and Sphinx styles. If unsure, the style is auto-detected.

Parameter Position:
Context parameters (RunContextWrapper, ToolContext) must be the first argument. An error is raised otherwise.

Strict JSON Schema:
Setting strict_json_schema=True ensures compatibility with OpenAI's function-calling API, but may restrict some advanced schema features.

Default Values:
Default parameter values and descriptions are included in the generated schema.

Dynamic Models:
Parameter schemas are built as Pydantic models, enabling runtime validation and parsing.

Related Files
agent.py
: Agent classes that use function schemas for tool integration.
tool_context.py
: Context objects passed to tool functions.
strict_schema.py
: Utilities for enforcing strict JSON schema.
exceptions.py
: Custom error types for schema and usage errors.
For further details, see the source code and related modules.


#####

guardrail.py — Guardrail Abstractions and Decorators for OpenAI Agents
File Overview
This file defines the core abstractions and decorators for "guardrails"—modular checks that run before or after agent execution to enforce safety, correctness, or business logic in OpenAI-style agent systems. It provides the InputGuardrail and OutputGuardrail classes, result types, and flexible decorators (@input_guardrail, @output_guardrail) for both synchronous and asynchronous validation. Guardrails can halt agent execution (tripwire) or provide additional diagnostics, making them essential for robust, production-grade agent workflows.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
GuardrailFunctionOutput	Output/result of a guardrail function, including tripwire status.
InputGuardrailResult	Result of an input guardrail run.
OutputGuardrailResult	Result of an output guardrail run.
InputGuardrail	Guardrail for validating/checking agent input before execution.
OutputGuardrail	Guardrail for validating/checking agent output after execution.
input_guardrail	Decorator for defining input guardrails (sync or async).
output_guardrail	Decorator for defining output guardrails (sync or async).
Annotated Code Snippets
1. Guardrail Function Output
@dataclass
class GuardrailFunctionOutput:
    output_info: Any
    tripwire_triggered: bool
Explanation:
Encapsulates the result of a guardrail check, including optional diagnostic info and whether the guardrail "tripwire" was triggered (which halts agent execution).

2. Input and Output Guardrail Results
@dataclass
class InputGuardrailResult:
    guardrail: InputGuardrail[Any]
    output: GuardrailFunctionOutput

@dataclass
class OutputGuardrailResult:
    guardrail: OutputGuardrail[Any]
    agent_output: Any
    agent: Agent[Any]
    output: GuardrailFunctionOutput
Explanation:
Wraps the result of running a guardrail, including references to the guardrail, the checked input/output, and the result.

3. InputGuardrail and OutputGuardrail Classes
@dataclass
class InputGuardrail(Generic[TContext]):
    guardrail_function: Callable[[RunContextWrapper[TContext], Agent[Any], str | list[TResponseInputItem]], MaybeAwaitable[GuardrailFunctionOutput]]
    name: str | None = None

    async def run(self, agent, input, context) -> InputGuardrailResult: ...
    def get_name(self) -> str: ...

@dataclass
class OutputGuardrail(Generic[TContext]):
    guardrail_function: Callable[[RunContextWrapper[TContext], Agent[Any], Any], MaybeAwaitable[GuardrailFunctionOutput]]
    name: str | None = None

    async def run(self, context, agent, agent_output) -> OutputGuardrailResult: ...
    def get_name(self) -> str: ...
Explanation:

Both classes wrap a guardrail function and provide a standard async run method.
The guardrail function can be synchronous or asynchronous.
The name is used for tracing and diagnostics.
4. Guardrail Decorators
def input_guardrail(func=None, *, name=None):
    # Decorator that transforms a sync or async function into an InputGuardrail
    ...

def output_guardrail(func=None, *, name=None):
    # Decorator that transforms a sync or async function into an OutputGuardrail
    ...
Explanation:

These decorators allow you to define guardrails with or without parentheses.
They support both sync and async functions.
The decorated function is wrapped in the appropriate guardrail class.
Function/Class Reference
GuardrailFunctionOutput
@dataclass
class GuardrailFunctionOutput:
    output_info: Any
    tripwire_triggered: bool
Purpose: Result of a guardrail function, including diagnostics and tripwire status.
InputGuardrail / OutputGuardrail
@dataclass
class InputGuardrail(Generic[TContext]):
    guardrail_function: Callable[[RunContextWrapper[TContext], Agent[Any], str | list[TResponseInputItem]], MaybeAwaitable[GuardrailFunctionOutput]]
    name: str | None = None

    async def run(self, agent, input, context) -> InputGuardrailResult
    def get_name(self) -> str

@dataclass
class OutputGuardrail(Generic[TContext]):
    guardrail_function: Callable[[RunContextWrapper[TContext], Agent[Any], Any], MaybeAwaitable[GuardrailFunctionOutput]]
    name: str | None = None

    async def run(self, context, agent, agent_output) -> OutputGuardrailResult
    def get_name(self) -> str
Purpose: Encapsulate guardrail logic for input or output validation.
Parameters: See above.
Methods:
run: Executes the guardrail function and returns the result.
get_name: Returns the guardrail's name.
input_guardrail / output_guardrail Decorators
@input_guardrail
def my_guardrail(context, agent, input): ...

@output_guardrail(name="custom_output_guardrail")
async def my_async_output_guardrail(context, agent, output): ...
Purpose: Ergonomic way to define guardrails as decorated functions.
Usage: With or without parentheses; supports sync and async functions.
Example Usage
1. Synchronous Input Guardrail
@input_guardrail
def block_empty_input(context, agent, input):
    if not input:
        return GuardrailFunctionOutput(output_info="Input was empty", tripwire_triggered=True)
    return GuardrailFunctionOutput(output_info="OK", tripwire_triggered=False)
2. Asynchronous Output Guardrail with Custom Name
@output_guardrail(name="check_output_length")
async def check_output_length(context, agent, output):
    if len(str(output)) > 1000:
        return GuardrailFunctionOutput(output_info="Output too long", tripwire_triggered=True)
    return GuardrailFunctionOutput(output_info="OK", tripwire_triggered=False)
3. Manual Guardrail Creation
def custom_guardrail(context, agent, input):
    ...
guardrail = InputGuardrail(guardrail_function=custom_guardrail, name="custom_guardrail")
Tips, Gotchas, and FAQ
Tripwire Logic:
If tripwire_triggered is True, agent execution is halted and an exception is raised.

Sync/Async Support:
Both sync and async guardrail functions are supported. The run method handles both transparently.

Decorator Flexibility:
Decorators can be used with or without parentheses and with custom names.

Guardrail Naming:
If no name is provided, the function's name is used for tracing and diagnostics.

Guardrail Function Signature:

Input guardrail: (context, agent, input)
Output guardrail: (context, agent, output)
Related Files
agent.py
: Agent classes that use guardrails for input/output validation.
exceptions.py
: Exception types raised when guardrails are tripped.
run_context.py
: Run context wrapper for agent execution.
items.py
: Input/output item types for agent runs.
For further details, see the source code and related modules.


#####

handoffs.py — Agent Handoff Abstractions for OpenAI Agents
File Overview
This file defines the core abstractions and utilities for "handoffs"—the process by which one agent delegates a task to another agent in an OpenAI-style agent system. It introduces the Handoff dataclass, input filtering, and the handoff factory function, which together enable modular, hierarchical, or multi-agent workflows. The design ensures strict input validation, supports custom input filtering, and allows dynamic enable/disable logic for handoffs.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
HandoffInputData	Captures the input history and items relevant to a handoff event.
HandoffInputFilter	Type alias for a function that filters handoff input data.
Handoff	Encapsulates all metadata and logic for delegating to another agent.
handoff	Factory function for creating a Handoff object with validation and customization.
Annotated Code Snippets
1. Handoff Input Data
@dataclass(frozen=True)
class HandoffInputData:
    input_history: str | tuple[TResponseInputItem, ...]
    pre_handoff_items: tuple[RunItem, ...]
    new_items: tuple[RunItem, ...]
Explanation:
Captures the input history and items generated before and during the handoff event, enabling custom filtering or transformation of what is passed to the next agent.

2. Handoff Abstraction
@dataclass
class Handoff(Generic[TContext, TAgent]):
    tool_name: str
    tool_description: str
    input_json_schema: dict[str, Any]
    on_invoke_handoff: Callable[[RunContextWrapper[Any], str], Awaitable[TAgent]]
    agent_name: str
    input_filter: HandoffInputFilter | None = None
    strict_json_schema: bool = True
    is_enabled: bool | Callable[[RunContextWrapper[Any], AgentBase[Any]], MaybeAwaitable[bool]] = True

    def get_transfer_message(self, agent: AgentBase[Any]) -> str: ...
    @classmethod
    def default_tool_name(cls, agent: AgentBase[Any]) -> str: ...
    @classmethod
    def default_tool_description(cls, agent: AgentBase[Any]) -> str: ...
Explanation:
Encapsulates all logic and metadata needed to represent a handoff as a tool, including input schema, invocation logic, and enable/disable state.

3. Handoff Factory Function
def handoff(
    agent: Agent[TContext],
    tool_name_override: str | None = None,
    tool_description_override: str | None = None,
    on_handoff: OnHandoffWithInput[THandoffInput] | OnHandoffWithoutInput | None = None,
    input_type: type[THandoffInput] | None = None,
    input_filter: Callable[[HandoffInputData], HandoffInputData] | None = None,
    is_enabled: bool | Callable[[RunContextWrapper[Any], Agent[TContext]], MaybeAwaitable[bool]] = True,
) -> Handoff[TContext, Agent[TContext]]:
    ...
Explanation:

Validates and constructs a Handoff object.
Supports both input-taking and input-less handoff functions.
Ensures input is validated against a strict JSON schema.
Allows for custom tool names, descriptions, input filtering, and dynamic enable/disable logic.
Function/Class Reference
HandoffInputData
@dataclass(frozen=True)
class HandoffInputData:
    input_history: str | tuple[TResponseInputItem, ...]
    pre_handoff_items: tuple[RunItem, ...]
    new_items: tuple[RunItem, ...]
Purpose: Holds all relevant input and item history for a handoff event.
Handoff
@dataclass
class Handoff(Generic[TContext, TAgent]):
    tool_name: str
    tool_description: str
    input_json_schema: dict[str, Any]
    on_invoke_handoff: Callable[[RunContextWrapper[Any], str], Awaitable[TAgent]]
    agent_name: str
    input_filter: HandoffInputFilter | None = None
    strict_json_schema: bool = True
    is_enabled: bool | Callable[[RunContextWrapper[Any], AgentBase[Any]], MaybeAwaitable[bool]] = True

    def get_transfer_message(self, agent: AgentBase[Any]) -> str
    @classmethod
    def default_tool_name(cls, agent: AgentBase[Any]) -> str
    @classmethod
    def default_tool_description(cls, agent: AgentBase[Any]) -> str
Purpose: Represents a handoff tool, including invocation logic and metadata.
handoff Factory Function
def handoff(
    agent: Agent[TContext],
    tool_name_override: str | None = None,
    tool_description_override: str | None = None,
    on_handoff: OnHandoffWithInput[THandoffInput] | OnHandoffWithoutInput | None = None,
    input_type: type[THandoffInput] | None = None,
    input_filter: Callable[[HandoffInputData], HandoffInputData] | None = None,
    is_enabled: bool | Callable[[RunContextWrapper[Any], Agent[TContext]], MaybeAwaitable[bool]] = True,
) -> Handoff[TContext, Agent[TContext]]
Purpose: Creates a Handoff object, ensuring input validation, schema generation, and correct invocation logic.
Parameters:
agent: The agent to hand off to.
tool_name_override: Custom tool name (optional).
tool_description_override: Custom tool description (optional).
on_handoff: Function to invoke when handoff occurs (with or without input).
input_type: Type to validate input against (if applicable).
input_filter: Function to filter/transform handoff input data.
is_enabled: Bool or callable to enable/disable the handoff dynamically.
Example Usage
1. Simple Agent Handoff
# Assume BillingAgent is an Agent instance
billing_handoff = handoff(
    agent=BillingAgent,
    tool_name_override="transfer_to_billing",
    tool_description_override="Transfer to billing support agent."
)
2. Handoff with Input Validation
from pydantic import BaseModel

class BillingInput(BaseModel):
    account_id: str

async def on_billing_handoff(context, input: BillingInput):
    # Custom logic before handing off
    ...

billing_handoff = handoff(
    agent=BillingAgent,
    on_handoff=on_billing_handoff,
    input_type=BillingInput,
    tool_name_override="transfer_to_billing"
)
3. Handoff with Input Filtering
def filter_old_items(data: HandoffInputData) -> HandoffInputData:
    # Remove old items from input history
    return HandoffInputData(
        input_history=data.input_history[-5:],  # last 5 items
        pre_handoff_items=data.pre_handoff_items,
        new_items=data.new_items
    )

handoff_with_filter = handoff(
    agent=BillingAgent,
    input_filter=filter_old_items
)
Tips, Gotchas, and FAQ
Strict Input Validation:
All handoff inputs are validated against a strict JSON schema for safety and compatibility.

Custom Enable Logic:
Use the is_enabled parameter to dynamically enable or disable handoffs based on runtime context.

Input Filtering:
The input_filter allows you to customize what conversation history or items are passed to the next agent.

Error Handling:
Misconfigured handoff functions (wrong argument count, etc.) will raise clear errors.

Streaming Mode:
Input filtering does not affect already-streamed items in streaming mode.

Related Files
agent.py
: Agent classes that can be targets for handoffs.
items.py
: Run item and input item types.
run_context.py
: Run context wrapper for agent execution.
strict_schema.py
: Utilities for enforcing strict JSON schema.
exceptions.py
: Custom error types for handoff and validation errors.
For further details, see the source code and related modules.


#####

Should This Code Be Included in an Agent for OpenAI Agent Creation?
Yes, this code is very important to include in the file base of an agent that helps with the creation of OpenAI Agents.

Why?
It defines the core data structures (RunItemBase and its subclasses) that represent all the input and output items generated during agent execution, including messages, tool calls, handoffs, reasoning steps, and MCP interactions.
The ModelResponse class and ItemHelpers utility class provide essential methods for converting, extracting, and manipulating these items, which is crucial for agent orchestration, logging, and downstream processing.
The design is tightly integrated with the OpenAI Responses API and supports advanced agent features such as tool-calling, handoffs, and multi-agent workflows.
In summary:
This file is foundational for any agent system that needs to track, process, or manipulate the detailed input/output items generated by OpenAI-style agents.

I will now generate comprehensive markdown documentation for this file, following the guidelines provided.

items.py — Agent Run Item and Model Response Structures for OpenAI Agents
File Overview
This file defines the core data structures and utility methods for representing, processing, and extracting information from the input and output items generated during agent execution in OpenAI-style agent systems. It includes a hierarchy of RunItemBase subclasses for different item types (messages, tool calls, handoffs, reasoning, MCP interactions), the ModelResponse class for model outputs, and the ItemHelpers utility class for common item manipulations. The design is tightly integrated with the OpenAI Responses API and supports advanced agent features such as tool-calling, handoffs, and multi-agent workflows.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RunItemBase	Abstract base for all run items (input/output, tool calls, etc.).
MessageOutputItem	Represents a message from the LLM.
HandoffCallItem	Represents a tool call for a handoff between agents.
HandoffOutputItem	Represents the output of a handoff.
ToolCallItem	Represents a tool call (function, computer, file search, etc.).
ToolCallOutputItem	Represents the output of a tool call.
ReasoningItem	Represents a reasoning step/item.
MCPListToolsItem	Represents a call to an MCP server to list tools.
MCPApprovalRequestItem	Represents a request for MCP approval.
MCPApprovalResponseItem	Represents a response to an MCP approval request.
RunItem	Type alias for any of the above run item types.
ModelResponse	Represents a model's output, including usage and response ID.
ItemHelpers	Utility class for extracting and manipulating run items and model responses.
Annotated Code Snippets
1. Run Item Base and Subclasses
@dataclass
class RunItemBase(Generic[T], abc.ABC):
    agent: Agent[Any]
    raw_item: T

    def to_input_item(self) -> TResponseInputItem:
        ...
Explanation:
Abstract base for all run items, holding a reference to the agent and the raw item (input or output). The to_input_item method converts the item to a format suitable for model input.

2. ModelResponse Structure
@pydantic.dataclasses.dataclass
class ModelResponse:
    output: list[TResponseOutputItem]
    usage: Usage
    response_id: str | None

    def to_input_items(self) -> list[TResponseInputItem]:
        ...
Explanation:
Represents a model's output, including all output items, usage statistics, and an optional response ID. The to_input_items method converts outputs to input items for further processing.

3. ItemHelpers Utility Methods
class ItemHelpers:
    @classmethod
    def extract_last_content(cls, message: TResponseOutputItem) -> str: ...
    @classmethod
    def extract_last_text(cls, message: TResponseOutputItem) -> str | None: ...
    @classmethod
    def input_to_new_input_list(cls, input: str | list[TResponseInputItem]) -> list[TResponseInputItem]: ...
    @classmethod
    def text_message_outputs(cls, items: list[RunItem]) -> str: ...
    @classmethod
    def text_message_output(cls, message: MessageOutputItem) -> str: ...
    @classmethod
    def tool_call_output_item(cls, tool_call: ResponseFunctionToolCall, output: str) -> FunctionCallOutput: ...
Explanation:
Provides static methods for extracting text, converting input formats, and constructing tool call outputs from run items and model responses.

Function/Class Reference
RunItemBase and Subclasses
Class Name	Purpose/Description
RunItemBase	Abstract base for all run items.
MessageOutputItem	Represents a message from the LLM.
HandoffCallItem	Represents a handoff tool call.
HandoffOutputItem	Represents the output of a handoff, with source and target agents.
ToolCallItem	Represents a tool call (function, computer, etc.).
ToolCallOutputItem	Represents the output of a tool call.
ReasoningItem	Represents a reasoning step/item.
MCPListToolsItem	Represents a call to an MCP server to list tools.
MCPApprovalRequestItem	Represents a request for MCP approval.
MCPApprovalResponseItem	Represents a response to an MCP approval request.
ModelResponse
@pydantic.dataclasses.dataclass
class ModelResponse:
    output: list[TResponseOutputItem]
    usage: Usage
    response_id: str | None

    def to_input_items(self) -> list[TResponseInputItem]
Purpose: Holds all outputs, usage, and response ID from a model call.
Method: to_input_items converts outputs to input items for further processing.
ItemHelpers
Method Name	Purpose/Description
extract_last_content	Extracts the last text or refusal from a message output item.
extract_last_text	Extracts the last text content (ignores refusals).
input_to_new_input_list	Converts a string or list of input items to a new list of input items.
text_message_outputs	Concatenates all text content from a list of message output items.
text_message_output	Extracts all text content from a single message output item.
tool_call_output_item	Creates a tool call output item from a tool call and its output.
Example Usage
1. Extracting Text from Model Outputs
# Assume model_response is a ModelResponse instance
text_outputs = ItemHelpers.text_message_outputs(model_response.output)
2. Converting Output Items to Input Items
input_items = model_response.to_input_items()
3. Creating a Tool Call Output Item
tool_call_output = ItemHelpers.tool_call_output_item(tool_call, "result string")
4. Handling Handoff Output Items
handoff_item = HandoffOutputItem(
    agent=source_agent,
    raw_item=input_item,
    source_agent=source_agent,
    target_agent=target_agent
)
Tips, Gotchas, and FAQ
Type Safety:
All run items are strongly typed and correspond to OpenAI Responses API types for robust integration.

Deep Copy for Inputs:
input_to_new_input_list uses copy.deepcopy to avoid mutating original input data.

Text Extraction:
Use extract_last_content or extract_last_text to handle messages with refusals or multiple content types.

Custom Run Items:
Extend RunItemBase if you need to track additional item types in your agent system.

Related Files
agent.py
: Agent classes that generate and consume run items.
usage.py
: Usage tracking for model responses.
exceptions.py
: Exception types for error handling.
run_context.py
: Run context wrapper for agent execution.
For further details, see the source code and related modules.


#####

Should This Code Be Included in an Agent for OpenAI Agent Creation?
Yes, this code is important to include in the file base of an agent that helps with the creation of OpenAI Agents.

Why?
It defines the RunHooksBase and AgentHooksBase classes, which provide a structured way to receive callbacks on key lifecycle events during agent execution (start, end, handoff, tool start/end).
These hooks are essential for observability, logging, debugging, custom analytics, or integrating side effects into agent workflows.
The design is generic and flexible, allowing you to override only the methods you need for your use case.
The AgentHooks and RunHooks type aliases make it easy to use these hooks with standard agent types.
In summary:
This file is foundational for any agent system that needs to support custom event handling, monitoring, or extensibility during agent runs.

I will now generate comprehensive markdown documentation for this file, following the guidelines provided.

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


#####

logger.py — Logging Utility for OpenAI Agent Framework
File Overview
This file sets up a module-level logger named "openai.agents". It provides a consistent logging interface for all components of the agent framework, supporting structured logging, debugging, and diagnostics across the codebase.

Annotated Code Snippet
import logging

logger = logging.getLogger("openai.agents")
Explanation:

Imports Python's standard logging module.
Creates a logger instance with the name "openai.agents".
Use this logger throughout the agent framework for all logging needs.
Example Usage
from .logger import logger

logger.info("Agent started successfully.")
logger.error("Failed to process tool call.", exc_info=True)
Tips, Gotchas, and FAQ
Consistent Logging:
Always use this logger (logger) for logging in your agent framework to ensure consistent output and easy configuration.

Configuration:
Logging configuration (handlers, formatters, levels) 
#####

Should be set up in your application entry point or main script.

Log Levels:
Use appropriate log levels (debug, info, warning, error, critical) for different types of messages.

Related Files
All agent framework files 
#####

Should import and use this logger for their logging needs.
For further details, see the Python 
logging
 documentation.


#####

model_settings.py — Model Configuration for OpenAI Agents
File Overview
This file defines the ModelSettings dataclass, which encapsulates all tunable parameters and advanced configuration options for LLM/model calls in OpenAI-style agent systems. It also includes type aliases and helpers for OpenAI-specific features (headers, tool choices, omit fields). The design supports flexible merging/overriding of settings and serialization for API calls, making it essential for dynamic, configurable agent orchestration.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
ModelSettings	Holds all model/LLM configuration parameters and advanced options.
MCPToolChoice	Represents a tool choice for MCP servers.
Omit	Type annotation for omitting fields in OpenAI API calls.
Headers	Type alias for HTTP headers, supporting omitted fields.
ToolChoice	Type alias for tool choice options in model calls.
Annotated Code Snippets
1. ModelSettings Dataclass
@dataclass
class ModelSettings:
    temperature: float | None = None
    top_p: float | None = None
    frequency_penalty: float | None = None
    presence_penalty: float | None = None
    tool_choice: ToolChoice | None = None
    parallel_tool_calls: bool | None = None
    truncation: Literal["auto", "disabled"] | None = None
    max_tokens: int | None = None
    reasoning: Reasoning | None = None
    metadata: dict[str, str] | None = None
    store: bool | None = None
    include_usage: bool | None = None
    response_include: list[ResponseIncludable] | None = None
    extra_query: Query | None = None
    extra_body: Body | None = None
    extra_headers: Headers | None = None
    extra_args: dict[str, Any] | None = None

    def resolve(self, override: ModelSettings | None) -> ModelSettings: ...
    def to_json_dict(self) -> dict[str, Any]: ...
Explanation:
Encapsulates all configuration options for a model call, including standard LLM parameters and OpenAI-specific features. The resolve method overlays non-None values from an override, and to_json_dict serializes the settings for API calls.

2. MCPToolChoice and Type Aliases
@dataclass
class MCPToolChoice:
    server_label: str
    name: str

Omit = Annotated[_Omit, _OmitTypeAnnotation]
Headers: TypeAlias = Mapping[str, Union[str, Omit]]
ToolChoice: TypeAlias = Union[Literal["auto", "required", "none"], str, MCPToolChoice, None]
Explanation:

MCPToolChoice is used for specifying tool choices in MCP-enabled agent systems.
Omit, Headers, and ToolChoice provide type-safe ways to handle OpenAI API features.
Function/Class Reference
ModelSettings
@dataclass
class ModelSettings:
    # See above for fields

    def resolve(self, override: ModelSettings | None) -> ModelSettings
    def to_json_dict(self) -> dict[str, Any]
Purpose: Holds all model/LLM configuration parameters.
Fields: See above for all supported options.
Methods:
resolve(override): Returns a new ModelSettings with non-None values from override applied.
to_json_dict(): Serializes the settings to a JSON-compatible dictionary.
MCPToolChoice
@dataclass
class MCPToolChoice:
    server_label: str
    name: str
Purpose: Represents a tool choice for MCP servers.
Type Aliases
Name	Purpose/Description
Omit	Used to indicate omitted fields in OpenAI API calls.
Headers	Mapping of HTTP headers, supporting omitted fields.
ToolChoice	Tool choice options for model calls (auto, required, none, custom, MCP).
Example Usage
1. Creating and Merging Model Settings
base_settings = ModelSettings(temperature=0.7, max_tokens=512)
override = ModelSettings(top_p=0.9, max_tokens=1024)
merged = base_settings.resolve(override)
# merged.temperature == 0.7, merged.top_p == 0.9, merged.max_tokens == 1024
2. Serializing to JSON
json_dict = merged.to_json_dict()
# Can be used for logging or sending to an API
3. Using ToolChoice and Headers
settings = ModelSettings(
    tool_choice="auto",
    extra_headers={"Authorization": "Bearer ..."}
)
Tips, Gotchas, and FAQ
Override Logic:
The resolve method overlays only non-None values from the override, except for extra_args, which are merged.

Serialization:
The to_json_dict method handles nested Pydantic models automatically.

OpenAI API Compatibility:
All fields are designed to match OpenAI API parameters, but not all models/providers support every option. Check provider docs.

Omit Fields:
Use Omit to explicitly omit fields in API calls where supported.

Related Files
agent.py
: Agents use ModelSettings for model configuration.
tool.py
: Tools may reference tool choices.
usage.py
: Usage tracking for model responses.
For further details, see the source code and related modules.


#####

prompts.py — Prompt Configuration and Utilities for OpenAI Agents
File Overview
This file defines the structures and utilities for configuring prompts when interacting with OpenAI models in agent systems. It supports both static prompt objects and dynamic prompt functions, enabling runtime customization of prompts based on context or agent state. The design is compatible with OpenAI's Responses API and supports prompt versioning and variable substitution.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
Prompt	TypedDict representing a prompt configuration for OpenAI models.
GenerateDynamicPromptData	Holds context and agent for dynamic prompt generation.
DynamicPromptFunction	Callable type for functions that generate prompts dynamically.
PromptUtil	Utility class for resolving prompts to model input format.
Annotated Code Snippets
1. Prompt TypedDict
class Prompt(TypedDict):
    id: str
    version: NotRequired[str]
    variables: NotRequired[dict[str, ResponsesPromptVariables]]
Explanation:
Defines the structure for a prompt, including a required id, optional version, and optional variables for substitution.

2. Dynamic Prompt Generation
@dataclass
class GenerateDynamicPromptData:
    context: RunContextWrapper[Any]
    agent: Agent[Any]

DynamicPromptFunction = Callable[[GenerateDynamicPromptData], MaybeAwaitable[Prompt]]
Explanation:

GenerateDynamicPromptData provides the context and agent to dynamic prompt functions.
DynamicPromptFunction is a callable that returns a prompt, either synchronously or asynchronously.
3. Prompt Utility for Model Input
class PromptUtil:
    @staticmethod
    async def to_model_input(
        prompt: Prompt | DynamicPromptFunction | None,
        context: RunContextWrapper[Any],
        agent: Agent[Any],
    ) -> ResponsePromptParam | None:
        ...
Explanation:

Resolves a prompt (static or dynamic) to the format required by the OpenAI Responses API.
Handles both synchronous and asynchronous dynamic prompt functions.
Ensures the returned prompt is valid and raises a UserError if not.
Function/Class Reference
Prompt
class Prompt(TypedDict):
    id: str
    version: NotRequired[str]
    variables: NotRequired[dict[str, ResponsesPromptVariables]]
Purpose: Represents a prompt configuration for OpenAI models.
Fields:
id: Unique identifier for the prompt.
version: Optional version string.
variables: Optional dictionary of variables for substitution.
GenerateDynamicPromptData
@dataclass
class GenerateDynamicPromptData:
    context: RunContextWrapper[Any]
    agent: Agent[Any]
Purpose: Holds context and agent for dynamic prompt generation.
DynamicPromptFunction
DynamicPromptFunction = Callable[[GenerateDynamicPromptData], MaybeAwaitable[Prompt]]
Purpose: Type for functions that generate prompts dynamically.
PromptUtil
class PromptUtil:
    @staticmethod
    async def to_model_input(
        prompt: Prompt | DynamicPromptFunction | None,
        context: RunContextWrapper[Any],
        agent: Agent[Any],
    ) -> ResponsePromptParam | None
Purpose: Resolves a prompt (static or dynamic) to the format required by the OpenAI Responses API.
Behavior: Handles both static dicts and dynamic functions (sync or async). Raises UserError for invalid results.
Example Usage
1. Static Prompt
prompt = {
    "id": "support_prompt",
    "version": "1.0",
    "variables": {"customer_name": "Alice"}
}

model_input = await PromptUtil.to_model_input(prompt, context, agent)
2. Dynamic Prompt Function
async def dynamic_prompt(data: GenerateDynamicPromptData) -> Prompt:
    return {
        "id": "dynamic_prompt",
        "variables": {"user_id": data.context.context.get("user_id")}
    }

model_input = await PromptUtil.to_model_input(dynamic_prompt, context, agent)
Tips, Gotchas, and FAQ
Dynamic Prompt Functions:
Can be synchronous or asynchronous. Always return a Prompt dict.

Error Handling:
If a dynamic prompt function returns a non-dict, a UserError is raised.

Prompt Variables:
Use the variables field to substitute values into your prompt template.

Versioning:
The version field is optional but recommended for tracking prompt changes.

Related Files
agent.py
: Agents use prompts for system instructions and configuration.
run_context.py
: Provides the context used in dynamic prompt generation.
For further details, see the source code and related modules.


#####

Should This Code Be Included in an Agent for OpenAI Agent Creation?
Yes, this code is useful to include in the file base of an agent that helps with the creation of OpenAI Agents.

Why?
It provides a simple REPL (read-eval-print loop) utility for interactively testing and debugging agents from the command line.
The loop preserves conversation state, supports both streamed and non-streamed agent output, and handles tool calls and agent updates in the output.
This is a valuable developer tool for manual QA, demos, and rapid iteration when building or refining agents.
In summary:
This file is a practical utility for hands-on agent testing and debugging, which is helpful for any agent development workflow.

I will now generate comprehensive markdown documentation for this file, following the guidelines provided.

demo_loop.py — Interactive REPL for OpenAI Agent Testing
File Overview
This file provides a simple, interactive REPL (read-eval-print loop) utility for manually testing and debugging OpenAI-style agents from the command line. It preserves conversation state across turns, supports both streamed and non-streamed agent output, and displays tool calls and agent updates in real time. This is a valuable tool for rapid development, manual QA, and demonstrations.

Table of Contents
Key Function
Annotated Code Snippets
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Function
Name	Purpose
run_demo_loop	Runs an interactive REPL loop for agent testing, supporting both streaming and non-streaming output.
Annotated Code Snippets
1. REPL Loop for Agent Testing
async def run_demo_loop(agent: Agent[Any], *, stream: bool = True) -> None:
    """Run a simple REPL loop with the given agent.

    This utility allows quick manual testing and debugging of an agent from the
    command line. Conversation state is preserved across turns. Enter ``exit``
    or ``quit`` to stop the loop.

    Args:
        agent: The starting agent to run.
        stream: Whether to stream the agent output.
    """
    current_agent = agent
    input_items: list[TResponseInputItem] = []
    while True:
        try:
            user_input = input(" > ")
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if user_input.strip().lower() in {"exit", "quit"}:
            break
        if not user_input:
            continue

        input_items.append({"role": "user", "content": user_input})

        result: RunResultBase
        if stream:
            result = Runner.run_streamed(current_agent, input=input_items)
            async for event in result.stream_events():
                if isinstance(event, RawResponsesStreamEvent):
                    if isinstance(event.data, ResponseTextDeltaEvent):
                        print(event.data.delta, end="", flush=True)
                elif isinstance(event, RunItemStreamEvent):
                    if event.item.type == "tool_call_item":
                        print("\n[tool called]", flush=True)
                    elif event.item.type == "tool_call_output_item":
                        print(f"\n[tool output: {event.item.output}]", flush=True)
                elif isinstance(event, AgentUpdatedStreamEvent):
                    print(f"\n[Agent updated: {event.new_agent.name}]", flush=True)
            print()
        else:
            result = await Runner.run(current_agent, input_items)
            if result.final_output is not None:
                print(result.final_output)

        current_agent = result.last_agent
        input_items = result.to_input_list()
Explanation:

Prompts the user for input, appends it to the conversation, and runs the agent.
In streaming mode, prints output as it is generated, including tool calls and agent updates.
In non-streaming mode, prints the final output after the agent completes.
Conversation state is preserved, allowing for multi-turn interactions.
Example Usage
1. Running the Demo Loop
import asyncio
from my_agent_module import MyAgent  # Your agent definition
from demo_loop import run_demo_loop

agent = MyAgent(...)
asyncio.run(run_demo_loop(agent, stream=True))
Type your input at the prompt (>).
Enter exit or quit to end the session.
Tips, Gotchas, and FAQ
Streaming vs. Non-Streaming:
Set stream=True to see output as it is generated (recommended for LLMs that support streaming). Use stream=False for a simple turn-based experience.

Conversation State:
The REPL preserves the full conversation history, enabling multi-turn interactions and context-aware agent behavior.

Interrupting the Loop:
Use Ctrl+C or type exit/quit to exit the loop gracefully.

Tool Calls and Agent Updates:
Tool calls and agent updates are displayed in the output for transparency and debugging.

Related Files
agent.py
: Agent definitions used in the demo loop.
run.py
: Runner logic for executing agents.
items.py
: Input/output item types for agent runs.
stream_events.py
: Stream event types for agent output.
For further details, see the source code and related modules.


#####

result.py — Agent Run Result Structures and Streaming for OpenAI Agents
File Overview
This file defines the core result structures for agent runs in OpenAI-style agent systems. It includes both batch (RunResult) and streaming (RunResultStreaming) result classes, encapsulating all outputs, run items, responses, and guardrail results. The streaming result class supports asynchronous event streaming, robust error handling, and cancellation, making it essential for real-time, interactive, or long-running agent workflows.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RunResultBase	Abstract base class for agent run results (batch or streaming).
RunResult	Concrete class for batch agent run results.
RunResultStreaming	Concrete class for streaming agent run results, supporting async event streaming.
Annotated Code Snippets
1. RunResultBase: Abstract Result Structure
@dataclass
class RunResultBase(abc.ABC):
    input: str | list[TResponseInputItem]
    new_items: list[RunItem]
    raw_responses: list[ModelResponse]
    final_output: Any
    input_guardrail_results: list[InputGuardrailResult]
    output_guardrail_results: list[OutputGuardrailResult]
    context_wrapper: RunContextWrapper[Any]

    @property
    @abc.abstractmethod
    def last_agent(self) -> Agent[Any]: ...

    def final_output_as(self, cls: type[T], raise_if_incorrect_type: bool = False) -> T: ...
    def to_input_list(self) -> list[TResponseInputItem]: ...
    @property
    def last_response_id(self) -> str | None: ...
Explanation:
Encapsulates all relevant data from an agent run, including input, outputs, responses, guardrail results, and context. Provides convenience methods for type-casting outputs and merging input lists.

2. RunResult: Batch Result
@dataclass
class RunResult(RunResultBase):
    _last_agent: Agent[Any]

    @property
    def last_agent(self) -> Agent[Any]:
        return self._last_agent

    def __str__(self) -> str:
        return pretty_print_result(self)
Explanation:
Concrete implementation for batch (non-streaming) agent runs. Provides a pretty-print string representation.

3. RunResultStreaming: Streaming Result
@dataclass
class RunResultStreaming(RunResultBase):
    current_agent: Agent[Any]
    current_turn: int
    max_turns: int
    final_output: Any
    _current_agent_output_schema: AgentOutputSchemaBase | None = field(repr=False)
    trace: Trace | None = field(repr=False)
    is_complete: bool = False
    _event_queue: asyncio.Queue[StreamEvent | QueueCompleteSentinel] = field(default_factory=asyncio.Queue, repr=False)
    _input_guardrail_queue: asyncio.Queue[InputGuardrailResult] = field(default_factory=asyncio.Queue, repr=False)
    _run_impl_task: asyncio.Task[Any] | None = field(default=None, repr=False)
    _input_guardrails_task: asyncio.Task[Any] | None = field(default=None, repr=False)
    _output_guardrails_task: asyncio.Task[Any] | None = field(default=None, repr=False)
    _stored_exception: Exception | None = field(default=None, repr=False)

    @property
    def last_agent(self) -> Agent[Any]: ...
    def cancel(self) -> None: ...
    async def stream_events(self) -> AsyncIterator[StreamEvent]: ...
    def __str__(self) -> str: ...
Explanation:

Supports streaming of agent events via stream_events, with robust error handling and cancellation.
Tracks current agent, turn, and completion state.
Integrates with guardrails and pretty-printing utilities.
Function/Class Reference
RunResultBase
Purpose: Abstract base for all agent run results.
Fields: See above.
Key Methods:
final_output_as(cls, raise_if_incorrect_type=False): Casts final output to a given type, optionally raising if type is incorrect.
to_input_list(): Merges original input and new items into a new input list.
last_response_id: Returns the response ID of the last model response.
RunResult
Purpose: Concrete result for batch agent runs.
Key Methods:
last_agent: Returns the last agent run.
__str__: Pretty-prints the result.
RunResultStreaming
Purpose: Concrete result for streaming agent runs.
Fields: Tracks current agent, turn, completion, event queues, and tasks.
Key Methods:
stream_events(): Async generator yielding stream events as they are produced.
cancel(): Cancels the streaming run and all background tasks.
__str__: Pretty-prints the streaming result.
Example Usage
1. Batch Agent Run
result = await Runner.run(agent, input_items)
print(result.final_output)
print(result.last_agent.name)
2. Streaming Agent Run
result = Runner.run_streamed(agent, input=input_items)
async for event in result.stream_events():
    # Handle each StreamEvent (text delta, tool call, etc.)
    ...
print(result.final_output)
3. Type-Safe Output Casting
output = result.final_output_as(MyOutputType, raise_if_incorrect_type=True)
Tips, Gotchas, and FAQ
Streaming Error Handling:
Exceptions (e.g., max turns exceeded, guardrail tripped) are raised during streaming and stored for later inspection.

Cancellation:
Use cancel() to stop a streaming run and clean up background tasks.

Pretty Printing:
Both result classes support pretty-printing for easy debugging and diagnostics.

Guardrail Integration:
Guardrail results are tracked and included in the result object for post-run inspection.

Related Files
agent.py
: Agent definitions used in runs.
items.py
: Run item and model response structures.
guardrail.py
: Guardrail result types.
stream_events.py
: Stream event types for streaming output.
exceptions.py
: Exception types for error handling.
For further details, see the source code and related modules.


#####

run.py — Agent Orchestration and Execution Engine for OpenAI Agents
File Overview
This file defines the core orchestration logic for running OpenAI-style agents, including batch, synchronous, and streaming workflows. The Runner and AgentRunner classes manage the entire agent run loop: invoking agents, handling tool use, managing handoffs, enforcing guardrails, integrating session memory, and supporting tracing and hooks. This is the primary entry point for agent execution in both development and production environments.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RunConfig	Encapsulates global settings for an agent run (model, guardrails, tracing, etc.).
RunOptions	TypedDict for passing arguments to runner methods.
Runner	High-level static interface for running agents (async, sync, streaming).
AgentRunner	Core class implementing the agent run loop and orchestration logic.
Annotated Code Snippets
1. RunConfig: Global Run Settings
@dataclass
class RunConfig:
    model: str | Model | None = None
    model_provider: ModelProvider = field(default_factory=MultiProvider)
    model_settings: ModelSettings | None = None
    handoff_input_filter: HandoffInputFilter | None = None
    input_guardrails: list[InputGuardrail[Any]] | None = None
    output_guardrails: list[OutputGuardrail[Any]] | None = None
    tracing_disabled: bool = False
    trace_include_sensitive_data: bool = True
    workflow_name: str = "Agent workflow"
    trace_id: str | None = None
    group_id: str | None = None
    trace_metadata: dict[str, Any] | None = None
Explanation:
Holds all global configuration for a run, including model selection, guardrails, tracing, and workflow metadata.

2. Runner: High-Level Agent Execution
class Runner:
    @classmethod
    async def run(cls, starting_agent, input, *, context=None, max_turns=10, hooks=None, run_config=None, previous_response_id=None, session=None) -> RunResult: ...
    @classmethod
    def run_sync(cls, starting_agent, input, *, context=None, max_turns=10, hooks=None, run_config=None, previous_response_id=None, session=None) -> RunResult: ...
    @classmethod
    def run_streamed(cls, starting_agent, input, context=None, max_turns=10, hooks=None, run_config=None, previous_response_id=None, session=None) -> RunResultStreaming: ...
Explanation:

Provides static methods for running agents in async, sync, or streaming mode.
Delegates to the underlying AgentRunner instance.
3. AgentRunner: Core Orchestration Logic
class AgentRunner:
    async def run(self, starting_agent, input, **kwargs) -> RunResult: ...
    def run_sync(self, starting_agent, input, **kwargs) -> RunResult: ...
    def run_streamed(self, starting_agent, input, **kwargs) -> RunResultStreaming: ...
    # ... many internal methods for guardrails, handoffs, tools, etc.
Explanation:

Implements the main agent run loop, including agent invocation, tool use, handoffs, guardrail checks, and session memory.
Supports both batch and streaming execution, with robust error handling and tracing.
Function/Class Reference
RunConfig
Purpose: Holds all global settings for an agent run.
Fields: Model selection, providers, guardrails, tracing, workflow metadata, etc.
RunOptions
Purpose: TypedDict for passing optional arguments to runner methods.
Fields: Context, max_turns, hooks, run_config, previous_response_id, session.
Runner
Purpose: High-level interface for running agents.
Methods:
run: Async agent run (batch mode).
run_sync: Synchronous agent run (batch mode).
run_streamed: Streaming agent run (returns a RunResultStreaming for event streaming).
AgentRunner
Purpose: Implements the agent run loop and orchestration logic.
Key Methods:
run: Main async run loop.
run_sync: Synchronous wrapper for run.
run_streamed: Streaming run with async event streaming.
Internal methods for running guardrails, handling handoffs, managing tools, session memory, etc.
Example Usage
1. Running an Agent (Async)
result = await Runner.run(my_agent, input="Hello, agent!")
print(result.final_output)
2. Running an Agent (Sync)
result = Runner.run_sync(my_agent, input="Hello, agent!")
print(result.final_output)
3. Streaming Agent Output
streamed_result = Runner.run_streamed(my_agent, input="Hello, agent!")
async for event in streamed_result.stream_events():
    print(event)
print(streamed_result.final_output)
4. Custom Run Configuration
run_config = RunConfig(model="gpt-4o", max_turns=5, tracing_disabled=True)
result = await Runner.run(my_agent, input="Hi", run_config=run_config)
Tips, Gotchas, and FAQ
Max Turns:
The run loop enforces a maximum number of turns to prevent infinite loops.

Guardrails:
Input and output guardrails are enforced at appropriate points; tripwires raise exceptions.

Session Memory:
Supports session memory for conversation history; do not provide both a session and a list input.

Tracing:
Tracing is integrated for observability and debugging; can be disabled via config.

Streaming:
Use run_streamed for real-time output and event handling.

Hooks:
Lifecycle hooks are supported for custom logging, analytics, or side effects.

Related Files
agent.py
: Agent definitions used in runs.
result.py
: Result structures for batch and streaming runs.
guardrail.py
: Guardrail logic and result types.
items.py
: Run item and model response structures.
memory.py
: Session memory for conversation history.
lifecycle.py
: Lifecycle hooks for agent runs.
For further details, see the source code and related modules.


#####

run_context.py — Run Context Wrapper for OpenAI Agents
File Overview
This file defines the RunContextWrapper class, which encapsulates the context object and usage statistics for an agent run in OpenAI-style agent systems. The context object allows you to pass arbitrary state, dependencies, or configuration to tools, callbacks, and hooks, while the usage field tracks resource consumption throughout the run. This wrapper provides a consistent interface for accessing both context and usage data during agent execution.

Table of Contents
Key Class
Annotated Code Snippet
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Class
Name	Purpose
RunContextWrapper	Wraps the user-defined context and tracks agent run usage for each agent execution.
Annotated Code Snippet
from dataclasses import dataclass, field
from typing import Any, Generic
from typing_extensions import TypeVar

from .usage import Usage

TContext = TypeVar("TContext", default=Any)

@dataclass
class RunContextWrapper(Generic[TContext]):
    """This wraps the context object that you passed to `Runner.run()`. It also contains
    information about the usage of the agent run so far.

    NOTE: Contexts are not passed to the LLM. They're a way to pass dependencies and data to code
    you implement, like tool functions, callbacks, hooks, etc.
    """

    context: TContext
    """The context object (or None), passed by you to `Runner.run()`"""

    usage: Usage = field(default_factory=Usage)
    """The usage of the agent run so far. For streamed responses, the usage will be stale until the
    last chunk of the stream is processed.
    """
Explanation:

context: Holds the user-defined context object, which can be any type (e.g., dict, custom class, etc.).
usage: Tracks usage statistics (e.g., token counts, API calls) for the agent run.
Function/Class Reference
RunContextWrapper
Purpose: Wraps the context and usage for each agent run.
Fields:
context: The user-defined context object (any type).
usage: Usage statistics for the agent run (see 
usage.py
).
Usage: Passed to tools, hooks, and callbacks to provide access to run-specific state and usage data.
Example Usage
1. Passing Custom Context to an Agent Run
from my_agent_framework import Runner, RunContextWrapper

my_context = {"user_id": "123", "session_data": {}}
result = await Runner.run(my_agent, input="Hello", context=my_context)

# Access context in a tool function
def my_tool(context_wrapper: RunContextWrapper, ...):
    user_id = context_wrapper.context["user_id"]
    ...
2. Tracking Usage
# After the run
print(result.context_wrapper.usage.total_tokens)
Tips, Gotchas, and FAQ
Context is not sent to the LLM:
The context object is for your code only; it is never passed to the language model.

Usage is updated as the run progresses:
For streaming runs, usage statistics may be stale until the final chunk is processed.

Flexible Context Type:
You can use any type for the context (dict, custom class, etc.), depending on your application's needs.

Related Files
usage.py
: Defines the Usage class for tracking resource consumption.
run.py
: Main agent runner that uses RunContextWrapper.
tool.py
: Tool functions often receive the context wrapper as an argument.
lifecycle.py
: Hooks and callbacks receive the context wrapper.
For further details, see the source code and related modules.


#####

stream_events.py — Streaming Event Types for OpenAI Agents
File Overview
This file defines the streaming event types used for real-time, incremental output from OpenAI-style agents. It includes event classes for raw LLM responses, agent-generated run items (messages, tool calls, handoffs, etc.), and agent updates. The unified StreamEvent type alias enables ergonomic handling of all event types in streaming loops, dashboards, or interactive applications.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RawResponsesStreamEvent	Represents a raw streaming event directly from the LLM.
RunItemStreamEvent	Represents a streaming event for a new agent-generated run item (message, tool, etc.).
AgentUpdatedStreamEvent	Indicates that a new agent is now running.
StreamEvent	Type alias for any of the above event types.
Annotated Code Snippets
1. RawResponsesStreamEvent
@dataclass
class RawResponsesStreamEvent:
    """Streaming event from the LLM. These are 'raw' events, i.e. they are directly passed through
    from the LLM.
    """
    data: TResponseStreamEvent
    type: Literal["raw_response_event"] = "raw_response_event"
Explanation:
Represents a raw event from the LLM's streaming API, passed through without modification.

2. RunItemStreamEvent
@dataclass
class RunItemStreamEvent:
    """Streaming events that wrap a `RunItem`. As the agent processes the LLM response, it will
    generate these events for new messages, tool calls, tool outputs, handoffs, etc.
    """
    name: Literal[
        "message_output_created",
        "handoff_requested",
        "handoff_occured",  # (Note: misspelled for backward compatibility)
        "tool_called",
        "tool_output",
        "reasoning_item_created",
        "mcp_approval_requested",
        "mcp_list_tools",
    ]
    item: RunItem
    type: Literal["run_item_stream_event"] = "run_item_stream_event"
Explanation:
Represents a semantic event generated by the agent, such as a new message, tool call, or handoff.

3. AgentUpdatedStreamEvent
@dataclass
class AgentUpdatedStreamEvent:
    """Event that notifies that there is a new agent running."""
    new_agent: Agent[Any]
    type: Literal["agent_updated_stream_event"] = "agent_updated_stream_event"
Explanation:
Signals that the currently running agent has changed (e.g., after a handoff).

4. StreamEvent Type Alias
StreamEvent: TypeAlias = Union[
    RawResponsesStreamEvent,
    RunItemStreamEvent,
    AgentUpdatedStreamEvent,
]
Explanation:
Unifies all streaming event types for ergonomic handling in event loops or UI frameworks.

Function/Class Reference
RawResponsesStreamEvent
Purpose: Represents a raw streaming event from the LLM.
Fields:
data: The raw LLM streaming event.
type: Always "raw_response_event".
RunItemStreamEvent
Purpose: Represents a semantic event generated by the agent (message, tool call, handoff, etc.).
Fields:
name: The event type (e.g., "message_output_created", "tool_called").
item: The generated run item.
type: Always "run_item_stream_event".
AgentUpdatedStreamEvent
Purpose: Indicates that a new agent is now running.
Fields:
new_agent: The new agent instance.
type: Always "agent_updated_stream_event".
StreamEvent
Purpose: Type alias for any streaming event type.
Usage: Use in event loops, streaming APIs, or UI frameworks to handle all event types.
Example Usage
1. Handling Streaming Events
async for event in result.stream_events():
    if isinstance(event, RawResponsesStreamEvent):
        print(event.data)
    elif isinstance(event, RunItemStreamEvent):
        print(f"Event: {event.name}, Item: {event.item}")
    elif isinstance(event, AgentUpdatedStreamEvent):
        print(f"Agent switched to: {event.new_agent.name}")
2. UI Integration
def handle_stream_event(event: StreamEvent):
    if event.type == "run_item_stream_event":
        update_ui_with_item(event.item)
    elif event.type == "agent_updated_stream_event":
        show_agent_switch(event.new_agent)
Tips, Gotchas, and FAQ
Misspelled Event Name:
"handoff_occured" is intentionally misspelled for backward compatibility. Do not change it unless you are ready for a breaking change.

Extensibility:
You can extend the event system by adding new event classes and updating the StreamEvent type alias.

Real-Time Processing:
Use these events for real-time dashboards, chat UIs, or developer tools that need to reflect agent progress incrementally.

Related Files
run.py
: Agent runner that emits streaming events.
items.py
: Run item types referenced in stream events.
agent.py
: Agent definitions referenced in agent update events.
For further details, see the source code and related modules.


#####

strict_schema.py — Strict JSON Schema Enforcement for OpenAI Agents
File Overview
This file provides utilities for mutating and validating JSON schemas to ensure they conform to the "strict" standard required by the OpenAI API for function/tool-calling and structured outputs. The main entry point, ensure_strict_json_schema, recursively processes schemas to enforce strictness, handle $ref resolution, property requirements, and other schema features. This is essential for reliable function/tool-calling, agent output validation, and OpenAI API interoperability.

Table of Contents
Key Functions and Types
Annotated Code Snippets
Function Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Functions and Types
Name	Purpose
ensure_strict_json_schema	Main entry point for enforcing strict JSON schema compatibility.
_ensure_strict_json_schema	Internal recursive function for schema mutation and validation.
resolve_ref	Resolves $ref references within a schema.
is_dict, is_list	Type guards for dict/list objects.
has_more_than_n_keys	Utility to check the number of keys in a dict.
Annotated Code Snippets
1. Main Entry Point
def ensure_strict_json_schema(
    schema: dict[str, Any],
) -> dict[str, Any]:
    """Mutates the given JSON schema to ensure it conforms to the `strict` standard
    that the OpenAI API expects.
    """
    if schema == {}:
        return _EMPTY_SCHEMA
    return _ensure_strict_json_schema(schema, path=(), root=schema)
Explanation:

Ensures the provided schema is strict and OpenAI-compatible.
Returns a new schema or a default empty schema if input is empty.
2. Recursive Schema Mutation
def _ensure_strict_json_schema(
    json_schema: object,
    *,
    path: tuple[str, ...],
    root: dict[str, object],
) -> dict[str, Any]:
    # Recursively enforces strictness for objects, arrays, unions, intersections, and $refs.
    # - Sets "additionalProperties": False for objects.
    # - Ensures all properties are required.
    # - Resolves $refs and inlines them if needed.
    # - Removes unsupported or ambiguous features.
    ...
Explanation:

Handles all schema types, including objects, arrays, unions (anyOf), intersections (allOf), and $ref references.
Raises errors for non-strict features or misconfigurations.
3. Reference Resolution
def resolve_ref(*, root: dict[str, object], ref: str) -> object:
    if not ref.startswith("#/"):
        raise ValueError(f"Unexpected $ref format {ref!r}; Does not start with #/")
    path = ref[2:].split("/")
    resolved = root
    for key in path:
        value = resolved[key]
        assert is_dict(value), (
            f"encountered non-dictionary entry while resolving {ref} - {resolved}"
        )
        resolved = value
    return resolved
Explanation:

Resolves a $ref within the schema, following the JSON pointer path.
4. Type Guards and Utilities
def is_dict(obj: object) -> TypeGuard[dict[str, object]]:
    return isinstance(obj, dict)

def is_list(obj: object) -> TypeGuard[list[object]]:
    return isinstance(obj, list)

def has_more_than_n_keys(obj: dict[str, object], n: int) -> bool:
    i = 0
    for _ in obj.keys():
        i += 1
        if i > n:
            return True
    return False
Explanation:

Type guards for dict/list and utility for counting dict keys.
Function Reference
ensure_strict_json_schema
Purpose: Enforces strict JSON schema compatibility for OpenAI APIs.
Parameters: schema — the input JSON schema dict.
Returns: A strict, OpenAI-compatible JSON schema dict.
Raises: TypeError, UserError, or ValueError for invalid or non-strict schemas.
_ensure_strict_json_schema
Purpose: Internal recursive function for schema mutation and validation.
Parameters: json_schema, path, root.
Returns: A strict JSON schema dict.
resolve_ref
Purpose: Resolves a $ref pointer within a schema.
Parameters: root (root schema), ref (JSON pointer).
Returns: The resolved schema object.
is_dict, is_list, has_more_than_n_keys
Purpose: Type guards and utility for schema processing.
Example Usage
1. Enforcing Strict Schema
from strict_schema import ensure_strict_json_schema

schema = {
    "type": "object",
    "properties": {
        "foo": {"type": "string"},
        "bar": {"type": "integer"},
    }
}
strict_schema = ensure_strict_json_schema(schema)
# strict_schema now has "additionalProperties": False and all properties required
2. Handling $ref
schema = {
    "definitions": {
        "MyType": {
            "type": "object",
            "properties": {"x": {"type": "number"}}
        }
    },
    "type": "object",
    "properties": {"foo": {"$ref": "#/definitions/MyType"}}
}
strict_schema = ensure_strict_json_schema(schema)
Tips, Gotchas, and FAQ
additionalProperties:
All objects must have "additionalProperties": False for strict mode.

Required Properties:
All properties are made required by default.

$ref Handling:
$ref is inlined if other properties are present on the same object.

Union/Intersection:
Handles anyOf (union) and allOf (intersection) recursively.

Error Handling:
Raises clear errors for non-strict schemas or misconfigurations.

Related Files
agent_output.py
: Uses strict schema enforcement for output validation.
function_schema.py
: Uses strict schema enforcement for tool/function schemas.
handoffs.py
: Uses strict schema enforcement for handoff input schemas.
exceptions.py
: Defines UserError for schema errors.
For further details, see the source code and related modules.


#####

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


#####

usage.py — Usage Tracking for OpenAI Agent Runs
File Overview
This file defines the Usage dataclass, which tracks resource usage statistics for agent runs in OpenAI-style agent systems. It records total requests, input/output tokens, and detailed token breakdowns, supporting aggregation and reporting of LLM usage. The design is compatible with OpenAI's Responses API usage details and is essential for monitoring, analytics, and cost control in production agent systems.

Table of Contents
Key Class
Annotated Code Snippet
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Class
Name	Purpose
Usage	Tracks requests, input/output tokens, and detailed token usage for agent runs.
Annotated Code Snippet
from dataclasses import field
from openai.types.responses.response_usage import InputTokensDetails, OutputTokensDetails
from pydantic.dataclasses import dataclass

@dataclass
class Usage:
    requests: int = 0
    """Total requests made to the LLM API."""

    input_tokens: int = 0
    """Total input tokens sent, across all requests."""

    input_tokens_details: InputTokensDetails = field(
        default_factory=lambda: InputTokensDetails(cached_tokens=0)
    )
    """Details about the input tokens, matching responses API usage details."""

    output_tokens: int = 0
    """Total output tokens received, across all requests."""

    output_tokens_details: OutputTokensDetails = field(
        default_factory=lambda: OutputTokensDetails(reasoning_tokens=0)
    )
    """Details about the output tokens, matching responses API usage details."""

    total_tokens: int = 0
    """Total tokens sent and received, across all requests."""

    def add(self, other: "Usage") -> None:
        self.requests += other.requests if other.requests else 0
        self.input_tokens += other.input_tokens if other.input_tokens else 0
        self.output_tokens += other.output_tokens if other.output_tokens else 0
        self.total_tokens += other.total_tokens if other.total_tokens else 0
        self.input_tokens_details = InputTokensDetails(
            cached_tokens=self.input_tokens_details.cached_tokens
            + other.input_tokens_details.cached_tokens
        )
        self.output_tokens_details = OutputTokensDetails(
            reasoning_tokens=self.output_tokens_details.reasoning_tokens
            + other.output_tokens_details.reasoning_tokens
        )
Explanation:

Tracks total requests, input tokens, output tokens, and total tokens.
Includes detailed breakdowns for input and output tokens.
The add method aggregates usage from another Usage instance.
Function/Class Reference
Usage
Purpose: Tracks and aggregates resource usage for agent runs.
Fields:
requests: Total requests made to the LLM API.
input_tokens: Total input tokens sent.
input_tokens_details: Detailed breakdown of input tokens.
output_tokens: Total output tokens received.
output_tokens_details: Detailed breakdown of output tokens.
total_tokens: Total tokens sent and received.
Methods:
add(other: Usage): Aggregates usage statistics from another Usage instance.
Example Usage
1. Tracking and Aggregating Usage
usage1 = Usage(requests=1, input_tokens=100, output_tokens=50, total_tokens=150)
usage2 = Usage(requests=2, input_tokens=200, output_tokens=100, total_tokens=300)
usage1.add(usage2)
# usage1 now has requests=3, input_tokens=300, output_tokens=150, total_tokens=450
2. Accessing Token Details
print(usage1.input_tokens_details.cached_tokens)
print(usage1.output_tokens_details.reasoning_tokens)
Tips, Gotchas, and FAQ
Default Details:
input_tokens_details and output_tokens_details are initialized with zero values for safe aggregation.

Aggregation:
Use the add method to combine usage statistics across multiple runs or components.

OpenAI Compatibility:
The details fields are designed to match OpenAI's Responses API usage details.

Related Files
run_context.py
: Wraps and tracks usage for each agent run.
result.py
: Includes usage statistics in run results.
run.py
: Aggregates and updates usage during agent execution.
For further details, see the source code and related modules.

No file chosenNo file chosen
import importlib.metadata

try:
version = importlib.metadata.version("openai-agents")
except importlib.metadata.PackageNotFoundError:
# Fallback if running from source without being installed
version = "0.0.0"


#####

__version__.py — Package Version Utility for OpenAI Agent Framework
File Overview
This file exposes the current version of the agent package as __version__. It attempts to retrieve the version using Python's importlib.metadata (from installed package metadata), and falls back to "0.0.0" if the package is not installed (e.g., when running from source). This is a best practice for Python libraries and agent frameworks, enabling programmatic version checks for debugging, compatibility, and reproducibility.

Annotated Code Snippet
import importlib.metadata

try:
    __version__ = importlib.metadata.version("openai-agents")
except importlib.metadata.PackageNotFoundError:
    # Fallback if running from source without being installed
    __version__ = "0.0.0"
Explanation:

Tries to get the installed package version for "openai-agents".
If not installed, sets __version__ to "0.0.0" as a fallback.
Example Usage
from .__version__ import __version__

print(f"Agent framework version: {__version__}")
Tips, Gotchas, and FAQ
Always use __version__ for version checks in your code or for user-facing diagnostics.
Fallback value ensures the code works even in development or source-only environments.
Update the package name in the code if your distribution uses a different name.
Related Files
All files in the agent framework can import and use __version__ for version checks or logging.
For further details, see the Python 
importlib.metadata
 documentation.


#####

realtime_agent.py — Realtime Agent Class for Voice and Streaming OpenAI Agents
File Overview
This file defines the RealtimeAgent class, a specialized agent designed for use within a RealtimeSession to build voice or streaming agents. It enforces constraints and configuration specific to real-time workflows (such as voice agents), and provides support for dynamic instructions, modular handoffs, and lifecycle hooks. This class is foundational for agent systems that need to support interactive, streaming, or voice-based agent experiences.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RealtimeAgent	Specialized agent for real-time/voice workflows, supporting dynamic instructions and handoffs.
RealtimeAgentHooks	Type alias for agent hooks specific to RealtimeAgent.
RealtimeRunHooks	Type alias for run hooks specific to RealtimeAgent.
Annotated Code Snippets
1. RealtimeAgent Class
@dataclass
class RealtimeAgent(AgentBase, Generic[TContext]):
    instructions: (
        str
        | Callable[
            [RunContextWrapper[TContext], RealtimeAgent[TContext]],
            MaybeAwaitable[str],
        ]
        | None
    ) = None

    handoffs: list[RealtimeAgent[Any] | Handoff[TContext, RealtimeAgent[Any]]] = field(
        default_factory=list
    )

    hooks: RealtimeAgentHooks | None = None

    def clone(self, **kwargs: Any) -> RealtimeAgent[TContext]: ...
    async def get_system_prompt(self, run_context: RunContextWrapper[TContext]) -> str | None: ...
Explanation:

Supports dynamic or static instructions for the agent.
Allows modular handoffs to other RealtimeAgent instances or handoff objects.
Supports lifecycle hooks for custom event handling.
Provides a clone method for copying the agent with modifications.
2. RealtimeAgent Constraints
No per-agent model selection: All RealtimeAgents in a session use the same model.
No per-agent model settings: Model settings are unified across the session.
No structured outputs: Only plain text outputs are supported.
No per-agent tool use behavior: Tool use is unified across the session.
Voice configuration: Can be set per agent, but not changed after the first agent speaks in a session.
Function/Class Reference
RealtimeAgent
Purpose: Specialized agent for real-time/voice workflows.
Fields:
instructions: String or function for dynamic system prompt.
handoffs: List of sub-agents or handoff objects for modular delegation.
hooks: Lifecycle hooks for agent-specific events.
Key Methods:
clone(**kwargs): Returns a copy of the agent with updated fields.
get_system_prompt(run_context): Resolves the system prompt (instructions), supporting both static and dynamic forms.
RealtimeAgentHooks / RealtimeRunHooks
Purpose: Type aliases for agent and run hooks specific to RealtimeAgent.
Example Usage
1. Creating a RealtimeAgent
from realtime_agent import RealtimeAgent

agent = RealtimeAgent(
    name="VoiceAssistant",
    instructions="You are a helpful voice assistant."
)
2. Dynamic Instructions
async def dynamic_instructions(ctx, agent):
    return f"You are assisting user {ctx.context['user_id']}."

agent = RealtimeAgent(
    name="DynamicVoiceAgent",
    instructions=dynamic_instructions
)
3. Cloning a RealtimeAgent
new_agent = agent.clone(instructions="You are now a different assistant.")
Tips, Gotchas, and FAQ
No Structured Outputs:
RealtimeAgent does not support structured outputs (e.g., Pydantic models, TypedDicts). Use plain text only.

Unified Model Settings:
All agents in a RealtimeSession share the same model and settings.

Voice Configuration:
Voice can be set per agent, but not changed after the first agent speaks in a session.

Dynamic Instructions:
Instructions can be a string or an async/sync function for runtime customization.

Handoffs:
Use the handoffs field for modular delegation to other agents or handoff objects.

Related Files
agent.py
: Base agent class and standard agent logic.
handoffs.py
: Handoff abstractions for agent delegation.
lifecycle.py
: Lifecycle hooks for agent events.
run_context.py
: Run context wrapper for agent execution.
For further details, see the source code and related modules.


#####

realtime_types.py — Configuration Types for Realtime and Voice OpenAI Agents
File Overview
This file defines the configuration types and settings for real-time agent sessions, including model selection, audio formats, transcription, turn detection, tool/handoff integration, guardrails, and tracing. These TypedDicts and TypeAliases provide a structured, type-safe way to configure and manage real-time, streaming, or voice-based agent workflows in OpenAI-style agent systems.

Table of Contents
Key Types and Aliases
Annotated Code Snippets
Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Types and Aliases
Name	Purpose
RealtimeModelName	Type alias for supported real-time model names.
RealtimeAudioFormat	Type alias for supported audio formats.
RealtimeClientMessage	TypedDict for raw messages sent to the model.
RealtimeInputAudioTranscriptionConfig	TypedDict for audio transcription settings.
RealtimeTurnDetectionConfig	TypedDict for turn/voice activity detection settings.
RealtimeSessionModelSettings	TypedDict for model/session configuration.
RealtimeGuardrailsSettings	TypedDict for output guardrail settings.
RealtimeModelTracingConfig	TypedDict for tracing configuration.
RealtimeRunConfig	TypedDict for configuring a real-time agent session.
RealtimeUserInputText	TypedDict for text input from the user.
RealtimeUserInputMessage	TypedDict for structured user message input.
RealtimeUserInput	Type alias for user input (string or structured message).
Annotated Code Snippets
1. Model and Audio Format Aliases
RealtimeModelName: TypeAlias = Union[
    Literal[
        "gpt-4o-realtime-preview",
        "gpt-4o-mini-realtime-preview",
        "gpt-4o-realtime-preview-2025-06-03",
        "gpt-4o-realtime-preview-2024-12-17",
        "gpt-4o-realtime-preview-2024-10-01",
        "gpt-4o-mini-realtime-preview-2024-12-17",
    ],
    str,
]
RealtimeAudioFormat: TypeAlias = Union[Literal["pcm16", "g711_ulaw", "g711_alaw"], str]
Explanation:
Defines allowed values for real-time model names and audio formats, ensuring type safety and clarity.

2. RealtimeSessionModelSettings
class RealtimeSessionModelSettings(TypedDict):
    model_name: NotRequired[RealtimeModelName]
    instructions: NotRequired[str]
    modalities: NotRequired[list[Literal["text", "audio"]]]
    voice: NotRequired[str]
    input_audio_format: NotRequired[RealtimeAudioFormat]
    output_audio_format: NotRequired[RealtimeAudioFormat]
    input_audio_transcription: NotRequired[RealtimeInputAudioTranscriptionConfig]
    turn_detection: NotRequired[RealtimeTurnDetectionConfig]
    tool_choice: NotRequired[ToolChoice]
    tools: NotRequired[list[Tool]]
    handoffs: NotRequired[list[Handoff]]
    tracing: NotRequired[RealtimeModelTracingConfig | None]
Explanation:
Central configuration for a real-time agent session, covering model, audio, transcription, tools, handoffs, and tracing.

3. Guardrails and Tracing Settings
class RealtimeGuardrailsSettings(TypedDict):
    debounce_text_length: NotRequired[int]

class RealtimeModelTracingConfig(TypedDict):
    workflow_name: NotRequired[str]
    group_id: NotRequired[str]
    metadata: NotRequired[dict[str, Any]]
Explanation:
Settings for output guardrails (e.g., debounce thresholds) and tracing (workflow name, group, metadata).

4. RealtimeRunConfig
class RealtimeRunConfig(TypedDict):
    model_settings: NotRequired[RealtimeSessionModelSettings]
    output_guardrails: NotRequired[list[OutputGuardrail[Any]]]
    guardrails_settings: NotRequired[RealtimeGuardrailsSettings]
    tracing_disabled: NotRequired[bool]
Explanation:
Top-level configuration for running a real-time agent session, including model, guardrails, and tracing.

5. User Input Types
class RealtimeUserInputText(TypedDict):
    type: Literal["input_text"]
    text: str

class RealtimeUserInputMessage(TypedDict):
    type: Literal["message"]
    role: Literal["user"]
    content: list[RealtimeUserInputText]

RealtimeUserInput: TypeAlias = Union[str, RealtimeUserInputMessage]
Explanation:
Defines both string and structured message formats for user input.

Type Reference
RealtimeSessionModelSettings
Purpose: Central configuration for a real-time agent session.
Fields: Model name, instructions, modalities, voice, audio formats, transcription, turn detection, tool/handoff lists, tracing.
RealtimeRunConfig
Purpose: Top-level configuration for running a real-time agent session.
Fields: Model settings, output guardrails, guardrail settings, tracing disabled.
RealtimeUserInput
Purpose: User input for a real-time session (string or structured message).
Example Usage
1. Configuring a Realtime Session
model_settings = {
    "model_name": "gpt-4o-realtime-preview",
    "voice": "alloy",
    "modalities": ["text", "audio"],
    "tools": [my_tool],
    "handoffs": [my_handoff],
    "input_audio_format": "pcm16",
    "output_audio_format": "pcm16",
    "turn_detection": {"type": "semantic_vad", "eagerness": "auto"},
}

run_config = {
    "model_settings": model_settings,
    "output_guardrails": [my_guardrail],
    "guardrails_settings": {"debounce_text_length": 100},
    "tracing_disabled": False,
}
2. Sending User Input
user_input: RealtimeUserInput = "Hello, agent!"

structured_input: RealtimeUserInput = {
    "type": "message",
    "role": "user",
    "content": [{"type": "input_text", "text": "Hello, agent!"}]
}
Tips, Gotchas, and FAQ
Model and Audio Formats:
Use only supported values for model_name and audio formats for compatibility.

Guardrails:
Guardrail settings allow you to debounce or throttle guardrail checks for streaming output.

Tracing:
Tracing configuration enables workflow-level observability and grouping for real-time sessions.

User Input:
Both string and structured message formats are supported for user input.

Related Files
realtime_agent.py
: Realtime agent class that uses these types.
guardrail.py
: Guardrail logic referenced in output guardrails.
handoffs.py
: Handoff logic referenced in session settings.
tool.py
: Tool definitions referenced in session settings.
For further details, see the source code and related modules.


#####

Should This Code Be Included in an Agent for OpenAI Agent Creation?
Yes, this code is important to include in the file base of an agent that helps with the creation of OpenAI Agents, especially for real-time, streaming, or voice agent scenarios.

Why?
It defines the event types (RealtimeSessionEvent and its variants) that are emitted during a real-time agent session, covering agent lifecycle, tool calls, audio events, errors, history updates, and guardrail triggers.
These event classes are essential for building interactive, streaming, or voice-based agent experiences, enabling real-time UI updates, audio playback, error handling, and session management.
The design is modular and extensible, supporting advanced features like audio interruption, guardrail tripping, and full session history tracking.
These types are foundational for any system that needs to process, display, or respond to real-time agent events in dashboards, UIs, or voice applications.
In summary:
This file is foundational for any agent system that needs to support real-time, streaming, or voice-based workflows, and is required for robust event handling and integration.

I will now generate comprehensive markdown documentation for this file, following the guidelines provided.

realtime_events.py — Realtime Session Event Types for OpenAI Voice/Streaming Agents
File Overview
This file defines the event types emitted during a real-time agent session, covering agent lifecycle, tool calls, audio events, errors, history updates, and guardrail triggers. These event classes are essential for building interactive, streaming, or voice-based agent experiences, enabling real-time UI updates, audio playback, error handling, and session management.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Class/Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RealtimeEventInfo	Holds context for all realtime events.
RealtimeAgentStartEvent	Emitted when a new agent starts.
RealtimeAgentEndEvent	Emitted when an agent ends.
RealtimeHandoffEvent	Emitted when an agent hands off to another agent.
RealtimeToolStart	Emitted when an agent starts a tool call.
RealtimeToolEnd	Emitted when an agent ends a tool call.
RealtimeRawModelEvent	Forwards raw model events.
RealtimeAudioEnd	Emitted when audio generation stops.
RealtimeAudio	Emitted when new audio is generated.
RealtimeAudioInterrupted	Emitted when audio is interrupted.
RealtimeError	Emitted when an error occurs.
RealtimeHistoryUpdated	Emitted when the session history is updated.
RealtimeHistoryAdded	Emitted when a new item is added to the history.
RealtimeGuardrailTripped	Emitted when a guardrail is tripped and the agent is interrupted.
RealtimeSessionEvent	Type alias for any of the above event types.
Annotated Code Snippets
1. Agent Lifecycle Events
@dataclass
class RealtimeAgentStartEvent:
    agent: RealtimeAgent
    info: RealtimeEventInfo
    type: Literal["agent_start"] = "agent_start"

@dataclass
class RealtimeAgentEndEvent:
    agent: RealtimeAgent
    info: RealtimeEventInfo
    type: Literal["agent_end"] = "agent_end"
Explanation:
Emitted when an agent starts or ends, providing agent and context info.

2. Tool Call Events
@dataclass
class RealtimeToolStart:
    agent: RealtimeAgent
    tool: Tool
    info: RealtimeEventInfo
    type: Literal["tool_start"] = "tool_start"

@dataclass
class RealtimeToolEnd:
    agent: RealtimeAgent
    tool: Tool
    output: Any
    info: RealtimeEventInfo
    type: Literal["tool_end"] = "tool_end"
Explanation:
Emitted when a tool call starts or ends, including agent, tool, output, and context info.

3. Audio and Model Events
@dataclass
class RealtimeAudio:
    audio: RealtimeModelAudioEvent
    item_id: str
    content_index: int
    info: RealtimeEventInfo
    type: Literal["audio"] = "audio"

@dataclass
class RealtimeAudioEnd:
    info: RealtimeEventInfo
    item_id: str
    content_index: int
    type: Literal["audio_end"] = "audio_end"

@dataclass
class RealtimeAudioInterrupted:
    info: RealtimeEventInfo
    item_id: str
    content_index: int
    type: Literal["audio_interrupted"] = "audio_interrupted"

@dataclass
class RealtimeRawModelEvent:
    data: RealtimeModelEvent
    info: RealtimeEventInfo
    type: Literal["raw_model_event"] = "raw_model_event"
Explanation:
Covers all audio-related and raw model events, including playback, interruption, and raw data forwarding.

4. History and Guardrail Events
@dataclass
class RealtimeHistoryUpdated:
    history: list[RealtimeItem]
    info: RealtimeEventInfo
    type: Literal["history_updated"] = "history_updated"

@dataclass
class RealtimeHistoryAdded:
    item: RealtimeItem
    info: RealtimeEventInfo
    type: Literal["history_added"] = "history_added"

@dataclass
class RealtimeGuardrailTripped:
    guardrail_results: list[OutputGuardrailResult]
    message: str
    info: RealtimeEventInfo
    type: Literal["guardrail_tripped"] = "guardrail_tripped"
Explanation:
Emitted when session history is updated, a new item is added, or a guardrail is tripped.

5. Error Events
@dataclass
class RealtimeError:
    error: Any
    info: RealtimeEventInfo
    type: Literal["error"] = "error"
Explanation:
Emitted when an error occurs during the session.

6. Unified Event Type
RealtimeSessionEvent: TypeAlias = Union[
    RealtimeAgentStartEvent,
    RealtimeAgentEndEvent,
    RealtimeHandoffEvent,
    RealtimeToolStart,
    RealtimeToolEnd,
    RealtimeRawModelEvent,
    RealtimeAudioEnd,
    RealtimeAudio,
    RealtimeAudioInterrupted,
    RealtimeError,
    RealtimeHistoryUpdated,
    RealtimeHistoryAdded,
    RealtimeGuardrailTripped,
]
Explanation:
Unifies all event types for ergonomic handling in event loops or UI frameworks.

Class/Type Reference
RealtimeSessionEvent
Purpose: Represents any event emitted by a real-time agent session.
Variants: See above for all supported event classes.
Example Usage
1. Handling Realtime Events
def handle_event(event: RealtimeSessionEvent):
    if event.type == "agent_start":
        print(f"Agent started: {event.agent.name}")
    elif event.type == "audio":
        play_audio(event.audio)
    elif event.type == "guardrail_tripped":
        alert_user(event.message)
    # ... handle other event types ...
2. UI Integration
for event in session_event_stream:
    update_ui_with_event(event)
Tips, Gotchas, and FAQ
Extensibility:
You can extend the event system by adding new event classes and updating the RealtimeSessionEvent type alias.

Context Info:
All events include a RealtimeEventInfo object with the run context for easy access to session state.

Audio Handling:
Use RealtimeAudio, RealtimeAudioEnd, and RealtimeAudioInterrupted to manage audio playback and interruptions.

Guardrail Handling:
Use RealtimeGuardrailTripped to handle safety or validation interruptions in real-time sessions.

Related Files
realtime_agent.py
: Realtime agent class that emits these events.
run_context.py
: Run context wrapper included in event info.
tool.py
: Tool definitions referenced in tool events.
guardrail.py
: Guardrail result types referenced in guardrail events.
For further details, see the source code and related modules.


#####

Should This Code Be Included in an Agent for OpenAI Agent Creation?
Yes, this code is important to include in the file base of an agent that helps with the creation of OpenAI Agents, especially if you want to support real-time, streaming, or voice agent scenarios.

Why?
It defines the realtime_handoff utility, which enables handoffs (delegation) between RealtimeAgent instances—crucial for modular, multi-agent, or hierarchical real-time agent workflows.
The function enforces type safety and strict schema validation for handoff inputs, supporting both input-taking and input-less handoff functions.
It allows for dynamic enable/disable logic and provides clear error handling for misconfiguration.
This is foundational for building complex, interactive, or voice-based agent systems where tasks may need to be delegated between specialized agents in real-time.
In summary:
This file is foundational for any agent system that needs to support delegation, multi-agent orchestration, or modular design in real-time/voice agent workflows.

I will now generate comprehensive markdown documentation for this file, following the guidelines provided.

realtime_handoff.py — Handoff Utility for Realtime OpenAI Agents
File Overview
This file defines the realtime_handoff utility, which enables handoffs (delegation) between RealtimeAgent instances in real-time, streaming, or voice agent workflows. It supports both input-taking and input-less handoff functions, enforces strict schema validation, and allows for dynamic enable/disable logic. This is essential for modular, multi-agent, or hierarchical real-time agent systems.

Table of Contents
Key Function and Types
Annotated Code Snippet
Function Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Function and Types
Name	Purpose
realtime_handoff	Creates a handoff from one RealtimeAgent to another, with optional input validation.
OnHandoffWithInput	Callable type for handoff functions that take input.
OnHandoffWithoutInput	Callable type for handoff functions that take no input.
Annotated Code Snippet
def realtime_handoff(
    agent: RealtimeAgent[TContext],
    tool_name_override: str | None = None,
    tool_description_override: str | None = None,
    on_handoff: OnHandoffWithInput[THandoffInput] | OnHandoffWithoutInput | None = None,
    input_type: type[THandoffInput] | None = None,
    is_enabled: bool
    | Callable[[RunContextWrapper[Any], RealtimeAgent[Any]], MaybeAwaitable[bool]] = True,
) -> Handoff[TContext, RealtimeAgent[TContext]]:
    """Create a handoff from a RealtimeAgent.
    ...
    Note: input_filter is not supported for RealtimeAgent handoffs.
    """
    ...
Explanation:

Validates and constructs a Handoff object for real-time agent delegation.
Supports both input-taking and input-less handoff functions.
Enforces strict JSON schema validation for input types.
Allows for dynamic enable/disable logic.
Does not support input filtering for real-time handoffs.
Function Reference
realtime_handoff
Purpose: Creates a handoff from one RealtimeAgent to another, with optional input validation and dynamic enable/disable logic.
Parameters:
agent: The target RealtimeAgent for the handoff.
tool_name_override: Optional custom tool name.
tool_description_override: Optional custom tool description.
on_handoff: Function to call when the handoff is invoked (with or without input).
input_type: Type to validate input against (if applicable).
is_enabled: Bool or callable to enable/disable the handoff dynamically.
Returns: A Handoff object for real-time agent delegation.
Example Usage
1. Simple RealtimeAgent Handoff
handoff = realtime_handoff(
    agent=VoiceAgent,
    tool_name_override="transfer_to_voice",
    tool_description_override="Transfer to voice assistant agent."
)
2. Handoff with Input Validation
from pydantic import BaseModel

class VoiceInput(BaseModel):
    language: str

async def on_voice_handoff(context, input: VoiceInput):
    # Custom logic before handing off
    ...

handoff = realtime_handoff(
    agent=VoiceAgent,
    on_handoff=on_voice_handoff,
    input_type=VoiceInput,
    tool_name_override="transfer_to_voice"
)
3. Dynamic Enable Logic
def is_enabled(context, agent):
    return context.context.get("enable_voice", False)

handoff = realtime_handoff(
    agent=VoiceAgent,
    is_enabled=is_enabled
)
Tips, Gotchas, and FAQ
Strict Input Validation:
All handoff inputs are validated against a strict JSON schema for safety and compatibility.

No Input Filter:
input_filter is not supported for RealtimeAgent handoffs.

Dynamic Enable Logic:
Use the is_enabled parameter to dynamically enable or disable handoffs based on runtime context.

Error Handling:
Misconfigured handoff functions (wrong argument count, etc.) will raise clear errors.

Related Files
realtime_agent.py
: Realtime agent class that can be the target of handoffs.
handoffs.py
: General handoff logic for standard agents.
run_context.py
: Run context wrapper for agent execution.
strict_schema.py
: Utilities for enforcing strict JSON schema.
exceptions.py
: Custom error types for handoff and validation errors.
For further details, see the source code and related modules.


#####

Should This Code Be Included in an Agent for OpenAI Agent Creation?
Yes, this code is important to include in the file base of an agent that helps with the creation of OpenAI Agents, especially for real-time, streaming, or voice agent scenarios.

Why?
It defines the Pydantic models for all message and tool call items in real-time agent conversations, including user, assistant, and system messages, as well as tool call items.
The models support both text and audio content, and are designed for discriminated unions, making them robust for multimodal, streaming, or voice agent workflows.
The RealtimeResponse model encapsulates the output of a real-time agent, supporting structured, type-safe handling of agent responses.
These types are foundational for any system that needs to process, validate, or generate real-time agent messages and tool calls, especially in voice or multimodal applications.
In summary:
This file is foundational for any agent system that needs to support real-time, streaming, or voice-based workflows, and is required for robust message and tool call modeling.

I will now generate comprehensive markdown documentation for this file, following the guidelines provided.

realtime_items.py — Real-Time Message and Tool Call Models for OpenAI Agents
File Overview
This file defines Pydantic models for all message and tool call items in real-time OpenAI agent conversations. It supports user, assistant, and system messages (with both text and audio content), as well as tool call items. These models are designed for multimodal, streaming, or voice agent workflows, and provide structured, type-safe handling of real-time agent responses.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Class/Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
InputText	Represents text input content for real-time messages.
InputAudio	Represents audio input content for real-time messages.
AssistantText	Represents text content from the assistant.
AssistantAudio	Represents audio content from the assistant.
SystemMessageItem	Represents a system message in the conversation.
UserMessageItem	Represents a user message (text or audio).
AssistantMessageItem	Represents an assistant message (text or audio, with status).
RealtimeMessageItem	Union of system, user, and assistant message items.
RealtimeToolCallItem	Represents a tool call in the conversation.
RealtimeItem	Union of message and tool call items.
RealtimeResponse	Represents a response from the real-time model.
Annotated Code Snippets
1. Input and Assistant Content Models
class InputText(BaseModel):
    type: Literal["input_text"] = "input_text"
    text: str | None = None
    model_config = ConfigDict(extra="allow")

class InputAudio(BaseModel):
    type: Literal["input_audio"] = "input_audio"
    audio: str | None = None
    transcript: str | None = None
    model_config = ConfigDict(extra="allow")

class AssistantText(BaseModel):
    type: Literal["text"] = "text"
    text: str | None = None
    model_config = ConfigDict(extra="allow")

class AssistantAudio(BaseModel):
    type: Literal["audio"] = "audio"
    audio: str | None = None
    transcript: str | None = None
    model_config = ConfigDict(extra="allow")
Explanation:
Models for both text and audio content, supporting extra fields for extensibility.

2. Message Item Models
class SystemMessageItem(BaseModel):
    item_id: str
    previous_item_id: str | None = None
    type: Literal["message"] = "message"
    role: Literal["system"] = "system"
    content: list[InputText]
    model_config = ConfigDict(extra="allow")

class UserMessageItem(BaseModel):
    item_id: str
    previous_item_id: str | None = None
    type: Literal["message"] = "message"
    role: Literal["user"] = "user"
    content: list[Annotated[InputText | InputAudio, Field(discriminator="type")]]
    model_config = ConfigDict(extra="allow")

class AssistantMessageItem(BaseModel):
    item_id: str
    previous_item_id: str | None = None
    type: Literal["message"] = "message"
    role: Literal["assistant"] = "assistant"
    status: Literal["in_progress", "completed", "incomplete"] | None = None
    content: list[Annotated[AssistantText | AssistantAudio, Field(discriminator="type")]]
    model_config = ConfigDict(extra="allow")
Explanation:

Models for system, user, and assistant messages.
User and assistant messages support both text and audio content, using discriminated unions for type safety.
3. Tool Call Item Model
class RealtimeToolCallItem(BaseModel):
    item_id: str
    previous_item_id: str | None = None
    call_id: str | None
    type: Literal["function_call"] = "function_call"
    status: Literal["in_progress", "completed"]
    arguments: str
    name: str
    output: str | None = None
    model_config = ConfigDict(extra="allow")
Explanation:
Represents a tool call in the conversation, including arguments, status, and output.

4. Unified Types
RealtimeMessageItem = Annotated[
    Union[SystemMessageItem, UserMessageItem, AssistantMessageItem],
    Field(discriminator="role"),
]
RealtimeItem = Union[RealtimeMessageItem, RealtimeToolCallItem]
Explanation:

RealtimeMessageItem is a union of all message item types, discriminated by role.
RealtimeItem is a union of message and tool call items.
5. Realtime Model Response
class RealtimeResponse(BaseModel):
    id: str
    output: list[RealtimeMessageItem]
Explanation:
Represents a response from the real-time model, including all output message items.

Class/Type Reference
InputText, InputAudio, AssistantText, AssistantAudio
Purpose: Represent text and audio content for user and assistant messages.
SystemMessageItem, UserMessageItem, AssistantMessageItem
Purpose: Represent system, user, and assistant messages in the conversation.
RealtimeToolCallItem
Purpose: Represents a tool call (function invocation) in the conversation.
RealtimeMessageItem, RealtimeItem
Purpose: Unified types for message and tool call items.
RealtimeResponse
Purpose: Represents a response from the real-time model.
Example Usage
1. Creating a User Message Item
msg = UserMessageItem(
    item_id="1",
    type="message",
    role="user",
    content=[InputText(text="Hello!")]
)
2. Creating an Assistant Message Item with Audio
msg = AssistantMessageItem(
    item_id="2",
    type="message",
    role="assistant",
    status="completed",
    content=[AssistantAudio(audio="base64string", transcript="Hi there!")]
)
3. Creating a Tool Call Item
tool_call = RealtimeToolCallItem(
    item_id="3",
    type="function_call",
    status="in_progress",
    arguments='{"param": "value"}',
    name="my_tool"
)
4. Parsing a RealtimeResponse
response = RealtimeResponse(id="resp1", output=[msg])
Tips, Gotchas, and FAQ
Discriminated Unions:
Use the type and role fields for correct parsing and validation of message and content types.

Extensibility:
All models allow extra fields for forward compatibility and custom metadata.

Audio Support:
Both user and assistant messages support audio content, making these models suitable for voice and multimodal agents.

Related Files
realtime_events.py
: Event types for real-time agent sessions.
realtime_agent.py
: Realtime agent class using these message types.
tool.py
: Tool definitions referenced in tool call items.
For further details, see the source code and related modules.


#####

Should This Code Be Included in an Agent for OpenAI Agent Creation?
Yes, this code is important to include in the file base of an agent that helps with the creation of OpenAI Agents, especially for real-time, streaming, or voice agent scenarios.

Why?
It defines the RealtimeModel interface and related classes for connecting to, sending events to, and receiving events from a real-time model (e.g., for voice or streaming agents).
The RealtimePlaybackTracker provides a way to track audio playback progress, which is crucial for handling interruptions and synchronizing agent output with user playback.
The RealtimeModelListener interface allows for event-driven programming, enabling custom logic on model events.
The RealtimeModelConfig TypedDict encapsulates all configuration options for connecting to a real-time model, including API keys, URLs, model settings, and playback tracking.
These abstractions are foundational for building robust, interactive, and low-latency agent systems that require real-time communication and audio handling.
In summary:
This file is foundational for any agent system that needs to support real-time, streaming, or voice-based workflows, and is required for robust model integration and playback tracking.

I will now generate comprehensive markdown documentation for this file, following the guidelines provided.

realtime_model.py — Realtime Model Interface and Playback Tracking for OpenAI Agents
File Overview
This file defines the core interfaces and utilities for connecting to, sending events to, and receiving events from a real-time model (e.g., for voice or streaming OpenAI agents). It includes the RealtimeModel abstract base class, the RealtimePlaybackTracker for audio playback progress, the RealtimeModelListener for event-driven programming, and the RealtimeModelConfig TypedDict for connection configuration. These abstractions are essential for building robust, interactive, and low-latency agent systems that require real-time communication and audio handling.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Class/Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RealtimePlaybackState	TypedDict for tracking audio playback state.
RealtimePlaybackTracker	Tracks audio playback progress for real-time sessions.
RealtimeModelListener	Interface for receiving events from the real-time model.
RealtimeModelConfig	TypedDict for configuring real-time model connections.
RealtimeModel	Abstract base class for real-time model communication.
Annotated Code Snippets
1. Playback State and Tracker
class RealtimePlaybackState(TypedDict):
    current_item_id: str | None
    current_item_content_index: int | None
    elapsed_ms: float | None

class RealtimePlaybackTracker:
    def on_play_bytes(self, item_id: str, item_content_index: int, bytes: bytes) -> None: ...
    def on_play_ms(self, item_id: str, item_content_index: int, ms: float) -> None: ...
    def on_interrupted(self) -> None: ...
    def set_audio_format(self, format: RealtimeAudioFormat) -> None: ...
    def get_state(self) -> RealtimePlaybackState: ...
Explanation:

RealtimePlaybackState tracks which item is being played and how much audio has been played.
RealtimePlaybackTracker allows custom logic for tracking playback progress, handling interruptions, and reporting state.
2. Model Listener Interface
class RealtimeModelListener(abc.ABC):
    @abc.abstractmethod
    async def on_event(self, event: RealtimeModelEvent) -> None: ...
Explanation:
Defines an interface for receiving events from the real-time model.

3. Model Configuration
class RealtimeModelConfig(TypedDict):
    api_key: NotRequired[str | Callable[[], MaybeAwaitable[str]]]
    url: NotRequired[str]
    initial_model_settings: NotRequired[RealtimeSessionModelSettings]
    playback_tracker: NotRequired[RealtimePlaybackTracker]
Explanation:
Encapsulates all options for connecting to a real-time model, including API keys, URLs, initial settings, and playback tracking.

4. RealtimeModel Interface
class RealtimeModel(abc.ABC):
    @abc.abstractmethod
    async def connect(self, options: RealtimeModelConfig) -> None: ...
    @abc.abstractmethod
    def add_listener(self, listener: RealtimeModelListener) -> None: ...
    @abc.abstractmethod
    def remove_listener(self, listener: RealtimeModelListener) -> None: ...
    @abc.abstractmethod
    async def send_event(self, event: RealtimeModelSendEvent) -> None: ...
    @abc.abstractmethod
    async def close(self) -> None: ...
Explanation:
Abstract base class for real-time model communication, supporting connection, event sending, listener management, and session closing.

Class/Type Reference
RealtimePlaybackTracker
Purpose: Tracks audio playback progress, handling interruptions and reporting state.
Key Methods:
on_play_bytes(item_id, item_content_index, bytes): Called when audio bytes are played.
on_play_ms(item_id, item_content_index, ms): Called when a certain number of milliseconds of audio are played.
on_interrupted(): Called when playback is interrupted.
set_audio_format(format): Sets the audio format.
get_state(): Returns the current playback state.
RealtimeModelListener
Purpose: Receives events from the real-time model.
Key Method: on_event(event): Called when a model event is emitted.
RealtimeModelConfig
Purpose: Configuration for connecting to a real-time model.
Fields: API key, URL, initial model settings, playback tracker.
RealtimeModel
Purpose: Abstract interface for real-time model communication.
Key Methods:
connect(options): Establishes a connection.
add_listener(listener): Adds an event listener.
remove_listener(listener): Removes an event listener.
send_event(event): Sends an event to the model.
close(): Closes the session.
Example Usage
1. Custom Playback Tracker
tracker = RealtimePlaybackTracker()
tracker.set_audio_format("pcm16")
tracker.on_play_bytes("item1", 0, b"\x00\x01...")
print(tracker.get_state())
2. Implementing a Model Listener
class MyListener(RealtimeModelListener):
    async def on_event(self, event):
        print("Received event:", event)
3. Connecting to a Realtime Model
config = {
    "api_key": "sk-...",
    "url": "wss://...",
    "initial_model_settings": {...},
    "playback_tracker": tracker,
}
await my_realtime_model.connect(config)
my_realtime_model.add_listener(MyListener())
Tips, Gotchas, and FAQ
Playback Tracking:
Use a custom RealtimePlaybackTracker if your playback logic is non-standard or you need to handle interruptions accurately.

Event-Driven Design:
Implement RealtimeModelListener for custom event handling logic.

Configuration:
All connection options (API key, URL, settings) are provided via RealtimeModelConfig.

Extensibility:
Subclass RealtimeModel to implement custom real-time model integrations.

Related Files
realtime_agent.py
: Realtime agent class that interacts with the model.
realtime_events.py
: Event types for real-time agent sessions.
realtime_types.py
: Configuration types for real-time sessions.
For further details, see the source code and related modules.


#####

Should This Code Be Included in an Agent for OpenAI Agent Creation?
Yes, this code is important to include in the file base of an agent that helps with the creation of OpenAI Agents, especially for real-time, streaming, or voice agent scenarios.

Why?
It defines the event types (RealtimeModelEvent and its variants) that represent all possible events emitted by a real-time model, including errors, tool calls, audio events, transcription updates, item updates, connection status, turn boundaries, exceptions, and raw server events.
These event classes are essential for building robust, event-driven real-time agent systems, enabling fine-grained handling of model output, audio playback, tool invocation, and error conditions.
The design is modular and extensible, supporting both standard and vendor-specific events.
These types are foundational for any system that needs to process, display, or respond to real-time model events in dashboards, UIs, or voice applications.
In summary:
This file is foundational for any agent system that needs to support real-time, streaming, or voice-based workflows, and is required for robust event handling and integration.

I will now generate comprehensive markdown documentation for this file, following the guidelines provided.

model_events.py — Realtime Model Event Types for OpenAI Voice/Streaming Agents
File Overview
This file defines the event types emitted by a real-time model in OpenAI-style agent systems. These events cover errors, tool calls, audio events, transcription updates, item updates, connection status changes, turn boundaries, exceptions, and raw server events. The unified RealtimeModelEvent type alias enables ergonomic handling of all event types in event-driven, streaming, or voice agent workflows.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Class/Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RealtimeModelErrorEvent	Represents a transport-layer error.
RealtimeModelToolCallEvent	Model attempted a tool/function call.
RealtimeModelAudioEvent	Raw audio bytes emitted by the model.
RealtimeModelAudioInterruptedEvent	Audio playback interrupted.
RealtimeModelAudioDoneEvent	Audio playback finished.
RealtimeModelInputAudioTranscriptionCompletedEvent	Input audio transcription completed.
RealtimeModelTranscriptDeltaEvent	Partial transcript update.
RealtimeModelItemUpdatedEvent	Item added to the history or updated.
RealtimeModelItemDeletedEvent	Item deleted from the history.
RealtimeModelConnectionStatusEvent	Connection status changed.
RealtimeModelTurnStartedEvent	Model started generating a response for a turn.
RealtimeModelTurnEndedEvent	Model finished generating a response for a turn.
RealtimeModelOtherEvent	Catchall for vendor-specific events.
RealtimeModelExceptionEvent	Exception occurred during model operation.
RealtimeModelRawServerEvent	Raw events forwarded from the server.
RealtimeModelEvent	Type alias for any of the above event types.
Annotated Code Snippets
1. Audio and Tool Call Events
@dataclass
class RealtimeModelAudioEvent:
    data: bytes
    response_id: str
    item_id: str
    content_index: int
    type: Literal["audio"] = "audio"

@dataclass
class RealtimeModelToolCallEvent:
    name: str
    call_id: str
    arguments: str
    id: str | None = None
    previous_item_id: str | None = None
    type: Literal["function_call"] = "function_call"
Explanation:
Covers audio output and tool/function call events from the model.

2. Transcription and Item Events
@dataclass
class RealtimeModelInputAudioTranscriptionCompletedEvent:
    item_id: str
    transcript: str
    type: Literal["input_audio_transcription_completed"] = "input_audio_transcription_completed"

@dataclass
class RealtimeModelTranscriptDeltaEvent:
    item_id: str
    delta: str
    response_id: str
    type: Literal["transcript_delta"] = "transcript_delta"

@dataclass
class RealtimeModelItemUpdatedEvent:
    item: RealtimeItem
    type: Literal["item_updated"] = "item_updated"
Explanation:
Covers transcription completions, transcript deltas, and item updates.

3. Connection and Turn Events
@dataclass
class RealtimeModelConnectionStatusEvent:
    status: RealtimeConnectionStatus
    type: Literal["connection_status"] = "connection_status"

@dataclass
class RealtimeModelTurnStartedEvent:
    type: Literal["turn_started"] = "turn_started"

@dataclass
class RealtimeModelTurnEndedEvent:
    type: Literal["turn_ended"] = "turn_ended"
Explanation:
Covers connection status changes and turn boundaries.

4. Error, Exception, and Raw Events
@dataclass
class RealtimeModelErrorEvent:
    error: Any
    type: Literal["error"] = "error"

@dataclass
class RealtimeModelExceptionEvent:
    exception: Exception
    context: str | None = None
    type: Literal["exception"] = "exception"

@dataclass
class RealtimeModelRawServerEvent:
    data: Any
    type: Literal["raw_server_event"] = "raw_server_event"
Explanation:
Covers error, exception, and raw server events.

5. Unified Event Type
RealtimeModelEvent: TypeAlias = Union[
    RealtimeModelErrorEvent,
    RealtimeModelToolCallEvent,
    RealtimeModelAudioEvent,
    RealtimeModelAudioInterruptedEvent,
    RealtimeModelAudioDoneEvent,
    RealtimeModelInputAudioTranscriptionCompletedEvent,
    RealtimeModelTranscriptDeltaEvent,
    RealtimeModelItemUpdatedEvent,
    RealtimeModelItemDeletedEvent,
    RealtimeModelConnectionStatusEvent,
    RealtimeModelTurnStartedEvent,
    RealtimeModelTurnEndedEvent,
    RealtimeModelOtherEvent,
    RealtimeModelExceptionEvent,
    RealtimeModelRawServerEvent,
]
Explanation:
Unifies all event types for ergonomic handling in event loops or UI frameworks.

Class/Type Reference
RealtimeModelEvent
Purpose: Represents any event emitted by a real-time model.
Variants: See above for all supported event classes.
Example Usage
1. Handling Model Events
def handle_event(event: RealtimeModelEvent):
    if event.type == "audio":
        play_audio(event.data)
    elif event.type == "function_call":
        invoke_tool(event.name, event.arguments)
    elif event.type == "error":
        log_error(event.error)
    # ... handle other event types ...
2. UI Integration
for event in model_event_stream:
    update_ui_with_event(event)
Tips, Gotchas, and FAQ
Extensibility:
You can extend the event system by adding new event classes and updating the RealtimeModelEvent type alias.

Audio Handling:
Use RealtimeModelAudioEvent, RealtimeModelAudioInterruptedEvent, and RealtimeModelAudioDoneEvent to manage audio playback and interruptions.

Error and Exception Handling:
Use RealtimeModelErrorEvent and RealtimeModelExceptionEvent to handle errors and exceptions robustly.

Raw/Vendor Events:
Use RealtimeModelOtherEvent and RealtimeModelRawServerEvent for vendor-specific or unstructured events.

Related Files
realtime_model.py
: Realtime model interface and playback tracking.
realtime_items.py
: Message and tool call item types referenced in item events.
realtime_events.py
: Session-level event types for real-time agent workflows.
For further details, see the source code and related modules.


#####

Should This Code Be Included in an Agent for OpenAI Agent Creation?
Yes, this code is important to include in the file base of an agent that helps with the creation of OpenAI Agents, especially for real-time, streaming, or voice agent scenarios.

Why?
It defines the types and dataclasses for all possible sendable events/messages to a real-time model, including user input, audio, tool outputs, session updates, and interrupts.
The design supports both simple and structured user input, as well as advanced features like tool output and session configuration updates.
These types are foundational for any system that needs to send commands, messages, or updates to a real-time model, enabling robust, type-safe, and extensible communication.
The unified RealtimeModelSendEvent type alias makes it easy to handle all sendable event types in a consistent way.
In summary:
This file is foundational for any agent system that needs to send structured messages, audio, tool outputs, or configuration updates to a real-time model, and is required for robust real-time agent communication.

I will now generate comprehensive markdown documentation for this file, following the guidelines provided.

model_inputs.py — Sendable Event Types for Realtime OpenAI Models
File Overview
This file defines the types and dataclasses for all possible events/messages that can be sent to a real-time model in OpenAI agent systems. It includes user input (text or structured), audio, tool outputs, session updates, and interrupts. These types are foundational for robust, type-safe, and extensible communication with real-time, streaming, or voice models.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Class/Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RealtimeModelRawClientMessage	TypedDict for sending raw messages to the model.
RealtimeModelInputTextContent	TypedDict for sending a piece of text to the model.
RealtimeModelUserInputMessage	TypedDict for sending a structured user message.
RealtimeModelUserInput	Type alias for user input (string or structured message).
RealtimeModelSendRawMessage	Dataclass for sending a raw message.
RealtimeModelSendUserInput	Dataclass for sending user input.
RealtimeModelSendAudio	Dataclass for sending audio data.
RealtimeModelSendToolOutput	Dataclass for sending tool output.
RealtimeModelSendInterrupt	Dataclass for sending an interrupt signal.
RealtimeModelSendSessionUpdate	Dataclass for sending session configuration updates.
RealtimeModelSendEvent	Type alias for any of the above sendable event types.
Annotated Code Snippets
1. User Input Types
class RealtimeModelRawClientMessage(TypedDict):
    type: str  # explicitly required
    other_data: NotRequired[dict[str, Any]]

class RealtimeModelInputTextContent(TypedDict):
    type: Literal["input_text"]
    text: str

class RealtimeModelUserInputMessage(TypedDict):
    type: Literal["message"]
    role: Literal["user"]
    content: list[RealtimeModelInputTextContent]

RealtimeModelUserInput: TypeAlias = Union[str, RealtimeModelUserInputMessage]
Explanation:
Defines raw, text, and structured user input formats for sending to the model.

2. Sendable Event Dataclasses
@dataclass
class RealtimeModelSendRawMessage:
    message: RealtimeModelRawClientMessage

@dataclass
class RealtimeModelSendUserInput:
    user_input: RealtimeModelUserInput

@dataclass
class RealtimeModelSendAudio:
    audio: bytes
    commit: bool = False

@dataclass
class RealtimeModelSendToolOutput:
    tool_call: RealtimeModelToolCallEvent
    output: str
    start_response: bool

@dataclass
class RealtimeModelSendInterrupt:
    pass

@dataclass
class RealtimeModelSendSessionUpdate:
    session_settings: RealtimeSessionModelSettings
Explanation:

Each dataclass represents a specific kind of message/event that can be sent to the model.
Covers raw messages, user input, audio, tool output, interrupts, and session updates.
3. Unified Send Event Type
RealtimeModelSendEvent: TypeAlias = Union[
    RealtimeModelSendRawMessage,
    RealtimeModelSendUserInput,
    RealtimeModelSendAudio,
    RealtimeModelSendToolOutput,
    RealtimeModelSendInterrupt,
    RealtimeModelSendSessionUpdate,
]
Explanation:
Unifies all sendable event types for ergonomic handling in code that sends events to the model.

Class/Type Reference
RealtimeModelSendEvent
Purpose: Represents any event/message that can be sent to a real-time model.
Variants: See above for all supported dataclasses and TypedDicts.
Example Usage
1. Sending a Structured User Input
msg = RealtimeModelSendUserInput(
    user_input={
        "type": "message",
        "role": "user",
        "content": [{"type": "input_text", "text": "Hello, agent!"}]
    }
)
await model.send_event(msg)
2. Sending Audio
audio_event = RealtimeModelSendAudio(audio=b"...", commit=True)
await model.send_event(audio_event)
3. Sending Tool Output
tool_output = RealtimeModelSendToolOutput(
    tool_call=tool_call_event,
    output="42",
    start_response=True
)
await model.send_event(tool_output)
4. Sending a Session Update
session_update = RealtimeModelSendSessionUpdate(session_settings=my_settings)
await model.send_event(session_update)
Tips, Gotchas, and FAQ
User Input Flexibility:
User input can be a simple string or a structured message with content items.

Audio Commit:
The commit flag in RealtimeModelSendAudio can be used to indicate end of audio input.

Tool Output:
Use RealtimeModelSendToolOutput to send the result of a tool/function call back to the model.

Session Updates:
Use RealtimeModelSendSessionUpdate to update session configuration (e.g., model settings) on the fly.

Related Files
realtime_model.py
: Model interface that receives these events.
model_events.py
: Event types that the model emits in response.
config.py
: Session model settings referenced in session updates.
For further details, see the source code and related modules.


#####

Should This Code Be Included in an Agent for OpenAI Agent Creation?
Yes, this code is important to include in the file base of an agent that helps with the creation of OpenAI Agents, especially for real-time, streaming, or voice agent scenarios.

Why?
It provides a concrete implementation (OpenAIRealtimeWebSocketModel) of the RealtimeModel interface, enabling connection to OpenAI's WebSocket API for real-time, streaming, or voice agent workflows.
The class manages the WebSocket connection, event sending/receiving, session configuration, tool integration, audio playback tracking, and error handling.
It supports all major real-time agent features: user input, audio, tool calls, session updates, tracing, and event-driven programming.
The _ConversionHelper class handles conversion between internal agent types and OpenAI's WebSocket API types, ensuring robust, type-safe communication.
This is foundational for any agent system that needs to interact with OpenAI's real-time API, especially for voice, streaming, or multimodal agents.
In summary:
This file is foundational for any agent system that needs to connect to OpenAI's real-time WebSocket API, and is required for robust, production-grade real-time agent integration.

I will now generate comprehensive markdown documentation for this file, following the guidelines provided.

openai_realtime_ws.py — OpenAI Realtime WebSocket Model Integration
File Overview
This file provides a concrete implementation of the RealtimeModel interface for connecting to OpenAI's Realtime WebSocket API. The OpenAIRealtimeWebSocketModel class manages the WebSocket connection, event sending and receiving, session configuration, tool integration, audio playback tracking, and error handling. It supports all major real-time agent features, including user input, audio, tool calls, session updates, tracing, and event-driven programming. The _ConversionHelper class handles conversion between internal agent types and OpenAI's WebSocket API types, ensuring robust, type-safe communication.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Class/Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
OpenAIRealtimeWebSocketModel	Concrete implementation of RealtimeModel for OpenAI's WebSocket API.
_ConversionHelper	Utility class for converting between agent types and OpenAI WebSocket API types.
DEFAULT_MODEL_SETTINGS	Default model/session settings for real-time connections.
get_api_key	Utility function to resolve API key from string, callable, or environment variable.
Annotated Code Snippets
1. OpenAIRealtimeWebSocketModel: Core Implementation
class OpenAIRealtimeWebSocketModel(RealtimeModel):
    def __init__(self) -> None:
        ...
    async def connect(self, options: RealtimeModelConfig) -> None:
        ...
    def add_listener(self, listener: RealtimeModelListener) -> None:
        ...
    def remove_listener(self, listener: RealtimeModelListener) -> None:
        ...
    async def send_event(self, event: RealtimeModelSendEvent) -> None:
        ...
    async def close(self) -> None:
        ...
    # ... many internal methods for event handling, session config, etc.
Explanation:

Manages the WebSocket connection, event loop, listeners, and session state.
Handles all event types: user input, audio, tool output, interrupts, session updates.
Integrates playback tracking and session configuration.
2. Event Handling and Conversion
class _ConversionHelper:
    @classmethod
    def conversation_item_to_realtime_message_item(cls, item, previous_item_id): ...
    @classmethod
    def try_convert_raw_message(cls, message): ...
    @classmethod
    def convert_tracing_config(cls, tracing_config): ...
    @classmethod
    def convert_user_input_to_conversation_item(cls, event): ...
    @classmethod
    def convert_user_input_to_item_create(cls, event): ...
    @classmethod
    def convert_audio_to_input_audio_buffer_append(cls, event): ...
    @classmethod
    def convert_tool_output(cls, event): ...
    @classmethod
    def convert_interrupt(cls, current_item_id, current_audio_content_index, elapsed_time_ms): ...
Explanation:

Converts between internal agent types and OpenAI WebSocket API types for robust, type-safe communication.
3. Default Model Settings
DEFAULT_MODEL_SETTINGS: RealtimeSessionModelSettings = {
    "voice": "ash",
    "modalities": ["text", "audio"],
    "input_audio_format": "pcm16",
    "output_audio_format": "pcm16",
    "input_audio_transcription": {
        "model": "gpt-4o-mini-transcribe",
    },
    "turn_detection": {"type": "semantic_vad"},
}
Explanation:

Provides sensible defaults for real-time agent sessions.
Class/Type Reference
OpenAIRealtimeWebSocketModel
Purpose: Implements the RealtimeModel interface for OpenAI's WebSocket API.
Key Methods:
connect(options): Establishes the WebSocket connection and configures the session.
add_listener(listener): Adds an event listener.
remove_listener(listener): Removes an event listener.
send_event(event): Sends an event (user input, audio, tool output, etc.) to the model.
close(): Closes the WebSocket connection and cleans up resources.
Internal Methods: Handle event parsing, session updates, playback tracking, and error handling.
_ConversionHelper
Purpose: Converts between internal agent types and OpenAI WebSocket API types.
Key Methods: See above.
get_api_key
Purpose: Resolves the API key from a string, callable, or environment variable.
Example Usage
1. Connecting to the Realtime WebSocket Model
model = OpenAIRealtimeWebSocketModel()
await model.connect({
    "api_key": "sk-...",
    "initial_model_settings": {
        "voice": "alloy",
        "modalities": ["text", "audio"],
        # ... other settings ...
    }
})
2. Sending User Input
await model.send_event(RealtimeModelSendUserInput(user_input="Hello, agent!"))
3. Handling Events
class MyListener(RealtimeModelListener):
    async def on_event(self, event):
        print("Received event:", event)

model.add_listener(MyListener())
4. Sending Audio
await model.send_event(RealtimeModelSendAudio(audio=b"...", commit=True))
Tips, Gotchas, and FAQ
API Key:
Always provide a valid API key, or ensure OPENAI_API_KEY is set in the environment.

Session Configuration:
Use initial_model_settings to customize voice, modalities, audio formats, and more.

Tool Integration:
Only function tools and handoffs are supported as tools in the session.

Event Handling:
Implement RealtimeModelListener to handle events emitted by the model.

Error Handling:
Errors and exceptions are emitted as events and 
#####

Should be handled by listeners.

Related Files
realtime_model.py
: Model interface implemented by this class.
model_events.py
: Event types emitted by the model.
model_inputs.py
: Event types sent to the model.
config.py
: Session model settings used in configuration.
For further details, see the source code and related modules.


#####

Should This Code Be Included in an Agent for OpenAI Agent Creation?
Yes, this code is important to include in the file base of an agent that helps with the creation of OpenAI Agents, especially for real-time, streaming, or voice agent scenarios.

Why?
It defines the RealtimeRunner class, which is the real-time, streaming, or voice agent equivalent of the standard Runner class for text-based agents.
The RealtimeRunner manages the session lifecycle, persistent model connection, tool execution, guardrails, and agent handoffs for real-time agents.
It is the main entry point for starting and managing real-time agent sessions, providing a high-level, ergonomic API for developers.
The design is modular and extensible, supporting custom real-time model layers and configuration.
In summary:
This file is foundational for any agent system that needs to support real-time, streaming, or voice-based agent workflows, and is required for robust session management and orchestration.

I will now generate comprehensive markdown documentation for this file, following the guidelines provided.

realtime_runner.py — Realtime Runner for Voice and Streaming OpenAI Agents
File Overview
This file defines the RealtimeRunner class, the real-time/voice agent equivalent of the standard Runner for text-based agents. It manages the session lifecycle, persistent model connection, tool execution, guardrails, and agent handoffs for real-time agents. This is the main entry point for starting and managing real-time agent sessions, providing a high-level, ergonomic API for developers building voice, streaming, or interactive agents.

Table of Contents
Key Class
Annotated Code Snippet
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Class
Name	Purpose
RealtimeRunner	Orchestrates the lifecycle and session management for real-time/voice agent workflows.
Annotated Code Snippet
class RealtimeRunner:
    """A `RealtimeRunner` is the equivalent of `Runner` for realtime agents. It automatically
    handles multiple turns by maintaining a persistent connection with the underlying model
    layer.

    The session manages the local history copy, executes tools, runs guardrails and facilitates
    handoffs between agents.

    Since this code runs on your server, it uses WebSockets by default. You can optionally create
    your own custom model layer by implementing the `RealtimeModel` interface.
    """

    def __init__(
        self,
        starting_agent: RealtimeAgent,
        *,
        model: RealtimeModel | None = None,
        config: RealtimeRunConfig | None = None,
    ) -> None:
        ...
        self._starting_agent = starting_agent
        self._config = config
        self._model = model or OpenAIRealtimeWebSocketModel()

    async def run(
        self, *, context: TContext | None = None, model_config: RealtimeModelConfig | None = None
    ) -> RealtimeSession:
        """Start and returns a realtime session.

        Returns:
            RealtimeSession: A session object that allows bidirectional communication with the
            realtime model.

        Example:
            ```python
            runner = RealtimeRunner(agent)
            async with await runner.run() as session:
                await session.send_message("Hello")
                async for event in session:
                    print(event)
            ```
        """
        session = RealtimeSession(
            model=self._model,
            agent=self._starting_agent,
            context=context,
            model_config=model_config,
            run_config=self._config,
        )
        return session
Explanation:

Handles persistent model connection and session lifecycle for real-time agents.
Manages agent handoffs, tool execution, and guardrails.
Returns a RealtimeSession object for bidirectional communication and event streaming.
Function/Class Reference
RealtimeRunner
Purpose: Orchestrates real-time agent sessions, managing persistent model connections, session state, tools, guardrails, and handoffs.
Constructor Parameters:
starting_agent: The initial RealtimeAgent to start the session with.
model: (Optional) Custom real-time model implementation. Defaults to OpenAI's WebSocket model.
config: (Optional) Run configuration for the session.
Key Method:
async run(context=None, model_config=None) -> RealtimeSession: Starts a real-time session and returns a RealtimeSession object for communication and event streaming.
Example Usage
1. Running a Realtime Agent Session
runner = RealtimeRunner(my_realtime_agent)
async with await runner.run() as session:
    await session.send_message("Hello, agent!")
    async for event in session:
        print(event)
2. Using a Custom Model Layer
my_model = MyCustomRealtimeModel()
runner = RealtimeRunner(my_realtime_agent, model=my_model)
session = await runner.run()
Tips, Gotchas, and FAQ
Persistent Connection:
The runner maintains a persistent connection with the model for low-latency, interactive sessions.

Custom Model Support:
You can provide your own RealtimeModel implementation for advanced or non-OpenAI use cases.

Session Management:
The returned RealtimeSession object allows for bidirectional communication and event streaming.

Guardrails and Handoffs:
The session manages tool execution, guardrails, and agent handoffs automatically.

Related Files
realtime_agent.py
: Realtime agent class used as the starting agent.
openai_realtime.py
: Default OpenAI WebSocket model implementation.
session.py
: Realtime session class for bidirectional communication.
model.py
: Realtime model interface for custom model layers.
For further details, see the source code and related modules.


#####

Should This Code Be Included in an Agent for OpenAI Agent Creation?
Yes, this code is very important to include in the file base of an agent that helps with the creation of OpenAI Agents, especially for real-time, streaming, or voice agent scenarios.

Why?
It defines the RealtimeSession class, which manages the lifecycle, event streaming, message/audio sending, tool execution, handoffs, and guardrails for real-time agent sessions.
The session acts as the main interface for interacting with a real-time model, handling bidirectional communication, event streaming, and state management.
It supports advanced features such as guardrail debouncing, dynamic agent handoffs, tool invocation, and robust error/event handling.
This is the core session management logic for any real-time, streaming, or voice agent system.
In summary:
This file is foundational for any agent system that needs to support real-time, streaming, or voice-based workflows, and is required for robust session management, event streaming, and agent orchestration.

I will now generate comprehensive markdown documentation for this file, following the guidelines provided.

realtime_session.py — Realtime Session Management for Voice/Streaming OpenAI Agents
File Overview
This file defines the RealtimeSession class, which manages the lifecycle, event streaming, message/audio sending, tool execution, handoffs, and guardrails for real-time agent sessions. It acts as the main interface for interacting with a real-time model, handling bidirectional communication, event streaming, and state management. This class is foundational for building robust, interactive, and production-grade real-time, streaming, or voice agent systems.

Table of Contents
Key Class
Annotated Code Snippet
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Class
Name	Purpose
RealtimeSession	Manages the lifecycle, event streaming, message/audio sending, tools, handoffs, and guardrails for real-time agent sessions.
Annotated Code Snippet
class RealtimeSession(RealtimeModelListener):
    """A connection to a realtime model. It streams events from the model to you, and allows you to
    send messages and audio to the model.
    """

    def __init__(
        self,
        model: RealtimeModel,
        agent: RealtimeAgent,
        context: TContext | None,
        model_config: RealtimeModelConfig | None = None,
        run_config: RealtimeRunConfig | None = None,
    ) -> None:
        ...
        self._model = model
        self._current_agent = agent
        self._context_wrapper = RunContextWrapper(context)
        self._event_info = RealtimeEventInfo(context=self._context_wrapper)
        self._history: list[RealtimeItem] = []
        self._model_config = model_config or {}
        self._run_config = run_config or {}
        self._event_queue: asyncio.Queue[RealtimeSessionEvent] = asyncio.Queue()
        self._closed = False
        self._stored_exception: Exception | None = None
        # ... guardrail and transcript state ...
Explanation:

Initializes the session with the model, agent, context, configuration, and event queue.
Tracks session history, guardrail state, and manages event streaming.
Function/Class Reference
RealtimeSession
Purpose: Manages the lifecycle and communication for a real-time agent session.
Constructor Parameters:
model: The real-time model to use.
agent: The current RealtimeAgent.
context: The user-defined context object.
model_config: Model configuration.
run_config: Runtime configuration (guardrails, etc.).
Key Methods:
async __aenter__(): Starts the session, connects to the model, and emits the initial history.
async __aexit__(): Cleans up resources and closes the session.
async __aiter__(): Streams events from the session.
async send_message(message): Sends a user message to the model.
async send_audio(audio, commit=False): Sends audio data to the model.
async interrupt(): Sends an interrupt to the model.
async on_event(event): Handles incoming model events and updates session state.
async close(): Cleans up and closes the session.
Example Usage
1. Running a Realtime Session
runner = RealtimeRunner(my_realtime_agent)
async with await runner.run() as session:
    await session.send_message("Hello, agent!")
    async for event in session:
        print(event)
2. Sending Audio
await session.send_audio(audio_bytes, commit=True)
3. Handling Events
async for event in session:
    if event.type == "audio":
        play_audio(event.audio)
    elif event.type == "guardrail_tripped":
        alert_user(event.message)
Tips, Gotchas, and FAQ
Async Context Manager:
Always use the async context manager (async with await runner.run() as session) to ensure proper resource management.

Event Streaming:
Use async for event in session to stream events in real time.

Guardrails:
Guardrails are debounced and run in the background; interruptions are handled automatically.

Agent Handoffs:
The session supports dynamic agent handoffs and updates model settings as needed.

Error Handling:
Exceptions are stored and raised during event streaming for robust error propagation.

Related Files
realtime_runner.py
: Entry point for starting a real-time session.
realtime_agent.py
: Realtime agent class used in the session.
model.py
: Realtime model interface.
events.py
: Event types emitted by the session.
For further details, see the source code and related modules.


#####

Should These Files Be Included in an Agent for OpenAI Agent Creation?
Yes, all three of these files are useful and relevant for inclusion in an agent system that helps with the creation of OpenAI Agents. Here’s why for each:

1. Handoff Input Filters (remove_all_tools and helpers)
Purpose: Provides utility functions for filtering out tool-related items from handoff input data, which is essential for controlling what context/history is passed to sub-agents during a handoff.
Why include: This is a best-practice utility for multi-agent systems, ensuring that only relevant context is passed during delegation, and avoiding tool-call clutter.
2. Prompt Utilities for Handoffs
Purpose: Supplies a recommended prompt prefix and a helper function to prepend it to agent prompts, ensuring that agents using handoffs are given clear, consistent system instructions.
Why include: Good prompt hygiene is critical for multi-agent coordination, and this utility helps enforce best practices for handoff-aware agents.
3. Agent Graph Visualization (draw_graph, get_main_graph, etc.)
Purpose: Provides functions to generate a DOT/Graphviz representation of an agent’s structure, including its tools and handoffs, and to render/save the graph as an image.
Why include: Visualization is extremely valuable for debugging, documentation, and understanding complex agent workflows, especially in multi-agent or tool-rich systems.
In summary:
All three files are practical, reusable utilities for agent orchestration, prompt management, and visualization, and are recommended for inclusion in any robust OpenAI agent framework.

I will now generate comprehensive markdown documentation for all three files, following the guidelines provided.
Documentation for Provided Utilities
1. handoff_input_filters.py — Common Handoff Input Filters
File Overview
This file provides utility functions for filtering tool-related items from the input data passed during agent handoffs. This is useful for controlling the context/history that is passed to sub-agents, ensuring that only relevant conversation items are included and tool-call clutter is removed.

Key Functions
remove_all_tools(handoff_input_data: HandoffInputData) -> HandoffInputData
Purpose: Removes all tool-related items (file search, web search, function calls, and their outputs) from the handoff input data.
Parameters:
handoff_input_data: The original input data for the handoff.
Returns:
A new HandoffInputData object with tool items filtered out from history, pre-handoff items, and new items.
Internal Helpers
_remove_tools_from_items(items: tuple[RunItem, ...]) -> tuple[RunItem, ...]
Filters out all tool-related RunItem types.
_remove_tool_types_from_input(items: tuple[TResponseInputItem, ...]) -> tuple[TResponseInputItem, ...]
Filters out all tool-related input items based on their "type" field.
Example Usage
filtered_data = remove_all_tools(handoff_input_data)
Tips
Use this filter when you want to ensure sub-agents receive only conversational context, not tool call history.
2. handoff_prompt_utils.py — Prompt Utilities for Handoff-Aware Agents
File Overview
This file provides a recommended prompt prefix and a utility function to prepend it to agent prompts. This ensures that agents using handoffs have clear, consistent system instructions about the multi-agent environment and handoff mechanics.

Key Constants and Functions
RECOMMENDED_PROMPT_PREFIX
Purpose: A string containing recommended system instructions for agents that use handoffs.
Usage: Prepend this to your agent’s prompt to ensure proper handoff behavior.
prompt_with_handoff_instructions(prompt: str) -> str
Purpose: Prepends the recommended handoff instructions to a given prompt.
Parameters:
prompt: The original agent prompt.
Returns:
The prompt with handoff instructions prepended.
Example Usage
agent_prompt = prompt_with_handoff_instructions("You are a helpful assistant.")
Tips
Always use this or similar instructions for agents that may perform handoffs, to ensure LLMs handle delegation correctly.
3. agent_graphviz.py — Agent Structure Visualization with Graphviz
File Overview
This file provides functions to generate and render a DOT/Graphviz representation of an agent’s structure, including its tools and handoffs. This is useful for debugging, documentation, and understanding complex agent workflows.

Key Functions
get_main_graph(agent: Agent) -> str
Purpose: Generates the main DOT graph structure for the given agent.
Returns: DOT format string.
get_all_nodes(agent: Agent, parent: Agent | None = None, visited: set[str] | None = None) -> str
Purpose: Recursively generates DOT nodes for the agent and its handoffs.
Returns: DOT format string for nodes.
get_all_edges(agent: Agent, parent: Agent | None = None, visited: set[str] | None = None) -> str
Purpose: Recursively generates DOT edges for the agent and its handoffs/tools.
Returns: DOT format string for edges.
draw_graph(agent: Agent, filename: str | None = None) -> graphviz.Source
Purpose: Draws and optionally saves the agent graph as a PNG file.
Parameters:
agent: The agent to visualize.
filename: Optional filename to save the PNG.
Returns: graphviz.Source object.
Example Usage
from agent_graphviz import draw_graph

graph = draw_graph(my_agent, filename="agent_structure")
graph.view()  # Opens the rendered image
Tips
Use this visualization to debug agent handoff/tool relationships and to document your agent architectures.
The graph includes start/end nodes, agent nodes, tool nodes, and handoff relationships.
Related Files
agents.py
: Where agent, tool, and handoff classes are defined.
handoffs.py
: Handoff logic and input data structures.
tool.py
: Tool abstractions and types.
For further details, see the source code and related modules.


#####

Should These Files Be Included in an Agent for OpenAI Agent Creation?
Yes, both of these files are important for inclusion in an agent system that helps with the creation of OpenAI Agents, especially if you want to support Model Context Protocol (MCP) tool integration. Here’s why for each:

1. MCP Server Implementations (MCPServer, MCPServerStdio, MCPServerSse, MCPServerStreamableHttp, etc.)
Purpose: Provides abstract and concrete classes for connecting to MCP servers via various transports (stdio, SSE, streamable HTTP), managing tool listing, invocation, prompt management, and session lifecycle.
Why include: These classes are essential for integrating external tool servers (MCP-compliant) into your agent system, enabling dynamic tool discovery, invocation, and prompt management. They support advanced features like tool filtering (static and dynamic), caching, and robust connection management.
2. MCP Utility Functions and Tool Filtering (MCPUtil, ToolFilterContext, create_static_tool_filter, etc.)
Purpose: Supplies utility functions for converting MCP tools to agent-compatible tools, invoking MCP tools, and applying static/dynamic tool filters.
Why include: These utilities are crucial for seamless interoperability between MCP tools and your agent framework, allowing for both static (allow/block list) and dynamic (function-based) tool filtering, robust error handling, and schema conversion.
In summary:
Both files are foundational for any agent system that wants to support dynamic, protocol-based tool integration (via MCP), advanced tool filtering, and robust tool invocation. They are highly recommended for inclusion in any serious OpenAI agent platform.

I will now generate comprehensive markdown documentation for both files, following the guidelines provided.
Documentation for MCP Integration Utilities
1. mcp_server.py — MCP Server Implementations for Tool Integration
File Overview
This file provides abstract and concrete classes for connecting to Model Context Protocol (MCP) servers using various transports (stdio, SSE, streamable HTTP). It manages tool listing, invocation, prompt management, session lifecycle, and supports advanced features like tool filtering and caching.

Key Classes
MCPServer (abstract base class)
Purpose: Defines the interface for MCP servers, including connection management, tool listing, tool invocation, and prompt management.
Key Methods:
connect(), cleanup(): Manage server connection lifecycle.
list_tools(run_context, agent): List available tools.
call_tool(tool_name, arguments): Invoke a tool.
list_prompts(), get_prompt(name, arguments): Prompt management.
_MCPServerWithClientSession (abstract base class)
Purpose: Base for MCP servers using a ClientSession for communication, with support for tool filtering (static/dynamic), caching, and connection management.
Key Features:
Tool filtering via static allow/block lists or dynamic callables.
Tool list caching for performance.
Robust connection and cleanup logic.
MCPServerStdio, MCPServerSse, MCPServerStreamableHttp
Purpose: Concrete implementations for stdio, SSE, and streamable HTTP transports, respectively.
Parameters: Each accepts transport-specific parameters, tool filtering options, and caching configuration.
Key Method: create_streams() for establishing the underlying transport.
Example Usage
server = MCPServerStdio(
    params={"command": "python", "args": ["my_server.py"]},
    cache_tools_list=True,
    tool_filter=create_static_tool_filter(allowed_tool_names=["search", "summarize"])
)
await server.connect()
tools = await server.list_tools(run_context, agent)
result = await server.call_tool("search", {"query": "OpenAI"})
await server.cleanup()
Tips
Use tool filtering to control which tools are exposed to agents, either statically or dynamically.
Enable tool list caching for performance if your server's tool list is stable.
Always call connect() before using the server, and cleanup() when done.
2. mcp_util.py — MCP Utility Functions and Tool Filtering
File Overview
This file provides utility functions for converting MCP tools to agent-compatible tools, invoking MCP tools, and applying static/dynamic tool filters. It also includes helper types and context classes for tool filtering.

Key Classes and Functions
ToolFilterContext
Purpose: Provides context (run context, agent, server name) to dynamic tool filter functions.
ToolFilterCallable, ToolFilterStatic, ToolFilter
Purpose: Type definitions for tool filters:
Callable: Function-based dynamic filtering.
Static: Allow/block list filtering.
Union: Accepts either or None.
create_static_tool_filter(allowed_tool_names=None, blocked_tool_names=None)
Purpose: Convenience function for creating a static tool filter.
MCPUtil
Purpose: Utility class for MCP/Agents SDK interop.
Key Methods:
get_all_function_tools(servers, convert_schemas_to_strict, run_context, agent): Collects all tools from multiple servers, ensuring no name conflicts.
get_function_tools(server, convert_schemas_to_strict, run_context, agent): Collects tools from a single server.
to_function_tool(tool, server, convert_schemas_to_strict): Converts an MCP tool to a FunctionTool.
invoke_mcp_tool(server, tool, context, input_json): Invokes an MCP tool and returns the result as a string.
Example Usage
filter_ctx = ToolFilterContext(run_context, agent, server_name="my_server")
def dynamic_filter(ctx, tool):
    return tool.name.startswith("safe_")

tool_filter = dynamic_filter
server = MCPServerStdio(..., tool_filter=tool_filter)

tools = await MCPUtil.get_all_function_tools([server], True, run_context, agent)
Tips
Use ensure_strict_json_schema to convert tool schemas for OpenAI compatibility.
Dynamic tool filters can use any context (run context, agent, server name) for advanced filtering logic.
invoke_mcp_tool handles JSON parsing, error handling, and output formatting for you.
Related Files
tool.py
: Where FunctionTool and Tool abstractions are defined.
agent.py
: Agent and AgentBase classes.
run_context.py
: Run context wrappers.
exceptions.py
: Custom error types for robust error handling.
For further details, see the source code and related modules.


#####

Should This File Be Included in an Agent for OpenAI Agent Creation?
Yes, this file is important to include in the file base of an agent that helps with the creation of OpenAI Agents.

Why?
It defines a protocol (Session) and abstract base class (SessionABC) for session (memory) management, allowing agents to persist and retrieve conversation history across turns and sessions.
It provides a concrete implementation (SQLiteSession) for storing session data in SQLite, supporting both in-memory and persistent storage.
This enables agents to maintain context, support long conversations, and implement features like session recall, history truncation, and memory clearing.
The design is asynchronous and thread-safe, suitable for both production and development environments.
In summary:
This file is foundational for any agent system that needs to maintain conversation history, support session-based memory, or provide persistent agent context.

I will now generate comprehensive markdown documentation for this file, following the guidelines provided.

memory.py — Session and Conversation Memory Management for OpenAI Agents
File Overview
This file defines protocols, abstract base classes, and a concrete implementation for session (memory) management in OpenAI agent systems. It enables agents to persist and retrieve conversation history across turns and sessions, supporting both in-memory and persistent (SQLite) storage. This is essential for maintaining context, supporting long conversations, and implementing session-based memory features.

Table of Contents
Key Classes and Protocols
Annotated Code Snippet
Class/Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Protocols
Name	Purpose
Session	Protocol for session implementations (async, for conversation memory).
SessionABC	Abstract base class for session implementations (internal use or subclassing).
SQLiteSession	Concrete implementation of session storage using SQLite (in-memory or file-based).
Annotated Code Snippet
@runtime_checkable
class Session(Protocol):
    session_id: str

    async def get_items(self, limit: int | None = None) -> list[TResponseInputItem]: ...
    async def add_items(self, items: list[TResponseInputItem]) -> None: ...
    async def pop_item(self) -> TResponseInputItem | None: ...
    async def clear_session(self) -> None: ...
Explanation:

Session protocol defines the required async methods for any session implementation: retrieving, adding, popping, and clearing conversation items.
SQLiteSession Implementation
class SQLiteSession(SessionABC):
    def __init__(
        self,
        session_id: str,
        db_path: str | Path = ":memory:",
        sessions_table: str = "agent_sessions",
        messages_table: str = "agent_messages",
    ):
        ...
    async def get_items(self, limit: int | None = None) -> list[TResponseInputItem]: ...
    async def add_items(self, items: list[TResponseInputItem]) -> None: ...
    async def pop_item(self) -> TResponseInputItem | None: ...
    async def clear_session(self) -> None: ...
    def close(self) -> None: ...
Explanation:

Stores conversation history in SQLite, supporting both in-memory and file-based databases.
Provides thread-safe, asynchronous methods for all session operations.
Handles schema creation, connection management, and concurrency.
Class/Type Reference
Session (Protocol)
Purpose: Defines the interface for session/memory implementations.
Key Methods:
get_items(limit=None): Retrieve conversation history (optionally limited to N most recent).
add_items(items): Add new items to the session.
pop_item(): Remove and return the most recent item.
clear_session(): Clear all items for the session.
SessionABC (Abstract Base Class)
Purpose: Abstract base class for session implementations; provides the same interface as Session.
SQLiteSession
Purpose: Concrete, thread-safe, async implementation using SQLite.
Constructor Parameters:
session_id: Unique identifier for the session.
db_path: Path to the SQLite database file (default :memory: for in-memory).
sessions_table, messages_table: Table names for session and message storage.
Key Methods: Implements all required session methods, plus close() for cleanup.
Example Usage
1. Creating and Using a SQLiteSession
session = SQLiteSession(session_id="user123", db_path="my_sessions.db")
await session.add_items([{"role": "user", "content": "Hello"}])
history = await session.get_items()
await session.clear_session()
session.close()
2. Using with an Agent
result = await Runner.run(agent, input="Hi", session=session)
Tips, Gotchas, and FAQ
In-Memory vs. File-Based:
Use db_path=":memory:" for ephemeral sessions, or a file path for persistent storage.

Thread Safety:
The implementation uses thread-local connections for file databases and a shared connection for in-memory databases.

Async Methods:
All session methods are async and thread-safe, suitable for use in async agent frameworks.

Schema Management:
The schema is created automatically if it does not exist.

Related Files
run.py
: Uses session objects for conversation memory.
items.py
: Defines TResponseInputItem used in session storage.
agent.py
: Agents can be configured to use session memory.
For further details, see the source code and related modules.

#####

Documentation for OpenAI Model Integration and Session Management
1. openai_responses.py — OpenAI Responses API Model Integration
File Overview
Implements the Model interface for the OpenAI Responses API, supporting both batch and streaming responses, tool-calling, handoffs, schema conversion, and robust error/tracing support.

Key Classes
OpenAIResponsesModel
Purpose: Implements the Model interface for OpenAI’s Responses API.
Key Methods:
get_response(...): Calls the API and returns a ModelResponse.
stream_response(...): Streams response events as they are generated.
Features:
Handles tool-calling, handoffs, and output schema conversion.
Supports tracing and error handling.
Converter
Purpose: Helper class for converting agent tools, handoffs, and output schemas to OpenAI API-compatible formats.
Example Usage
model = OpenAIResponsesModel(model="gpt-4o", openai_client=AsyncOpenAI(api_key="sk-..."))
response = await model.get_response(
    system_instructions="You are a helpful assistant.",
    input="Hello!",
    model_settings=...,
    tools=[...],
    output_schema=...,
    handoffs=[...],
    tracing=ModelTracing.ENABLED,
    previous_response_id=None,
    prompt=None,
)
2. openai_provider.py — OpenAI Model Provider
File Overview
Defines the OpenAIProvider class, which implements the ModelProvider interface for OpenAI models. Manages API key, client, and model selection (including Responses API vs. Chat Completions).

Key Classes
OpenAIProvider
Purpose: Looks up and returns Model instances for OpenAI models.
Key Methods:
get_model(model_name): Returns a model instance for the given name.
shared_http_client()
Purpose: Returns a shared HTTP client for efficient connection pooling.
Example Usage
provider = OpenAIProvider(api_key="sk-...")
model = provider.get_model("gpt-4o")
3. interface.py — Model and Provider Abstractions
File Overview
Defines abstract base classes for model and model provider interfaces, including tracing configuration and streaming support.

Key Classes
ModelTracing (enum)
Purpose: Configures tracing (disabled, enabled, enabled without data).
Model (abstract base class)
Purpose: Interface for LLM models.
Key Methods: get_response(...), stream_response(...)
ModelProvider (abstract base class)
Purpose: Interface for model providers.
Key Method: get_model(model_name)
4. openai_shared.py — OpenAI Client and API Key Management
File Overview
Manages global/shared OpenAI client and API key, as well as default settings for using the Responses API.

Key Functions
set_default_openai_key(key), get_default_openai_key()
set_default_openai_client(client), get_default_openai_client()
set_use_responses_by_default(use_responses), get_use_responses_by_default()
Example Usage
from openai import AsyncOpenAI
from .openai_shared import set_default_openai_key, get_default_openai_client

set_default_openai_key("sk-...")
client = get_default_openai_client() or AsyncOpenAI(api_key="sk-...")
5. memory.py — Session and Conversation Memory Management
File Overview
Defines protocols, abstract base classes, and a concrete implementation for session (memory) management, supporting both in-memory and persistent (SQLite) storage.

Key Classes
Session (Protocol)
Purpose: Interface for session/memory implementations.
SessionABC (Abstract Base Class)
Purpose: Abstract base class for session implementations.
SQLiteSession
Purpose: Concrete, thread-safe, async implementation using SQLite.
Key Methods: get_items, add_items, pop_item, clear_session, close
Example Usage
session = SQLiteSession(session_id="user123", db_path="my_sessions.db")
await session.add_items([{"role": "user", "content": "Hello"}])
history = await session.get_items()
await session.clear_session()
session.close()
Related Files
tool.py
: Tool abstractions and types.
agent.py
: Agent and agent orchestration logic.
run.py
: Agent runner logic that uses models and sessions.
items.py
: Defines TResponseInputItem used in session storage.
For further details, see the source code and related modules.


#####

Should These Files Be Included in an Agent for OpenAI Agent Creation?
Yes, all of these files are important for inclusion in an agent system that helps with the creation of OpenAI Agents, especially for voice, audio, and speech-to-text/text-to-speech (STT/TTS) support. Here’s why for each:

1. Voice Stream Events and Audio Input/Output Types
Purpose: Defines event types for streaming audio and lifecycle events from a voice pipeline, as well as audio input utilities for static and streamed audio.
Why include: These are foundational for any agent system that needs to process, stream, or handle audio data (e.g., for voice agents, TTS, or STT).
2. Voice Exception Types
Purpose: Defines custom exceptions for voice/STT pipeline errors, such as websocket connection failures.
Why include: Robust error handling is essential for production-grade voice agent systems.
3. Voice Imports and Dependency Management
Purpose: Handles conditional imports for numpy, websockets, and related dependencies, raising clear errors if not installed.
Why include: Ensures optional dependencies are managed gracefully and provides clear installation instructions for users.
4. Audio Input Utilities
Purpose: Provides classes and functions for converting audio buffers to files or base64, and for managing streamed audio input.
Why include: These utilities are essential for converting between different audio representations and for integrating with TTS/STT models.
5. TTS/STT Model Interfaces and Settings
Purpose: Defines abstract base classes and settings for text-to-speech and speech-to-text models, including streaming and session management.
Why include: These interfaces are foundational for integrating any TTS/STT backend, supporting both batch and streaming workflows.
In summary:
All of these files are foundational for any agent system that needs to support voice, audio, or speech workflows, and are required for robust, extensible, and production-ready voice agent integration.

I will now generate comprehensive markdown documentation for all these files, following the guidelines provided.
Documentation for Voice and Audio Integration Utilities
1. voice_stream_events.py — Voice Stream Event Types
File Overview
Defines event types for streaming audio and lifecycle events from a voice pipeline, including audio data, lifecycle events (turn started/ended), and error events.

Key Classes and Types
VoiceStreamEventAudio: Audio data event.
VoiceStreamEventLifecycle: Lifecycle event (turn started/ended/session ended).
VoiceStreamEventError: Error event.
VoiceStreamEvent: Union of all voice stream event types.
Example Usage
event = VoiceStreamEventAudio(data=my_audio_buffer)
if event.type == "voice_stream_event_audio":
    process_audio(event.data)
2. voice_exceptions.py — Voice Exception Types
File Overview
Defines custom exceptions for voice/STT pipeline errors.

Key Classes
STTWebsocketConnectionError: Exception raised when the STT websocket connection fails.
Example Usage
raise STTWebsocketConnectionError("Failed to connect to STT websocket.")
3. voice_imports.py — Voice Dependency Management
File Overview
Handles conditional imports for numpy, websockets, and related dependencies, raising clear errors if not installed.

Example Usage
from .imports import np, npt, websockets
Raises ImportError with installation instructions if dependencies are missing.
4. voice_input.py — Audio Input Utilities
File Overview
Provides classes and functions for converting audio buffers to files or base64, and for managing streamed audio input.

Key Classes and Functions
AudioInput: Static audio input for the voice pipeline.
to_audio_file(): Returns (filename, bytes, content_type).
to_base64(): Returns base64-encoded audio data.
StreamedAudioInput: Streamed audio input for the voice pipeline.
add_audio(audio): Adds audio data to the stream.
Example Usage
audio = AudioInput(buffer=my_np_array)
filename, audio_bytes, content_type = audio.to_audio_file()
base64_audio = audio.to_base64()

streamed_input = StreamedAudioInput()
await streamed_input.add_audio(my_np_array)
5. voice_models.py — TTS/STT Model Interfaces and Settings
File Overview
Defines abstract base classes and settings for text-to-speech and speech-to-text models, including streaming and session management.

Key Classes and Types
TTSModelSettings: Settings for a TTS model (voice, buffer size, dtype, etc.).
TTSModel: Abstract base class for TTS models.
STTModelSettings: Settings for a speech-to-text model.
STTModel: Abstract base class for STT models.
StreamedTranscriptionSession: Abstract base class for streamed transcription sessions.
VoiceModelProvider: Abstract base class for voice model providers.
Example Usage
class MyTTSModel(TTSModel):
    @property
    def model_name(self): return "my-tts"
    def run(self, text, settings): ...

class MySTTModel(STTModel):
    @property
    def model_name(self): return "my-stt"
    async def transcribe(self, input, settings, trace_include_sensitive_data, trace_include_sensitive_audio_data): ...
    async def create_session(self, input, settings, trace_include_sensitive_data, trace_include_sensitive_audio_data): ...
Related Files
exceptions.py
: For base exception types.
tool.py
: For tool abstractions.
run.py
: For agent runner logic that may use voice models.
For further details, see the source code and related modules.


#####

Should These Files Be Included in an Agent for OpenAI Agent Creation?
Yes, all of these files are important for inclusion in an agent system that helps with the creation of OpenAI Agents, especially for voice, audio, and speech-to-text/text-to-speech (STT/TTS) agent pipelines. Here’s why for each:

1. VoicePipeline and Audio Processing (voice_pipeline.py, pipeline_config.py, result.py, etc.)
Purpose: Implements the core logic for a voice agent pipeline, including audio input processing, STT, TTS, streaming audio output, and workflow orchestration.
Why include: These files are foundational for any agent system that wants to support voice or audio-based workflows, enabling seamless integration of transcription, agent logic, and speech synthesis.
2. Voice Event Types and Audio Buffer Utilities (events.py, input.py, utils.py, etc.)
Purpose: Defines event types for streaming audio, audio input/output utilities, and text splitting for TTS.
Why include: These are essential for robust, real-time audio streaming, event-driven processing, and efficient TTS chunking.
3. Voice Workflow Abstractions (workflow.py)
Purpose: Provides abstract base classes and helpers for defining custom voice agent workflows, including single-agent workflows and helpers for extracting text from agent streams.
Why include: These abstractions make it easy to build both simple and complex voice agent workflows, supporting extensibility and custom logic.
In summary:
All of these files are foundational for any agent system that needs to support voice, audio, or speech workflows, and are required for robust, extensible, and production-ready voice agent integration.

I will now generate comprehensive markdown documentation for all these files, following the guidelines provided.
Documentation for Voice Pipeline and Workflow Utilities
1. voice_pipeline.py — Voice Agent Pipeline
File Overview
Implements an opinionated voice agent pipeline that handles audio input (static or streamed), transcribes it to text, runs a workflow (e.g., an agent), and streams TTS audio output. Integrates with STT/TTS models and supports both single-turn and multi-turn (streamed) audio input.

Key Class
VoicePipeline
Purpose: Orchestrates the full voice agent pipeline: STT → workflow → TTS.
Constructor Parameters:
workflow: The workflow to run (see VoiceWorkflowBase).
stt_model, tts_model: Optional STT/TTS model instances or names.
config: Pipeline configuration (see VoicePipelineConfig).
Key Method:
async run(audio_input): Runs the pipeline on the given audio input (static or streamed).
Internal Methods:
_run_single_turn(audio_input): Handles single static audio input.
_run_multi_turn(audio_input): Handles streamed audio input with turn detection.
Example Usage
pipeline = VoicePipeline(workflow=my_workflow)
result = await pipeline.run(AudioInput(buffer=my_np_array))
async for event in result.stream():
    handle_audio_event(event)
2. pipeline_config.py — Voice Pipeline Configuration
File Overview
Defines the configuration class for the voice pipeline, including model provider, tracing, workflow name, group ID, and STT/TTS settings.

Key Class
VoicePipelineConfig
Purpose: Holds configuration for the voice pipeline.
Fields: model_provider, tracing_disabled, trace_include_sensitive_data, workflow_name, group_id, trace_metadata, stt_settings, tts_settings.
Example Usage
config = VoicePipelineConfig(workflow_name="My Voice Agent")
pipeline = VoicePipeline(workflow=my_workflow, config=config)
3. result.py — Streamed Audio Result
File Overview
Implements the StreamedAudioResult class, which streams audio and event data as they're generated by the pipeline. Handles text-to-speech chunking, buffering, and event dispatching.

Key Class
StreamedAudioResult
Purpose: Streams events and audio data from the voice pipeline.
Key Method: async stream(): Async iterator yielding VoiceStreamEvent objects.
Example Usage
async for event in result.stream():
    if event.type == "voice_stream_event_audio":
        play_audio(event.data)
4. events.py, input.py, utils.py — Voice Event Types and Utilities
File Overview
Defines event types for streaming audio, audio input/output utilities, and text splitting for TTS.

Key Classes and Functions
VoiceStreamEventAudio, VoiceStreamEventLifecycle, VoiceStreamEventError, VoiceStreamEvent: Event types for audio streaming.
AudioInput, StreamedAudioInput: Audio input utilities for static and streamed audio.
get_sentence_based_splitter(): Utility for splitting text into TTS-friendly chunks.
Example Usage
splitter = get_sentence_based_splitter()
chunk, remainder = splitter("This is a sentence. This is another.")
5. workflow.py — Voice Workflow Abstractions
File Overview
Provides abstract base classes and helpers for defining custom voice agent workflows, including single-agent workflows and helpers for extracting text from agent streams.

Key Classes
VoiceWorkflowBase: Abstract base class for voice workflows.
VoiceWorkflowHelper: Helper for extracting text from agent streaming results.
SingleAgentVoiceWorkflow: Simple workflow for running a single agent with input history.
Example Usage
class MyWorkflow(VoiceWorkflowBase):
    async def run(self, transcription: str):
        # Custom logic here
        yield "Response to: " + transcription

workflow = MyWorkflow()
pipeline = VoicePipeline(workflow=workflow)
Related Files
model.py
: STT/TTS model interfaces.
exceptions.py
: Error types for robust error handling.
run.py
: Agent runner logic that may use voice models.
For further details, see the source code and related modules.