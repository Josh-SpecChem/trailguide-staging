realtime_items.py — Real-Time Message and Tool Call Models for OpenAI Agents
File Overview
This file defines Pydantic models for all message and tool call items in real-time OpenAI agent conversations. It supports user, assistant, and system messages (with both text and audio content), as well as tool call items. These models are designed for multimodal, streaming, or voice agent workflows, and provide structured, type-safe handling of real-time agent responses.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Class/Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
InputText	Represents text input content for real-time messages.
InputAudio	Represents audio input content for real-time messages.
AssistantText	Represents text content from the assistant.
AssistantAudio	Represents audio content from the assistant.
SystemMessageItem	Represents a system message in the conversation.
UserMessageItem	Represents a user message (text or audio).
AssistantMessageItem	Represents an assistant message (text or audio, with status).
RealtimeMessageItem	Union of system, user, and assistant message items.
RealtimeToolCallItem	Represents a tool call in the conversation.
RealtimeItem	Union of message and tool call items.
RealtimeResponse	Represents a response from the real-time model.
Annotated Code Snippets
1. Input and Assistant Content Models
class InputText(BaseModel):
    type: Literal["input_text"] = "input_text"
    text: str | None = None
    model_config = ConfigDict(extra="allow")

class InputAudio(BaseModel):
    type: Literal["input_audio"] = "input_audio"
    audio: str | None = None
    transcript: str | None = None
    model_config = ConfigDict(extra="allow")

class AssistantText(BaseModel):
    type: Literal["text"] = "text"
    text: str | None = None
    model_config = ConfigDict(extra="allow")

class AssistantAudio(BaseModel):
    type: Literal["audio"] = "audio"
    audio: str | None = None
    transcript: str | None = None
    model_config = ConfigDict(extra="allow")
Explanation:
Models for both text and audio content, supporting extra fields for extensibility.

2. Message Item Models
class SystemMessageItem(BaseModel):
    item_id: str
    previous_item_id: str | None = None
    type: Literal["message"] = "message"
    role: Literal["system"] = "system"
    content: list[InputText]
    model_config = ConfigDict(extra="allow")

class UserMessageItem(BaseModel):
    item_id: str
    previous_item_id: str | None = None
    type: Literal["message"] = "message"
    role: Literal["user"] = "user"
    content: list[Annotated[InputText | InputAudio, Field(discriminator="type")]]
    model_config = ConfigDict(extra="allow")

class AssistantMessageItem(BaseModel):
    item_id: str
    previous_item_id: str | None = None
    type: Literal["message"] = "message"
    role: Literal["assistant"] = "assistant"
    status: Literal["in_progress", "completed", "incomplete"] | None = None
    content: list[Annotated[AssistantText | AssistantAudio, Field(discriminator="type")]]
    model_config = ConfigDict(extra="allow")
Explanation:

Models for system, user, and assistant messages.
User and assistant messages support both text and audio content, using discriminated unions for type safety.
3. Tool Call Item Model
class RealtimeToolCallItem(BaseModel):
    item_id: str
    previous_item_id: str | None = None
    call_id: str | None
    type: Literal["function_call"] = "function_call"
    status: Literal["in_progress", "completed"]
    arguments: str
    name: str
    output: str | None = None
    model_config = ConfigDict(extra="allow")
Explanation:
Represents a tool call in the conversation, including arguments, status, and output.

4. Unified Types
RealtimeMessageItem = Annotated[
    Union[SystemMessageItem, UserMessageItem, AssistantMessageItem],
    Field(discriminator="role"),
]
RealtimeItem = Union[RealtimeMessageItem, RealtimeToolCallItem]
Explanation:

RealtimeMessageItem is a union of all message item types, discriminated by role.
RealtimeItem is a union of message and tool call items.
5. Realtime Model Response
class RealtimeResponse(BaseModel):
    id: str
    output: list[RealtimeMessageItem]
Explanation:
Represents a response from the real-time model, including all output message items.

Class/Type Reference
InputText, InputAudio, AssistantText, AssistantAudio
Purpose: Represent text and audio content for user and assistant messages.
SystemMessageItem, UserMessageItem, AssistantMessageItem
Purpose: Represent system, user, and assistant messages in the conversation.
RealtimeToolCallItem
Purpose: Represents a tool call (function invocation) in the conversation.
RealtimeMessageItem, RealtimeItem
Purpose: Unified types for message and tool call items.
RealtimeResponse
Purpose: Represents a response from the real-time model.
Example Usage
1. Creating a User Message Item
msg = UserMessageItem(
    item_id="1",
    type="message",
    role="user",
    content=[InputText(text="Hello!")]
)
2. Creating an Assistant Message Item with Audio
msg = AssistantMessageItem(
    item_id="2",
    type="message",
    role="assistant",
    status="completed",
    content=[AssistantAudio(audio="base64string", transcript="Hi there!")]
)
3. Creating a Tool Call Item
tool_call = RealtimeToolCallItem(
    item_id="3",
    type="function_call",
    status="in_progress",
    arguments='{"param": "value"}',
    name="my_tool"
)
4. Parsing a RealtimeResponse
response = RealtimeResponse(id="resp1", output=[msg])
Tips, Gotchas, and FAQ
Discriminated Unions:
Use the type and role fields for correct parsing and validation of message and content types.

Extensibility:
All models allow extra fields for forward compatibility and custom metadata.

Audio Support:
Both user and assistant messages support audio content, making these models suitable for voice and multimodal agents.

Related Files
realtime_events.py
: Event types for real-time agent sessions.
realtime_agent.py
: Realtime agent class using these message types.
tool.py
: Tool definitions referenced in tool call items.
For further details, see the source code and related modules.