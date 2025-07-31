# Voice Agents

## Quickstart

### Prerequisites

Make sure you've followed the base quickstart instructions for the Agents SDK, and set up a virtual environment. Then, install the optional voice dependencies from the SDK:

```bash
pip install 'openai-agents[voice]'
Concepts
The main concept to know about is a VoicePipeline, which is a 3 step process:

Run a speech-to-text model to turn audio into text.
Run your code, which is usually an agentic workflow, to produce a result.
Run a text-to-speech model to turn the result text back into audio.
Voice Pipeline:

Transcribe (speech-to-text)
Your Code
Text-to-speech
🎤 Audio Input → 🎧 Audio Output

Agents
First, let's set up some Agents. This should feel familiar to you if you've built any agents with this SDK. We'll have a couple of Agents, a handoff, and a tool.

import asyncio
import random

from agents import (
    Agent,
    function_tool,
)
from agents.extensions.handoff_prompt import prompt_with_handoff_instructions

@function_tool
def get_weather(city: str) -> str:
    """Get the weather for a given city."""
    print(f"[debug] get_weather called with city: {city}")
    choices = ["sunny", "cloudy", "rainy", "snowy"]
    return f"The weather in {city} is {random.choice(choices)}."

spanish_agent = Agent(
    name="Spanish",
    handoff_description="A spanish speaking agent.",
    instructions=prompt_with_handoff_instructions(
        "You're speaking to a human, so be polite and concise. Speak in Spanish.",
    ),
    model="gpt-4o-mini",
)

agent = Agent(
    name="Assistant",
    instructions=prompt_with_handoff_instructions(
        "You're speaking to a human, so be polite and concise. If the user speaks in Spanish, handoff to the spanish agent.",
    ),
    model="gpt-4o-mini",
    handoffs=[spanish_agent],
    tools=[get_weather],
)
Voice pipeline
We'll set up a simple voice pipeline, using SingleAgentVoiceWorkflow as the workflow.

from agents.voice import SingleAgentVoiceWorkflow, VoicePipeline
pipeline = VoicePipeline(workflow=SingleAgentVoiceWorkflow(agent))
Run the pipeline
import numpy as np
import sounddevice as sd
from agents.voice import AudioInput

# For simplicity, we'll just create 3 seconds of silence
# In reality, you'd get microphone data
buffer = np.zeros(24000 * 3, dtype=np.int16)
audio_input = AudioInput(buffer=buffer)

result = await pipeline.run(audio_input)

# Create an audio player using `sounddevice`
player = sd.OutputStream(samplerate=24000, channels=1, dtype=np.int16)
player.start()

# Play the audio stream as it comes in
async for event in result.stream():
    if event.type == "voice_stream_event_audio":
        player.write(event.data)
Put it all together
import asyncio
import random

import numpy as np
import sounddevice as sd

from agents import (
    Agent,
    function_tool,
    set_tracing_disabled,
)
from agents.voice import (
    AudioInput,
    SingleAgentVoiceWorkflow,
    VoicePipeline,
)
from agents.extensions.handoff_prompt import prompt_with_handoff_instructions

@function_tool
def get_weather(city: str) -> str:
    """Get the weather for a given city."""
    print(f"[debug] get_weather called with city: {city}")
    choices = ["sunny", "cloudy", "rainy", "snowy"]
    return f"The weather in {city} is {random.choice(choices)}."

spanish_agent = Agent(
    name="Spanish",
    handoff_description="A spanish speaking agent.",
    instructions=prompt_with_handoff_instructions(
        "You're speaking to a human, so be polite and concise. Speak in Spanish.",
    ),
    model="gpt-4o-mini",
)

agent = Agent(
    name="Assistant",
    instructions=prompt_with_handoff_instructions(
        "You're speaking to a human, so be polite and concise. If the user speaks in Spanish, handoff to the spanish agent.",
    ),
    model="gpt-4o-mini",
    handoffs=[spanish_agent],
    tools=[get_weather],
)

async def main():
    pipeline = VoicePipeline(workflow=SingleAgentVoiceWorkflow(agent))
    buffer = np.zeros(24000 * 3, dtype=np.int16)
    audio_input = AudioInput(buffer=buffer)

    result = await pipeline.run(audio_input)

    # Create an audio player using `sounddevice`
    player = sd.OutputStream(samplerate=24000, channels=1, dtype=np.int16)
    player.start()

    # Play the audio stream as it comes in
    async for event in result.stream():
        if event.type == "voice_stream_event_audio":
            player.write(event.data)

if __name__ == "__main__":
    asyncio.run(main())
If you run this example, the agent will speak to you! Check out the example in examples/voice/static to see a demo where you can speak to the agent yourself.

Pipelines and workflows
VoicePipeline is a class that makes it easy to turn your agentic workflows into a voice app. You pass in a workflow to run, and the pipeline takes care of transcribing input audio, detecting when the audio ends, calling your workflow at the right time, and turning the workflow output back into audio.

Voice Pipeline:

Transcribe (speech-to-text)
Your Code
Text-to-speech
🎤 Audio Input → 🎧 Audio Output

Configuring a pipeline
When you create a pipeline, you can set a few things:

The workflow, which is the code that runs each time new audio is transcribed.
The speech-to-text and text-to-speech models used
The config, which lets you configure things like:
A model provider, which can map model names to models
Tracing, including whether to disable tracing, whether audio files are uploaded, the workflow name, trace IDs etc.
Settings on the TTS and STT models, like the prompt, language and data types used.
Running a pipeline
You can run a pipeline via the run() method, which lets you pass in audio input in two forms:

AudioInput is used when you have a full audio transcript, and just want to produce a result for it. This is useful in cases where you don't need to detect when a speaker is done speaking; for example, when you have pre-recorded audio or in push-to-talk apps where it's clear when the user is done speaking.
StreamedAudioInput is used when you might need to detect when a user is done speaking. It allows you to push audio chunks as they are detected, and the voice pipeline will automatically run the agent workflow at the right time, via a process called "activity detection".
Results
The result of a voice pipeline run is a StreamedAudioResult. This is an object that lets you stream events as they occur. There are a few kinds of VoiceStreamEvent, including:

VoiceStreamEventAudio, which contains a chunk of audio.
VoiceStreamEventLifecycle, which informs you of lifecycle events like a turn starting or ending.
VoiceStreamEventError, is an error event.
result = await pipeline.run(input)

async for event in result.stream():
    if event.type == "voice_stream_event_audio":
        # play audio
    elif event.type == "voice_stream_event_lifecycle":
        # lifecycle
    elif event.type == "voice_stream_event_error":
        # error
    ...
Best practices
Interruptions
The Agents SDK currently does not support any built-in interruptions support for StreamedAudioInput. Instead for every detected turn it will trigger a separate run of your workflow. If you want to handle interruptions inside your application you can listen to the VoiceStreamEventLifecycle events. turn_started will indicate that a new turn was transcribed and processing is beginning. turn_ended will trigger after all the audio was dispatched for a respective turn. You could use these events to mute the microphone of the speaker when the model starts a turn and unmute it after you flushed all the related audio for a turn.

Tracing
Just like the way agents are traced, voice pipelines are also automatically traced.

You can read the tracing doc above for basic tracing information, but you can additionally configure tracing of a pipeline via VoicePipelineConfig.

Key tracing related fields are:

tracing_disabled: controls whether tracing is disabled. By default, tracing is enabled.
trace_include_sensitive_data: controls whether traces include potentially sensitive data, like audio transcripts. This is specifically for the voice pipeline, and not for anything that goes on inside your Workflow.
trace_include_sensitive_audio_data: controls whether traces include audio data.
workflow_name: The name of the trace workflow.
group_id: The group_id of the trace, which lets you link multiple traces.
trace_metadata: Additional metadata to include with the trace.