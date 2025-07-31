realtime_events.py — Realtime Session Event Types for OpenAI Voice/Streaming Agents
File Overview
This file defines the event types emitted during a real-time agent session, covering agent lifecycle, tool calls, audio events, errors, history updates, and guardrail triggers. These event classes are essential for building interactive, streaming, or voice-based agent experiences, enabling real-time UI updates, audio playback, error handling, and session management.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Class/Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RealtimeEventInfo	Holds context for all realtime events.
RealtimeAgentStartEvent	Emitted when a new agent starts.
RealtimeAgentEndEvent	Emitted when an agent ends.
RealtimeHandoffEvent	Emitted when an agent hands off to another agent.
RealtimeToolStart	Emitted when an agent starts a tool call.
RealtimeToolEnd	Emitted when an agent ends a tool call.
RealtimeRawModelEvent	Forwards raw model events.
RealtimeAudioEnd	Emitted when audio generation stops.
RealtimeAudio	Emitted when new audio is generated.
RealtimeAudioInterrupted	Emitted when audio is interrupted.
RealtimeError	Emitted when an error occurs.
RealtimeHistoryUpdated	Emitted when the session history is updated.
RealtimeHistoryAdded	Emitted when a new item is added to the history.
RealtimeGuardrailTripped	Emitted when a guardrail is tripped and the agent is interrupted.
RealtimeSessionEvent	Type alias for any of the above event types.
Annotated Code Snippets
1. Agent Lifecycle Events
@dataclass
class RealtimeAgentStartEvent:
    agent: RealtimeAgent
    info: RealtimeEventInfo
    type: Literal["agent_start"] = "agent_start"

@dataclass
class RealtimeAgentEndEvent:
    agent: RealtimeAgent
    info: RealtimeEventInfo
    type: Literal["agent_end"] = "agent_end"
Explanation:
Emitted when an agent starts or ends, providing agent and context info.

2. Tool Call Events
@dataclass
class RealtimeToolStart:
    agent: RealtimeAgent
    tool: Tool
    info: RealtimeEventInfo
    type: Literal["tool_start"] = "tool_start"

@dataclass
class RealtimeToolEnd:
    agent: RealtimeAgent
    tool: Tool
    output: Any
    info: RealtimeEventInfo
    type: Literal["tool_end"] = "tool_end"
Explanation:
Emitted when a tool call starts or ends, including agent, tool, output, and context info.

3. Audio and Model Events
@dataclass
class RealtimeAudio:
    audio: RealtimeModelAudioEvent
    item_id: str
    content_index: int
    info: RealtimeEventInfo
    type: Literal["audio"] = "audio"

@dataclass
class RealtimeAudioEnd:
    info: RealtimeEventInfo
    item_id: str
    content_index: int
    type: Literal["audio_end"] = "audio_end"

@dataclass
class RealtimeAudioInterrupted:
    info: RealtimeEventInfo
    item_id: str
    content_index: int
    type: Literal["audio_interrupted"] = "audio_interrupted"

@dataclass
class RealtimeRawModelEvent:
    data: RealtimeModelEvent
    info: RealtimeEventInfo
    type: Literal["raw_model_event"] = "raw_model_event"
Explanation:
Covers all audio-related and raw model events, including playback, interruption, and raw data forwarding.

4. History and Guardrail Events
@dataclass
class RealtimeHistoryUpdated:
    history: list[RealtimeItem]
    info: RealtimeEventInfo
    type: Literal["history_updated"] = "history_updated"

@dataclass
class RealtimeHistoryAdded:
    item: RealtimeItem
    info: RealtimeEventInfo
    type: Literal["history_added"] = "history_added"

@dataclass
class RealtimeGuardrailTripped:
    guardrail_results: list[OutputGuardrailResult]
    message: str
    info: RealtimeEventInfo
    type: Literal["guardrail_tripped"] = "guardrail_tripped"
Explanation:
Emitted when session history is updated, a new item is added, or a guardrail is tripped.

5. Error Events
@dataclass
class RealtimeError:
    error: Any
    info: RealtimeEventInfo
    type: Literal["error"] = "error"
Explanation:
Emitted when an error occurs during the session.

6. Unified Event Type
RealtimeSessionEvent: TypeAlias = Union[
    RealtimeAgentStartEvent,
    RealtimeAgentEndEvent,
    RealtimeHandoffEvent,
    RealtimeToolStart,
    RealtimeToolEnd,
    RealtimeRawModelEvent,
    RealtimeAudioEnd,
    RealtimeAudio,
    RealtimeAudioInterrupted,
    RealtimeError,
    RealtimeHistoryUpdated,
    RealtimeHistoryAdded,
    RealtimeGuardrailTripped,
]
Explanation:
Unifies all event types for ergonomic handling in event loops or UI frameworks.

Class/Type Reference
RealtimeSessionEvent
Purpose: Represents any event emitted by a real-time agent session.
Variants: See above for all supported event classes.
Example Usage
1. Handling Realtime Events
def handle_event(event: RealtimeSessionEvent):
    if event.type == "agent_start":
        print(f"Agent started: {event.agent.name}")
    elif event.type == "audio":
        play_audio(event.audio)
    elif event.type == "guardrail_tripped":
        alert_user(event.message)
    # ... handle other event types ...
2. UI Integration
for event in session_event_stream:
    update_ui_with_event(event)
Tips, Gotchas, and FAQ
Extensibility:
You can extend the event system by adding new event classes and updating the RealtimeSessionEvent type alias.

Context Info:
All events include a RealtimeEventInfo object with the run context for easy access to session state.

Audio Handling:
Use RealtimeAudio, RealtimeAudioEnd, and RealtimeAudioInterrupted to manage audio playback and interruptions.

Guardrail Handling:
Use RealtimeGuardrailTripped to handle safety or validation interruptions in real-time sessions.

Related Files
realtime_agent.py
: Realtime agent class that emits these events.
run_context.py
: Run context wrapper included in event info.
tool.py
: Tool definitions referenced in tool events.
guardrail.py
: Guardrail result types referenced in guardrail events.
For further details, see the source code and related modules.