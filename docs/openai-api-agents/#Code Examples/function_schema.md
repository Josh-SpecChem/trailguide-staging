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