model_inputs.py — Sendable Event Types for Realtime OpenAI Models
File Overview
This file defines the types and dataclasses for all possible events/messages that can be sent to a real-time model in OpenAI agent systems. It includes user input (text or structured), audio, tool outputs, session updates, and interrupts. These types are foundational for robust, type-safe, and extensible communication with real-time, streaming, or voice models.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Class/Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RealtimeModelRawClientMessage	TypedDict for sending raw messages to the model.
RealtimeModelInputTextContent	TypedDict for sending a piece of text to the model.
RealtimeModelUserInputMessage	TypedDict for sending a structured user message.
RealtimeModelUserInput	Type alias for user input (string or structured message).
RealtimeModelSendRawMessage	Dataclass for sending a raw message.
RealtimeModelSendUserInput	Dataclass for sending user input.
RealtimeModelSendAudio	Dataclass for sending audio data.
RealtimeModelSendToolOutput	Dataclass for sending tool output.
RealtimeModelSendInterrupt	Dataclass for sending an interrupt signal.
RealtimeModelSendSessionUpdate	Dataclass for sending session configuration updates.
RealtimeModelSendEvent	Type alias for any of the above sendable event types.
Annotated Code Snippets
1. User Input Types
class RealtimeModelRawClientMessage(TypedDict):
    type: str  # explicitly required
    other_data: NotRequired[dict[str, Any]]

class RealtimeModelInputTextContent(TypedDict):
    type: Literal["input_text"]
    text: str

class RealtimeModelUserInputMessage(TypedDict):
    type: Literal["message"]
    role: Literal["user"]
    content: list[RealtimeModelInputTextContent]

RealtimeModelUserInput: TypeAlias = Union[str, RealtimeModelUserInputMessage]
Explanation:
Defines raw, text, and structured user input formats for sending to the model.

2. Sendable Event Dataclasses
@dataclass
class RealtimeModelSendRawMessage:
    message: RealtimeModelRawClientMessage

@dataclass
class RealtimeModelSendUserInput:
    user_input: RealtimeModelUserInput

@dataclass
class RealtimeModelSendAudio:
    audio: bytes
    commit: bool = False

@dataclass
class RealtimeModelSendToolOutput:
    tool_call: RealtimeModelToolCallEvent
    output: str
    start_response: bool

@dataclass
class RealtimeModelSendInterrupt:
    pass

@dataclass
class RealtimeModelSendSessionUpdate:
    session_settings: RealtimeSessionModelSettings
Explanation:

Each dataclass represents a specific kind of message/event that can be sent to the model.
Covers raw messages, user input, audio, tool output, interrupts, and session updates.
3. Unified Send Event Type
RealtimeModelSendEvent: TypeAlias = Union[
    RealtimeModelSendRawMessage,
    RealtimeModelSendUserInput,
    RealtimeModelSendAudio,
    RealtimeModelSendToolOutput,
    RealtimeModelSendInterrupt,
    RealtimeModelSendSessionUpdate,
]
Explanation:
Unifies all sendable event types for ergonomic handling in code that sends events to the model.

Class/Type Reference
RealtimeModelSendEvent
Purpose: Represents any event/message that can be sent to a real-time model.
Variants: See above for all supported dataclasses and TypedDicts.
Example Usage
1. Sending a Structured User Input
msg = RealtimeModelSendUserInput(
    user_input={
        "type": "message",
        "role": "user",
        "content": [{"type": "input_text", "text": "Hello, agent!"}]
    }
)
await model.send_event(msg)
2. Sending Audio
audio_event = RealtimeModelSendAudio(audio=b"...", commit=True)
await model.send_event(audio_event)
3. Sending Tool Output
tool_output = RealtimeModelSendToolOutput(
    tool_call=tool_call_event,
    output="42",
    start_response=True
)
await model.send_event(tool_output)
4. Sending a Session Update
session_update = RealtimeModelSendSessionUpdate(session_settings=my_settings)
await model.send_event(session_update)
Tips, Gotchas, and FAQ
User Input Flexibility:
User input can be a simple string or a structured message with content items.

Audio Commit:
The commit flag in RealtimeModelSendAudio can be used to indicate end of audio input.

Tool Output:
Use RealtimeModelSendToolOutput to send the result of a tool/function call back to the model.

Session Updates:
Use RealtimeModelSendSessionUpdate to update session configuration (e.g., model settings) on the fly.

Related Files
realtime_model.py
: Model interface that receives these events.
model_events.py
: Event types that the model emits in response.
config.py
: Session model settings referenced in session updates.
For further details, see the source code and related modules.