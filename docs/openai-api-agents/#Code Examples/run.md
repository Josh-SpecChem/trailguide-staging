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