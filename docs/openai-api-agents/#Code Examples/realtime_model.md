realtime_model.py — Realtime Model Interface and Playback Tracking for OpenAI Agents
File Overview
This file defines the core interfaces and utilities for connecting to, sending events to, and receiving events from a real-time model (e.g., for voice or streaming OpenAI agents). It includes the RealtimeModel abstract base class, the RealtimePlaybackTracker for audio playback progress, the RealtimeModelListener for event-driven programming, and the RealtimeModelConfig TypedDict for connection configuration. These abstractions are essential for building robust, interactive, and low-latency agent systems that require real-time communication and audio handling.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Class/Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RealtimePlaybackState	TypedDict for tracking audio playback state.
RealtimePlaybackTracker	Tracks audio playback progress for real-time sessions.
RealtimeModelListener	Interface for receiving events from the real-time model.
RealtimeModelConfig	TypedDict for configuring real-time model connections.
RealtimeModel	Abstract base class for real-time model communication.
Annotated Code Snippets
1. Playback State and Tracker
class RealtimePlaybackState(TypedDict):
    current_item_id: str | None
    current_item_content_index: int | None
    elapsed_ms: float | None

class RealtimePlaybackTracker:
    def on_play_bytes(self, item_id: str, item_content_index: int, bytes: bytes) -> None: ...
    def on_play_ms(self, item_id: str, item_content_index: int, ms: float) -> None: ...
    def on_interrupted(self) -> None: ...
    def set_audio_format(self, format: RealtimeAudioFormat) -> None: ...
    def get_state(self) -> RealtimePlaybackState: ...
Explanation:

RealtimePlaybackState tracks which item is being played and how much audio has been played.
RealtimePlaybackTracker allows custom logic for tracking playback progress, handling interruptions, and reporting state.
2. Model Listener Interface
class RealtimeModelListener(abc.ABC):
    @abc.abstractmethod
    async def on_event(self, event: RealtimeModelEvent) -> None: ...
Explanation:
Defines an interface for receiving events from the real-time model.

3. Model Configuration
class RealtimeModelConfig(TypedDict):
    api_key: NotRequired[str | Callable[[], MaybeAwaitable[str]]]
    url: NotRequired[str]
    initial_model_settings: NotRequired[RealtimeSessionModelSettings]
    playback_tracker: NotRequired[RealtimePlaybackTracker]
Explanation:
Encapsulates all options for connecting to a real-time model, including API keys, URLs, initial settings, and playback tracking.

4. RealtimeModel Interface
class RealtimeModel(abc.ABC):
    @abc.abstractmethod
    async def connect(self, options: RealtimeModelConfig) -> None: ...
    @abc.abstractmethod
    def add_listener(self, listener: RealtimeModelListener) -> None: ...
    @abc.abstractmethod
    def remove_listener(self, listener: RealtimeModelListener) -> None: ...
    @abc.abstractmethod
    async def send_event(self, event: RealtimeModelSendEvent) -> None: ...
    @abc.abstractmethod
    async def close(self) -> None: ...
Explanation:
Abstract base class for real-time model communication, supporting connection, event sending, listener management, and session closing.

Class/Type Reference
RealtimePlaybackTracker
Purpose: Tracks audio playback progress, handling interruptions and reporting state.
Key Methods:
on_play_bytes(item_id, item_content_index, bytes): Called when audio bytes are played.
on_play_ms(item_id, item_content_index, ms): Called when a certain number of milliseconds of audio are played.
on_interrupted(): Called when playback is interrupted.
set_audio_format(format): Sets the audio format.
get_state(): Returns the current playback state.
RealtimeModelListener
Purpose: Receives events from the real-time model.
Key Method: on_event(event): Called when a model event is emitted.
RealtimeModelConfig
Purpose: Configuration for connecting to a real-time model.
Fields: API key, URL, initial model settings, playback tracker.
RealtimeModel
Purpose: Abstract interface for real-time model communication.
Key Methods:
connect(options): Establishes a connection.
add_listener(listener): Adds an event listener.
remove_listener(listener): Removes an event listener.
send_event(event): Sends an event to the model.
close(): Closes the session.
Example Usage
1. Custom Playback Tracker
tracker = RealtimePlaybackTracker()
tracker.set_audio_format("pcm16")
tracker.on_play_bytes("item1", 0, b"\x00\x01...")
print(tracker.get_state())
2. Implementing a Model Listener
class MyListener(RealtimeModelListener):
    async def on_event(self, event):
        print("Received event:", event)
3. Connecting to a Realtime Model
config = {
    "api_key": "sk-...",
    "url": "wss://...",
    "initial_model_settings": {...},
    "playback_tracker": tracker,
}
await my_realtime_model.connect(config)
my_realtime_model.add_listener(MyListener())
Tips, Gotchas, and FAQ
Playback Tracking:
Use a custom RealtimePlaybackTracker if your playback logic is non-standard or you need to handle interruptions accurately.

Event-Driven Design:
Implement RealtimeModelListener for custom event handling logic.

Configuration:
All connection options (API key, URL, settings) are provided via RealtimeModelConfig.

Extensibility:
Subclass RealtimeModel to implement custom real-time model integrations.

Related Files
realtime_agent.py
: Realtime agent class that interacts with the model.
realtime_events.py
: Event types for real-time agent sessions.
realtime_types.py
: Configuration types for real-time sessions.
For further details, see the source code and related modules.