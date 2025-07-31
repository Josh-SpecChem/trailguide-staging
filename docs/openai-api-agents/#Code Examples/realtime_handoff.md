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