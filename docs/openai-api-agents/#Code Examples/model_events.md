model_events.py — Realtime Model Event Types for OpenAI Voice/Streaming Agents
File Overview
This file defines the event types emitted by a real-time model in OpenAI-style agent systems. These events cover errors, tool calls, audio events, transcription updates, item updates, connection status changes, turn boundaries, exceptions, and raw server events. The unified RealtimeModelEvent type alias enables ergonomic handling of all event types in event-driven, streaming, or voice agent workflows.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Class/Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RealtimeModelErrorEvent	Represents a transport-layer error.
RealtimeModelToolCallEvent	Model attempted a tool/function call.
RealtimeModelAudioEvent	Raw audio bytes emitted by the model.
RealtimeModelAudioInterruptedEvent	Audio playback interrupted.
RealtimeModelAudioDoneEvent	Audio playback finished.
RealtimeModelInputAudioTranscriptionCompletedEvent	Input audio transcription completed.
RealtimeModelTranscriptDeltaEvent	Partial transcript update.
RealtimeModelItemUpdatedEvent	Item added to the history or updated.
RealtimeModelItemDeletedEvent	Item deleted from the history.
RealtimeModelConnectionStatusEvent	Connection status changed.
RealtimeModelTurnStartedEvent	Model started generating a response for a turn.
RealtimeModelTurnEndedEvent	Model finished generating a response for a turn.
RealtimeModelOtherEvent	Catchall for vendor-specific events.
RealtimeModelExceptionEvent	Exception occurred during model operation.
RealtimeModelRawServerEvent	Raw events forwarded from the server.
RealtimeModelEvent	Type alias for any of the above event types.
Annotated Code Snippets
1. Audio and Tool Call Events
@dataclass
class RealtimeModelAudioEvent:
    data: bytes
    response_id: str
    item_id: str
    content_index: int
    type: Literal["audio"] = "audio"

@dataclass
class RealtimeModelToolCallEvent:
    name: str
    call_id: str
    arguments: str
    id: str | None = None
    previous_item_id: str | None = None
    type: Literal["function_call"] = "function_call"
Explanation:
Covers audio output and tool/function call events from the model.

2. Transcription and Item Events
@dataclass
class RealtimeModelInputAudioTranscriptionCompletedEvent:
    item_id: str
    transcript: str
    type: Literal["input_audio_transcription_completed"] = "input_audio_transcription_completed"

@dataclass
class RealtimeModelTranscriptDeltaEvent:
    item_id: str
    delta: str
    response_id: str
    type: Literal["transcript_delta"] = "transcript_delta"

@dataclass
class RealtimeModelItemUpdatedEvent:
    item: RealtimeItem
    type: Literal["item_updated"] = "item_updated"
Explanation:
Covers transcription completions, transcript deltas, and item updates.

3. Connection and Turn Events
@dataclass
class RealtimeModelConnectionStatusEvent:
    status: RealtimeConnectionStatus
    type: Literal["connection_status"] = "connection_status"

@dataclass
class RealtimeModelTurnStartedEvent:
    type: Literal["turn_started"] = "turn_started"

@dataclass
class RealtimeModelTurnEndedEvent:
    type: Literal["turn_ended"] = "turn_ended"
Explanation:
Covers connection status changes and turn boundaries.

4. Error, Exception, and Raw Events
@dataclass
class RealtimeModelErrorEvent:
    error: Any
    type: Literal["error"] = "error"

@dataclass
class RealtimeModelExceptionEvent:
    exception: Exception
    context: str | None = None
    type: Literal["exception"] = "exception"

@dataclass
class RealtimeModelRawServerEvent:
    data: Any
    type: Literal["raw_server_event"] = "raw_server_event"
Explanation:
Covers error, exception, and raw server events.

5. Unified Event Type
RealtimeModelEvent: TypeAlias = Union[
    RealtimeModelErrorEvent,
    RealtimeModelToolCallEvent,
    RealtimeModelAudioEvent,
    RealtimeModelAudioInterruptedEvent,
    RealtimeModelAudioDoneEvent,
    RealtimeModelInputAudioTranscriptionCompletedEvent,
    RealtimeModelTranscriptDeltaEvent,
    RealtimeModelItemUpdatedEvent,
    RealtimeModelItemDeletedEvent,
    RealtimeModelConnectionStatusEvent,
    RealtimeModelTurnStartedEvent,
    RealtimeModelTurnEndedEvent,
    RealtimeModelOtherEvent,
    RealtimeModelExceptionEvent,
    RealtimeModelRawServerEvent,
]
Explanation:
Unifies all event types for ergonomic handling in event loops or UI frameworks.

Class/Type Reference
RealtimeModelEvent
Purpose: Represents any event emitted by a real-time model.
Variants: See above for all supported event classes.
Example Usage
1. Handling Model Events
def handle_event(event: RealtimeModelEvent):
    if event.type == "audio":
        play_audio(event.data)
    elif event.type == "function_call":
        invoke_tool(event.name, event.arguments)
    elif event.type == "error":
        log_error(event.error)
    # ... handle other event types ...
2. UI Integration
for event in model_event_stream:
    update_ui_with_event(event)
Tips, Gotchas, and FAQ
Extensibility:
You can extend the event system by adding new event classes and updating the RealtimeModelEvent type alias.

Audio Handling:
Use RealtimeModelAudioEvent, RealtimeModelAudioInterruptedEvent, and RealtimeModelAudioDoneEvent to manage audio playback and interruptions.

Error and Exception Handling:
Use RealtimeModelErrorEvent and RealtimeModelExceptionEvent to handle errors and exceptions robustly.

Raw/Vendor Events:
Use RealtimeModelOtherEvent and RealtimeModelRawServerEvent for vendor-specific or unstructured events.

Related Files
realtime_model.py
: Realtime model interface and playback tracking.
realtime_items.py
: Message and tool call item types referenced in item events.
realtime_events.py
: Session-level event types for real-time agent workflows.
For further details, see the source code and related modules.