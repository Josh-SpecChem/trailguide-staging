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