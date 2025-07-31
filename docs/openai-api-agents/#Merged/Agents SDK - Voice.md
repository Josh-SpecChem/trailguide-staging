Voice Agent Documentation
Pipeline
VoicePipeline
An opinionated voice agent pipeline. It works in three steps:

Transcribe audio input into text.
Run the provided workflow, which produces a sequence of text responses.
Convert the text responses into streaming audio output.
Source code in src/agents/voice/pipeline.py

_init__
_init__(
    *,
    workflow: VoiceWorkflowBase,
    stt_model: STTModel | str | None = None,
    tts_model: TTSModel | str | None = None,
    config: VoicePipelineConfig | None = None,
)
Create a new voice pipeline.

Name	Type	Description	Default
workflow	VoiceWorkflowBase	The workflow to run. See VoiceWorkflowBase.	required
stt_model	STTModel | str | None	The speech-to-text model to use. If not provided, a default OpenAI model will be used.	None
tts_model	TTSModel | str | None	The text-to-speech model to use. If not provided, a default OpenAI model will be used.	None
config	VoicePipelineConfig | None	The pipeline configuration. If not provided, a default configuration will be used.	None
run (async)
run(
    audio_input: AudioInput | StreamedAudioInput,
) -> StreamedAudioResult
Run the voice pipeline.

Name	Type	Description	Default
audio_input	AudioInput | StreamedAudioInput	The audio input to process. This can either be an AudioInput instance (single static buffer) or a StreamedAudioInput instance (stream of audio data).	required
Returns:

StreamedAudioResult: A StreamedAudioResult instance. You can use this object to stream audio events and play them out.
Workflow
VoiceWorkflowBase
Bases: ABC

A base class for a voice workflow. You must implement the run method. A "workflow" is any code you want, that receives a transcription and yields text that will be turned into speech by a text-to-speech model. In most cases, you'll create Agents and use Runner.run_streamed() to run them, returning some or all of the text events from the stream. You can use the VoiceWorkflowHelper class to help with extracting text events from the stream. If you have a simple workflow that has a single starting agent and no custom logic, you can use SingleAgentVoiceWorkflow directly.

Source code in src/agents/voice/workflow.py

run (abstractmethod)
run(transcription: str) -> AsyncIterator[str]
Run the voice workflow. You will receive an input transcription, and must yield text that will be spoken to the user. You can run whatever logic you want here. In most cases, the final logic will involve calling Runner.run_streamed() and yielding any text events from the stream.

on_start (async)
on_start() -> AsyncIterator[str]
Optional method that runs before any user input is received. Can be used to deliver a greeting or instruction via TTS. Defaults to doing nothing.

VoiceWorkflowHelper
Source code in src/agents/voice/workflow.py

stream_text_from (async classmethod)
stream_text_from(
    result: RunResultStreaming,
) -> AsyncIterator[str]
Wraps a RunResultStreaming object and yields text events from the stream.

SingleAgentWorkflowCallbacks
Source code in src/agents/voice/workflow.py

on_run
on_run(
    workflow: SingleAgentVoiceWorkflow, transcription: str
) -> None
Called when the workflow is run.

SingleAgentVoiceWorkflow
Bases: VoiceWorkflowBase

A simple voice workflow that runs a single agent. Each transcription and result is added to the input history. For more complex workflows (e.g. multiple Runner calls, custom message history, custom logic, custom configs), subclass VoiceWorkflowBase and implement your own logic.

Source code in src/agents/voice/workflow.py

_init__
_init__(
    agent: Agent[Any],
    callbacks: SingleAgentWorkflowCallbacks | None = None,
)
Create a new single agent voice workflow.

Name	Type	Description	Default
agent	Agent[Any]	The agent to run.	required
callbacks	SingleAgentWorkflowCallbacks | None	Optional callbacks to call during the workflow.	None
on_start (async)
on_start() -> AsyncIterator[str]
Optional method that runs before any user input is received. Can be used to deliver a greeting or instruction via TTS. Defaults to doing nothing.

Input
AudioInput (dataclass)
Static audio to be used as input for the VoicePipeline.

Source code in src/agents/voice/input.py

Attributes
buffer: NDArray[int16 | float32]
A buffer containing the audio data for the agent. Must be a numpy array of int16 or float32.

frame_rate: int = DEFAULT_SAMPLE_RATE
The sample rate of the audio data. Defaults to 24000.

sample_width: int = 2
The sample width of the audio data. Defaults to 2.

channels: int = 1
The number of channels in the audio data. Defaults to 1.

Methods
to_audio_file() -> tuple[str, BytesIO, str]
Returns a tuple of (filename, bytes, content_type)

to_base64() -> str
Returns the audio data as a base64 encoded string.

StreamedAudioInput
Audio input represented as a stream of audio data. You can pass this to the VoicePipeline and then push audio data into the queue using the add_audio method.

Source code in src/agents/voice/input.py

add_audio (async)
add_audio(audio: NDArray[int16 | float32])
Adds more audio data to the stream.

Name	Type	Description	Default
audio	NDArray[int16 | float32]	The audio data to add. Must be a numpy array of int16 or float32.	required
Result
StreamedAudioResult
The output of a VoicePipeline. Streams events and audio data as they're generated.

Source code in src/agents/voice/result.py

__init__
__init__(
    tts_model: TTSModel,
    tts_settings: TTSModelSettings,
    voice_pipeline_config: VoicePipelineConfig,
)
Create a new StreamedAudioResult instance.

Name	Type	Description	Default
tts_model	TTSModel	The TTS model to use.	required
tts_settings	TTSModelSettings	The TTS settings to use.	required
voice_pipeline_config	VoicePipelineConfig	The voice pipeline config to use.	required
stream (async)
stream() -> AsyncIterator[VoiceStreamEvent]
Stream the events and audio data as they're generated.

Pipeline Config
VoicePipelineConfig (dataclass)
Configuration for a VoicePipeline.

Source code in src/agents/voice/pipeline_config.py

Attributes
model_provider: VoiceModelProvider = field(default_factory=OpenAIVoiceModelProvider)
The voice model provider to use for the pipeline. Defaults to OpenAI.

tracing_disabled: bool = False
Whether to disable tracing of the pipeline. Defaults to False.

trace_include_sensitive_data: bool = True
Whether to include sensitive data in traces. Defaults to True. This is specifically for the voice pipeline, and not for anything that goes on inside your Workflow.

trace_include_sensitive_audio_data: bool = True
Whether to include audio data in traces. Defaults to True.

workflow_name: str = 'Voice Agent'
The name of the workflow to use for tracing. Defaults to Voice Agent.

group_id: str = field(default_factory=gen_group_id)
A grouping identifier to use for tracing, to link multiple traces from the same conversation or process. If not provided, we will create a random group ID.

trace_metadata: dict[str, Any] | None = None
An optional dictionary of additional metadata to include with the trace.

stt_settings: STTModelSettings = field(default_factory=STTModelSettings)
The settings to use for the STT model.

tts_settings: TTSModelSettings = field(default_factory=TTSModelSettings)
The settings to use for the TTS model.

Events
VoiceStreamEvent
VoiceStreamEvent: TypeAlias = Union[
    VoiceStreamEventAudio,
    VoiceStreamEventLifecycle,
    VoiceStreamEventError,
]
An event from the VoicePipeline, streamed via StreamedAudioResult.stream().

VoiceStreamEventAudio (dataclass)
Streaming event from the VoicePipeline

Source code in src/agents/voice/events.py

Attributes
data: NDArray[int16 | float32] | None
The audio data.

type: Literal["voice_stream_event_audio"] = "voice_stream_event_audio"
The type of event.

VoiceStreamEventLifecycle (dataclass)
Streaming event from the VoicePipeline

Source code in src/agents/voice/events.py

Attributes
event: Literal["turn_started", "turn_ended", "session_ended"]
The event that occurred.

type: Literal["voice_stream_event_lifecycle"] = "voice_stream_event_lifecycle"
The type of event.

VoiceStreamEventError (dataclass)
Streaming event from the VoicePipeline

Source code in src/agents/voice/events.py

Attributes
error: Exception
The error that occurred.

type: Literal["voice_stream_event_error"] = "voice_stream_event_error"
The type of event.

Exceptions
STTWebsocketConnectionError
Bases: AgentsException

Exception raised when the STT websocket connection fails.

Source code in src/agents/voice/exceptions.py

Model
TTSVoice
TTSVoice = Literal[
    "alloy",
    "ash",
    "coral",
    "echo",
    "fable",
    "onyx",
    "nova",
    "sage",
    "shimmer",
]
Exportable type for the TTSModelSettings voice enum

TTSModelSettings (dataclass)
Settings for a TTS model.

Source code in src/agents/voice/model.py

Attributes
voice: TTSVoice | None = None
The voice to use for the TTS model. If not provided, the default voice for the respective model will be used.

buffer_size: int = 120
The minimal size of the chunks of audio data that are being streamed out.

dtype: DTypeLike = int16
The data type for the audio data to be returned in.

transform_data: (Callable[[NDArray[int16 | float32]], NDArray[int16 | float32]] | None) = None
A function to transform the data from the TTS model. This is useful if you want the resulting audio stream to have the data in a specific shape already.

instructions: str = "You will receive partial sentences. Do not complete the sentence just read out the text."
The instructions to use for the TTS model. This is useful if you want to control the tone of the audio output.

text_splitter: Callable[[str], tuple[str, str]] = (get_sentence_based_splitter())
A function to split the text into chunks. This is useful if you want to split the text into chunks before sending it to the TTS model rather than waiting for the whole text to be processed.

speed: float | None = None
The speed with which the TTS model will read the text. Between 0.25 and 4.0.

TTSModel
Bases: ABC

A text-to-speech model that can convert text into audio output.

Source code in src/agents/voice/model.py

Properties
model_name: str The name of the TTS model.
Methods
run(text: str, settings: TTSModelSettings) -> AsyncIterator[bytes]
Given a text string, produces a stream of audio bytes, in PCM format.

Name	Type	Description	Default
text	str	The text to convert to audio.	required
settings	TTSModelSettings	The settings to use for the text-to-speech model.	required
Returns:

AsyncIterator[bytes]: An async iterator of audio bytes, in PCM format.
StreamedTranscriptionSession
Bases: ABC

A streamed transcription of audio input.

Source code in src/agents/voice/model.py

Methods
transcribe_turns() -> AsyncIterator[str]
Yields a stream of text transcriptions. Each transcription is a turn in the conversation. This method is expected to return only after close() is called.

close() -> None (async)
Closes the session.

STTModelSettings (dataclass)
Settings for a speech-to-text model.

Source code in src/agents/voice/model.py

Attributes
prompt: str | None = None
Instructions for the model to follow.

language: str | None = None
The language of the audio input.

temperature: float | None = None
The temperature of the model.

turn_detection: dict[str, Any] | None = None
The turn detection settings for the model when using streamed audio input.

STTModel
Bases: ABC

A speech-to-text model that can convert audio input into text.

Source code in src/agents/voice/model.py

Properties
model_name: str The name of the STT model.
Methods
transcribe(input: AudioInput, settings: STTModelSettings, trace_include_sensitive_data: bool, trace_include_sensitive_audio_data: bool) -> str (async)
Given an audio input, produces a text transcription.

Name	Type	Description	Default
input	AudioInput	The audio input to transcribe.	required
settings	STTModelSettings	The settings to use for the transcription.	required
trace_include_sensitive_data	bool	Whether to include sensitive data in traces.	required
trace_include_sensitive_audio_data	bool	Whether to include sensitive audio data in traces.	required
Returns:

str: The text transcription of the audio input.
create_session(input: StreamedAudioInput, settings: STTModelSettings, trace_include_sensitive_data: bool, trace_include_sensitive_audio_data: bool) -> StreamedTranscriptionSession (async)
Creates a new transcription session, which you can push audio to, and receive a stream of text transcriptions.

Name	Type	Description	Default
input	StreamedAudioInput	The audio input to transcribe.	required
settings	STTModelSettings	The settings to use for the transcription.	required
trace_include_sensitive_data	bool	Whether to include sensitive data in traces.	required
trace_include_sensitive_audio_data	bool	Whether to include sensitive audio data in traces.	required
Returns:

StreamedTranscriptionSession: A new transcription session.
VoiceModelProvider
Bases: ABC

The base interface for a voice model provider.
A model provider is responsible for creating speech-to-text and text-to-speech models, given a name.

Source code in src/agents/voice/model.py

Methods
get_stt_model(model_name: str | None) -> STTModel
Get a speech-to-text model by name.

Name	Type	Description	Default
model_name	str | None	The name of the model to get.	required
Returns:

STTModel: The speech-to-text model.
get_tts_model(model_name: str | None) -> TTSModel
Get a text-to-speech model by name.

Utils
get_sentence_based_splitter
get_sentence_based_splitter(
    min_sentence_length: int = 20,
) -> Callable[[str], tuple[str, str]]
Returns a function that splits text into chunks based on sentence boundaries.

Name	Type	Description	Default
min_sentence_length	int	The minimum length of a sentence to be included in a chunk.	20
Returns:

Callable[[str], tuple[str, str]]: A function that splits text into chunks based on sentence boundaries.
Source code in src/agents/voice/utils.py

OpenAI Voice Model Provider
OpenAIVoiceModelProvider
Bases: VoiceModelProvider

A voice model provider that uses OpenAI models.

Source code in src/agents/voice/models/openai_model_provider.py

_init__
_init__(
    *,
    api_key: str | None = None,
    base_url: str | None = None,
    openai_client: AsyncOpenAI | None = None,
    organization: str | None = None,
    project: str | None = None,
) -> None
Create a new OpenAI voice model provider.

Name	Type	Description	Default
api_key	str | None	The API key to use for the OpenAI client. If not provided, we will use the default API key.	None
base_url	str | None	The base URL to use for the OpenAI client. If not provided, we will use the default base URL.	None
openai_client	AsyncOpenAI | None	An optional OpenAI client to use. If not provided, we will create a new OpenAI client using the api_key and base_url.	None
organization	str | None	The organization to use for the OpenAI client.	None
project	str | None	The project to use for the OpenAI client.	None
get_stt_model
get_stt_model(model_name: str | None) -> STTModel
Get a speech-to-text model by name.

Name	Type	Description	Default
model_name	str | None	The name of the model to get.	required
Returns:

STTModel: The speech-to-text model.
get_tts_model
get_tts_model(model_name: str | None) -> TTSModel
Get a text-to-speech model by name.

Name	Type	Description	Default
model_name	str | None	The name of the model to get.	required
Returns:

TTSModel: The text-to-speech model.
OpenAI STT
OpenAISTTTranscriptionSession
Bases: StreamedTranscriptionSession

A transcription session for OpenAI's STT model.

Source code in src/agents/voice/models/openai_stt.py

OpenAISTTModel
Bases: STTModel

A speech-to-text model for OpenAI.

Source code in src/agents/voice/models/openai_stt.py

_init__
_init__(model: str, openai_client: AsyncOpenAI)
Create a new OpenAI speech-to-text model.

Name	Type	Description	Default
model	str	The name of the model to use.	required
openai_client	AsyncOpenAI	The OpenAI client to use.	required
transcribe (async)
transcribe(
    input: AudioInput,
    settings: STTModelSettings,
    trace_include_sensitive_data: bool,
    trace_include_sensitive_audio_data: bool,
) -> str
Transcribe an audio input.

Name	Type	Description	Default
input	AudioInput	The audio input to transcribe.	required
settings	STTModelSettings	The settings to use for the transcription.	required
Returns:

str: The transcribed text.
create_session (async)
create_session(
    input: StreamedAudioInput,
    settings: STTModelSettings,
    trace_include_sensitive_data: bool,
    trace_include_sensitive_audio_data: bool,
) -> StreamedTranscriptionSession
Create a new transcription session.

Name	Type	Description	Default
input	StreamedAudioInput	The audio input to transcribe.	required
settings	STTModelSettings	The settings to use for the transcription.	required
trace_include_sensitive_data	bool	Whether to include sensitive data in traces.	required
trace_include_sensitive_audio_data	bool	Whether to include sensitive audio data in traces.	required
Returns:

StreamedTranscriptionSession: A new transcription session.
OpenAI TTS
OpenAITTSModel
Bases: TTSModel

A text-to-speech model for OpenAI.

Source code in src/agents/voice/models/openai_tts.py

_init__
_init__(model: str, openai_client: AsyncOpenAI)
Create a new OpenAI text-to-speech model.

Name	Type	Description	Default
model	str	The name of the model to use.	required
openai_client	AsyncOpenAI	The OpenAI client to use.	required
run (async)
run(
    text: str, settings: TTSModelSettings
) -> AsyncIterator[bytes]
Run the text-to-speech model.

Name	Type	Description	Default
text	str	The text to convert to speech.	required
settings	TTSModelSettings	The settings to use for the text-to-speech model.	required
Returns:

AsyncIterator[bytes]: An iterator of audio chunks.