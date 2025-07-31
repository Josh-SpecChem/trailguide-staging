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