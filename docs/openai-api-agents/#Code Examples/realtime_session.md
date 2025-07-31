realtime_session.py — Realtime Session Management for Voice/Streaming OpenAI Agents
File Overview
This file defines the RealtimeSession class, which manages the lifecycle, event streaming, message/audio sending, tool execution, handoffs, and guardrails for real-time agent sessions. It acts as the main interface for interacting with a real-time model, handling bidirectional communication, event streaming, and state management. This class is foundational for building robust, interactive, and production-grade real-time, streaming, or voice agent systems.

Table of Contents
Key Class
Annotated Code Snippet
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Class
Name	Purpose
RealtimeSession	Manages the lifecycle, event streaming, message/audio sending, tools, handoffs, and guardrails for real-time agent sessions.
Annotated Code Snippet
class RealtimeSession(RealtimeModelListener):
    """A connection to a realtime model. It streams events from the model to you, and allows you to
    send messages and audio to the model.
    """

    def __init__(
        self,
        model: RealtimeModel,
        agent: RealtimeAgent,
        context: TContext | None,
        model_config: RealtimeModelConfig | None = None,
        run_config: RealtimeRunConfig | None = None,
    ) -> None:
        ...
        self._model = model
        self._current_agent = agent
        self._context_wrapper = RunContextWrapper(context)
        self._event_info = RealtimeEventInfo(context=self._context_wrapper)
        self._history: list[RealtimeItem] = []
        self._model_config = model_config or {}
        self._run_config = run_config or {}
        self._event_queue: asyncio.Queue[RealtimeSessionEvent] = asyncio.Queue()
        self._closed = False
        self._stored_exception: Exception | None = None
        # ... guardrail and transcript state ...
Explanation:

Initializes the session with the model, agent, context, configuration, and event queue.
Tracks session history, guardrail state, and manages event streaming.
Function/Class Reference
RealtimeSession
Purpose: Manages the lifecycle and communication for a real-time agent session.
Constructor Parameters:
model: The real-time model to use.
agent: The current RealtimeAgent.
context: The user-defined context object.
model_config: Model configuration.
run_config: Runtime configuration (guardrails, etc.).
Key Methods:
async __aenter__(): Starts the session, connects to the model, and emits the initial history.
async __aexit__(): Cleans up resources and closes the session.
async __aiter__(): Streams events from the session.
async send_message(message): Sends a user message to the model.
async send_audio(audio, commit=False): Sends audio data to the model.
async interrupt(): Sends an interrupt to the model.
async on_event(event): Handles incoming model events and updates session state.
async close(): Cleans up and closes the session.
Example Usage
1. Running a Realtime Session
runner = RealtimeRunner(my_realtime_agent)
async with await runner.run() as session:
    await session.send_message("Hello, agent!")
    async for event in session:
        print(event)
2. Sending Audio
await session.send_audio(audio_bytes, commit=True)
3. Handling Events
async for event in session:
    if event.type == "audio":
        play_audio(event.audio)
    elif event.type == "guardrail_tripped":
        alert_user(event.message)
Tips, Gotchas, and FAQ
Async Context Manager:
Always use the async context manager (async with await runner.run() as session) to ensure proper resource management.

Event Streaming:
Use async for event in session to stream events in real time.

Guardrails:
Guardrails are debounced and run in the background; interruptions are handled automatically.

Agent Handoffs:
The session supports dynamic agent handoffs and updates model settings as needed.

Error Handling:
Exceptions are stored and raised during event streaming for robust error propagation.

Related Files
realtime_runner.py
: Entry point for starting a real-time session.
realtime_agent.py
: Realtime agent class used in the session.
model.py
: Realtime model interface.
events.py
: Event types emitted by the session.
For further details, see the source code and related modules.