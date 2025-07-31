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