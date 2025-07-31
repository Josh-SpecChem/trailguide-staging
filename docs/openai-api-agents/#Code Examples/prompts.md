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