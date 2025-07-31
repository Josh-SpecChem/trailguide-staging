realtime_types.py — Configuration Types for Realtime and Voice OpenAI Agents
File Overview
This file defines the configuration types and settings for real-time agent sessions, including model selection, audio formats, transcription, turn detection, tool/handoff integration, guardrails, and tracing. These TypedDicts and TypeAliases provide a structured, type-safe way to configure and manage real-time, streaming, or voice-based agent workflows in OpenAI-style agent systems.

Table of Contents
Key Types and Aliases
Annotated Code Snippets
Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Types and Aliases
Name	Purpose
RealtimeModelName	Type alias for supported real-time model names.
RealtimeAudioFormat	Type alias for supported audio formats.
RealtimeClientMessage	TypedDict for raw messages sent to the model.
RealtimeInputAudioTranscriptionConfig	TypedDict for audio transcription settings.
RealtimeTurnDetectionConfig	TypedDict for turn/voice activity detection settings.
RealtimeSessionModelSettings	TypedDict for model/session configuration.
RealtimeGuardrailsSettings	TypedDict for output guardrail settings.
RealtimeModelTracingConfig	TypedDict for tracing configuration.
RealtimeRunConfig	TypedDict for configuring a real-time agent session.
RealtimeUserInputText	TypedDict for text input from the user.
RealtimeUserInputMessage	TypedDict for structured user message input.
RealtimeUserInput	Type alias for user input (string or structured message).
Annotated Code Snippets
1. Model and Audio Format Aliases
RealtimeModelName: TypeAlias = Union[
    Literal[
        "gpt-4o-realtime-preview",
        "gpt-4o-mini-realtime-preview",
        "gpt-4o-realtime-preview-2025-06-03",
        "gpt-4o-realtime-preview-2024-12-17",
        "gpt-4o-realtime-preview-2024-10-01",
        "gpt-4o-mini-realtime-preview-2024-12-17",
    ],
    str,
]
RealtimeAudioFormat: TypeAlias = Union[Literal["pcm16", "g711_ulaw", "g711_alaw"], str]
Explanation:
Defines allowed values for real-time model names and audio formats, ensuring type safety and clarity.

2. RealtimeSessionModelSettings
class RealtimeSessionModelSettings(TypedDict):
    model_name: NotRequired[RealtimeModelName]
    instructions: NotRequired[str]
    modalities: NotRequired[list[Literal["text", "audio"]]]
    voice: NotRequired[str]
    input_audio_format: NotRequired[RealtimeAudioFormat]
    output_audio_format: NotRequired[RealtimeAudioFormat]
    input_audio_transcription: NotRequired[RealtimeInputAudioTranscriptionConfig]
    turn_detection: NotRequired[RealtimeTurnDetectionConfig]
    tool_choice: NotRequired[ToolChoice]
    tools: NotRequired[list[Tool]]
    handoffs: NotRequired[list[Handoff]]
    tracing: NotRequired[RealtimeModelTracingConfig | None]
Explanation:
Central configuration for a real-time agent session, covering model, audio, transcription, tools, handoffs, and tracing.

3. Guardrails and Tracing Settings
class RealtimeGuardrailsSettings(TypedDict):
    debounce_text_length: NotRequired[int]

class RealtimeModelTracingConfig(TypedDict):
    workflow_name: NotRequired[str]
    group_id: NotRequired[str]
    metadata: NotRequired[dict[str, Any]]
Explanation:
Settings for output guardrails (e.g., debounce thresholds) and tracing (workflow name, group, metadata).

4. RealtimeRunConfig
class RealtimeRunConfig(TypedDict):
    model_settings: NotRequired[RealtimeSessionModelSettings]
    output_guardrails: NotRequired[list[OutputGuardrail[Any]]]
    guardrails_settings: NotRequired[RealtimeGuardrailsSettings]
    tracing_disabled: NotRequired[bool]
Explanation:
Top-level configuration for running a real-time agent session, including model, guardrails, and tracing.

5. User Input Types
class RealtimeUserInputText(TypedDict):
    type: Literal["input_text"]
    text: str

class RealtimeUserInputMessage(TypedDict):
    type: Literal["message"]
    role: Literal["user"]
    content: list[RealtimeUserInputText]

RealtimeUserInput: TypeAlias = Union[str, RealtimeUserInputMessage]
Explanation:
Defines both string and structured message formats for user input.

Type Reference
RealtimeSessionModelSettings
Purpose: Central configuration for a real-time agent session.
Fields: Model name, instructions, modalities, voice, audio formats, transcription, turn detection, tool/handoff lists, tracing.
RealtimeRunConfig
Purpose: Top-level configuration for running a real-time agent session.
Fields: Model settings, output guardrails, guardrail settings, tracing disabled.
RealtimeUserInput
Purpose: User input for a real-time session (string or structured message).
Example Usage
1. Configuring a Realtime Session
model_settings = {
    "model_name": "gpt-4o-realtime-preview",
    "voice": "alloy",
    "modalities": ["text", "audio"],
    "tools": [my_tool],
    "handoffs": [my_handoff],
    "input_audio_format": "pcm16",
    "output_audio_format": "pcm16",
    "turn_detection": {"type": "semantic_vad", "eagerness": "auto"},
}

run_config = {
    "model_settings": model_settings,
    "output_guardrails": [my_guardrail],
    "guardrails_settings": {"debounce_text_length": 100},
    "tracing_disabled": False,
}
2. Sending User Input
user_input: RealtimeUserInput = "Hello, agent!"

structured_input: RealtimeUserInput = {
    "type": "message",
    "role": "user",
    "content": [{"type": "input_text", "text": "Hello, agent!"}]
}
Tips, Gotchas, and FAQ
Model and Audio Formats:
Use only supported values for model_name and audio formats for compatibility.

Guardrails:
Guardrail settings allow you to debounce or throttle guardrail checks for streaming output.

Tracing:
Tracing configuration enables workflow-level observability and grouping for real-time sessions.

User Input:
Both string and structured message formats are supported for user input.

Related Files
realtime_agent.py
: Realtime agent class that uses these types.
guardrail.py
: Guardrail logic referenced in output guardrails.
handoffs.py
: Handoff logic referenced in session settings.
tool.py
: Tool definitions referenced in session settings.
For further details, see the source code and related modules.