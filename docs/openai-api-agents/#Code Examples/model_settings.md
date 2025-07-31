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