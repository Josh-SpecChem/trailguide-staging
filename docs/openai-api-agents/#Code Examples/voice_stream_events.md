1. voice_stream_events.py — Voice Stream Event Types
File Overview
Defines event types for streaming audio and lifecycle events from a voice pipeline, including audio data, lifecycle events (turn started/ended), and error events.

Key Classes and Types
VoiceStreamEventAudio: Audio data event.
VoiceStreamEventLifecycle: Lifecycle event (turn started/ended/session ended).
VoiceStreamEventError: Error event.
VoiceStreamEvent: Union of all voice stream event types.
Example Usage
event = VoiceStreamEventAudio(data=my_audio_buffer)
if event.type == "voice_stream_event_audio":
    process_audio(event.data)
2. voice_exceptions.py — Voice Exception Types
File Overview
Defines custom exceptions for voice/STT pipeline errors.

Key Classes
STTWebsocketConnectionError: Exception raised when the STT websocket connection fails.
Example Usage
raise STTWebsocketConnectionError("Failed to connect to STT websocket.")
3. voice_imports.py — Voice Dependency Management
File Overview
Handles conditional imports for numpy, websockets, and related dependencies, raising clear errors if not installed.

Example Usage
from .imports import np, npt, websockets
Raises ImportError with installation instructions if dependencies are missing.
4. voice_input.py — Audio Input Utilities
File Overview
Provides classes and functions for converting audio buffers to files or base64, and for managing streamed audio input.

Key Classes and Functions
AudioInput: Static audio input for the voice pipeline.
to_audio_file(): Returns (filename, bytes, content_type).
to_base64(): Returns base64-encoded audio data.
StreamedAudioInput: Streamed audio input for the voice pipeline.
add_audio(audio): Adds audio data to the stream.
Example Usage
audio = AudioInput(buffer=my_np_array)
filename, audio_bytes, content_type = audio.to_audio_file()
base64_audio = audio.to_base64()

streamed_input = StreamedAudioInput()
await streamed_input.add_audio(my_np_array)
5. voice_models.py — TTS/STT Model Interfaces and Settings
File Overview
Defines abstract base classes and settings for text-to-speech and speech-to-text models, including streaming and session management.

Key Classes and Types
TTSModelSettings: Settings for a TTS model (voice, buffer size, dtype, etc.).
TTSModel: Abstract base class for TTS models.
STTModelSettings: Settings for a speech-to-text model.
STTModel: Abstract base class for STT models.
StreamedTranscriptionSession: Abstract base class for streamed transcription sessions.
VoiceModelProvider: Abstract base class for voice model providers.
Example Usage
class MyTTSModel(TTSModel):
    @property
    def model_name(self): return "my-tts"
    def run(self, text, settings): ...

class MySTTModel(STTModel):
    @property
    def model_name(self): return "my-stt"
    async def transcribe(self, input, settings, trace_include_sensitive_data, trace_include_sensitive_audio_data): ...
    async def create_session(self, input, settings, trace_include_sensitive_data, trace_include_sensitive_audio_data): ...
Related Files
exceptions.py
: For base exception types.
tool.py
: For tool abstractions.
run.py
: For agent runner logic that may use voice models.
For further details, see the source code and related modules.