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