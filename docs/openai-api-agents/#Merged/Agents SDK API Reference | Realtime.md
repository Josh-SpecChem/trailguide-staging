# Agents SDK API Reference | Realtime

---

## RealtimeAgent

**Bases:** `AgentBase`, `Generic[TContext]`

A specialized agent instance that is meant to be used within a `RealtimeSession` to build voice agents.  
**Key differences from regular Agent instances:**
- Model choice is not supported (all RealtimeAgents use the same model in a session).
- `modelSettings` is not supported (all RealtimeAgents use the same model in a session).
- `outputType` is not supported (no structured outputs).
- `toolUseBehavior` is not supported (all RealtimeAgents use the same model in a session).
- `voice` can be configured per agent, but cannot be changed after the first agent in a session has spoken.

See `AgentBase` for base parameters shared with Agents.

**Source code:** `src/agents/realtime/agent.py`

### Attributes

- **instructions** (class-attribute, instance-attribute):  
  ```python
  instructions: (
      str
      | Callable[
          [
              RunContextWrapper[TContext],
              RealtimeAgent[TContext],
          ],
          MaybeAwaitable[str],
      ]
      | None
  ) = None
The instructions for the agent (used as the "system prompt"). Can be a string or a function returning a string.

handoffs (class-attribute, instance-attribute):

handoffs: list[
    RealtimeAgent[Any]
    | Handoff[TContext, RealtimeAgent[Any]]
] = field(default_factory=list)
Sub-agents that the agent can delegate to.

hooks (class-attribute, instance-attribute):
hooks: RealtimeAgentHooks | None = None
Receives callbacks on various lifecycle events for this agent.

name (instance-attribute):
name: str
The name of the agent.

handoff_description (class-attribute, instance-attribute):
handoff_description: str | None = None
Description used when the agent is used as a handoff.

tools (class-attribute, instance-attribute):
tools: list[Tool] = field(default_factory=list)
Tools the agent can use.

mcp_servers (class-attribute, instance-attribute):
mcp_servers: list[MCPServer] = field(default_factory=list)
MCP servers the agent can use.
Note: You must call server.connect() before passing to the agent, and server.cleanup() when done.

mcp_config (class-attribute, instance-attribute):
mcp_config: MCPConfig = field(default_factory=lambda: MCPConfig())
Configuration for MCP servers.

Methods
**clone(kwargs: Any) -> RealtimeAgent[TContext]
Make a copy of the agent, with given arguments changed.

new_agent = agent.clone(instructions="New instructions")
get_system_prompt(run_context: RunContextWrapper[TContext]) -> str | None (async)
Get the system prompt for the agent.

get_mcp_tools(run_context: RunContextWrapper[TContext]) -> list[Tool] (async)
Fetch available tools from the MCP servers.

get_all_tools(run_context: RunContextWrapper[Any]) -> list[Tool] (async)
All agent tools, including MCP tools and function tools.

RealtimeRunner
A RealtimeRunner is the equivalent of Runner for realtime agents. It manages multiple turns by maintaining a persistent connection with the model layer.

Manages local history, executes tools, runs guardrails, and facilitates handoffs.
Uses WebSockets by default.
You can implement your own model layer by implementing the RealtimeModel interface.
Source code: src/agents/realtime/runner.py

init
__init__(
    starting_agent: RealtimeAgent,
    *,
    model: RealtimeModel | None = None,
    config: RealtimeRunConfig | None = None,
) -> None
Parameters:
starting_agent (RealtimeAgent): The agent to start the session with. required
context: The context to use for the session. required
model (RealtimeModel | None): The model to use. If not provided, uses default OpenAI realtime model.
config (RealtimeRunConfig | None): Override parameters for the run.
run (async)
run(
    *,
    context: TContext | None = None,
    model_config: RealtimeModelConfig | None = None,
) -> RealtimeSession
Start and return a realtime session.

Returns:
RealtimeSession: A session object for bidirectional communication with the realtime model.
Example:

runner = RealtimeRunner(agent)
async with await runner.run() as session:
    await session.send_message("Hello")
    async for event in session:
        print(event)
RealtimeSession
Bases: RealtimeModelListener

A connection to a realtime model. Streams events from the model to you, and allows sending messages and audio.

Source code: src/agents/realtime/session.py

Example
runner = RealtimeRunner(agent)
async with await runner.run() as session:
    # Send messages
    await session.send_message("Hello")
    await session.send_audio(audio_bytes)

    # Stream events
    async for event in session:
        if event.type == "audio":
            # Handle audio event
            pass
Attributes
model (property): model: RealtimeModel Access the underlying model for adding listeners or direct interaction.
Methods
init(...)

model (RealtimeModel): The model to use.
agent (RealtimeAgent): The current agent.
context (TContext | None): The context object.
model_config (RealtimeModelConfig | None): Model configuration.
run_config (RealtimeRunConfig | None): Runtime configuration including guardrails.
aenter() -> RealtimeSession (async)
Start the session by connecting to the model.

enter() -> RealtimeSession (async)
Enter the async context manager (manual alternative to __aenter__).

aexit(_exc_type: Any, _exc_val: Any, _exc_tb: Any) -> None (async)
End the session.

aiter() -> AsyncIterator[RealtimeSessionEvent] (async)
Iterate over events from the session.

close() -> None (async)
Close the session.

send_message(message: RealtimeUserInput) -> None (async)
Send a message to the model.

*send_audio(audio: bytes, , commit: bool = False) -> None (async)
Send a raw audio chunk to the model.

interrupt() -> None (async)
Interrupt the model.

Realtime Events
Session Events
An event emitted by the realtime session.

Event Types
Agent Events
A new agent has started.

agent: RealtimeAgent
info: RealtimeEventInfo
An agent has ended.

agent: RealtimeAgent
info: RealtimeEventInfo
Audio Events
Triggered when the agent generates new audio to be played.

audio: RealtimeModelAudioEvent
item_id: str
content_index: int
info: RealtimeEventInfo
Triggered when the agent stops generating audio.

info: RealtimeEventInfo
item_id: str
content_index: int
Triggered when the agent is interrupted.

info: RealtimeEventInfo
item_id: str
content_index: int
Tool Events
An agent is starting a tool call.

agent: RealtimeAgent
info: RealtimeEventInfo
An agent has ended a tool call.

agent: RealtimeAgent
tool: Tool
output: Any
info: RealtimeEventInfo
Handoff Events
An agent has handed off to another agent.
from_agent: RealtimeAgent
to_agent: RealtimeAgent
info: RealtimeEventInfo
Guardrail Events
A guardrail has been tripped and the agent has been interrupted.
guardrail_results: list[OutputGuardrailResult]
message: str
info: RealtimeEventInfo
History Events
A new item has been added to the history.

item: RealtimeItem
info: RealtimeEventInfo
The history has been updated.

history: list[RealtimeItem]
info: RealtimeEventInfo
Error Events
An error has occurred.
error: Any
info: RealtimeEventInfo
Raw Model Events
Forwards raw events from the model layer.
data: RealtimeModelEvent
info: RealtimeEventInfo
Realtime Configuration
Run Configuration
Bases: TypedDict
Configuration for running a realtime agent session.

Source code: src/agents/realtime/config.py

model_settings: NotRequired[RealtimeSessionModelSettings]
Settings for the realtime model session.

output_guardrails: NotRequired[list[OutputGuardrail[Any]]]
List of output guardrails to run on the agent's responses.

guardrails_settings: NotRequired[RealtimeGuardrailsSettings]
Settings for guardrail execution.

tracing_disabled: NotRequired[bool]
Whether tracing is disabled for this run.

Model Settings
Bases: TypedDict
Model settings for a realtime model session.

model_name: NotRequired[RealtimeModelName]
instructions: NotRequired[str]
modalities: NotRequired[list[Literal['text', 'audio']]]
voice: NotRequired[str]
input_audio_format: NotRequired[RealtimeAudioFormat]
output_audio_format: NotRequired[RealtimeAudioFormat]
input_audio_transcription: NotRequired[RealtimeInputAudioTranscriptionConfig]
turn_detection: NotRequired[RealtimeTurnDetectionConfig]
tool_choice: NotRequired[ToolChoice]
tools: NotRequired[list[Tool]]
handoffs: NotRequired[list[Handoff]]
tracing: NotRequired[RealtimeModelTracingConfig | None]
Audio Configuration
Bases: TypedDict
Configuration for audio transcription in realtime sessions.

language: NotRequired[str]
model: NotRequired[Literal["gpt-4o-transcribe", "gpt-4o-mini-transcribe", "whisper-1"] | str]
prompt: NotRequired[str]
Turn Detection Config
Bases: TypedDict
Turn detection config. Allows extra vendor keys if needed.

type: NotRequired[Literal['semantic_vad', 'server_vad']]
create_response: NotRequired[bool]
eagerness: NotRequired[Literal["auto", "low", "medium", "high"]]
interrupt_response: NotRequired[bool]
prefix_padding_ms: NotRequired[int]
silence_duration_ms: NotRequired[int]
threshold: NotRequired[float]
Guardrails Settings
Bases: TypedDict
Settings for output guardrails in realtime sessions.

debounce_text_length: NotRequired[int] The minimum number of characters to accumulate before running guardrails on transcript deltas. Defaults to 100.
Model Configuration
Bases: TypedDict
Options for connecting to a realtime model.

Source code: src/agents/realtime/model.py

api_key: NotRequired[str | Callable[[], MaybeAwaitable[str]]]
The API key (or function that returns a key) to use when connecting.

url: NotRequired[str]
The URL to use when connecting.

initial_model_settings: NotRequired[RealtimeSessionModelSettings]
The initial model settings to use when connecting.

Tracing Configuration
Bases: TypedDict
Configuration for tracing in realtime model sessions.

workflow_name: NotRequired[str]
group_id: NotRequired[str]
metadata: NotRequired[dict[str, Any]]
User Input Types
User input can be a string or structured message.

Text Input
Bases: TypedDict
A text input from the user.

type: Literal['input_text']
text: str
Message Input
Bases: TypedDict
A message input from the user.

type: Literal['message']
role: Literal['user']
content: list[RealtimeUserInputText]
Client Messages
Bases: TypedDict
A raw message to be sent to the model.

type: str
other_data: NotRequired[dict[str, Any]]
Model
RealtimeModelListener
Bases: ABC
A listener for realtime transport events.

Source code: src/agents/realtime/model.py

on_event(event: RealtimeModelEvent) -> None (abstractmethod, async) Called when an event is emitted by the realtime transport.
RealtimeModelConfig
Bases: TypedDict
Options for connecting to a realtime model.

api_key: NotRequired[str | Callable[[], MaybeAwaitable[str]]]
url: NotRequired[str]
initial_model_settings: NotRequired[RealtimeSessionModelSettings]
RealtimeModel
Bases: ABC
Interface for connecting to a realtime model and sending/receiving events.

Source code: src/agents/realtime/model.py

Methods
connect(options: RealtimeModelConfig) -> None (abstractmethod, async)
Establish a connection to the model and keep it alive.

add_listener(listener: RealtimeModelListener) -> None (abstractmethod)
Add a listener to the model.

remove_listener(listener: RealtimeModelListener) -> None (abstractmethod)
Remove a listener from the model.

send_event(event: RealtimeModelSendEvent) -> None (abstractmethod, async)
Send an event to the model.

close() -> None (abstractmethod, async)
Close the session.

